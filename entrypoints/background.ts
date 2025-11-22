import { blockerStorage } from "@/utils/storage";
import type { BlockCheckResult } from "@/types";

export default defineBackground({
  main() {
    // Check and clean up expired grace periods periodically
    setInterval(async () => {
      await blockerStorage.removeExpiredGracePeriods();
    }, 60000); // Every minute

    // Track tabs we've already checked to avoid loops
    const checkedTabs = new Set<string>();

    // Listen for tab updates instead of navigation
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      // Only proceed when page is loading and we have a URL
      if (changeInfo.status !== "loading" || !tab.url) return;

      // Skip internal pages
      if (
        tab.url.startsWith("chrome://") ||
        tab.url.startsWith("chrome-extension://")
      )
        return;

      const tabKey = `${tabId}-${tab.url}`;

      // Skip if we've already checked this tab-url combination recently
      if (checkedTabs.has(tabKey)) return;

      checkedTabs.add(tabKey);

      // Remove from checked set after 2 seconds to allow re-checking
      setTimeout(() => checkedTabs.delete(tabKey), 2000);

      const result = await checkIfBlocked(tab.url);

      if (result.isBlocked && !result.hasActiveGrace) {
        // Wait a bit to ensure content script is ready
        setTimeout(() => {
          chrome.tabs
            .sendMessage(tabId, {
              type: "SHOW_BLOCK_SCREEN",
              data: result,
            })
            .catch(() => {
              // Content script not ready, inject it
              chrome.scripting
                .executeScript({
                  target: { tabId: tabId },
                  files: ["/content-scripts/content.js"],
                })
                .then(() => {
                  // Try sending message again after injection
                  setTimeout(() => {
                    chrome.tabs
                      .sendMessage(tabId, {
                        type: "SHOW_BLOCK_SCREEN",
                        data: result,
                      })
                      .catch(() => {
                        console.log("Could not send message to tab", tabId);
                      });
                  }, 100);
                })
                .catch((err) => {
                  console.error("Failed to inject content script:", err);
                });
            });
        }, 100);
      }
    });

    // Message handler
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      handleMessage(message, sender).then(sendResponse);
      return true; // Keep channel open for async response
    });

    async function checkIfBlocked(url: string): Promise<BlockCheckResult> {
      const data = await blockerStorage.get();

      // Check if URL matches any blocked site
      const blockedSite = data.blockedSites.find((site) => {
        try {
          const regex = new RegExp(site.pattern);
          return regex.test(url);
        } catch {
          return url.includes(site.url);
        }
      });

      if (!blockedSite) {
        return { isBlocked: false, hasActiveGrace: false };
      }

      // Check for active grace period that matches this specific blocked site
      const activeGrace = data.activeGracePeriods.find((gp) => {
        // Match by the blocked site URL, not the current URL
        return gp.url === blockedSite.url && gp.expiresAt > Date.now();
      });

      return {
        isBlocked: true,
        hasActiveGrace: !!activeGrace,
        gracePeriod: activeGrace,
        site: blockedSite,
      };
    }

    async function handleMessage(message: any, sender: any) {
      switch (message.type) {
        case "CHECK_BLOCKED":
          return await checkIfBlocked(message.url);

        case "REQUEST_GRACE_PERIOD":
          const canRequest = await blockerStorage.canRequestGracePeriod();
          if (!canRequest) {
            return {
              success: false,
              error: "Maximum 3 grace periods per hour reached",
            };
          }

          const duration = blockerStorage.getRandomDuration();
          const gracePeriod = await blockerStorage.addGracePeriod(
            message.url,
            duration,
          );

          // Don't reload automatically - let user save the key first
          return { success: true, gracePeriod };

        case "VERIFY_KEY":
          const data = await blockerStorage.get();
          const grace = data.activeGracePeriods.find(
            (gp) => gp.key === message.key && gp.expiresAt > Date.now(),
          );

          if (grace) {
            // Don't reload - let content script handle it
            return { success: true };
          }

          return { success: false, error: "Invalid or expired key" };

        default:
          return { success: false, error: "Unknown message type" };
      }
    }
  },
});

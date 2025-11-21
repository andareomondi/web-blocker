import { storage } from "../utils/storage";
import type { BlockCheckResult } from "../types";

export default defineBackground(() => {
  // Check and clean up expired grace periods periodically
  setInterval(async () => {
    await storage.removeExpiredGracePeriods();
  }, 60000); // Every minute

  // Listen for navigation events
  chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    if (details.frameId !== 0) return; // Only main frame

    const result = await checkIfBlocked(details.url);

    if (result.isBlocked && !result.hasActiveGrace) {
      // Inject content script to show block screen
      chrome.tabs
        .sendMessage(details.tabId, {
          type: "SHOW_BLOCK_SCREEN",
          data: result,
        })
        .catch(() => {
          // If content script not ready, inject it
          chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ["/content-scripts/content.js"],
          });
        });
    }
  });

  // Message handler
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    handleMessage(message, sender).then(sendResponse);
    return true; // Keep channel open for async response
  });
});

async function checkIfBlocked(url: string): Promise<BlockCheckResult> {
  const data = await storage.get();

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

  // Check for active grace period
  const activeGrace = data.activeGracePeriods.find((gp) => {
    const graceSite = data.blockedSites.find((s) => s.url === gp.url);
    if (!graceSite) return false;

    try {
      const regex = new RegExp(graceSite.pattern);
      return regex.test(url) && gp.expiresAt > Date.now();
    } catch {
      return url.includes(gp.url) && gp.expiresAt > Date.now();
    }
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
      const canRequest = await storage.canRequestGracePeriod();
      if (!canRequest) {
        return {
          success: false,
          error: "Maximum 3 grace periods per hour reached",
        };
      }

      const duration = storage.getRandomDuration();
      const gracePeriod = await storage.addGracePeriod(message.url, duration);

      // Reload the tab to apply grace period
      if (sender.tab?.id) {
        chrome.tabs.reload(sender.tab.id);
      }

      return { success: true, gracePeriod };

    case "VERIFY_KEY":
      const data = await storage.get();
      const grace = data.activeGracePeriods.find(
        (gp) => gp.key === message.key && gp.expiresAt > Date.now(),
      );

      if (grace) {
        // Reload tab to apply the grace period
        if (sender.tab?.id) {
          chrome.tabs.reload(sender.tab.id);
        }
        return { success: true };
      }

      return { success: false, error: "Invalid or expired key" };

    default:
      return { success: false, error: "Unknown message type" };
  }
}

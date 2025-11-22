import type {
  StorageData,
  BlockedSite,
  GracePeriod,
  GracePeriodHistory,
} from "../types";

const STORAGE_KEY = "website_blocker_data";

const defaultData: StorageData = {
  blockedSites: [],
  activeGracePeriods: [],
  gracePeriodHistory: [],
};

export const storage = {
  async get(): Promise<StorageData> {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    return result[STORAGE_KEY] || defaultData;
  },

  async set(data: StorageData): Promise<void> {
    await chrome.storage.local.set({ [STORAGE_KEY]: data });
  },

  async addBlockedSite(url: string): Promise<BlockedSite> {
    const data = await this.get();
    const site: BlockedSite = {
      id: crypto.randomUUID(),
      url,
      pattern: this.urlToPattern(url),
      addedAt: Date.now(),
    };
    data.blockedSites.push(site);
    await this.set(data);
    return site;
  },

  async removeBlockedSite(id: string): Promise<void> {
    const data = await this.get();
    data.blockedSites = data.blockedSites.filter((site) => site.id !== id);
    await this.set(data);
  },

  async addGracePeriod(
    siteUrl: string,
    duration: number,
  ): Promise<GracePeriod> {
    const data = await this.get();
    const key = this.generateUniqueKey();

    // Find the blocked site that matches this URL to use its base URL
    const matchingSite = data.blockedSites.find((site) => {
      try {
        const regex = new RegExp(site.pattern);
        return regex.test(siteUrl);
      } catch {
        return siteUrl.includes(site.url);
      }
    });

    const gracePeriod: GracePeriod = {
      key,
      url: matchingSite ? matchingSite.url : siteUrl, // Store the base blocked site URL
      expiresAt: Date.now() + duration,
      duration,
    };
    data.activeGracePeriods.push(gracePeriod);

    // Add to history
    const hour = this.getCurrentHour();
    data.gracePeriodHistory.push({ timestamp: Date.now(), hour });

    // Clean up old history (keep only last 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    data.gracePeriodHistory = data.gracePeriodHistory.filter(
      (h) => h.timestamp > oneDayAgo,
    );

    await this.set(data);
    return gracePeriod;
  },

  async removeExpiredGracePeriods(): Promise<void> {
    const data = await this.get();
    const now = Date.now();
    data.activeGracePeriods = data.activeGracePeriods.filter(
      (gp) => gp.expiresAt > now,
    );
    await this.set(data);
  },

  async getGracePeriodCount(): Promise<number> {
    const data = await this.get();
    const currentHour = this.getCurrentHour();
    return data.gracePeriodHistory.filter((h) => h.hour === currentHour).length;
  },

  async canRequestGracePeriod(): Promise<boolean> {
    const count = await this.getGracePeriodCount();
    return count < 3;
  },

  urlToPattern(url: string): string {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      const hostname = urlObj.hostname.replace(/\./g, "\\.");
      const pathname = urlObj.pathname;

      // If there's a specific path, include it in the pattern
      if (pathname && pathname !== "/") {
        const pathPattern = pathname.replace(/\./g, "\\.").replace(/\*/g, ".*");
        return `^https?://(www\\.)?${hostname}${pathPattern}.*`;
      }

      // Otherwise just match the hostname
      return `^https?://(www\\.)?${hostname}.*`;
    } catch {
      return url.replace(/\./g, "\\.").replace(/\*/g, ".*");
    }
  },

  generateUniqueKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 8; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key.match(/.{1,4}/g)?.join("-") || key;
  },

  getCurrentHour(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}`;
  },

  getRandomDuration(): number {
    // Random duration between 30 seconds and 9 minutes (in milliseconds)
    const minMs = 30 * 1000;
    const maxMs = 9 * 60 * 1000;
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  },
};

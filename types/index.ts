export interface BlockedSite {
  id: string;
  url: string;
  pattern: string; // Regex pattern for matching
  addedAt: number;
}

export interface GracePeriod {
  key: string;
  url: string;
  expiresAt: number;
  duration: number; // in milliseconds
}

export interface GracePeriodHistory {
  timestamp: number;
  hour: string; // Format: YYYY-MM-DD-HH
}

export interface StorageData {
  blockedSites: BlockedSite[];
  activeGracePeriods: GracePeriod[];
  gracePeriodHistory: GracePeriodHistory[];
}

export interface BlockCheckResult {
  isBlocked: boolean;
  hasActiveGrace: boolean;
  gracePeriod?: GracePeriod;
  site?: BlockedSite;
}

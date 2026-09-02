interface CacheItem {
  data: any;
  timestamp: number;
  version?: string;
}

export const CACHE_KEYS = {
  USER_PROFILE: "user_profile",
  TRAINING_TOPICS: "training_topics",
  EXISTING_TRAINING_TOPICS: "existing_training_topics",
  TRAINING_SCHEDULE: "training_schedule",
  PROGRESS_DATA: "progress_data",
} as const;

export const getGameTypeCacheKey = (baseKey: string, gameType?: string | null) => 
  gameType ? `${baseKey}_${gameType}` : baseKey;

export const getProgressCacheKey = (month: string, gameType?: string | null) => 
  getGameTypeCacheKey(`${CACHE_KEYS.PROGRESS_DATA}_${month}`, gameType);

const CACHE_EXPIRATION = 60 * 60 * 1000;
const CACHE_VERSION = "1.0.0";

/**
 * Every cached entry is namespaced by the account that fetched it. Without this
 * the keys are global to the browser, so a second account logging in on the
 * same machine reads the previous account's training-plan data.
 */
const SCOPE_PREFIX = "tp";
const SCOPE_STORAGE_KEY = "tp_cache_scope";
const ANON_SCOPE = "anon";

/** Non-reversible so the bearer token never lands in a localStorage key. */
const hashScope = (raw: string): string => {
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash + raw.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
};

let userScope: string = ANON_SCOPE;

class CacheManager {
  private isValidCacheItem = (cacheItem: CacheItem): boolean => {
    const now = Date.now();
    
    if (now - cacheItem.timestamp > CACHE_EXPIRATION) {
      return false;
    }
    
    if (cacheItem.version && cacheItem.version !== CACHE_VERSION) {
      return false;
    }
    
    return true;
  };

  /** Namespaces a logical key so callers can keep passing plain CACHE_KEYS. */
  private scoped = (key: string): string =>
    `${SCOPE_PREFIX}:${userScope}:${key}`;

  /**
   * Binds the cache to an account. Call this before any read, passing the
   * active sessionId (or null when signed out). Switching owners drops every
   * entry the previous owner left behind rather than serving it to the new one.
   */
  setUserScope = (sessionId?: string | null): void => {
    const next = sessionId ? hashScope(sessionId) : ANON_SCOPE;

    if (!this.isStorageAvailable()) {
      userScope = next;
      return;
    }

    if (localStorage.getItem(SCOPE_STORAGE_KEY) === next) {
      userScope = next;
      return;
    }

    this.clearAll();
    userScope = next;
    localStorage.setItem(SCOPE_STORAGE_KEY, next);
  };

  setItem = (key: string, data: any): void => {
    try {
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };

      if (this.isStorageAvailable()) {
        localStorage.setItem(this.scoped(key), JSON.stringify(cacheItem));
      }
    } catch (error) {
      console.error("Error setting cache item:", error);
    }
  };

  getItem = (key: string): any | null => {
    try {
      if (!this.isStorageAvailable()) {
        return null;
      }

      const cachedItem = localStorage.getItem(this.scoped(key));
      if (!cachedItem) return null;

      const parsedItem: CacheItem = JSON.parse(cachedItem);

      if (!this.isValidCacheItem(parsedItem)) {
        this.clearItem(key);
        return null;
      }

      return parsedItem.data;
    } catch (error) {
      console.error("Error getting cache item:", error);
      this.clearItem(key);
      return null;
    }
  };

  clearItem = (key: string): void => {
    try {
      if (this.isStorageAvailable()) {
        localStorage.removeItem(this.scoped(key));
      }
    } catch (error) {
      console.error("Error clearing cache item:", error);
    }
  };

  /**
   * Wipes cached training-plan data for every scope, not just the active one,
   * and forgets the owner. Safe to call on logout.
   */
  clearAll = (): void => {
    try {
      if (this.isStorageAvailable()) {
        Object.values(CACHE_KEYS).forEach((key) => {
          this.clearItemsByPattern(key);
        });
        this.clearAllProgress();
        localStorage.removeItem(SCOPE_STORAGE_KEY);
        userScope = ANON_SCOPE;
      }
    } catch (error) {
      console.error("Error clearing all cache items:", error);
    }
  };

  clearGameTypeCache = (gameType: string): void => {
    try {
      if (this.isStorageAvailable()) {
        Object.values(CACHE_KEYS).forEach((baseKey) => {
          this.clearItem(getGameTypeCacheKey(baseKey, gameType));
        });

        this.clearProgressByGameType(gameType);
      }
    } catch (error) {
      console.error("Error clearing game type cache:", error);
    }
  };

  clearProgressMonth = (month: string, gameType?: string | null): void => {
    const cacheKey = getProgressCacheKey(month, gameType);
    this.clearItem(cacheKey);
  };

  private clearItemsByPattern = (pattern: string): void => {
    if (!this.isStorageAvailable()) return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(pattern)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  private clearProgressByGameType = (gameType: string): void => {
    if (!this.isStorageAvailable()) return;

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(CACHE_KEYS.PROGRESS_DATA) && key.includes(`_${gameType}`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  clearAllProgress = (): void => {
    try {
      this.clearItemsByPattern(CACHE_KEYS.PROGRESS_DATA);
    } catch (error) {
      console.error("Error clearing progress cache:", error);
    }
  };

  hasValidCache = (key: string): boolean => {
    try {
      if (!this.isStorageAvailable()) {
        return false;
      }

      const cachedItem = localStorage.getItem(this.scoped(key));
      if (!cachedItem) return false;

      const parsedItem: CacheItem = JSON.parse(cachedItem);
      return this.isValidCacheItem(parsedItem);
    } catch (error) {
      console.error("Error checking cache validity:", error);
      return false;
    }
  };

  getCacheInfo = (): {
    localStorageSize: number;
    keys: string[];
  } => {
    try {
      const info = {
        localStorageSize: 0,
        keys: [] as string[],
      };

      if (this.isStorageAvailable()) {
        Object.values(CACHE_KEYS).forEach((key) => {
          if (localStorage.getItem(this.scoped(key))) {
            info.localStorageSize++;
          }
        });

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && Object.values(CACHE_KEYS).some(cacheKey => key.includes(cacheKey))) {
            info.keys.push(key);
          }
        }
      }

      return info;
    } catch (error) {
      console.error("Error getting cache info:", error);
      return { localStorageSize: 0, keys: [] };
    }
  };

  private isStorageAvailable = (): boolean => {
    return typeof window !== "undefined" && !!window.localStorage;
  };

  preloadCache = (): void => {
    if (!this.isStorageAvailable()) return;

    try {
      Object.values(CACHE_KEYS).forEach((key) => {
        this.preloadCacheItem(key);
      });

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(CACHE_KEYS.PROGRESS_DATA)) {
          this.preloadCacheItem(key);
        }
      }
    } catch (error) {
      console.error("Error preloading cache:", error);
    }
  };

  private preloadCacheItem = (key: string): void => {
    const cachedItem = localStorage.getItem(key);
    if (cachedItem) {
      try {
        const parsedItem: CacheItem = JSON.parse(cachedItem);
        if (!this.isValidCacheItem(parsedItem)) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        localStorage.removeItem(key);
      }
    }
  };

  cleanupExpiredCache = (): void => {
    try {
      if (this.isStorageAvailable()) {
        this.cleanupStorageCache();
      }
    } catch (error) {
      console.error("Error cleaning up expired cache:", error);
    }
  };

  private cleanupStorageCache = (): void => {
    const keysToCheck: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && Object.values(CACHE_KEYS).some(cacheKey => key.includes(cacheKey))) {
        keysToCheck.push(key);
      }
    }

    keysToCheck.forEach(key => {
      const cachedItem = localStorage.getItem(key);
      if (cachedItem) {
        try {
          const parsedItem: CacheItem = JSON.parse(cachedItem);
          if (!this.isValidCacheItem(parsedItem)) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      }
    });
  };
}

export const CacheUtil = new CacheManager();

if (typeof window !== "undefined") {
  // Restore the owner recorded by the last session so a reload reads its own
  // namespace instead of falling back to anon and re-fetching everything.
  try {
    userScope = localStorage.getItem(SCOPE_STORAGE_KEY) || ANON_SCOPE;
  } catch {
    userScope = ANON_SCOPE;
  }

  CacheUtil.preloadCache();

  setInterval(() => {
    CacheUtil.cleanupExpiredCache();
  }, 60 * 60 * 1000);

  window.addEventListener("beforeunload", () => {
    CacheUtil.cleanupExpiredCache();
  });
}

export default CacheUtil;
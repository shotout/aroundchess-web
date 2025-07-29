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

export const getProgressCacheKey = (month: string) => `${CACHE_KEYS.PROGRESS_DATA}_${month}`;

const CACHE_EXPIRATION = 60 * 60 * 1000;
const CACHE_VERSION = "1.0.0";
const memoryCache = new Map<string, CacheItem>();

const isValidCacheItem = (cacheItem: CacheItem): boolean => {
  const now = Date.now();

  if (now - cacheItem.timestamp > CACHE_EXPIRATION) {
    return false;
  }

  if (cacheItem.version && cacheItem.version !== CACHE_VERSION) {
    return false;
  }

  return true;
};

export const CacheUtil = {
  setItem: (key: string, data: any): void => {
    try {
      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };

      memoryCache.set(key, cacheItem);

      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(cacheItem));
      }
    } catch (error) {
      console.error("Error setting cache item:", error);
    }
  },

  getItem: (key: string): any | null => {
    try {
      const memoryItem = memoryCache.get(key);
      if (memoryItem && isValidCacheItem(memoryItem)) {
        return memoryItem.data;
      }

      if (typeof window === "undefined" || !window.localStorage) {
        return null;
      }

      const cachedItem = localStorage.getItem(key);
      if (!cachedItem) return null;

      const parsedItem: CacheItem = JSON.parse(cachedItem);

      if (!isValidCacheItem(parsedItem)) {
        CacheUtil.clearItem(key);
        return null;
      }

      memoryCache.set(key, parsedItem);

      return parsedItem.data;
    } catch (error) {
      console.error("Error getting cache item:", error);
      CacheUtil.clearItem(key);
      return null;
    }
  },

  clearItem: (key: string): void => {
    try {
      memoryCache.delete(key);

      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error clearing cache item:", error);
    }
  },

  clearAll: (): void => {
    try {
      memoryCache.clear();

      if (typeof window !== "undefined" && window.localStorage) {
        Object.values(CACHE_KEYS).forEach((key) => {
          localStorage.removeItem(key);
        });
        CacheUtil.clearAllProgress();
      }
    } catch (error) {
      console.error("Error clearing all cache items:", error);
    }
  },

  clearProgressMonth: (month: string): void => {
    const cacheKey = getProgressCacheKey(month);
    CacheUtil.clearItem(cacheKey);
  },

  clearAllProgress: (): void => {
    try {
      const memoryEntries = Array.from(memoryCache.keys());
      memoryEntries.forEach(key => {
        if (key.startsWith(CACHE_KEYS.PROGRESS_DATA)) {
          memoryCache.delete(key);
        }
      });

      if (typeof window !== "undefined" && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(CACHE_KEYS.PROGRESS_DATA)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.error("Error clearing progress cache:", error);
    }
  },

  hasValidCache: (key: string): boolean => {
    try {
      const memoryItem = memoryCache.get(key);
      if (memoryItem) {
        return isValidCacheItem(memoryItem);
      }

      if (typeof window === "undefined" || !window.localStorage) {
        return false;
      }

      const cachedItem = localStorage.getItem(key);
      if (!cachedItem) return false;

      const parsedItem: CacheItem = JSON.parse(cachedItem);
      return isValidCacheItem(parsedItem);
    } catch (error) {
      console.error("Error checking cache validity:", error);
      return false;
    }
  },

  getCacheInfo: (): {
    memorySize: number;
    localStorageSize: number;
    keys: string[];
  } => {
    try {
      const info = {
        memorySize: memoryCache.size,
        localStorageSize: 0,
        keys: Array.from(memoryCache.keys()),
      };

      if (typeof window !== "undefined" && window.localStorage) {
        Object.values(CACHE_KEYS).forEach((key) => {
          if (localStorage.getItem(key)) {
            info.localStorageSize++;
          }
        });
      }

      return info;
    } catch (error) {
      console.error("Error getting cache info:", error);
      return { memorySize: 0, localStorageSize: 0, keys: [] };
    }
  },

  preloadCache: (): void => {
    try {
      if (typeof window === "undefined" || !window.localStorage) {
        return;
      }

      Object.values(CACHE_KEYS).forEach((key) => {
        const cachedItem = localStorage.getItem(key);
        if (cachedItem) {
          try {
            const parsedItem: CacheItem = JSON.parse(cachedItem);
            if (isValidCacheItem(parsedItem)) {
              memoryCache.set(key, parsedItem);
            } else {
              localStorage.removeItem(key);
            }
          } catch (error) {
            localStorage.removeItem(key);
          }
        }
      });

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(CACHE_KEYS.PROGRESS_DATA)) {
          const cachedItem = localStorage.getItem(key);
          if (cachedItem) {
            try {
              const parsedItem: CacheItem = JSON.parse(cachedItem);
              if (isValidCacheItem(parsedItem)) {
                memoryCache.set(key, parsedItem);
              } else {
                localStorage.removeItem(key);
              }
            } catch (error) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error preloading cache:", error);
    }
  },

  cleanupExpiredCache: (): void => {
    try {
      const memoryEntries = Array.from(memoryCache.entries());
      for (const [key, item] of memoryEntries) {
        if (!isValidCacheItem(item)) {
          memoryCache.delete(key);
        }
      }

      if (typeof window !== "undefined" && window.localStorage) {
        Object.values(CACHE_KEYS).forEach((key) => {
          const cachedItem = localStorage.getItem(key);
          if (cachedItem) {
            try {
              const parsedItem: CacheItem = JSON.parse(cachedItem);
              if (!isValidCacheItem(parsedItem)) {
                localStorage.removeItem(key);
              }
            } catch (error) {
              localStorage.removeItem(key);
            }
          }
        });

        const keysToCheck: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(CACHE_KEYS.PROGRESS_DATA)) {
            keysToCheck.push(key);
          }
        }

        keysToCheck.forEach(key => {
          const cachedItem = localStorage.getItem(key);
          if (cachedItem) {
            try {
              const parsedItem: CacheItem = JSON.parse(cachedItem);
              if (!isValidCacheItem(parsedItem)) {
                localStorage.removeItem(key);
              }
            } catch (error) {
              localStorage.removeItem(key);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error cleaning up expired cache:", error);
    }
  },
};

if (typeof window !== "undefined") {
  CacheUtil.preloadCache();

  setInterval(() => {
    CacheUtil.cleanupExpiredCache();
  }, 60 * 60 * 1000);

  window.addEventListener("beforeunload", () => {
    CacheUtil.cleanupExpiredCache();
  });
}

export default CacheUtil;
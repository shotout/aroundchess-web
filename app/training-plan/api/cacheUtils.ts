
interface CacheItem {
    data: any;
    timestamp: number;
  }
  
  export const CACHE_KEYS = {
    USER_PROFILE: 'user_profile',
    TRAINING_TOPICS: 'training_topics',
    TRAINING_SCHEDULE: 'training_schedule',
    PROGRESS_DATA: 'progress_data',
  };
  
  // Cache expiration time in milliseconds (5 minutes)
  const CACHE_EXPIRATION = 5 * 60 * 1000;
  
  export const CacheUtil = {
    /**
     * Set item in cache with current timestamp
     */
    setItem: (key: string, data: any): void => {
      try {
        const cacheItem: CacheItem = {
          data,
          timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheItem));
      } catch (error) {
        console.error('Error setting cache item:', error);
      }
    },
  
    /**
     * Get item from cache if it exists and hasn't expired
     * @returns The cached data or null if not found or expired
     */
    getItem: (key: string): any | null => {
      try {
        const cachedItem = localStorage.getItem(key);
        if (!cachedItem) return null;
  
        const { data, timestamp }: CacheItem = JSON.parse(cachedItem);
        const now = Date.now();
  
        // Check if cache has expired
        if (now - timestamp > CACHE_EXPIRATION) {
          localStorage.removeItem(key);
          return null;
        }
  
        return data;
      } catch (error) {
        console.error('Error getting cache item:', error);
        return null;
      }
    },
  
    /**
     * Clear a specific cache item
     */
    clearItem: (key: string): void => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error clearing cache item:', error);
      }
    },
  
    /**
     * Clear all cache items
     */
    clearAll: (): void => {
      try {
        Object.values(CACHE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (error) {
        console.error('Error clearing all cache items:', error);
      }
    },
  
    /**
     * Check if a cache item exists and is not expired
     */
    hasValidCache: (key: string): boolean => {
      try {
        const cachedItem = localStorage.getItem(key);
        if (!cachedItem) return false;
  
        const { timestamp }: CacheItem = JSON.parse(cachedItem);
        const now = Date.now();
  
        // Check if cache has expired
        return now - timestamp <= CACHE_EXPIRATION;
      } catch (error) {
        console.error('Error checking cache validity:', error);
        return false;
      }
    }
  };
  
  export default CacheUtil;
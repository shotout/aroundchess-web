import { CacheItem } from "../types/GameHistoryTypes";

// Default cache expiration time: 5 minutes
export const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Check if cached data is still valid based on timestamp and expiration
 */
export const isCacheValid = <T>(
  lastFetched: number | null, 
  cachedData: T | null,
  expiration: number = DEFAULT_CACHE_EXPIRATION
): boolean => {
  if (!lastFetched || !cachedData) return false;

  const now = Date.now();
  const cacheAge = now - lastFetched;
  
  // For array data, also check if it has elements
  if (Array.isArray(cachedData)) {
    return cacheAge < expiration && cachedData.length > 0;
  }
  
  // For object data, check if it has properties
  if (typeof cachedData === 'object' && cachedData !== null) {
    return cacheAge < expiration && Object.keys(cachedData).length > 0;
  }
  
  return cacheAge < expiration;
};

/**
 * Store data in cache with timestamp
 */
export const createCacheItem = <T>(data: T): CacheItem<T> => {
  return {
    data,
    timestamp: Date.now()
  };
};

/**
 * Get data from cache if valid, or fetch new data
 */
export const getFromCacheOrFetch = async <T>(
  cachedItem: CacheItem<T> | null,
  fetchFn: () => Promise<T>,
  expiration: number = DEFAULT_CACHE_EXPIRATION
): Promise<T> => {
  if (cachedItem && isCacheValid(cachedItem.timestamp, cachedItem.data, expiration)) {
    return cachedItem.data;
  }
  
  return await fetchFn();
};
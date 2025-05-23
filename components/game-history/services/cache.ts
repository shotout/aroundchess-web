import { CacheItem } from "../types/GameHistoryTypes";

export const DEFAULT_CACHE_EXPIRATION = 60 * 60 * 1000; 

export const isCacheValid = <T>(
  lastFetched: number | null, 
  cachedData: T | null,
  expiration: number = DEFAULT_CACHE_EXPIRATION
): boolean => {
  // More robust validation
  if (!lastFetched || lastFetched <= 0) return false;
  if (!cachedData) return false;

  const now = Date.now();
  const cacheAge = now - lastFetched;
  
  // Check if cache has expired
  if (cacheAge >= expiration) return false;
  
  // Additional validation for arrays
  if (Array.isArray(cachedData)) {
    return cachedData.length > 0;
  }
  
  // Additional validation for objects
  if (typeof cachedData === 'object' && cachedData !== null) {
    return Object.keys(cachedData).length > 0;
  }
  
  // For primitive types, just check if cache hasn't expired
  return true;
};

export const createCacheItem = <T>(data: T): CacheItem<T> => {
  return {
    data,
    timestamp: Date.now()
  };
};

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

// Helper function to debug cache state
export const debugCacheState = <T>(
  lastFetched: number | null,
  cachedData: T | null,
  label: string = "Cache"
): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${label} Debug:`, {
      lastFetched,
      hasData: !!cachedData,
      dataLength: Array.isArray(cachedData) ? cachedData.length : 'N/A',
      cacheAge: lastFetched ? Date.now() - lastFetched : 'N/A',
      isValid: isCacheValid(lastFetched, cachedData)
    });
  }
};
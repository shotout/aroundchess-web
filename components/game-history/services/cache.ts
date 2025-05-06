import { CacheItem } from "../types/GameHistoryTypes";

export const DEFAULT_CACHE_EXPIRATION = 5 * 60 * 1000;


export const isCacheValid = <T>(
  lastFetched: number | null, 
  cachedData: T | null,
  expiration: number = DEFAULT_CACHE_EXPIRATION
): boolean => {
  if (!lastFetched || !cachedData) return false;

  const now = Date.now();
  const cacheAge = now - lastFetched;
  
  if (Array.isArray(cachedData)) {
    return cacheAge < expiration && cachedData.length > 0;
  }
  
  if (typeof cachedData === 'object' && cachedData !== null) {
    return cacheAge < expiration && Object.keys(cachedData).length > 0;
  }
  
  return cacheAge < expiration;
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
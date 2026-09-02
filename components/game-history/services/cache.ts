import { CacheItem } from "../types/GameHistoryTypes";

export const DEFAULT_CACHE_EXPIRATION = 60 * 60 * 1000;

export const isCacheValid = <T>(
  lastFetched: number | null,
  cachedData: T | null,
  expiration: number = DEFAULT_CACHE_EXPIRATION
): boolean => {
  if (!lastFetched || lastFetched <= 0) {
    console.log("Cache validation failed: No valid lastFetched timestamp");
    return false;
  }

  if (!cachedData) {
    console.log("Cache validation failed: No cached data");
    return false;
  }

  const now = Date.now();
  const cacheAge = now - lastFetched;

  // Check if cache has expired
  if (cacheAge >= expiration) {
    console.log(
      `Cache validation failed: Expired (age: ${Math.round(
        cacheAge / 1000
      )}s, max: ${Math.round(expiration / 1000)}s)`
    );
    return false;
  }

  // Additional validation for arrays
  if (Array.isArray(cachedData)) {
    if (cachedData.length === 0) {
      console.log(
        "Cache validation warning: Empty array, but considering valid"
      );
      // Don't invalidate empty arrays - they might be legitimately empty
      return true;
    }
    console.log(
      `Cache validation passed: Array with ${
        cachedData.length
      } items, age: ${Math.round(cacheAge / 1000)}s`
    );
    return true;
  }

  // Additional validation for objects
  if (typeof cachedData === "object" && cachedData !== null) {
    const hasData = Object.keys(cachedData).length > 0;
    if (!hasData) {
      console.log(
        "Cache validation warning: Empty object, but considering valid"
      );
    } else {
      console.log(
        `Cache validation passed: Object with ${
          Object.keys(cachedData).length
        } keys, age: ${Math.round(cacheAge / 1000)}s`
      );
    }
    return true;
  }

  // For primitive types, just check if cache hasn't expired
  console.log(
    `Cache validation passed: Primitive value, age: ${Math.round(
      cacheAge / 1000
    )}s`
  );
  return true;
};

export const createCacheItem = <T>(data: T): CacheItem<T> => {
  return {
    data,
    timestamp: Date.now(),
  };
};

export const getFromCacheOrFetch = async <T>(
  cachedItem: CacheItem<T> | null,
  fetchFn: () => Promise<T>,
  expiration: number = DEFAULT_CACHE_EXPIRATION
): Promise<T> => {
  if (
    cachedItem &&
    isCacheValid(cachedItem.timestamp, cachedItem.data, expiration)
  ) {
    console.log("Using cached data from getFromCacheOrFetch");
    return cachedItem.data;
  }

  console.log("Fetching fresh data from getFromCacheOrFetch");
  return await fetchFn();
};

// Helper function to debug cache state with more detailed info
export const debugCacheState = <T>(
  lastFetched: number | null,
  cachedData: T | null,
  label: string = "Cache"
): void => {
  if (process.env.NODE_ENV === "development") {
    const now = Date.now();
    const cacheAge = lastFetched ? now - lastFetched : null;
    const isValid = isCacheValid(lastFetched, cachedData);

    console.group(`${label} Debug State`);
    console.log(
      "Timestamp:",
      lastFetched ? new Date(lastFetched).toISOString() : "None"
    );
    console.log(
      "Age (seconds):",
      cacheAge ? Math.round(cacheAge / 1000) : "N/A"
    );
    console.log("Has Data:", !!cachedData);
    console.log("Data Type:", cachedData ? typeof cachedData : "undefined");

    if (Array.isArray(cachedData)) {
      console.log("Array Length:", cachedData.length);
      console.log("Sample Items:", cachedData.slice(0, 3));
    } else if (typeof cachedData === "object" && cachedData !== null) {
      console.log("Object Keys:", Object.keys(cachedData));
    }

    console.log("Is Valid:", isValid);
    console.groupEnd();
  }
};

export const shouldForceRefresh = (
  lastFetched: number | null,
  forceRefreshThreshold: number = 60 * 60 * 1000 // 1 hour
): boolean => {
  if (!lastFetched) return true;

  const now = Date.now();
  const age = now - lastFetched;

  return age >= forceRefreshThreshold;
};

export const getCacheAge = (lastFetched: number | null): string => {
  if (!lastFetched) return "No cache";

  const now = Date.now();
  const ageMs = now - lastFetched;
  const ageMinutes = Math.floor(ageMs / (60 * 1000));
  const ageSeconds = Math.floor((ageMs % (60 * 1000)) / 1000);

  if (ageMinutes > 0) {
    return `${ageMinutes}m ${ageSeconds}s ago`;
  } else {
    return `${ageSeconds}s ago`;
  }
};

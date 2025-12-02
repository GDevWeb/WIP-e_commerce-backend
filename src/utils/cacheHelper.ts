import { redisClient } from "../configuration/redis";

/**
 * Helper functions for caching data in Redis.
 * This module provides utilities to interact with Redis for caching purposes,
 * including getting, setting, and deleting cached data, as well as generating
 * cache keys for search queries.
 */

/**
 * Get data from cache
 */
export async function getFromCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redisClient.get(key);
    if (!cached) {
      return null;
    }
    return JSON.parse(cached) as T;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
}

/**
 * Set data in cache with TTL
 */
export async function setInCache<T>(
  key: string,
  data: T,
  ttl: number = 300
): Promise<void> {
  try {
    await redisClient.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error("Cache set error:", error);
  }
}

/**
 * Delete from cache
 */
export async function deleteFromCache(key: string): Promise<void> {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Cache delete error:", error);
  }
}

/**
 * Generate cache key for search
 */
export function generateSearchCacheKey(filters: any): string {
  // Create an unique key based on the filters
  const sortedFilters = Object.keys(filters)
    .sort()
    .map((key) => `${key}:${filters[key]}`)
    .join("|");

  return `search:products:${sortedFilters}`;
}

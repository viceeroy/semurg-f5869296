
import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
}

class AdvancedCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly MAX_SIZE = 200;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  
  set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
    console.log(`Cache SET: ${key} (TTL: ${ttl}ms)`);
    
    // Clean up if cache is getting large
    if (this.cache.size >= this.MAX_SIZE) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      accessCount: 0,
      lastAccessed: Date.now()
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      console.log(`Cache EXPIRED: ${key}`);
      this.cache.delete(key);
      return null;
    }

    // Update access stats
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    console.log(`Cache HIT: ${key} (access count: ${entry.accessCount})`);
    
    return entry.data;
  }

  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.entries());
    
    // Sort by access count and last accessed time
    entries.sort((a, b) => {
      const scoreA = a[1].accessCount * (Date.now() - a[1].lastAccessed);
      const scoreB = b[1].accessCount * (Date.now() - b[1].lastAccessed);
      return scoreA - scoreB;
    });

    // Remove 20% of least used entries
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
    
    console.log(`Cache evicted ${toRemove} entries`);
  }

  clear(): void {
    console.log('Cache cleared');
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.MAX_SIZE,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        size: JSON.stringify(entry.data).length,
        accessCount: entry.accessCount,
        age: Date.now() - entry.timestamp
      }))
    };
  }
}

const advancedCache = new AdvancedCache();

export const useAdvancedCache = <T,>(
  key: string,
  fetcher: () => Promise<T>,
  options: { 
    ttl?: number; 
    enabled?: boolean;
    staleWhileRevalidate?: boolean;
  } = {}
) => {
  const { ttl = 5 * 60 * 1000, enabled = true, staleWhileRevalidate = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (useCache = true) => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    if (useCache) {
      const cachedData = advancedCache.get<T>(key);
      if (cachedData) {
        setData(cachedData);
        
        if (!staleWhileRevalidate) {
          return;
        }
        // Continue to background refresh if staleWhileRevalidate is true
      }
    }

    setLoading(true);
    setError(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const result = await fetcher();
      
      if (!abortController.signal.aborted) {
        advancedCache.set(key, result, ttl);
        setData(result);
      }
    } catch (err) {
      if (!abortController.signal.aborted) {
        const error = err as Error;
        console.error(`Cache fetch error for ${key}:`, error);
        setError(error);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }
  }, [key, fetcher, ttl, enabled, staleWhileRevalidate]);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  const invalidate = useCallback(() => {
    advancedCache.set(key, null as any, 0); // Immediate expiry
  }, [key]);

  return { data, loading, error, refetch, invalidate };
};

export { advancedCache };

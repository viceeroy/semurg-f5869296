import { useState, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class AICache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly MAX_CACHE_SIZE = 100;

  set<T>(key: string, data: T, expiresIn = 5 * 60 * 1000): void { // 5 min default
    // Clean up expired entries if cache is getting large
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    }

    // If still too large, remove oldest entries
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const entries = Array.from(this.cache.entries());
      entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, this.cache.size - this.MAX_CACHE_SIZE + 10)
        .forEach(([key]) => this.cache.delete(key));
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

const aiCache = new AICache();

export const useAICache = <T,>(
  key: string,
  fetcher: () => Promise<T>,
  options: { expiresIn?: number; enabled?: boolean } = {}
) => {
  const { expiresIn = 5 * 60 * 1000, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!enabled) return;

    // Check cache first
    const cachedData = aiCache.get<T>(key);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      aiCache.set(key, result, expiresIn);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [key, enabled]);

  const refetch = () => {
    aiCache.set(key, null as any, 0); // Invalidate cache
    fetchData();
  };

  return { data, loading, error, refetch };
};

export { aiCache };
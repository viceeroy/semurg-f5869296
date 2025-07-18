
import { supabase } from "@/integrations/supabase/client";

// Database connection monitoring
export const monitorDatabaseHealth = async () => {
  const startTime = performance.now();
  
  try {
    // Simple health check query
    const { data, error } = await supabase
      .from('posts')
      .select('count')
      .limit(1);
    
    const responseTime = performance.now() - startTime;
    
    if (error) {
      console.error('Database health check failed:', error);
      return { healthy: false, responseTime, error: error.message };
    }
    
    console.log(`Database health check: ${responseTime.toFixed(2)}ms`);
    
    return {
      healthy: true,
      responseTime,
      status: responseTime < 100 ? 'excellent' : responseTime < 500 ? 'good' : 'slow'
    };
  } catch (error) {
    const responseTime = performance.now() - startTime;
    console.error('Database connection error:', error);
    return { healthy: false, responseTime, error: 'Connection failed' };
  }
};

// Optimize image URLs for better loading
export const optimizeImageUrl = (url: string, options: {
  width?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
} = {}) => {
  const { width = 400, quality = 75, format = 'webp' } = options;
  
  if (!url || url.startsWith('data:')) return url;
  
  // Supabase storage optimization
  if (url.includes('.supabase.co/storage/')) {
    return `${url}?width=${width}&quality=${quality}&format=${format}`;
  }
  
  // Unsplash optimization
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&q=${quality}&fm=${format}&auto=compress,format`;
  }
  
  return url;
};

// Batch operations for better performance
export const batchQuery = async <T>(
  queries: (() => Promise<T>)[],
  batchSize: number = 5
): Promise<T[]> => {
  const results: T[] = [];
  
  for (let i = 0; i < queries.length; i += batchSize) {
    const batch = queries.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(query => query()));
    
    batchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Batch query failed:', result.reason);
      }
    });
    
    // Small delay between batches to prevent overwhelming the server
    if (i + batchSize < queries.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    };
  }
  return null;
};

// Performance recommendations
export const getPerformanceRecommendations = () => {
  const memory = getMemoryUsage();
  const recommendations: string[] = [];
  
  if (memory) {
    if (memory.used > memory.limit * 0.8) {
      recommendations.push('Memory usage is high. Consider refreshing the page.');
    }
    
    if (memory.used > 100) {
      recommendations.push('Consider clearing browser cache for better performance.');
    }
  }
  
  // Check connection type
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
      recommendations.push('Slow connection detected. Reduce image quality for better performance.');
    }
  }
  
  return recommendations;
};

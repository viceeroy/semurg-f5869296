
import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  apiCalls: number;
  errorCount: number;
  userInteractions: number;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  type: 'render' | 'api' | 'user-action' | 'error';
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    apiCalls: 0,
    errorCount: 0,
    userInteractions: 0
  };
  
  private entries: PerformanceEntry[] = [];
  private startTimes = new Map<string, number>();

  markStart(name: string): void {
    this.startTimes.set(name, performance.now());
  }

  markEnd(name: string, type: PerformanceEntry['type'] = 'render'): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    
    this.entries.push({
      name,
      startTime,
      duration,
      type
    });

    // Update metrics
    switch (type) {
      case 'render':
        this.metrics.renderTime += duration;
        break;
      case 'api':
        this.metrics.apiCalls++;
        break;
      case 'user-action':
        this.metrics.userInteractions++;
        break;
      case 'error':
        this.metrics.errorCount++;
        break;
    }

    this.startTimes.delete(name);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  getMetrics(): PerformanceMetrics & { 
    entries: PerformanceEntry[];
    slowOperations: PerformanceEntry[];
  } {
    const slowOperations = this.entries.filter(entry => entry.duration > 100);
    
    // Update memory usage if available
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    return {
      ...this.metrics,
      entries: this.entries,
      slowOperations
    };
  }

  reset(): void {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      apiCalls: 0,
      errorCount: 0,
      userInteractions: 0
    };
    this.entries = [];
    this.startTimes.clear();
  }
}

const globalMonitor = new PerformanceMonitor();

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<ReturnType<typeof globalMonitor.getMetrics>>();
  const renderStartRef = useRef<number>();

  // Track component render time
  useEffect(() => {
    renderStartRef.current = performance.now();
    globalMonitor.markStart(`${componentName}-render`);

    return () => {
      if (renderStartRef.current) {
        globalMonitor.markEnd(`${componentName}-render`, 'render');
      }
    };
  });

  // Track component mount/unmount
  useEffect(() => {
    globalMonitor.markStart(`${componentName}-mount`);
    
    return () => {
      globalMonitor.markEnd(`${componentName}-mount`, 'render');
    };
  }, [componentName]);

  const trackUserAction = useCallback((actionName: string) => {
    globalMonitor.markStart(`${componentName}-${actionName}`);
    return () => globalMonitor.markEnd(`${componentName}-${actionName}`, 'user-action');
  }, [componentName]);

  const trackApiCall = useCallback((apiName: string) => {
    globalMonitor.markStart(`${componentName}-${apiName}`);
    return () => globalMonitor.markEnd(`${componentName}-${apiName}`, 'api');
  }, [componentName]);

  const trackError = useCallback((errorName: string) => {
    globalMonitor.markEnd(`${componentName}-${errorName}`, 'error');
  }, [componentName]);

  const getMetrics = useCallback(() => {
    const currentMetrics = globalMonitor.getMetrics();
    setMetrics(currentMetrics);
    return currentMetrics;
  }, []);

  const logPerformanceReport = useCallback(() => {
    const report = globalMonitor.getMetrics();
    console.group(`Performance Report - ${componentName}`);
    console.log('Metrics:', report);
    if (report.slowOperations.length > 0) {
      console.warn('Slow Operations:', report.slowOperations);
    }
    console.groupEnd();
  }, [componentName]);

  return {
    trackUserAction,
    trackApiCall,
    trackError,
    getMetrics,
    logPerformanceReport,
    metrics
  };
};

export { globalMonitor };

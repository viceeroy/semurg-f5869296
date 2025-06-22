
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  threshold?: number;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 300
}: UseInfiniteScrollOptions) => {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingElementRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        !isFetching
      ) {
        setIsFetching(true);
        try {
          await fetchNextPage();
        } finally {
          setIsFetching(false);
        }
      }
    },
    [hasNextPage, isFetchingNextPage, isFetching, fetchNextPage]
  );

  useEffect(() => {
    const currentLoadingElement = loadingElementRef.current;
    
    if (currentLoadingElement) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      });
      
      observerRef.current.observe(currentLoadingElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold]);

  return { loadingElementRef, isFetching };
};

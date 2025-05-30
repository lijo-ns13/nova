import { useCallback, useEffect, useRef } from "react";

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 0.1,
}: {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}) => {
  const observer = useRef<IntersectionObserver>(null);
  const observerTarget = useRef(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading && hasMore) {
        onLoadMore();
      }
    },
    [loading, hasMore, onLoadMore]
  );

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold,
    });

    if (observerTarget.current) {
      observer.current.observe(observerTarget.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [handleObserver, threshold]);

  return { observerTarget };
};

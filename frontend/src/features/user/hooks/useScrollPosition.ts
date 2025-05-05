import { useState, useEffect } from "react";

interface ScrollOptions {
  threshold?: number;
}

/**
 * Custom hook to track scroll position and determine if scrolled past threshold
 * @param options Configuration options
 * @returns Object containing scrolled state
 */
export function useScrollPosition({ threshold = 100 }: ScrollOptions = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { scrolled };
}

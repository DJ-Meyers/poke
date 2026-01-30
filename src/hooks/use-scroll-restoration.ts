import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router';

const SCROLL_STORAGE_KEY = 'dex:scroll-positions';

const getStoredPositions = (): Record<string, number> => {
  try {
    const stored = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const savePosition = (pathname: string, position: number) => {
  try {
    const positions = getStoredPositions();
    positions[pathname] = position;
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Ignore storage errors
  }
};

/**
 * Stores and restores scroll positions for a scrollable element based on route.
 * Positions are saved to sessionStorage keyed by pathname.
 */
export const useScrollRestoration = () => {
  const location = useLocation();
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  const setScrollRef = useCallback((element: HTMLElement | null) => {
    setScrollElement(element);
  }, []);

  // Handle scroll saving (debounced)
  useEffect(() => {
    if (!scrollElement) return;

    const pathname = location.pathname;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        savePosition(pathname, scrollElement.scrollTop);
      }, 150);
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [scrollElement, location.pathname]);

  // Restore scroll position when location changes
  useEffect(() => {
    if (!scrollElement) return;

    const positions = getStoredPositions();
    const savedPosition = positions[location.pathname];

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      scrollElement.scrollTop = savedPosition ?? 0;
    });
  }, [scrollElement, location.pathname]);

  return { setScrollRef };
};

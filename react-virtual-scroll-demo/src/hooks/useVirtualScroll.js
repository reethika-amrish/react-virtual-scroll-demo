import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for virtual scrolling with paginated data fetching.
 * Only renders visible rows + buffer, fetches pages as user scrolls.
 */
export function useVirtualScroll({ fetchFn, rowHeight = 40, buffer = 5, pageSize = 50 }) {
  const [items, setItems] = useState(new Map());
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const loadedPages = useRef(new Set());
  const containerRef = useRef(null);

  const visibleStart = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const visibleEnd = Math.min(totalCount, Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer);

  const loadPage = useCallback(async (page, search = '') => {
    if (loadedPages.current.has(`${page}-${search}`)) return;
    loadedPages.current.add(`${page}-${search}`);

    setLoading(true);
    const result = await fetchFn(page, pageSize, search);
    setTotalCount(result.total);
    setItems(prev => {
      const next = new Map(prev);
      result.records.forEach((rec, i) => next.set(page * pageSize + i, rec));
      return next;
    });
    setLoading(false);
  }, [fetchFn, pageSize]);

  // Load pages for visible range
  useEffect(() => {
    const startPage = Math.floor(visibleStart / pageSize);
    const endPage = Math.floor(visibleEnd / pageSize);
    for (let p = startPage; p <= endPage; p++) {
      loadPage(p);
    }
  }, [visibleStart, visibleEnd, loadPage, pageSize]);

  const onScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  const reset = useCallback((search = '') => {
    setItems(new Map());
    loadedPages.current = new Set();
    setScrollTop(0);
    loadPage(0, search);
  }, [loadPage]);

  return {
    items, totalCount, loading, containerRef,
    visibleStart, visibleEnd, rowHeight, onScroll, reset,
    totalHeight: totalCount * rowHeight,
  };
}

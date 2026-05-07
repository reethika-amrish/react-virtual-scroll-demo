import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

const DEPARTMENTS = ['Cardiology', 'Oncology', 'Neurology', 'Pediatrics', 'Radiology', 'Orthopedics'];
const STUDIES = ['TRIAL-A', 'TRIAL-B', 'TRIAL-C', 'TRIAL-D', 'PHASE-II', 'PHASE-III'];
const STATUSES = ['Active', 'Completed', 'Pending'];

function generateRecord(index) {
  return {
    id: `REC-${String(index + 1).padStart(5, '0')}`,
    patientCode: `PT-${String((index * 7 + 3) % 99999).padStart(5, '0')}`,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    study: STUDIES[index % STUDIES.length],
    status: STATUSES[index % STATUSES.length],
    enrollDate: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
    dataPoints: 50 + (index * 13) % 950,
  };
}

/**
 * Custom hook for virtual scrolling with paginated data generation.
 * Only renders visible rows + overscan buffer, generates pages on demand.
 */
export function useVirtualScroll({ totalItems = 50000, rowHeight = 40, viewportHeight = 600, overscan = 5, pageSize = 200, searchQuery = '' }) {
  const [items, setItems] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const loadedPages = useRef(new Set());

  const allRecords = useMemo(() => {
    const records = [];
    for (let i = 0; i < totalItems; i++) {
      const rec = generateRecord(i);
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const match = rec.id.toLowerCase().includes(query) ||
          rec.patientCode.toLowerCase().includes(query) ||
          rec.department.toLowerCase().includes(query) ||
          rec.study.toLowerCase().includes(query) ||
          rec.status.toLowerCase().includes(query);
        if (match) records.push(rec);
      } else {
        records.push(rec);
      }
    }
    return records;
  }, [totalItems, searchQuery]);

  const totalCount = allRecords.length;
  const visibleStart = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleEnd = Math.min(totalCount, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan);

  useEffect(() => {
    setItems(new Map());
    loadedPages.current = new Set();
    setScrollTop(0);

    const startPage = Math.floor(visibleStart / pageSize);
    const endPage = Math.floor(visibleEnd / pageSize);
    const cacheKey = searchQuery || '__all__';

    for (let p = startPage; p <= endPage; p++) {
      const pageKey = `${p}-${cacheKey}`;
      if (loadedPages.current.has(pageKey)) continue;
      loadedPages.current.add(pageKey);

      const start = p * pageSize;
      const pageRecords = allRecords.slice(start, start + pageSize);

      setItems(prev => {
        const next = new Map(prev);
        pageRecords.forEach((rec, i) => next.set(start + i, rec));
        return next;
      });
    }
  }, [searchQuery, allRecords]);

  useEffect(() => {
    const startPage = Math.floor(visibleStart / pageSize);
    const endPage = Math.floor(visibleEnd / pageSize);
    const cacheKey = searchQuery || '__all__';

    for (let p = startPage; p <= endPage; p++) {
      const pageKey = `${p}-${cacheKey}`;
      if (loadedPages.current.has(pageKey)) continue;
      loadedPages.current.add(pageKey);

      setLoading(true);
      const start = p * pageSize;
      const pageRecords = allRecords.slice(start, start + pageSize);

      setItems(prev => {
        const next = new Map(prev);
        pageRecords.forEach((rec, i) => next.set(start + i, rec));
        return next;
      });
      setLoading(false);
    }
  }, [visibleStart, visibleEnd, pageSize]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    items, totalCount, loading,
    visibleStart, visibleEnd, handleScroll,
  };
}

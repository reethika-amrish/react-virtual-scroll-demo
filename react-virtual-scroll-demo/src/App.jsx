import { useState, useDeferredValue, useCallback, useRef } from 'react';
import { useVirtualScroll } from './hooks/useVirtualScroll';
import VirtualList from './components/VirtualList';
import SearchBar from './components/SearchBar';

const ROW_HEIGHT = 40;
const VIEWPORT_HEIGHT = 600;
const TOTAL_RECORDS = 50000;

export default function App() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDeferredValue(search);
  const scrollRef = useRef(null);

  const {
    items, totalCount, visibleStart, visibleEnd,
    loading, handleScroll,
  } = useVirtualScroll({
    totalItems: TOTAL_RECORDS,
    rowHeight: ROW_HEIGHT,
    viewportHeight: VIEWPORT_HEIGHT,
    overscan: 10,
    pageSize: 200,
    searchQuery: debouncedSearch,
  });

  const totalHeight = totalCount * ROW_HEIGHT;

  return (
    <div style={{
      maxWidth: '1100px', margin: '0 auto', padding: '32px 16px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif", color: '#e2e8f0',
      minHeight: '100vh', background: '#0a0a1a',
    }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#64ffda', margin: 0 }}>
          Virtual Scroll Demo
        </h1>
      </header>

      <SearchBar
        value={search}
        onChange={setSearch}
        totalCount={totalCount}
        visibleCount={totalCount}
      />

      <VirtualList
        items={items}
        totalCount={totalCount}
        visibleStart={visibleStart}
        visibleEnd={visibleEnd}
        rowHeight={ROW_HEIGHT}
        totalHeight={totalHeight}
        onScroll={handleScroll}
        loading={loading}
      />

      <footer style={{
        marginTop: '16px', padding: '12px',
        background: '#1e293b', borderRadius: '8px',
        display: 'flex', justifyContent: 'space-between',
        fontSize: '12px', color: '#64748b',
      }}>
        <span>Loaded pages: {Math.ceil(items.size / 200)}</span>
        <span>DOM nodes: ~{visibleEnd - visibleStart}</span>
        <span>Viewport: rows {visibleStart}–{visibleEnd}</span>
      </footer>
    </div>
  );
}

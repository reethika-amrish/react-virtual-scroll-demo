import { useState, useEffect } from 'react';

/**
 * Debounce hook — delays value updates to avoid excessive API calls.
 * Used for search input debouncing.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

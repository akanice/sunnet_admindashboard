import { useCallback, useMemo, useRef } from 'react';
import { debounce } from 'lodash';

export const useOptimizedComponent = ({
  onSearch,
  onSort,
  onFilter,
  searchDelay = 300,
  initialSort = { field: '', order: 'asc' },
  initialFilters = {},
}) => {
  // Refs để lưu trữ giá trị hiện tại
  const currentFiltersRef = useRef(initialFilters);
  const currentSortRef = useRef(initialSort);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((value) => {
      if (onSearch) {
        onSearch(value);
      }
    }, searchDelay),
    [onSearch, searchDelay]
  );

  // Memoized sort function
  const handleSort = useCallback((field) => {
    if (!onSort) return;

    const newOrder = 
      currentSortRef.current.field === field && currentSortRef.current.order === 'asc'
        ? 'desc'
        : 'asc';

    currentSortRef.current = { field, order: newOrder };
    onSort(field, newOrder);
  }, [onSort]);

  // Memoized filter function
  const handleFilter = useCallback((filters) => {
    if (!onFilter) return;

    currentFiltersRef.current = { ...currentFiltersRef.current, ...filters };
    onFilter(currentFiltersRef.current);
  }, [onFilter]);

  // Cleanup function
  const cleanup = useCallback(() => {
    debouncedSearch.cancel();
  }, [debouncedSearch]);

  return {
    handleSearch: debouncedSearch,
    handleSort,
    handleFilter,
    cleanup,
    currentFilters: currentFiltersRef.current,
    currentSort: currentSortRef.current,
  };
}; 
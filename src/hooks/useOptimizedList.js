import { useState, useEffect, useCallback, useMemo } from 'react';
import { useVirtual } from 'react-virtual';

export const useOptimizedList = ({
  items,
  itemHeight = 50,
  overscan = 5,
  containerRef,
  filterFn,
  sortFn,
}) => {
  const [filteredItems, setFilteredItems] = useState(items);
  const [sortOrder, setSortOrder] = useState('asc');

  // Memoize filtered items
  useEffect(() => {
    if (filterFn) {
      setFilteredItems(items.filter(filterFn));
    } else {
      setFilteredItems(items);
    }
  }, [items, filterFn]);

  // Memoize sorted items
  const sortedItems = useMemo(() => {
    if (!sortFn) return filteredItems;
    return [...filteredItems].sort((a, b) => {
      const result = sortFn(a, b);
      return sortOrder === 'asc' ? result : -result;
    });
  }, [filteredItems, sortFn, sortOrder]);

  // Virtual list setup
  const rowVirtualizer = useVirtual({
    size: sortedItems.length,
    parentRef: containerRef,
    estimateSize: useCallback(() => itemHeight, [itemHeight]),
    overscan,
  });

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  return {
    items: sortedItems,
    virtualItems: rowVirtualizer.virtualItems,
    totalSize: rowVirtualizer.totalSize,
    sortOrder,
    toggleSortOrder,
  };
}; 
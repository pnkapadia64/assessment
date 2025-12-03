import React, { useEffect, useState, useRef, useCallback } from 'react';
import { List } from 'react-window';
import { useInfiniteLoader } from 'react-window-infinite-loader';
import { useData } from '../state/DataContext';
import ItemRow from './ItemRow';

function Items() {
  const { items, pagination, fetchItems } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allItems, setAllItems] = useState([]);
  const isFetchingRef = useRef(false);
  const itemCount = pagination?.total || allItems.length;

  const isRowLoaded = useCallback(
    (index) => allItems[index] !== undefined,
    [allItems]
  );

  const loadMoreRows = useCallback((startIndex) => {
    console.log('loadMoreRows called:', startIndex, items[startIndex], allItems[startIndex]);
    if (isFetchingRef.current || !pagination?.hasNextPage || items[startIndex] !== undefined) {
      console.log('loadMoreRows ignored');
      return Promise.resolve();
    }

    isFetchingRef.current = true;
    setIsLoading(true);
    const nextPage = startIndex / (pagination?.pageSize || 10) + 1;
    setCurrentPage(nextPage);

    return fetchItems(null, searchQuery, nextPage)
      .catch(err => {
        console.error('Error loading more items:', err);
      })
      .finally(() => {
        setIsLoading(false);
        isFetchingRef.current = false;
      });
  }, [searchQuery, pagination?.hasNextPage]);

  const onRowsRendered = useInfiniteLoader({
    isRowLoaded,
    loadMoreRows,
    rowCount: allItems.length + (pagination?.hasNextPage ? 1 : 0)
  });

  useEffect(() => {
    const abortController = new AbortController();

    const timeoutId = setTimeout(() => {
      console.log('other effect');
      if (isFetchingRef.current) return;
      
      isFetchingRef.current = true;
      setIsLoading(true);
      setCurrentPage(1);
      setAllItems([]);
      
      console.log('other effect fetching');
      fetchItems(abortController.signal, searchQuery, 1)
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error(err);
          }
        })
        .finally(() => {
          setIsLoading(false);
          isFetchingRef.current = false;
        });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [fetchItems, searchQuery]);

  useEffect(() => {
    if (items && items.length > 0) {
      setAllItems(prev => {
        if (currentPage === 1) {
          return items;
        }
        const newItems = items.filter(item => !prev.some(p => p.id === item.id));
        return [...prev, ...newItems];
      });
    }
  }, [items, currentPage]);

  return (
    <div style={{ padding: '16px' }}>
      <input
        type="text"
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: '8px 12px',
          fontSize: '14px',
          marginBottom: '16px',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#fafafa',
          width: '100%',
          height: '400px',
        }}
      >
        {allItems.length === 0 && !isLoading ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '16px' }}>
            No items found.
          </p>
        ) : (
          <List
            onRowsRendered={onRowsRendered}
            rowComponent={ItemRow}
            rowCount={itemCount}
            rowHeight={60}
            defaultHeight={400}
            rowProps={{ rows: allItems }}
          />
        )}
      </div>
      
      {/* {pagination && (
        <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Showing {allItems.length} of {pagination.total} items
          {isLoading && ' (Loading...)'}
        </div>
      )} */}
    </div>
  );
}

export default Items;
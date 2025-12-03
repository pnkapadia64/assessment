import React, { useEffect, useState, useRef, useCallback } from 'react';
import { List } from 'react-window';
import { useInfiniteLoader } from 'react-window-infinite-loader';
import { useData } from '../state/DataContext';
import ItemRow from './ItemRow';

function Items() {
  const { fetchItems } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [resetKey, setResetKey] = useState(0);
  const isFetchingRef = useRef(false);
  const itemCount = pagination?.total || allItems.length;

  const isRowLoaded = useCallback(
    (index) => allItems[index] !== undefined,
    [allItems]
  );

  const loadMoreRows = useCallback((startIndex) => {
    if (isFetchingRef.current || allItems[startIndex] !== undefined) {
      return Promise.resolve();
    }

    if (pagination && !pagination.hasNextPage && startIndex >= allItems.length) {
      return Promise.resolve();
    }

    isFetchingRef.current = true;
    const nextPage = Math.floor(startIndex / (pagination?.pageSize || 10)) + 1;

    return fetchItems(null, searchQuery, nextPage)
      .then(result => {
        setAllItems(prev => {
          if (nextPage === 1) return result.data || [];
          const newItems = (result.data || []).filter(
            item => !prev.some(p => p.id === item.id)
          );
          return [...prev, ...newItems];
        });
        setPagination(result.pagination || null);
      })
      .catch(err => {
        console.error('Error loading more items:', err);
      })
      .finally(() => {
        isFetchingRef.current = false;
      });
  }, [searchQuery, allItems, pagination, fetchItems]);

  const onRowsRendered = useInfiniteLoader({
    isRowLoaded,
    loadMoreRows,
    rowCount: allItems.length + (pagination?.hasNextPage ? 1 : 0)
  });

  useEffect(() => {
    setAllItems([]);
    setPagination(null);
    isFetchingRef.current = false;
    setResetKey(prev => prev + 1);
    
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      if (!isFetchingRef.current) {
        isFetchingRef.current = true;
        fetchItems(abortController.signal, searchQuery, 1)
          .then(result => {
            setAllItems(result.data || []);
            setPagination(result.pagination || null);
          })
          .catch(err => {
            if (err.name !== 'AbortError') {
              console.error('Error loading items:', err);
            }
          })
          .finally(() => {
            isFetchingRef.current = false;
          });
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [searchQuery, fetchItems]);

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
        <List
          key={resetKey}
          onRowsRendered={onRowsRendered}
          rowComponent={ItemRow}
          rowCount={itemCount}
          rowHeight={60}
          defaultHeight={400}
          rowProps={{ rows: allItems }}
        />
      </div>
    </div>
  );
}

export default Items;
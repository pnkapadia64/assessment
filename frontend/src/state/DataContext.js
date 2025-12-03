import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);

  const fetchItems = useCallback(async (signal, searchQuery = '', page = 1) => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('q', searchQuery);
    }
    params.append('page', page);
    
    const url = `http://localhost:3001/api/items?${params.toString()}`;
    const res = await fetch(url, {
      signal
    });
    const json = await res.json();
    setItems(json.data || json);
    setPagination(json.pagination || null);
  }, []);

  return (
    <DataContext.Provider value={{ items, pagination, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
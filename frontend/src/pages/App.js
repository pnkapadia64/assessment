import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import Stats from './Stats';
import { DataProvider } from '../state/DataContext';

function App() {
  return (
    <DataProvider>
      <nav style={{padding: '16px 24px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{ fontSize: 24 }}>Items</div>
        <Stats />
      </nav>
      <Routes>
        <Route path="/" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetail />} />
      </Routes>
    </DataProvider>
  );
}

export default App;
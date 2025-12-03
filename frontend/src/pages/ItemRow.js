import React from 'react';
import { Link } from 'react-router-dom';

export default function ItemRow({ index, rows, style }) {
    const item = rows[index];
    
    if (!item) {
      return (
        <div style={style}>
          <div style={{ padding: '8px', color: '#999', fontStyle: 'italic' }}>
            Loading...
          </div>
        </div>
      );
    }

    return (
      <div style={style}>
        <div 
          style={{
          padding: '12px',
          margin: '4px 8px',
          backgroundColor: 'white',
          borderRadius: '4px',
          border: '1px solid #e0e0e0',
          transition: 'all 0.2s'
        }}
        >
      <Link 
        to={'/items/' + item.id}
        style={{
          textDecoration: 'none',
          color: '#007bff',
          fontSize: '14px',
          display: 'block'
        }}
      >
        {item.name}
      </Link>
    </div>
      </div>
    );
  }

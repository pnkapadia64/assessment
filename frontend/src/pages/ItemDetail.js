import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    
    setIsLoading(true);
    setError(null);
    
    fetch(`http://localhost:3001/api/items/${id}`, {
      signal: abortController.signal
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Item not found (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        setItem(data);
        setIsLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error fetching item:', err);
          setError(err.message);
          setIsLoading(false);
          setTimeout(() => navigate('/'), 2000);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [id, navigate]);

  if (isLoading) return <p style={{padding: 16}}>Loading...</p>;
  if (error) return <p style={{padding: 16, color: 'red'}}>Error: {error}. Redirecting...</p>;
  if (!item) return <p style={{padding: 16}}>No item found.</p>;

  return (
    <div style={{padding: 16}}>
      <h2>{item.name}</h2>
      <p><strong>ID:</strong> {item.id}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
      <button 
        onClick={() => navigate('/')}
        style={{
          marginTop: '16px',
          padding: '8px 16px',
          fontSize: '14px',
          cursor: 'pointer',
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: 'white'
        }}
      >
        Back to Items
      </button>
    </div>
  );
}

export default ItemDetail;
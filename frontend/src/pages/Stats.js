import React, { useEffect, useState } from 'react';

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{fontSize: '14px', color: '#666'}}>
        Loading...
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div style={{fontSize: '14px', color: '#666'}}>
      Total Items: {stats.total} | Average Price: ${stats.averagePrice.toFixed(2)}
    </div>
  );
}

export default Stats;

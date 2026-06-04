import React, { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import { searchLocation } from '../services/geocode';

const SearchBar = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!query || query.length < 3) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const result = await searchLocation(query);
      if (result && onLocationSelect) {
         onLocationSelect(result);
      }
      setIsSearching(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [query, onLocationSelect]);

  return (
    <div style={{
      position: 'absolute',
      top: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      width: '400px',
      maxWidth: '90vw'
    }}>
      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        borderRadius: '30px',
        border: '1px solid var(--glass-border)'
      }}>
        <Search size={18} color="var(--text-muted)" style={{ marginRight: '12px' }} />
        <input 
          type="text"
          placeholder="Search location to view potholes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            flex: 1,
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            fontFamily: 'inherit'
          }}
        />
        {isSearching && (
          <Loader size={18} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;

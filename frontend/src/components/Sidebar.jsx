import React from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle } from 'lucide-react';
import '../styles/animations.css';

const Sidebar = ({ potholes = [], isConnected = false }) => {
  const sortedPotholes = [...potholes].sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'fixed': return 'var(--success)';
      case 'verified': return 'var(--warning)';
      default: return 'var(--danger)';
    }
  };

  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      width: '350px',
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      position: 'relative',
      boxShadow: '4px 0 24px rgba(0,0,0,0.05)'
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            backgroundColor: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <MapPin size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, m: 0 }}>Pothole Monitor</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
              <span className={isConnected ? "blink-dot" : ""} style={{
                display: 'inline-block', width: '8px', height: '8px',
                backgroundColor: isConnected ? 'var(--success)' : 'var(--danger)',
                borderRadius: '50%'
              }}></span>
              {isConnected ? 'System Live' : 'Disconnected'}
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          padding: '16px',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Total Active</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{potholes.length}</div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>High Risk</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>
              {potholes.filter(p => (p.confidence || 0) > 0.8).length}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 24px 8px' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', margin: 0 }}>Live Feed</h3>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {sortedPotholes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <AlertTriangle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p>No potholes detected yet. Waiting for live sensors...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '24px' }}>
            {sortedPotholes.map((pothole, i) => (
              <div key={pothole.id || i} className="slide-up" style={{
                padding: '16px',
                backgroundColor: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                animationDelay: `${i * 0.05}s`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: getStatusColor(pothole.status)
                    }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: getStatusColor(pothole.status) }}>
                      {pothole.status || 'Pending'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <Clock size={12} />
                    {formatTime(pothole.timestamp)}
                  </div>
                </div>
                
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px', color: '#1e293b' }}>
                  {pothole.locationName || 'Unknown Location'}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '12px' }}>
                   <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                     {pothole.latitude?.toFixed(4)}, {pothole.longitude?.toFixed(4)}
                   </div>
                   <div style={{
                     padding: '2px 8px',
                     backgroundColor: '#f1f5f9',
                     borderRadius: '12px',
                     fontSize: '0.75rem',
                     fontWeight: 600,
                     color: '#475569'
                   }}>
                     {(pothole.confidence * 100).toFixed(0)}% Conf
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

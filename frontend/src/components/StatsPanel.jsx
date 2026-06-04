import React from 'react';
import { Activity, AlertOctagon, Zap } from 'lucide-react';
import '../styles/animations.css';

const StatsPanel = ({ potholes, isConnected, userLocation }) => {
  // Rough calculation for 1km radius (approx 0.009 degrees lat/lon)
  const nearbyAlerts = potholes.filter(p => {
    if (!userLocation || !p.latitude || !p.longitude) return false;
    const latDiff = Math.abs(p.latitude - userLocation[0]);
    const lonDiff = Math.abs(p.longitude - userLocation[1]);
    return latDiff < 0.009 && lonDiff < 0.009;
  }).length;

  return (
    <div className="glass-panel slide-up" style={{
      position: 'absolute',
      bottom: '30px',
      right: '30px',
      zIndex: 1000,
      padding: '20px',
      width: '320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <Activity size={20} color="var(--primary)" />
           <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>System Health</span>
         </div>
         <div style={{
           display: 'flex', alignItems: 'center', gap: '6px',
           padding: '4px 10px', borderRadius: '20px',
           backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
           color: isConnected ? 'var(--success)' : 'var(--danger)',
           fontSize: '0.75rem', fontWeight: 600
         }}>
           <span className={isConnected ? "blink-dot" : ""} style={{
             width: '6px', height: '6px', borderRadius: '50%',
             backgroundColor: 'currentColor'
           }} />
           {isConnected ? 'LIVE' : 'OFFLINE'}
         </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
             <AlertOctagon size={14} /> Total Active
           </div>
           <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
             {potholes.length}
           </span>
        </div>

        <div style={{ width: '1px', backgroundColor: 'var(--glass-border)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
             <Zap size={14} color="var(--warning)" /> Nearby (1km)
           </div>
           <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--warning)' }}>
             {nearbyAlerts}
           </span>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;

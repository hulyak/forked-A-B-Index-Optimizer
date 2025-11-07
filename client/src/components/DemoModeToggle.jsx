import React from 'react';
import { Zap, Database } from 'lucide-react';

function DemoModeToggle({ demoMode, onToggle }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          borderRadius: '10px',
          fontWeight: '600',
          fontSize: '16px',
          transition: 'all 0.3s',
          cursor: 'pointer',
          border: demoMode ? 'none' : '2px solid #3b82f6',
          background: demoMode ? '#eab308' : '#3b82f6',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}
      >
        {demoMode ? <Zap size={22} /> : <Database size={22} />}
        {demoMode ? 'Demo Mode' : 'Live Mode'}
      </button>

      {demoMode && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '12px',
          padding: '12px 16px',
          background: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#92400e',
          maxWidth: '320px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <strong>Demo Mode Active:</strong> Showcasing features with simulated data for hackathon judges. Toggle to <strong>Live Mode</strong> to try with Tiger Cloud!
        </div>
      )}

      {!demoMode && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          marginTop: '12px',
          padding: '12px 16px',
          background: '#dbeafe',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1e3a8a',
          maxWidth: '320px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <strong>Live Mode Active:</strong> Connects to Tiger Cloud API for production testing. Switch to <strong>Demo Mode</strong> for simulated results!
        </div>
      )}
    </div>
  );
}

export default DemoModeToggle;
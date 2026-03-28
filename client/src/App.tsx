import { useState, useEffect } from 'react';
import { client } from './client';
import { Status } from './gen/api/v1/data_pb';
import { Activity, ServerCrash, CheckCircle2, Clock } from 'lucide-react';
import './index.css';

export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('Connecting...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.getData({ query: 'system_metrics' });
        setData(response.items);
        setStatus(response.status);
      } catch (err) {
        console.error('Failed to fetch data via ConnectRPC:', err);
        setStatus('Connection Failed');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Poll every 5 seconds for dynamic effect
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (type: Status) => {
    switch (type) {
      case Status.ACTIVE: return <CheckCircle2 size={16} className="mr-1" />;
      case Status.PENDING: return <Clock size={16} className="mr-1" />;
      case Status.ERROR: return <ServerCrash size={16} className="mr-1" />;
      default: return <Activity size={16} className="mr-1" />;
    }
  };

  const getStatusClass = (type: Status) => {
    switch (type) {
      case Status.ACTIVE: return 'status-active';
      case Status.PENDING: return 'status-pending';
      case Status.ERROR: return 'status-error';
      default: return '';
    }
  };

  const getStatusLabel = (type: Status) => {
    switch (type) {
      case Status.ACTIVE: return 'Active';
      case Status.PENDING: return 'Pending';
      case Status.ERROR: return 'Alert';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo d-flex align-items-center">
          <Activity className="mr-2" color="var(--accent-color)" size={28} />
          NeoUI Matrix
        </div>
        <div>
          <button className="button" onClick={() => window.location.reload()}>Refresh Cluster</button>
        </div>
      </header>
      
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>System Telemetry</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ 
            display: 'inline-block', 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: status === 'Connection Failed' ? 'var(--error)' : 'var(--success)',
            boxShadow: `0 0 8px ${status === 'Connection Failed' ? 'var(--error)' : 'var(--success)'}`
          }}></span>
          <span style={{ color: 'var(--text-secondary)' }}>
             RPC Status: {status}
          </span>
        </div>
      </div>

      <div className="grid">
        {loading && data.length === 0 ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="glass-card skeleton" style={{ height: '220px' }}></div>
          ))
        ) : (
          data.map((item) => (
            <div key={item.id} className="glass-card data-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className={`status-badge ${getStatusClass(item.type)}`}>
                  {getStatusIcon(item.type)}
                  {getStatusLabel(item.type)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h3 className="item-title">{item.title}</h3>
              <p className="item-desc">{item.description}</p>
              
              <div className="item-meta mt-auto">
                <span style={{ color: 'var(--text-secondary)' }}>ID: #{item.id}</span>
                <span className="value-text">{item.value.toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

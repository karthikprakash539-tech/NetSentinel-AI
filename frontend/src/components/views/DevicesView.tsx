import { useState } from 'react';
import type { NetworkDevice } from '../../types/sentinel.ts';
import {
  Server,
  Search,
  Lock,
  Unlock
} from 'lucide-react';

interface DevicesViewProps {
  devices: NetworkDevice[];
  onToggleIsolate: (deviceId: string) => void;
  searchQuery?: string;
}

export function DevicesView({ devices, onToggleIsolate, searchQuery = '' }: DevicesViewProps) {
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [filterSearch, setFilterSearch] = useState('');

  const effectiveSearch = searchQuery || filterSearch;

  const filteredDevices = devices.filter((dev) => {
    if (deviceFilter !== 'all' && dev.deviceType !== deviceFilter) {
      return false;
    }
    if (effectiveSearch.trim()) {
      const q = effectiveSearch.toLowerCase();
      return (
        dev.hostname.toLowerCase().includes(q) ||
        dev.ipAddress.toLowerCase().includes(q) ||
        dev.macAddress.toLowerCase().includes(q) ||
        dev.os.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="view-container">
      {/* Devices Toolbar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
            Network Asset & Sensor Inventory
          </h3>
          <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>
            ({filteredDevices.length} monitored)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="filter-pills" role="group" aria-label="Device type filter">
            {['all', 'firewall', 'server', 'k8s_node', 'switch', 'endpoint'].map((type) => (
              <button
                key={type}
                type="button"
                className={`filter-pill ${deviceFilter === type ? 'active' : ''}`}
                onClick={() => setDeviceFilter(type)}
              >
                {type === 'all' ? 'All Devices' : type.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="table-search-box">
            <Search size={14} className="table-search-icon" aria-hidden="true" />
            <input
              type="text"
              className="table-search-input"
              placeholder="Filter hostname, IP..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              aria-label="Filter devices"
            />
          </div>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid-3-col">
        {filteredDevices.map((dev) => {
          const isQuarantined = dev.status === 'isolated';

          return (
            <div
              key={dev.id}
              className="glass-panel device-card"
              style={{
                borderColor: isQuarantined
                  ? 'var(--sev-critical-border)'
                  : dev.activeAlerts > 0
                  ? 'rgba(249, 115, 22, 0.4)'
                  : undefined
              }}
            >
              <div className="device-header">
                <div className="device-name-box">
                  <div
                    className="device-icon-box"
                    style={{
                      color: isQuarantined ? 'var(--accent-red)' : 'var(--accent-cyan)'
                    }}
                  >
                    <Server size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                      {dev.hostname}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {dev.ipAddress}
                    </span>
                  </div>
                </div>

                <span
                  className={`badge-status ${
                    dev.status === 'online'
                      ? 'resolved'
                      : dev.status === 'isolated'
                      ? 'blocked'
                      : 'investigating'
                  }`}
                >
                  {dev.status}
                </span>
              </div>

              <div className="device-meta-row">
                <div className="device-meta-item">
                  <span className="device-meta-label">OS Platform</span>
                  <span className="device-meta-val" style={{ fontSize: '10.5px' }}>{dev.os}</span>
                </div>
                <div className="device-meta-item">
                  <span className="device-meta-label">MAC Address</span>
                  <span className="device-meta-val">{dev.macAddress}</span>
                </div>
                <div className="device-meta-item">
                  <span className="device-meta-label">Active Alerts</span>
                  <span className="device-meta-val" style={{ color: dev.activeAlerts > 0 ? '#f87171' : '#34d399' }}>
                    {dev.activeAlerts} alerts
                  </span>
                </div>
                <div className="device-meta-item">
                  <span className="device-meta-label">Bandwidth</span>
                  <span className="device-meta-val">{dev.bandwidthUsage}</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  paddingTop: '10px'
                }}
              >
                <span className={`badge-sev ${dev.threatLevel}`}>
                  Risk: {dev.threatLevel}
                </span>

                <button
                  type="button"
                  className={isQuarantined ? 'btn-secondary' : 'btn-danger-action'}
                  style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}
                  onClick={() => onToggleIsolate(dev.id)}
                  title={isQuarantined ? 'Restore network access' : 'Quarantine host from local subnet'}
                >
                  {isQuarantined ? (
                    <>
                      <Unlock size={12} /> Un-quarantine
                    </>
                  ) : (
                    <>
                      <Lock size={12} /> Isolate Host
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import {
  Settings,
  Bell,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Save
} from 'lucide-react';

interface SettingsViewProps {
  onResetDemoData: () => void;
}

export function SettingsView({ onResetDemoData }: SettingsViewProps) {
  const [threshold, setThreshold] = useState(85);
  const [samplingRate, setSamplingRate] = useState(100); // 100% full capture
  const [autoMitigation, setAutoMitigation] = useState(true);
  const [dnsSinkhole, setDnsSinkhole] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="view-container">
      {/* Settings Header */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={22} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              System & AI Engine Configuration
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Tune neural anomaly thresholds, autonomous response rules, and alert webhooks
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {savedNotice && (
            <span style={{ color: '#34d399', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> Configuration Saved
            </span>
          )}
          <button type="button" className="btn-primary" onClick={handleSave}>
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="grid-2-col">
        {/* Detection Engine Settings */}
        <div className="glass-panel settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={16} color="var(--accent-cyan)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              AI Anomaly & Detection Sensitivity
            </h4>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Neural Confidence Threshold</span>
              <span className="setting-desc">
                Minimum ML certainty score required to trigger an autonomous incident alert.
              </span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="50"
                max="99"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="range-slider"
                aria-label="Neural confidence threshold slider"
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: '40px' }}>
                {threshold}%
              </span>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Packet Inspection Sampling Rate</span>
              <span className="setting-desc">
                Percentage of ingress flows evaluated via deep packet inspection (DPI).
              </span>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={samplingRate}
                onChange={(e) => setSamplingRate(Number(e.target.value))}
                className="range-slider"
                aria-label="Packet sampling rate slider"
              />
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, minWidth: '40px' }}>
                {samplingRate}%
              </span>
            </div>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Autonomous eBPF Rate Limiting</span>
              <span className="setting-desc">
                Instantly drop volumetric DDoS packets at the Linux kernel layer without CPU overhead.
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={autoMitigation}
                onChange={(e) => setAutoMitigation(e.target.checked)}
                aria-label="Autonomous eBPF rate limiting switch"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Automated DNS Sinkholing</span>
              <span className="setting-desc">
                Redirect malicious C2 lookup queries to isolated internal sinkhole servers.
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={dnsSinkhole}
                onChange={(e) => setDnsSinkhole(e.target.checked)}
                aria-label="Automated DNS sinkholing switch"
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        {/* Notifications & Maintenance */}
        <div className="glass-panel settings-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} color="var(--accent-indigo)" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              Alert Routing & SOC Dispatch
            </h4>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Slack / Teams Dispatch</span>
              <span className="setting-desc">
                Post instant incident summaries to `#soc-critical-alerts` webhook.
              </span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={slackAlerts}
                onChange={(e) => setSlackAlerts(e.target.checked)}
                aria-label="Slack alerts toggle"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="setting-row">
            <div className="setting-info">
              <span className="setting-title">Syslog SIEM Forwarding</span>
              <span className="setting-desc">
                Stream CEF/JSON audit logs to external Splunk / QRadar / Datadog endpoints.
              </span>
            </div>
            <span className="mono-tag" style={{ color: 'var(--accent-cyan)' }}>
              10.0.0.50:514 (UDP)
            </span>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h5 style={{ fontSize: '12.5px', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
              Demonstration Environment Reset
            </h5>
            <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
              Reset all blocked IPs, quarantined host devices, and event statuses back to the default synthetic demo dataset.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={onResetDemoData}
              title="Reset simulated data"
            >
              <RefreshCw size={14} /> Reset Demo Telemetry State
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

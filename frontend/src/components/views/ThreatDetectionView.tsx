import type { ThreatIntelligenceItem, SeverityDistributionItem } from '../../types/sentinel.ts';
import { SeverityDistributionChart } from '../dashboard/SeverityDistributionChart.tsx';
import {
  ShieldAlert,
  Flame,
  Globe,
  ExternalLink
} from 'lucide-react';

interface ThreatDetectionViewProps {
  threatIntel: ThreatIntelligenceItem[];
  severityData: SeverityDistributionItem[];
  onInspectActor?: (actor: string) => void;
}

export function ThreatDetectionView({
  threatIntel,
  severityData,
  onInspectActor
}: ThreatDetectionViewProps) {
  return (
    <div className="view-container">
      {/* AI Intrusion Detection Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(14, 22, 41, 0.9), rgba(99, 102, 241, 0.12))',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="pulse-indicator" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              AI NEURAL DETECTION CORE (ACTIVE)
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Multi-Layer Deep Packet Inspection & Heuristic Scoring
          </h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            NetSentinel AI uses unsupervised Isolation Forests, LSTM sequence models, and signature matching to detect zero-day exploits, C2 beaconing, and distributed flood anomalies before data exfiltration occurs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '14px 18px', textAlign: 'center', minWidth: '120px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precision</span>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#34d399' }}>99.4%</div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>F1 Score: 0.982</span>
          </div>

          <div className="glass-panel" style={{ padding: '14px 18px', textAlign: 'center', minWidth: '120px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Latency</span>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>1.2 ms</div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>Inference / pkt</span>
          </div>
        </div>
      </div>

      {/* Row: Severity Chart & MITRE Matrix Summary */}
      <div className="grid-2-col">
        <SeverityDistributionChart data={severityData} />

        {/* MITRE ATT&CK Matrix Card */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={16} color="var(--accent-indigo)" />
              MITRE ATT&CK Tactic Distribution
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Active intrusion attempts mapped against enterprise framework
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div className="glass-panel" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Initial Access</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)', fontWeight: 700 }}>4 Events</span>
              </div>
              <span className="mono-tag" style={{ color: '#94a3b8' }}>T1190 (Public Exploit)</span>
            </div>

            <div className="glass-panel" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Credential Access</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)', fontWeight: 700 }}>6 Events</span>
              </div>
              <span className="mono-tag" style={{ color: '#94a3b8' }}>T1110 (Brute Force)</span>
            </div>

            <div className="glass-panel" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Command & Control</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)', fontWeight: 700 }}>2 Events</span>
              </div>
              <span className="mono-tag" style={{ color: '#94a3b8' }}>T1071 (Web C2 Beacon)</span>
            </div>

            <div className="glass-panel" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Exfiltration</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 700 }}>2 Events</span>
              </div>
              <span className="mono-tag" style={{ color: '#94a3b8' }}>T1071.004 (DNS Tunnel)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Threat Actor & IOC Feed */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} color="var(--accent-red)" />
              Tracked Threat Actors & Indicators of Compromise (IOC)
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Cross-correlated threat intelligence feeds synchronized with AlienVault OTX & CISA alerts
            </span>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Threat Actor / Campaign</th>
                <th>Indicator / Network Signature</th>
                <th>Category</th>
                <th>Associated CVEs</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {threatIntel.map((actor) => (
                <tr key={actor.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Globe size={14} color="var(--accent-cyan)" />
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{actor.threatActor}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ID: {actor.id} • Seen {actor.firstSeen}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{actor.indicator}</span>
                  </td>

                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{actor.category}</span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {actor.associatedCves.map((cve) => (
                        <span key={cve} className="mono-tag" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                          {cve}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: actor.riskScore > 90 ? '#f87171' : '#fbbf24' }}>
                      {actor.riskScore} / 100
                    </span>
                  </td>

                  <td>
                    <span className={`badge-status ${actor.status === 'Active' ? 'blocked' : actor.status === 'Monitored' ? 'investigating' : 'resolved'}`}>
                      {actor.status}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                      onClick={() => onInspectActor?.(actor.threatActor)}
                    >
                      <ExternalLink size={12} /> Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

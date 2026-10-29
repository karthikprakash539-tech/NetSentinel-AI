import { useState } from 'react';
import type { SecurityEvent } from '../../types/sentinel.ts';
import {
  ShieldAlert,
  Flame,
  Terminal,
  Cpu,
  Lock,
  Globe,
  CheckCircle,
  FileDown,
  Info
} from 'lucide-react';

interface ThreatActivityPanelProps {
  selectedEvent: SecurityEvent | null;
  onClearSelection: () => void;
  onBlockIp: (ip: string) => void;
  onIsolateHost: (ip: string) => void;
  onResolveEvent: (id: string) => void;
}

export function ThreatActivityPanel({
  selectedEvent,
  onClearSelection,
  onBlockIp,
  onIsolateHost,
  onResolveEvent
}: ThreatActivityPanelProps) {
  const [copied, setCopied] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleCopyPayload = () => {
    if (selectedEvent?.payloadSnippet) {
      navigator.clipboard.writeText(selectedEvent.payloadSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAction = (msg: string, actionFn: () => void) => {
    actionFn();
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="glass-panel threat-activity-panel" aria-label="Threat Activity Forensics Panel">
      <div className="activity-panel-header">
        <div className="activity-panel-title">
          <Flame size={16} color="var(--accent-red)" aria-hidden="true" />
          <span>Threat Activity & AI Triage</span>
        </div>
        {selectedEvent && (
          <button
            type="button"
            className="btn-secondary"
            style={{ height: '24px', padding: '0 8px', fontSize: '10px' }}
            onClick={onClearSelection}
            title="Deselect event"
          >
            Clear Focus
          </button>
        )}
      </div>

      {actionNotice && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle size={14} />
          <span>{actionNotice}</span>
        </div>
      )}

      {selectedEvent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Header row with badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {selectedEvent.id}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span className={`badge-sev ${selectedEvent.severity}`}>
                {selectedEvent.severity}
              </span>
              <span className={`badge-status ${selectedEvent.status}`}>
                {selectedEvent.status}
              </span>
            </div>
          </div>

          {/* Event description */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
              {selectedEvent.eventType}
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {selectedEvent.description}
            </p>
          </div>

          {/* AI Confidence Gauge */}
          <div className="ai-confidence-gauge">
            <div className="confidence-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                <Cpu size={14} color="var(--accent-cyan)" />
                AI Neural Detection Confidence
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                {selectedEvent.confidenceScore}%
              </span>
            </div>
            <div className="confidence-bar-bg">
              <div
                className="confidence-bar-fill"
                style={{ width: `${selectedEvent.confidenceScore}%` }}
              />
            </div>
          </div>

          {/* MITRE ATT&CK Mapping */}
          {selectedEvent.mitreTechnique && (
            <div className="detail-section">
              <span className="detail-section-title">MITRE ATT&CK Framework</span>
              <div className="mitre-badge">
                <ShieldAlert size={12} aria-hidden="true" />
                {selectedEvent.mitreTechnique}
              </div>
            </div>
          )}

          {/* IP & Telemetry endpoints */}
          <div className="detail-section">
            <span className="detail-section-title">Network Endpoints</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                background: 'rgba(10, 16, 30, 0.6)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '11px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>SOURCE IP</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#f87171', fontWeight: 600 }}>
                  {selectedEvent.sourceIp}
                  {selectedEvent.sourcePort ? `:${selectedEvent.sourcePort}` : ''}
                </span>
                {selectedEvent.country && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', marginTop: '2px', fontSize: '10px' }}>
                    <Globe size={10} /> {selectedEvent.country}
                  </span>
                )}
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '10px' }}>TARGET IP</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {selectedEvent.destinationIp}
                  {selectedEvent.destinationPort ? `:${selectedEvent.destinationPort}` : ''}
                </span>
                <span style={{ display: 'block', color: 'var(--text-muted)', marginTop: '2px', fontSize: '10px' }}>
                  Proto: {selectedEvent.protocol} {selectedEvent.bytesTransferred ? `(${selectedEvent.bytesTransferred})` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Raw Payload Inspection */}
          {selectedEvent.payloadSnippet && (
            <div className="detail-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="detail-section-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Terminal size={12} /> Captured Packet / Payload Excerpt
                </span>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  style={{ fontSize: '10px', color: 'var(--accent-cyan)', cursor: 'pointer' }}
                >
                  {copied ? 'Copied!' : 'Copy String'}
                </button>
              </div>
              <pre className="payload-box">{selectedEvent.payloadSnippet}</pre>
            </div>
          )}

          {/* Recommended Remediation */}
          {selectedEvent.recommendation && (
            <div className="detail-section">
              <span className="detail-section-title">Recommended SOC Playbook</span>
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '11.5px',
                  color: '#c7d2fe',
                  lineHeight: 1.4
                }}
              >
                {selectedEvent.recommendation}
              </div>
            </div>
          )}

          {/* Incident Response Action Buttons */}
          <div className="threat-action-buttons">
            <button
              type="button"
              className="btn-danger-action"
              onClick={() =>
                handleAction(`Added ${selectedEvent.sourceIp} to edge perimeter deny-list`, () =>
                  onBlockIp(selectedEvent.sourceIp)
                )
              }
            >
              <Lock size={12} /> Block Source IP
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '11px', justifyContent: 'center' }}
              onClick={() =>
                handleAction(`Quarantined internal host ${selectedEvent.destinationIp}`, () =>
                  onIsolateHost(selectedEvent.destinationIp)
                )
              }
            >
              <ShieldAlert size={12} /> Isolate Host
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '11px', justifyContent: 'center' }}
              onClick={() =>
                handleAction(`Event ${selectedEvent.id} marked as resolved`, () =>
                  onResolveEvent(selectedEvent.id)
                )
              }
            >
              <CheckCircle size={12} /> Mark Resolved
            </button>

            <button
              type="button"
              className="btn-secondary"
              style={{ fontSize: '11px', justifyContent: 'center' }}
              onClick={() =>
                handleAction(`Triggered synthetic PCAP capture download for ${selectedEvent.id}`, () => {})
              }
            >
              <FileDown size={12} /> Export PCAP
            </button>
          </div>
        </div>
      ) : (
        /* Empty / Idle State when no event is clicked */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '320px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            gap: '12px',
            padding: '20px'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}
          >
            <Info size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '13px' }}>
              Select an Event for Deep-Dive Triage
            </div>
            <p style={{ fontSize: '11.5px', maxWidth: '280px', lineHeight: 1.4 }}>
              Click any security event row to inspect payload signatures, AI detection confidence, MITRE techniques, and initiate containment playbooks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

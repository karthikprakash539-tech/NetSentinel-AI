import { useState } from 'react';
import type { SecurityEvent } from '../../types/sentinel.ts';
import { EventsTable } from '../dashboard/EventsTable.tsx';
import { ThreatActivityPanel } from '../dashboard/ThreatActivityPanel.tsx';
import { Shield, FileSpreadsheet, Check } from 'lucide-react';

interface SecurityEventsViewProps {
  events: SecurityEvent[];
  selectedEvent: SecurityEvent | null;
  onSelectEvent: (event: SecurityEvent) => void;
  onClearSelection: () => void;
  onBlockIp: (ip: string) => void;
  onIsolateHost: (ip: string) => void;
  onResolveEvent: (id: string) => void;
  searchQuery: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export function SecurityEventsView({
  events,
  selectedEvent,
  onSelectEvent,
  onClearSelection,
  onBlockIp,
  onIsolateHost,
  onResolveEvent,
  searchQuery,
  isLoading,
  onRefresh
}: SecurityEventsViewProps) {
  const [downloadNotice, setDownloadNotice] = useState(false);

  const handleExportCsv = () => {
    // Generate synthetic CSV from demo events
    const headers = 'ID,Timestamp,Source IP,Destination IP,Event Type,Severity,Status,Protocol,Confidence\n';
    const rows = events
      .map(
        (e) =>
          `"${e.id}","${e.timestamp}","${e.sourceIp}","${e.destinationIp}","${e.eventType}","${e.severity}","${e.status}","${e.protocol}",${e.confidenceScore}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netsentinel-events-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="view-container">
      {/* Top Banner and Quick Export Action */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={20} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              Forensic Event Audit Log
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Comprehensive real-time telemetry indexing all ingress/egress anomalies
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleExportCsv}
            title="Download CSV export of security events"
          >
            {downloadNotice ? <Check size={14} /> : <FileSpreadsheet size={14} />}
            <span>{downloadNotice ? 'Exported CSV' : 'Export Audit CSV'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Events Table & Threat Activity Panel */}
      <div className="dashboard-events-grid">
        <EventsTable
          events={events}
          selectedEventId={selectedEvent?.id || null}
          onSelectEvent={onSelectEvent}
          externalSearch={searchQuery}
          onBlockIp={onBlockIp}
          isLoading={isLoading}
          onRefresh={onRefresh}
        />

        <ThreatActivityPanel
          selectedEvent={selectedEvent}
          onClearSelection={onClearSelection}
          onBlockIp={onBlockIp}
          onIsolateHost={onIsolateHost}
          onResolveEvent={onResolveEvent}
        />
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import type { SecurityEvent, SeverityLevel, EventStatus } from '../../types/sentinel.ts';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Inbox
} from 'lucide-react';

interface EventsTableProps {
  events: SecurityEvent[];
  selectedEventId: string | null;
  onSelectEvent: (event: SecurityEvent) => void;
  externalSearch?: string;
  onExternalSearchChange?: (val: string) => void;
  onBlockIp?: (ip: string) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function EventsTable({
  events,
  selectedEventId,
  onSelectEvent,
  externalSearch = '',
  onBlockIp,
  isLoading = false,
  onRefresh
}: EventsTableProps) {
  const [internalSearch, setInternalSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');

  const effectiveSearch = externalSearch || internalSearch;

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Severity check
      if (severityFilter !== 'all' && ev.severity !== severityFilter) {
        return false;
      }
      // Status check
      if (statusFilter !== 'all' && ev.status !== statusFilter) {
        return false;
      }
      // Search query check
      if (effectiveSearch.trim()) {
        const q = effectiveSearch.toLowerCase();
        const matchesIp = ev.sourceIp.toLowerCase().includes(q) || ev.destinationIp.toLowerCase().includes(q);
        const matchesType = ev.eventType.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        const matchesMitre = ev.mitreTechnique?.toLowerCase().includes(q);
        const matchesCountry = ev.country?.toLowerCase().includes(q);
        if (!matchesIp && !matchesType && !matchesDesc && !matchesMitre && !matchesCountry) {
          return false;
        }
      }
      return true;
    });
  }, [events, severityFilter, statusFilter, effectiveSearch]);

  const severityOptions: Array<{ id: SeverityLevel | 'all'; label: string }> = [
    { id: 'all', label: 'All Severities' },
    { id: 'critical', label: 'Critical' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  return (
    <div className="glass-panel events-panel" aria-label="Recent Security Events Table">
      <div className="events-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="var(--accent-cyan)" aria-hidden="true" />
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Recent Security Events & Ingress Telemetry
          </h3>
          <span className="mono-tag" style={{ color: 'var(--text-muted)' }}>
            ({filteredEvents.length} of {events.length})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onRefresh && (
            <button
              type="button"
              className="btn-secondary"
              style={{ height: '30px', padding: '0 10px', fontSize: '11px' }}
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh telemetry stream"
            >
              <RefreshCw size={12} className={isLoading ? 'spin-icon' : ''} aria-hidden="true" />
              <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="events-filter-bar">
        <div className="filter-pills" role="group" aria-label="Severity filter pills">
          {severityOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`filter-pill ${opt.id} ${severityFilter === opt.id ? 'active' : ''}`}
              onClick={() => setSeverityFilter(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Status Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EventStatus | 'all')}
              className="table-search-input"
              style={{ width: '130px', appearance: 'none', paddingRight: '24px', cursor: 'pointer' }}
              aria-label="Filter events by triage status"
            >
              <option value="all" style={{ background: '#0a101f', color: '#fff' }}>Status: All</option>
              <option value="blocked" style={{ background: '#0a101f', color: '#fff' }}>Blocked</option>
              <option value="investigating" style={{ background: '#0a101f', color: '#fff' }}>Investigating</option>
              <option value="flagged" style={{ background: '#0a101f', color: '#fff' }}>Flagged</option>
              <option value="resolved" style={{ background: '#0a101f', color: '#fff' }}>Resolved</option>
            </select>
            <ChevronDown
              size={12}
              style={{ position: 'absolute', right: '8px', top: '10px', pointerEvents: 'none', color: '#64748b' }}
            />
          </div>

          {/* Quick Table Search */}
          <div className="table-search-box">
            <Search size={14} className="table-search-icon" aria-hidden="true" />
            <input
              type="text"
              className="table-search-input"
              placeholder="Filter table rows..."
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              aria-label="Filter table by IP or event"
            />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="table-wrapper">
        <table className="cyber-table" role="table">
          <thead>
            <tr>
              <th scope="col">Event ID / Time</th>
              <th scope="col">Source IP</th>
              <th scope="col">Destination IP</th>
              <th scope="col">Event Type</th>
              <th scope="col">Severity</th>
              <th scope="col">Status</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skel-${idx}`}>
                  <td colSpan={7}>
                    <div className="skeleton-box" style={{ height: '24px', width: '100%' }} />
                  </td>
                </tr>
              ))
            ) : filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="table-empty-state">
                    <div className="table-empty-icon">
                      <Inbox size={24} />
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      No security events match the current criteria
                    </div>
                    <div style={{ fontSize: '11px' }}>
                      Try adjusting the severity filter, search keywords, or clear active filters.
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ marginTop: '8px', height: '28px', fontSize: '11px' }}
                      onClick={() => {
                        setSeverityFilter('all');
                        setStatusFilter('all');
                        setInternalSearch('');
                      }}
                    >
                      <Filter size={12} /> Reset Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredEvents.map((ev) => {
                const isSelected = selectedEventId === ev.id;

                return (
                  <tr
                    key={ev.id}
                    className={isSelected ? 'selected' : ''}
                    onClick={() => onSelectEvent(ev)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSelectEvent(ev);
                    }}
                    role="button"
                    aria-label={`View details for event ${ev.id}`}
                  >
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                          {ev.id}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>
                          {ev.timestamp.split(' ')[1]}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                          {ev.sourceIp}
                        </span>
                        {ev.country && (
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {ev.country} {ev.countryCode ? `(${ev.countryCode})` : ''}
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        {ev.destinationIp}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '240px' }}>
                        <span style={{ fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ev.eventType}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--accent-indigo)' }}>
                          {ev.protocol} • Confidence: {ev.confidenceScore}%
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className={`badge-sev ${ev.severity}`}>
                        {ev.severity}
                      </span>
                    </td>

                    <td>
                      <span className={`badge-status ${ev.status}`}>
                        {ev.status}
                      </span>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ height: '26px', padding: '0 8px', fontSize: '10.5px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEvent(ev);
                          }}
                          title="Inspect incident deep dive"
                        >
                          <ExternalLink size={11} aria-hidden="true" />
                          Inspect
                        </button>
                        {onBlockIp && ev.status !== 'blocked' && (
                          <button
                            type="button"
                            className="btn-danger-action"
                            style={{ height: '26px', padding: '0 8px', fontSize: '10px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onBlockIp(ev.sourceIp);
                            }}
                            title={`Add ${ev.sourceIp} to edge block list`}
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

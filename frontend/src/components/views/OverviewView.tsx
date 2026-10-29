import type {
  SOCSummaryStats,
  TrafficDataPoint,
  SeverityDistributionItem,
  SecurityEvent,
  SeverityLevel
} from '../../types/sentinel.ts';
import { SummaryCards } from '../dashboard/SummaryCards.tsx';
import { TrafficChart } from '../dashboard/TrafficChart.tsx';
import { SeverityDistributionChart } from '../dashboard/SeverityDistributionChart.tsx';
import { EventsTable } from '../dashboard/EventsTable.tsx';
import { ThreatActivityPanel } from '../dashboard/ThreatActivityPanel.tsx';

interface OverviewViewProps {
  stats: SOCSummaryStats;
  trafficData: TrafficDataPoint[];
  severityData: SeverityDistributionItem[];
  events: SecurityEvent[];
  selectedEvent: SecurityEvent | null;
  onSelectEvent: (event: SecurityEvent) => void;
  onClearSelection: () => void;
  onBlockIp: (ip: string) => void;
  onIsolateHost: (ip: string) => void;
  onResolveEvent: (id: string) => void;
  searchQuery: string;
  onFilterThreats: () => void;
  onViewDevices: () => void;
  isLoading: boolean;
  onRefresh: () => void;
  selectedSeverity: SeverityLevel | 'all';
  onSelectSeverity: (sev: SeverityLevel | 'all') => void;
}

export function OverviewView({
  stats,
  trafficData,
  severityData,
  events,
  selectedEvent,
  onSelectEvent,
  onClearSelection,
  onBlockIp,
  onIsolateHost,
  onResolveEvent,
  searchQuery,
  onFilterThreats,
  onViewDevices,
  isLoading,
  onRefresh,
  selectedSeverity,
  onSelectSeverity
}: OverviewViewProps) {
  return (
    <div className="view-container">
      {/* 4 Summary Cards */}
      <SummaryCards
        stats={stats}
        onFilterThreats={onFilterThreats}
        onViewDevices={onViewDevices}
      />

      {/* 2 Charts Row */}
      <div className="charts-grid">
        <TrafficChart data={trafficData} />
        <SeverityDistributionChart
          data={severityData}
          selectedSeverity={selectedSeverity}
          onSelectSeverity={onSelectSeverity}
        />
      </div>

      {/* Events Table & Threat Activity Inspector */}
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

import { useState } from 'react';
import type {
  NavigationTab,
  SecurityEvent,
  NetworkDevice,
  SOCSummaryStats,
  SOCNotification,
  SeverityLevel
} from './types/sentinel.ts';
import {
  DEMO_SUMMARY_STATS,
  DEMO_TRAFFIC_DATA,
  DEMO_SEVERITY_DISTRIBUTION,
  DEMO_PROTOCOL_BREAKDOWN,
  DEMO_SECURITY_EVENTS,
  DEMO_DEVICES,
  DEMO_THREAT_INTEL,
  DEMO_NOTIFICATIONS
} from './data/demoData.ts';

import { DemoBanner } from './components/layout/DemoBanner.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { Header } from './components/layout/Header.tsx';

import { OverviewView } from './components/views/OverviewView.tsx';
import { TrafficView } from './components/views/TrafficView.tsx';
import { ThreatDetectionView } from './components/views/ThreatDetectionView.tsx';
import { SecurityEventsView } from './components/views/SecurityEventsView.tsx';
import { DevicesView } from './components/views/DevicesView.tsx';
import { ReportsView } from './components/views/ReportsView.tsx';
import { SettingsView } from './components/views/SettingsView.tsx';

import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | 'all'>('all');

  // Application Data States
  const [stats, setStats] = useState<SOCSummaryStats>(DEMO_SUMMARY_STATS);
  const [events, setEvents] = useState<SecurityEvent[]>(DEMO_SECURITY_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(DEMO_SECURITY_EVENTS[0]);
  const [devices, setDevices] = useState<NetworkDevice[]>(DEMO_DEVICES);
  const [notifications, setNotifications] = useState<SOCNotification[]>(DEMO_NOTIFICATIONS);

  // Filter events when global search or severity card is tapped
  const handleFilterThreats = () => {
    setActiveTab('events');
    setSelectedSeverity('critical');
    setMobileMenuOpen(false);
  };

  const handleViewDevices = () => {
    setActiveTab('devices');
    setMobileMenuOpen(false);
  };

  // Quick Action: Block Source IP
  const handleBlockIp = (ipToBlock: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.sourceIp === ipToBlock ? { ...e, status: 'blocked' } : e
      )
    );
    if (selectedEvent && selectedEvent.sourceIp === ipToBlock) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: 'blocked' } : null));
    }
    setStats((prev) => ({
      ...prev,
      blockedAttacks24h: prev.blockedAttacks24h + 1,
      activeThreats: Math.max(0, prev.activeThreats - 1),
    }));

    // Add alert notification
    const newNotif: SOCNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Perimeter Rule Updated',
      message: `Source IP ${ipToBlock} blocked and dropped by edge firewall.`,
      severity: 'medium',
      timestamp: 'Just now',
      read: false,
      linkTab: 'events'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Quick Action: Isolate Target Host
  const handleIsolateHost = (ipToIsolate: string) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.ipAddress === ipToIsolate
          ? { ...d, status: d.status === 'isolated' ? 'online' : 'isolated' }
          : d
      )
    );
    const newNotif: SOCNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Host Quarantine Enforced',
      message: `Device with IP ${ipToIsolate} placed into network isolation VLAN.`,
      severity: 'high',
      timestamp: 'Just now',
      read: false,
      linkTab: 'devices'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Toggle Isolate Device from Devices View
  const handleToggleDeviceIsolate = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const newStatus = d.status === 'isolated' ? 'online' : 'isolated';
          return {
            ...d,
            status: newStatus,
            bandwidthUsage: newStatus === 'isolated' ? '0 Mbps (Quarantined)' : '45 Mbps'
          };
        }
        return d;
      })
    );
  };

  // Quick Action: Mark Event as Resolved
  const handleResolveEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: 'resolved' } : e))
    );
    if (selectedEvent?.id === eventId) {
      setSelectedEvent((prev) => (prev ? { ...prev, status: 'resolved' } : null));
    }
  };

  // Refresh Telemetry Stream
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStats((prev) => ({
        ...prev,
        totalEvents24h: prev.totalEvents24h + Math.floor(Math.random() * 45),
        avgLatencyMs: Number((14.0 + Math.random() * 1.5).toFixed(1))
      }));
    }, 600);
  };

  // Reset Demo State
  const handleResetDemoData = () => {
    setStats(DEMO_SUMMARY_STATS);
    setEvents(DEMO_SECURITY_EVENTS);
    setDevices(DEMO_DEVICES);
    setSelectedEvent(DEMO_SECURITY_EVENTS[0]);
    setNotifications(DEMO_NOTIFICATIONS);
    setSelectedSeverity('all');
    setSearchQuery('');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="app-container">
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Collapsible Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        activeThreatCount={stats.activeThreats}
      />

      {/* Main Workspace Area (starts at sidebar edge) */}
      <div className={`main-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Simulation Disclaimer Banner */}
        <DemoBanner />

        {/* Top Header */}
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          notifications={notifications}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onMarkAllRead={handleMarkAllNotificationsRead}
        />

        {/* Tab Specific Page Views */}
        <main className="dashboard-content" role="main">
          {activeTab === 'overview' && (
            <OverviewView
              stats={stats}
              trafficData={DEMO_TRAFFIC_DATA}
              severityData={DEMO_SEVERITY_DISTRIBUTION}
              events={events}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
              onClearSelection={() => setSelectedEvent(null)}
              onBlockIp={handleBlockIp}
              onIsolateHost={handleIsolateHost}
              onResolveEvent={handleResolveEvent}
              searchQuery={searchQuery}
              onFilterThreats={handleFilterThreats}
              onViewDevices={handleViewDevices}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              selectedSeverity={selectedSeverity}
              onSelectSeverity={setSelectedSeverity}
            />
          )}

          {activeTab === 'traffic' && (
            <TrafficView
              trafficData={DEMO_TRAFFIC_DATA}
              protocolData={DEMO_PROTOCOL_BREAKDOWN}
            />
          )}

          {activeTab === 'threats' && (
            <ThreatDetectionView
              threatIntel={DEMO_THREAT_INTEL}
              severityData={DEMO_SEVERITY_DISTRIBUTION}
              onInspectActor={(actor) => {
                setSearchQuery(actor);
                setActiveTab('events');
                setMobileMenuOpen(false);
              }}
            />
          )}

          {activeTab === 'events' && (
            <SecurityEventsView
              events={events}
              selectedEvent={selectedEvent}
              onSelectEvent={setSelectedEvent}
              onClearSelection={() => setSelectedEvent(null)}
              onBlockIp={handleBlockIp}
              onIsolateHost={handleIsolateHost}
              onResolveEvent={handleResolveEvent}
              searchQuery={searchQuery}
              isLoading={isLoading}
              onRefresh={handleRefresh}
            />
          )}

          {activeTab === 'devices' && (
            <DevicesView
              devices={devices}
              onToggleIsolate={handleToggleDeviceIsolate}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'settings' && (
            <SettingsView onResetDemoData={handleResetDemoData} />
          )}
        </main>
      </div>
    </div>
  );
}

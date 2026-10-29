import { useState, useRef, useEffect } from 'react';
import type { NavigationTab, SOCNotification } from '../../types/sentinel.ts';
import { Search, Bell, Menu, X, ShieldCheck } from 'lucide-react';
import { NotificationPopover } from '../common/NotificationPopover.tsx';

interface HeaderProps {
  activeTab: NavigationTab;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileMenu: () => void;
  notifications: SOCNotification[];
  onSelectTab: (tab: NavigationTab) => void;
  onMarkAllRead: () => void;
}

export function Header({
  activeTab,
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  notifications,
  onSelectTab,
  onMarkAllRead
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabTitles: Record<NavigationTab, { title: string; subtitle: string }> = {
    overview: { title: 'SOC Overview & Telemetry', subtitle: 'Live Intrusion Detection & Threat Posture' },
    traffic: { title: 'Network Traffic Analysis', subtitle: 'Real-Time Bandwidth, Protocols & Packet Flows' },
    threats: { title: 'AI Threat Intelligence', subtitle: 'Neural Anomaly Engine & Threat Actor Tracking' },
    events: { title: 'Security Event Explorer', subtitle: 'Searchable Audit Log of Ingress/Egress Telemetry' },
    devices: { title: 'Protected Network Assets', subtitle: 'Monitored Firewalls, Gateways, Nodes & Endpoints' },
    reports: { title: 'Intelligence & Audit Reports', subtitle: 'Executive Summaries & Compliance Verification' },
    settings: { title: 'SOC System Configuration', subtitle: 'Neural Detection Thresholds & Sensor Tuning' },
  };

  const currentInfo = tabTitles[activeTab] || tabTitles.overview;

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="top-header" role="banner">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenMobileMenu}
          aria-label="Open mobile navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-title-box">
          <div className="header-breadcrumbs">
            <span>NetSentinel AI</span>
            <span>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>SOC Console</span>
            <span>/</span>
            <span style={{ color: 'var(--accent-cyan)' }}>{activeTab.toUpperCase()}</span>
          </div>
          <h1 className="header-page-title">{currentInfo.title}</h1>
        </div>
      </div>

      <div className="header-search">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search IPs, CVEs, MITRE tactics, event types..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Global SOC search"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '12px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          ) : (
            <span className="search-kbd-hint" aria-hidden="true">Ctrl K</span>
          )}
        </div>
      </div>

      <div className="header-right">
        {/* Connection status indicator */}
        <div 
          className="header-btn" 
          title="Telemetry Connection: Active (Simulated)" 
          style={{ cursor: 'default' }}
        >
          <span className="pulse-indicator" aria-hidden="true" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
            ONLINE
          </span>
        </div>

        {/* Notifications toggle button */}
        <button
          type="button"
          className={`header-btn ${showNotifications ? 'is-active' : ''}`}
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label={`Security alerts: ${unreadCount} unread`}
          title="View security alerts and notifications"
        >
          <Bell size={18} aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="notification-count">{unreadCount}</span>
          )}
        </button>

        {/* User Profile */}
        <div className="user-profile-badge" title="Authenticated SOC Analyst Tier 3">
          <div className="user-avatar" aria-hidden="true">KR</div>
          <div className="user-info">
            <span className="user-name">Karthik R.</span>
            <span className="user-role">
              <ShieldCheck size={10} style={{ display: 'inline', marginRight: '3px' }} />
              Tier 3 Lead
            </span>
          </div>
        </div>
      </div>

      {showNotifications && (
        <NotificationPopover
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onSelectTab={onSelectTab}
          onMarkAllRead={onMarkAllRead}
        />
      )}
    </header>
  );
}

import type { NavigationTab } from '../../types/sentinel.ts';
import {
  Shield,
  Activity,
  Radio,
  AlertTriangle,
  Server,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Lock
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeThreatCount?: number;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: typeof Shield;
  badge?: number | string;
}

export function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  activeThreatCount = 14
}: SidebarProps) {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'traffic', label: 'Network Traffic', icon: Radio },
    { id: 'threats', label: 'Threat Detection', icon: AlertTriangle, badge: activeThreatCount },
    { id: 'events', label: 'Security Events', icon: Shield },
    { id: 'devices', label: 'Devices', icon: Server },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: NavigationTab) => {
    onTabChange(id);
    onCloseMobile();
  };

  return (
    <aside 
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      aria-label="SOC Navigation Sidebar"
    >
      <div className="sidebar-header">
        <a 
          href="#overview" 
          className="brand-container" 
          onClick={(e) => { e.preventDefault(); handleSelect('overview'); }}
          title="NetSentinel AI SOC Dashboard"
        >
          <div className="brand-logo-hex">
            <Lock size={20} strokeWidth={2.4} aria-hidden="true" />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-title">
                NetSentinel <span>AI</span>
                <span className="brand-badge">SOC</span>
              </span>
              <span className="brand-subtitle">Intrusion Detection System</span>
            </div>
          )}
        </a>

        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Main Navigation">
        {!collapsed && <div className="nav-section-label">Operations Console</div>}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="nav-icon" aria-hidden="true" />
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && item.badge !== undefined && (
                <span className="nav-badge" title={`${item.badge} active threats`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-status-box">
            <div className="sidebar-status-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-indicator" aria-hidden="true" />
                AI Engine
              </span>
              <span className="metric">ARMED (v2.4)</span>
            </div>
            <div className="sidebar-status-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={12} color="#64748b" aria-hidden="true" />
                Packet Engine
              </span>
              <span className="metric">14.8 ms</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

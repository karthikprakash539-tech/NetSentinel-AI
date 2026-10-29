import type { SOCNotification, NavigationTab } from '../../types/sentinel.ts';
import { Bell, CheckCheck, ShieldAlert, AlertTriangle, Info, X } from 'lucide-react';

interface NotificationPopoverProps {
  notifications: SOCNotification[];
  onClose: () => void;
  onSelectTab: (tab: NavigationTab) => void;
  onMarkAllRead: () => void;
}

export function NotificationPopover({
  notifications,
  onClose,
  onSelectTab,
  onMarkAllRead
}: NotificationPopoverProps) {
  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert size={16} color="#ef4444" />;
      case 'high':
        return <AlertTriangle size={16} color="#f97316" />;
      default:
        return <Info size={16} color="#38bdf8" />;
    }
  };

  return (
    <div 
      className="notification-popover" 
      role="dialog" 
      aria-label="Security Notifications Center"
    >
      <div className="notif-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="#38bdf8" aria-hidden="true" />
          <h4>SOC Alerts & Notifications</h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
            onClick={onMarkAllRead}
            title="Mark all as read"
          >
            <CheckCheck size={12} aria-hidden="true" />
            Mark Read
          </button>
          <button
            type="button"
            className="sidebar-toggle-btn"
            style={{ width: '24px', height: '24px' }}
            onClick={onClose}
            aria-label="Close notification panel"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
            No new security alerts
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`notif-item ${!notif.read ? 'unread' : ''}`}
              onClick={() => {
                if (notif.linkTab) onSelectTab(notif.linkTab);
                onClose();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (notif.linkTab) onSelectTab(notif.linkTab);
                  onClose();
                }
              }}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(notif.severity)}</div>
              <div className="notif-content">
                <div className="notif-title-row">
                  <span className="notif-title">{notif.title}</span>
                  <span className="notif-time">{notif.timestamp}</span>
                </div>
                <p className="notif-msg">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

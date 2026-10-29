import { useState } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface DemoBannerProps {
  onDismiss?: () => void;
}

export function DemoBanner({ onDismiss }: DemoBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <aside 
      className="demo-banner" 
      role="region" 
      aria-label="Simulation Environment Notice"
    >
      <div className="demo-banner-left">
        <span className="demo-banner-badge">DEMO DATA — NOT LIVE MONITORING</span>
        <AlertTriangle size={14} aria-hidden="true" />
        <span>
          NetSentinel AI is running in offline demonstration mode with simulated intrusion telemetry. It does not monitor live production traffic or detect real-world attacks.
        </span>
      </div>
      <button 
        type="button" 
        className="demo-banner-dismiss" 
        onClick={handleClose}
        aria-label="Dismiss demo simulation banner"
        title="Dismiss notice"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ShieldAlert size={12} aria-hidden="true" />
          Acknowledge
          <X size={12} aria-hidden="true" />
        </span>
      </button>
    </aside>
  );
}

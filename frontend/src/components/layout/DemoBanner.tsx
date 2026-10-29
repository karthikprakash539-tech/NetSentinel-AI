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
        <div className="demo-banner-text-group">
          <AlertTriangle size={15} className="demo-banner-icon" aria-hidden="true" />
          <span className="demo-banner-text">
            NetSentinel AI is running in offline demonstration mode with simulated intrusion telemetry. It does not monitor live production traffic or detect real-world attacks.
          </span>
        </div>
      </div>
      <button 
        type="button" 
        className="demo-banner-dismiss" 
        onClick={handleClose}
        aria-label="Dismiss demo simulation banner"
        title="Dismiss notice"
      >
        <ShieldAlert size={13} aria-hidden="true" />
        <span>Acknowledge</span>
        <X size={13} aria-hidden="true" />
      </button>
    </aside>
  );
}

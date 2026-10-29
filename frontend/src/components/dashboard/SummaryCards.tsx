import type { SOCSummaryStats } from '../../types/sentinel.ts';
import {
  Activity,
  AlertOctagon,
  ShieldCheck,
  HeartPulse,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SummaryCardsProps {
  stats: SOCSummaryStats;
  onFilterThreats?: () => void;
  onViewDevices?: () => void;
}

export function SummaryCards({ stats, onFilterThreats, onViewDevices }: SummaryCardsProps) {
  const cards = [
    {
      id: 'events',
      label: 'Total Security Events',
      value: stats.totalEvents24h.toLocaleString(),
      delta: `+${stats.totalEventsDelta}%`,
      isPositive: true,
      deltaLabel: 'vs last 24h',
      icon: Activity,
      accent: 'var(--accent-cyan)',
      footerText: `${stats.blockedAttacks24h.toLocaleString()} threats blocked at ingress`,
      onClick: undefined,
    },
    {
      id: 'threats',
      label: 'Active Threats',
      value: stats.activeThreats.toString(),
      delta: `${stats.activeThreatsDelta}%`,
      isPositive: false, // Fewer threats is good, or red highlight for alert
      deltaLabel: 'triage queue',
      icon: AlertOctagon,
      accent: 'var(--accent-red)',
      footerText: '3 Critical, 7 High requiring analysis',
      onClick: onFilterThreats,
    },
    {
      id: 'devices',
      label: 'Protected Devices',
      value: `${stats.protectedDevices} / ${stats.totalDevices}`,
      delta: `${((stats.protectedDevices / stats.totalDevices) * 100).toFixed(1)}%`,
      isPositive: true,
      deltaLabel: 'sensor coverage',
      icon: ShieldCheck,
      accent: 'var(--accent-indigo)',
      footerText: '8 Quarantined / 0 Unmonitored nodes',
      onClick: onViewDevices,
    },
    {
      id: 'health',
      label: 'Network Health Score',
      value: `${stats.networkHealthScore}%`,
      delta: `${stats.avgLatencyMs}ms`,
      isPositive: true,
      deltaLabel: 'RTT latency',
      icon: HeartPulse,
      accent: 'var(--accent-emerald)',
      footerText: 'Zero packet loss on backbone trunks',
      onClick: undefined,
    },
  ];

  return (
    <section className="summary-grid" aria-label="Key SOC Metrics Summary">
      {cards.map((card) => {
        const Icon = card.icon;
        const style = { '--card-accent': card.accent } as React.CSSProperties;

        return (
          <div
            key={card.id}
            className={`glass-panel summary-card ${card.onClick ? 'glass-panel-interactive' : ''}`}
            style={style}
            onClick={card.onClick}
            role={card.onClick ? 'button' : undefined}
            tabIndex={card.onClick ? 0 : undefined}
            onKeyDown={card.onClick ? (e) => { if (e.key === 'Enter') card.onClick?.(); } : undefined}
          >
            <div className="summary-card-top">
              <span className="summary-label">{card.label}</span>
              <div className="summary-icon-box" aria-hidden="true">
                <Icon size={18} />
              </div>
            </div>

            <div className="summary-value-row">
              <span className="summary-value">{card.value}</span>
              <span className={`summary-delta-pill ${card.id === 'threats' ? 'negative' : 'positive'}`}>
                {card.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.delta}
              </span>
            </div>

            <div className="summary-card-footer">
              <span>{card.footerText}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                {card.deltaLabel}
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

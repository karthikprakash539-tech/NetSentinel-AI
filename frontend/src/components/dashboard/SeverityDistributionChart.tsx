import { useState } from 'react';
import type { SeverityDistributionItem, SeverityLevel } from '../../types/sentinel.ts';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import { ShieldAlert } from 'lucide-react';

interface SeverityDistributionChartProps {
  data: SeverityDistributionItem[];
  onSelectSeverity?: (severity: SeverityLevel | 'all') => void;
  selectedSeverity?: SeverityLevel | 'all';
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: SeverityDistributionItem;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="custom-chart-tooltip">
        <div className="tooltip-time">{item.name} Severity</div>
        <div className="tooltip-row">
          <span style={{ color: 'var(--text-secondary)' }}>Active Count:</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: item.color }}>
            {item.count} incidents
          </span>
        </div>
        <div className="tooltip-row">
          <span style={{ color: 'var(--text-secondary)' }}>Distribution:</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>
            {item.percentage}% of total
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export function SeverityDistributionChart({
  data,
  onSelectSeverity,
  selectedSeverity = 'all'
}: SeverityDistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalIncidents = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="glass-panel chart-card" aria-label="Threat Severity Distribution Breakdown">
      <div className="chart-header">
        <div className="chart-title-area">
          <h3 className="chart-title">
            <ShieldAlert size={16} color="var(--accent-red)" aria-hidden="true" />
            Threat Severity Distribution
          </h3>
          <span className="chart-subtitle">
            Active triaged incidents categorized by CVSS risk tier
          </span>
        </div>
      </div>

      <div className="chart-body" style={{ minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="count"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={(_, index) => {
                if (onSelectSeverity && data[index]) {
                  const clickedSev = data[index].severity;
                  onSelectSeverity(selectedSeverity === clickedSev ? 'all' : clickedSev);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => {
                const isSelected = selectedSeverity === entry.severity;
                const isHovered = activeIndex === index;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={isSelected || isHovered ? '#fff' : 'rgba(10, 16, 30, 0.8)'}
                    strokeWidth={isSelected || isHovered ? 2 : 1}
                    opacity={selectedSeverity !== 'all' && !isSelected ? 0.4 : 1}
                  />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center overlay label */}
        <div
          style={{
            position: 'absolute',
            textAlign: 'center',
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total
          </span>
          <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
            {totalIncidents}
          </span>
        </div>
      </div>

      {/* Donut Legend */}
      <div className="donut-legend" role="list" aria-label="Severity classification legend">
        {data.map((item) => (
          <button
            key={item.severity}
            type="button"
            className="donut-legend-item"
            onClick={() => onSelectSeverity?.(selectedSeverity === item.severity ? 'all' : item.severity)}
            style={{
              cursor: 'pointer',
              background: 'transparent',
              opacity: selectedSeverity !== 'all' && selectedSeverity !== item.severity ? 0.4 : 1
            }}
          >
            <div className="donut-legend-left">
              <span className="tooltip-dot" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <div className="donut-legend-right">
              {item.count} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({item.percentage}%)</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { TrafficDataPoint } from '../../types/sentinel.ts';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Radio, ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';

interface TrafficChartProps {
  data: TrafficDataPoint[];
}

type TimeRange = '1h' | '6h' | '24h' | '7d';

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <div className="tooltip-time">Time: {label} UTC</div>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="tooltip-row">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span className="tooltip-dot" style={{ backgroundColor: entry.color }} />
              <span style={{ color: 'var(--text-secondary)' }}>{entry.name}:</span>
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>
              {entry.value} Mbps
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function TrafficChart({ data }: TrafficChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false);

  const ranges: TimeRange[] = ['1h', '6h', '24h', '7d'];

  return (
    <div className="glass-panel chart-card" aria-label="Network Throughput Telemetry Chart">
      <div className="chart-header">
        <div className="chart-title-area">
          <h3 className="chart-title">
            <Radio size={16} color="var(--accent-cyan)" aria-hidden="true" />
            Network Traffic & Intrusion Anomalies
          </h3>
          <span className="chart-subtitle">
            Ingress / Egress throughput with AI real-time anomaly detection overlay (Mbps)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className={`btn-secondary ${showAnomaliesOnly ? 'active' : ''}`}
            style={{
              height: '28px',
              padding: '0 8px',
              fontSize: '11px',
              borderColor: showAnomaliesOnly ? 'var(--accent-red)' : undefined,
              color: showAnomaliesOnly ? 'var(--sev-critical-text)' : undefined,
            }}
            onClick={() => setShowAnomaliesOnly(!showAnomaliesOnly)}
            title="Toggle Anomalous Stream Focus"
          >
            <AlertTriangle size={12} aria-hidden="true" />
            Anomalies
          </button>

          <div className="chart-filters" role="group" aria-label="Time range selector">
            {ranges.map((r) => (
              <button
                key={r}
                type="button"
                className={`chart-filter-btn ${timeRange === r ? 'active' : ''}`}
                onClick={() => setTimeRange(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {/* Inbound Gradient */}
              <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>

              {/* Outbound Gradient */}
              <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
              </linearGradient>

              {/* Anomalous Spike Gradient */}
              <linearGradient id="anomalousGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.65} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />

            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="var(--font-mono)"
              tickLine={false}
              unit="M"
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />

            {!showAnomaliesOnly && (
              <>
                <Area
                  type="monotone"
                  dataKey="inboundMbps"
                  name="Inbound Traffic"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#inboundGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="outboundMbps"
                  name="Outbound Traffic"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#outboundGrad)"
                />
              </>
            )}

            <Area
              type="monotone"
              dataKey="anomalousMbps"
              name="Anomalous Packets"
              stroke="#ef4444"
              strokeWidth={showAnomaliesOnly ? 3 : 2}
              fillOpacity={1}
              fill="url(#anomalousGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowDown size={12} color="#38bdf8" /> Peak Inbound: 1,120 Mbps (SYN Flood detected @ 12:00)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ArrowUp size={12} color="#818cf8" /> Normal Baseline: ~420 Mbps
        </span>
      </div>
    </div>
  );
}

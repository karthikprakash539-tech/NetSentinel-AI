import type { TrafficDataPoint, ProtocolBreakdownItem } from '../../types/sentinel.ts';
import { TrafficChart } from '../dashboard/TrafficChart.tsx';
import { Radio, ArrowUpRight, ArrowDownRight, Layers, Activity } from 'lucide-react';

interface TrafficViewProps {
  trafficData: TrafficDataPoint[];
  protocolData: ProtocolBreakdownItem[];
}

export function TrafficView({ trafficData, protocolData }: TrafficViewProps) {
  const totalVolumeGb = protocolData.reduce((acc, curr) => acc + curr.volumeGb, 0);

  return (
    <div className="view-container">
      {/* Top Metric Strips */}
      <div className="grid-3-col">
        <div className="glass-panel metric-strip-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Total 24h Ingress Volume
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              8.42 TB
            </span>
            <span style={{ fontSize: '11px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowDownRight size={12} /> +8.1% sustained bandwidth
            </span>
          </div>
          <div className="summary-icon-box" style={{ color: 'var(--accent-cyan)' }}>
            <Radio size={20} />
          </div>
        </div>

        <div className="glass-panel metric-strip-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Total 24h Egress Volume
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              6.19 TB
            </span>
            <span style={{ fontSize: '11px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ArrowUpRight size={12} /> +3.4% outbound requests
            </span>
          </div>
          <div className="summary-icon-box" style={{ color: 'var(--accent-indigo)' }}>
            <Layers size={20} />
          </div>
        </div>

        <div className="glass-panel metric-strip-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Current Packet Velocity
            </span>
            <span style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
              74,200 pps
            </span>
            <span style={{ fontSize: '11px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} /> BPF hardware offload active
            </span>
          </div>
          <div className="summary-icon-box" style={{ color: 'var(--accent-red)' }}>
            <Activity size={20} />
          </div>
        </div>
      </div>

      {/* Main Traffic Chart */}
      <TrafficChart data={trafficData} />

      {/* Protocol Breakdown Section */}
      <div className="grid-2-col">
        {/* Protocol Share Bars */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
              Protocol Distribution Breakdown
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Total monitored volume: {totalVolumeGb.toLocaleString()} GB
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {protocolData.map((item) => (
              <div key={item.protocol} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ fontWeight: 600, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="tooltip-dot" style={{ backgroundColor: item.color }} />
                    {item.protocol}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>
                    {item.volumeGb.toLocaleString()} GB ({item.share}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${item.share}%`,
                      backgroundColor: item.color,
                      borderRadius: '999px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Trunk Interfaces */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
              Interface Trunk Throughput
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Hardware link utilization on core routing layers
            </span>
          </div>

          <div className="table-wrapper">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>Interface</th>
                  <th>Speed</th>
                  <th>Current Load</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>eth0 (Edge WAN)</td>
                  <td>10 Gbps</td>
                  <td>1.12 Gbps (11.2%)</td>
                  <td><span className="badge-status resolved">Normal</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>eth1 (Core Internal)</td>
                  <td>40 Gbps</td>
                  <td>4.85 Gbps (12.1%)</td>
                  <td><span className="badge-status resolved">Normal</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>bond0 (K8s Cluster)</td>
                  <td>25 Gbps</td>
                  <td>6.10 Gbps (24.4%)</td>
                  <td><span className="badge-status investigating">Heavy</span></td>
                </tr>
                <tr>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>tun0 (Site-to-Site VPN)</td>
                  <td>1 Gbps</td>
                  <td>320 Mbps (32.0%)</td>
                  <td><span className="badge-status resolved">Normal</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

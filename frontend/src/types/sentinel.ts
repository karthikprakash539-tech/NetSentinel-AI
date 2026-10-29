export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type EventStatus = 'blocked' | 'investigating' | 'flagged' | 'resolved';

export type ProtocolType = 'TCP' | 'UDP' | 'ICMP' | 'HTTPS' | 'DNS' | 'SSH';

export type NavigationTab = 
  | 'overview'
  | 'traffic'
  | 'threats'
  | 'events'
  | 'devices'
  | 'reports'
  | 'settings';

export interface SecurityEvent {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  sourcePort?: number;
  destinationPort?: number;
  eventType: string;
  severity: SeverityLevel;
  status: EventStatus;
  protocol: ProtocolType;
  country?: string;
  countryCode?: string;
  mitreTechnique?: string;
  mitreTactic?: string;
  confidenceScore: number; // 0 - 100
  payloadSnippet?: string;
  description: string;
  recommendation?: string;
  packetCount?: number;
  bytesTransferred?: string;
}

export interface TrafficDataPoint {
  time: string;
  inboundMbps: number;
  outboundMbps: number;
  anomalousMbps: number;
  packetsPerSec: number;
}

export interface SeverityDistributionItem {
  name: string;
  severity: SeverityLevel;
  count: number;
  color: string;
  percentage: number;
}

export interface ProtocolBreakdownItem {
  protocol: ProtocolType;
  share: number;
  volumeGb: number;
  color: string;
}

export interface NetworkDevice {
  id: string;
  hostname: string;
  ipAddress: string;
  macAddress: string;
  deviceType: 'firewall' | 'router' | 'switch' | 'server' | 'endpoint' | 'k8s_node';
  os: string;
  status: 'online' | 'degraded' | 'isolated' | 'offline';
  threatLevel: SeverityLevel;
  activeAlerts: number;
  lastSeen: string;
  bandwidthUsage: string;
}

export interface ThreatIntelligenceItem {
  id: string;
  threatActor: string;
  indicator: string;
  category: string;
  firstSeen: string;
  riskScore: number;
  status: 'Active' | 'Neutralized' | 'Monitored';
  associatedCves: string[];
}

export interface SOCNotification {
  id: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  timestamp: string;
  read: boolean;
  linkTab?: NavigationTab;
}

export interface SOCSummaryStats {
  totalEvents24h: number;
  totalEventsDelta: number;
  activeThreats: number;
  activeThreatsDelta: number;
  protectedDevices: number;
  totalDevices: number;
  networkHealthScore: number; // e.g. 98.6
  avgLatencyMs: number;
  blockedAttacks24h: number;
}

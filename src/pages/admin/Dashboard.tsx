import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Activity, Clock, AlertTriangle, Globe, ArrowUp, ArrowDown,
  CheckCircle, AlertCircle, XCircle, Info
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// ---------- Mock Data ----------
const kpiData = {
  totalRequests: 1243521,
  totalRequestsChange: 12.5,
  avgLatency: 45,
  avgLatencyChange: -8.2,
  errorRate: 0.42,
  errorRateChange: 0.1,
  activeApis: 18,
  activeApisChange: 2,
};

const sparklineData = Array.from({ length: 20 }, (_, i) => ({
  i,
  v1: 40 + Math.sin(i / 3) * 20 + Math.random() * 10,
  v2: 30 + Math.cos(i / 4) * 15 + Math.random() * 8,
  v3: 10 + Math.sin(i / 2) * 5 + Math.random() * 4,
  v4: 50 + Math.cos(i / 5) * 10 + Math.random() * 6,
}));

const trafficData = Array.from({ length: 48 }, (_, i) => ({
  time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
  total: Math.floor(800 + Math.sin(i / 4) * 400 + Math.random() * 200),
  ok: Math.floor(780 + Math.sin(i / 4) * 380 + Math.random() * 180),
  clientError: Math.floor(10 + Math.random() * 15),
  serverError: Math.floor(2 + Math.random() * 8),
}));

const topApis = [
  { name: 'Payment Processing API', type: 'REST', requests: 482000, latency: 38, errorRate: 0.12, uptime: 99.98 },
  { name: 'User Management Service', type: 'REST', requests: 315000, latency: 22, errorRate: 0.05, uptime: 99.99 },
  { name: 'Inventory GraphQL', type: 'GRAPHQL', requests: 198000, latency: 55, errorRate: 0.34, uptime: 99.95 },
  { name: 'Shipping Calculator', type: 'REST', requests: 142000, latency: 120, errorRate: 0.87, uptime: 99.82 },
  { name: 'gRPC Product Catalog', type: 'GRPC', requests: 106000, latency: 15, errorRate: 0.02, uptime: 99.99 },
];

const errorData = Array.from({ length: 48 }, (_, i) => ({
  time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
  serverError: 0.1 + Math.sin(i / 6) * 0.15 + Math.random() * 0.1,
  clientError: 0.3 + Math.cos(i / 8) * 0.2 + Math.random() * 0.15,
}));

const latencyData = Array.from({ length: 48 }, (_, i) => ({
  time: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
  p50: 30 + Math.sin(i / 8) * 15 + Math.random() * 5,
  p95: 65 + Math.sin(i / 8) * 25 + Math.random() * 10,
  p99: 120 + Math.sin(i / 8) * 40 + Math.random() * 20,
}));

const activityItems = [
  { action: 'Payment Processing API published', time: '2 min ago', severity: 'success' as const },
  { action: 'Rate limit exceeded for E-Commerce app', time: '15 min ago', severity: 'warning' as const },
  { action: 'New subscription: User Mgmt to Mobile App', time: '32 min ago', severity: 'info' as const },
  { action: '500 error spike detected on Shipping API', time: '1h ago', severity: 'error' as const },
  { action: 'API key regenerated for Partner Integration', time: '2h ago', severity: 'info' as const },
  { action: 'User Management Service deprecated', time: '3h ago', severity: 'warning' as const },
  { action: 'New application: Analytics Dashboard', time: '5h ago', severity: 'info' as const },
  { action: 'Gateway health check: all healthy', time: '6h ago', severity: 'success' as const },
];

// ---------- Components ----------

function KpiCard({
  label,
  value,
  change,
  icon,
  color,
  dataKey,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  dataKey: 'v1' | 'v2' | 'v3' | 'v4';
}) {
  const isPositive = change > 0;
  const isGood = label === 'Avg Latency' || label === 'Error Rate' ? !isPositive : isPositive;
  const changeColor = isGood ? '#10B981' : '#EF4444';

  return (
    <Card className="bg-[#2B2F38] border-[#3D434F] hover:border-[#F59E0B20] transition-all duration-200 hover:-translate-y-px">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[12px] text-[#9DA5B4] mb-1">{label}</p>
            <p className="text-[28px] font-bold text-[#E8ECF1] leading-none">{value}</p>
          </div>
          <span style={{ color }}>{icon}</span>
        </div>
        <div className="flex items-center gap-1 mb-3">
          {isPositive ? (
            <ArrowUp className="w-3 h-3" style={{ color: changeColor }} />
          ) : (
            <ArrowDown className="w-3 h-3" style={{ color: changeColor }} />
          )}
          <span className="text-[13px] font-medium" style={{ color: changeColor }}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-[12px] text-[#6B7280] ml-1">vs last period</span>
        </div>
        <div className="h-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${dataKey})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityIcon({ severity }: { severity: 'success' | 'warning' | 'error' | 'info' }) {
  switch (severity) {
    case 'success': return <CheckCircle className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />;
    case 'warning': return <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />;
    case 'error': return <XCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />;
    case 'info': return <Info className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />;
  }
}

function LatencyColor({ ms }: { ms: number }) {
  const color = ms < 100 ? '#10B981' : ms < 500 ? '#F59E0B' : '#EF4444';
  return <span style={{ color }} className="font-medium">{ms}ms</span>;
}

function ErrorColor({ rate }: { rate: number }) {
  const color = rate < 0.5 ? '#10B981' : rate < 1 ? '#F59E0B' : '#EF4444';
  return <span style={{ color }} className="font-medium">{rate}%</span>;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return String(n);
}

// ---------- Chart Tooltips ----------

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1A1D23] border border-[#3D434F] rounded-md px-3 py-2 shadow-lg">
      <p className="text-[11px] text-[#6B7280] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-[12px] font-medium" style={{ color: p.color || p.stroke }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
}

// ---------- Main Page ----------

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('24H');
  const timeOptions = ['1H', '6H', '24H', '7D', '30D', 'Custom'];

  return (
    <Layout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-6 animate-in fade-in duration-200">
          <div>
            <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-tight">Dashboard</h1>
            <p className="text-[13px] text-[#9DA5B4] mt-0.5">Real-time platform overview</p>
          </div>
          <div className="flex items-center gap-1 bg-[#1E2128] rounded-md p-0.5">
            {timeOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setTimeRange(opt)}
                className={cn(
                  'px-3 py-1.5 rounded text-[12px] font-medium transition-all duration-150',
                  timeRange === opt
                    ? 'bg-[#F59E0B] text-[#0D0E12]'
                    : 'text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]'
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label="Total Requests"
            value="1.24M"
            change={kpiData.totalRequestsChange}
            icon={<Activity className="w-5 h-5" />}
            color="#4488FF"
            dataKey="v1"
          />
          <KpiCard
            label="Avg Latency"
            value="45ms"
            change={kpiData.avgLatencyChange}
            icon={<Clock className="w-5 h-5" />}
            color="#F59E0B"
            dataKey="v2"
          />
          <KpiCard
            label="Error Rate"
            value="0.42%"
            change={kpiData.errorRateChange}
            icon={<AlertTriangle className="w-5 h-5" />}
            color="#EF4444"
            dataKey="v3"
          />
          <KpiCard
            label="Active APIs"
            value="18"
            change={kpiData.activeApisChange}
            icon={<Globe className="w-5 h-5" />}
            color="#10B981"
            dataKey="v4"
          />
        </div>

        {/* Charts Row 1: Traffic + API Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          {/* Traffic Chart */}
          <Card className="lg:col-span-3 bg-[#2B2F38] border-[#3D434F]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[16px] font-semibold text-[#E8ECF1]">API Traffic</CardTitle>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">Requests per minute</p>
                </div>
                <span className="text-[11px] text-[#6B7280] bg-[#1E2128] px-2 py-1 rounded">Last 24h</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3D434F30" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6B7280' }} interval={7} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} width={40} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="total" stroke="#4488FF" strokeWidth={2} dot={false} name="Total" />
                    <Line type="monotone" dataKey="ok" stroke="#10B981" strokeWidth={1} strokeDasharray="4 4" dot={false} name="200 OK" />
                    <Line type="monotone" dataKey="clientError" stroke="#F59E0B" strokeWidth={1} strokeDasharray="4 4" dot={false} name="4xx" />
                    <Line type="monotone" dataKey="serverError" stroke="#EF4444" strokeWidth={1} strokeDasharray="4 4" dot={false} name="5xx" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top APIs Bar Chart */}
          <Card className="lg:col-span-2 bg-[#2B2F38] border-[#3D434F]">
            <CardHeader className="pb-2">
              <CardTitle className="text-[16px] font-semibold text-[#E8ECF1]">Top APIs by Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topApis} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3D434F30" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#E8ECF1' }} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4488FF" />
                        <stop offset="100%" stopColor="#7C5CFF" />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="requests" fill="url(#barGrad)" radius={[0, 4, 4, 0]} name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2: Error Rates + Latency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Error Rate Area Chart */}
          <Card className="bg-[#2B2F38] border-[#3D434F]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[16px] font-semibold text-[#E8ECF1]">Error Rate Trend</CardTitle>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">Last 24 hours</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={errorData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3D434F30" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6B7280' }} interval={7} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} width={35} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="serverError" stackId="err" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="5xx" />
                    <Area type="monotone" dataKey="clientError" stackId="err" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="4xx" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Latency Multi-line Chart */}
          <Card className="bg-[#2B2F38] border-[#3D434F]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[16px] font-semibold text-[#E8ECF1]">Response Latency</CardTitle>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">p50 / p95 / p99</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3D434F30" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6B7280' }} interval={7} />
                    <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} width={40} unit="ms" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="p50" stroke="#4488FF" strokeWidth={2} dot={false} name="p50" />
                    <Line type="monotone" dataKey="p95" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="p95" />
                    <Line type="monotone" dataKey="p99" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="p99" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row: Top APIs Table + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top APIs Table */}
          <Card className="bg-[#2B2F38] border-[#3D434F]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[16px] font-semibold text-[#E8ECF1]">Top Performing APIs</CardTitle>
                <button className="text-[12px] text-[#4488FF] hover:text-[#5A9AFF] font-medium">View All</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3D434F50]">
                      <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-wider py-2 px-3">API</th>
                      <th className="text-right text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-wider py-2 px-3">Requests</th>
                      <th className="text-right text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-wider py-2 px-3">Latency</th>
                      <th className="text-right text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-wider py-2 px-3">Error</th>
                      <th className="text-right text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-wider py-2 px-3">Uptime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topApis.map((api, i) => (
                      <tr key={i} className="border-b border-[#3D434F30] hover:bg-[#353942] transition-colors">
                        <td className="py-2.5 px-3">
                          <p className="text-[13px] font-medium text-[#E8ECF1]">{api.name}</p>
                          <Badge variant="outline" className="text-[10px] border-[#3D434F] text-[#9DA5B4] mt-0.5">{api.type}</Badge>
                        </td>
                        <td className="text-right text-[13px] text-[#E8ECF1] py-2.5 px-3">{formatNumber(api.requests)}</td>
                        <td className="text-right py-2.5 px-3"><LatencyColor ms={api.latency} /></td>
                        <td className="text-right py-2.5 px-3"><ErrorColor rate={api.errorRate} /></td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-16 h-1.5 bg-[#3D434F] rounded-full overflow-hidden">
                              <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${api.uptime}%` }} />
                            </div>
                            <span className="text-[11px] text-[#9DA5B4]">{api.uptime}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-[#2B2F38] border-[#3D434F]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[16px] font-semibold text-[#E8ECF1]">Recent Activity</CardTitle>
                <span className="text-[11px] text-[#6B7280]">{formatRelativeTime(new Date(Date.now() - 3600000).toISOString())}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {activityItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-[#3D434F30] last:border-0">
                    <ActivityIcon severity={item.severity} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#E8ECF1] leading-snug">{item.action}</p>
                      <p className="text-[12px] text-[#6B7280] mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

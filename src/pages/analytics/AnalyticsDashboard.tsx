import { useState } from 'react';
import Layout from '@/components/Layout';
import { cn } from '@/lib/utils';
import {
  Activity,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  FileText,
  Calendar,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend,
} from 'recharts';

// ---- Mock analytics data (inline, matching design spec) ----
const kpiData = {
  totalRequests: 2843521,
  totalRequestsChange: 18.2,
  avgLatency: 38,
  avgLatencyChange: -12.4,
  activeDevelopers: 342,
  activeDevelopersChange: 8,
  errorRate: 0.31,
  errorRateChange: -0.05,
  uptime: 99.97,
  uptimeChange: 0.02,
};

const trafficData = Array.from({ length: 48 }, (_, i) => {
  const date = new Date('2024-07-20T00:00:00Z');
  date.setMinutes(date.getMinutes() + i * 30);
  const base = 5000 + Math.sin(i / 8) * 2000;
  return {
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    total: Math.floor(base + Math.random() * 1000),
    success: Math.floor(base * 0.92 + Math.random() * 500),
    redirect: Math.floor(50 + Math.random() * 20),
    clientError: Math.floor(30 + Math.random() * 25),
    serverError: Math.floor(5 + Math.random() * 10),
  };
});

const topApis = [
  { name: 'Payment Processing API', requests: 482000 },
  { name: 'User Management Service', requests: 315000 },
  { name: 'Inventory GraphQL', requests: 198000 },
  { name: 'Shipping Calculator', requests: 142000 },
  { name: 'gRPC Product Catalog', requests: 106000 },
  { name: 'Notification Webhook', requests: 87000 },
  { name: 'Order Service', requests: 64000 },
  { name: 'Real-time Chat', requests: 42000 },
];

const geoData = [
  { country: 'United States', code: 'US', requests: 1283521, percent: 45.2 },
  { country: 'United Kingdom', code: 'GB', requests: 342000, percent: 12.0 },
  { country: 'Germany', code: 'DE', requests: 198000, percent: 7.0 },
  { country: 'Singapore', code: 'SG', requests: 156000, percent: 5.5 },
  { country: 'Japan', code: 'JP', requests: 124000, percent: 4.4 },
  { country: 'Australia', code: 'AU', requests: 87000, percent: 3.1 },
  { country: 'India', code: 'IN', requests: 65000, percent: 2.3 },
  { country: 'Canada', code: 'CA', requests: 48000, percent: 1.7 },
];

const devEngagement = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (30 - i) * 86400000).toISOString().split('T')[0].slice(5),
  newSignups: Math.floor(2 + Math.random() * 6),
  dailyActive: Math.floor(120 + Math.sin(i / 5) * 40 + Math.random() * 20),
  subscriptions: Math.floor(5 + Math.random() * 10),
}));

const errorAnalysis = {
  totalErrors: 8815,
  breakdown: [
    { type: '5xx Errors', count: 1842, color: '#EF4444' },
    { type: '4xx Errors', count: 6231, color: '#F59E0B' },
    { type: '3xx Redirects', count: 742, color: '#3B82F6' },
  ],
  topErrorEndpoints: [
    { path: '/shipping/rates', method: 'GET', count: 1245, errorRate: 2.1 },
    { path: '/payments', method: 'POST', count: 876, errorRate: 0.8 },
    { path: '/users/{id}', method: 'GET', count: 654, errorRate: 0.5 },
    { path: '/inventory/query', method: 'POST', count: 432, errorRate: 0.7 },
  ],
};

const timeRanges = ['1H', '6H', '24H', '7D', '30D'] as const;
type TimeRange = typeof timeRanges[number];

// ---- KPI Card ----
interface KPICardProps {
  icon: React.ReactNode;
  iconColor: string;
  value: string;
  label: string;
  change: number;
  changeLabel?: string;
  sparklineData?: number[];
  sparklineColor?: string;
}

function KPICard({ icon, iconColor, value, label, change, sparklineData, sparklineColor }: KPICardProps) {
  const isPositive = change >= 0;
  const sparkline = sparklineData || Array.from({ length: 10 }, () => Math.floor(Math.random() * 50 + 25));

  return (
    <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5 hover:border-[#4488FF40] transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2 rounded-md', iconColor)}>
          {icon}
        </div>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#10B981]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#EF4444]" />
          )}
          <span className={cn('text-[12px] font-medium', isPositive ? 'text-[#10B981]' : 'text-[#EF4444]')}>
            {isPositive ? '+' : ''}{change}{typeof change === 'number' && change < 10 && change > -10 ? '%' : ''}
          </span>
        </div>
      </div>
      <div className="text-[28px] font-bold text-[#E8ECF1] leading-tight">{value}</div>
      <div className="text-[12px] text-[#9DA5B4] mt-1">{label}</div>
      {/* Mini sparkline SVG */}
      {sparklineColor && (
        <svg className="w-full h-10 mt-2" viewBox="0 0 100 30" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={sparklineColor}
            strokeWidth="1.5"
            points={sparkline.map((v, i) => `${(i / (sparkline.length - 1)) * 100},${30 - (v / 100) * 30}`).join(' ')}
          />
        </svg>
      )}
    </div>
  );
}

// ---- Custom Tooltip for charts ----
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1D23] border border-[#3D434F] rounded-lg p-3 shadow-lg">
      <p className="text-[12px] text-[#6B7280] mb-1.5">{label}</p>
      {payload.map((entry, idx) => (
        <div key={idx} className="flex items-center gap-2 text-[12px]">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-[#9DA5B4]">{entry.name}:</span>
          <span className="text-[#E8ECF1] font-medium">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Country flag helper ----
function countryFlag(code: string) {
  const flags: Record<string, string> = {
    US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', SG: '🇸🇬', JP: '🇯🇵', AU: '🇦🇺', IN: '🇮🇳', CA: '🇨🇦',
  };
  return flags[code] || '🌍';
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const exportCSV = () => {
    const rows = [
      ['Metric', 'Value', 'Change'],
      ['Total Requests', String(kpiData.totalRequests), String(kpiData.totalRequestsChange)],
      ['Avg Latency', `${kpiData.avgLatency}ms`, String(kpiData.avgLatencyChange)],
      ['Active Developers', String(kpiData.activeDevelopers), String(kpiData.activeDevelopersChange)],
      ['Error Rate', `${kpiData.errorRate}%`, String(kpiData.errorRateChange)],
      ['Uptime', `${kpiData.uptime}%`, String(kpiData.uptimeChange)],
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRequestsFormatted = `${(kpiData.totalRequests / 1000000).toFixed(2)}M`;

  // Traffic legend toggle state
  const [trafficSeries, setTrafficSeries] = useState({
    total: true,
    success: true,
    redirect: false,
    clientError: false,
    serverError: false,
  });

  const toggleSeries = (key: keyof typeof trafficSeries) => {
    setTrafficSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout>
      {/* Page Header with time range selector */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#E8ECF1] leading-tight tracking-[-0.02em]">Analytics Dashboard</h1>
          <p className="text-[13px] text-[#9DA5B4] mt-1">Real-time API analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2B2F38] border border-[#3D434F] rounded-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </span>
            <span className="text-[12px] text-[#10B981] font-medium">Live</span>
          </div>
          {/* Time range selector */}
          <div className="flex items-center bg-[#2B2F38] border border-[#3D434F] rounded-md overflow-hidden">
            {timeRanges.map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 text-[12px] font-medium transition-all',
                  timeRange === range
                    ? 'bg-[#8B5CF6] text-white'
                    : 'text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]'
                )}
              >
                {range}
              </button>
            ))}
          </div>
          {/* Refresh */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-[#3D434F] bg-[#2B2F38] text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]"
            onClick={handleRefresh}
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          icon={<Activity className="w-5 h-5 text-[#4488FF]" />}
          iconColor="bg-[#4488FF20]"
          value={totalRequestsFormatted}
          label="Total Requests"
          change={kpiData.totalRequestsChange}
          sparklineData={trafficData.slice(-10).map(d => (d.total / 7000) * 100)}
          sparklineColor="#4488FF"
        />
        <KPICard
          icon={<Clock className="w-5 h-5 text-[#F59E0B]" />}
          iconColor="bg-[#F59E0B20]"
          value={`${kpiData.avgLatency}ms`}
          label="Avg Latency"
          change={kpiData.avgLatencyChange}
          sparklineColor="#F59E0B"
        />
        <KPICard
          icon={<Users className="w-5 h-5 text-[#10B981]" />}
          iconColor="bg-[#10B98120]"
          value={String(kpiData.activeDevelopers)}
          label="Active Developers"
          change={kpiData.activeDevelopersChange}
          sparklineColor="#10B981"
        />
        <KPICard
          icon={<AlertTriangle className="w-5 h-5 text-[#EF4444]" />}
          iconColor="bg-[#EF444420]"
          value={`${kpiData.errorRate}%`}
          label="Error Rate"
          change={kpiData.errorRateChange}
          sparklineColor="#EF4444"
        />
        <KPICard
          icon={<CheckCircle className="w-5 h-5 text-[#8B5CF6]" />}
          iconColor="bg-[#8B5CF620]"
          value={`${kpiData.uptime}%`}
          label="Avg Uptime"
          change={kpiData.uptimeChange}
          sparklineColor="#8B5CF6"
        />
      </div>

      {/* Traffic Overview - Full Width */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-semibold text-[#E8ECF1]">Traffic Overview</h3>
            <p className="text-[12px] text-[#6B7280]">Requests over time • Last {timeRange}</p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-3">
            {[
              { key: 'total' as const, label: 'Total', color: '#4488FF' },
              { key: 'success' as const, label: '2xx', color: '#10B981' },
              { key: 'redirect' as const, label: '3xx', color: '#3B82F6' },
              { key: 'clientError' as const, label: '4xx', color: '#F59E0B' },
              { key: 'serverError' as const, label: '5xx', color: '#EF4444' },
            ].map(s => (
              <button
                key={s.key}
                onClick={() => toggleSeries(s.key)}
                className={cn(
                  'flex items-center gap-1.5 text-[11px] transition-opacity',
                  trafficSeries[s.key] ? 'opacity-100' : 'opacity-40'
                )}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-[#9DA5B4]">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={trafficData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4488FF" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#4488FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#3D434F30" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#3D434F30' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#3D434F30' }} />
            <Tooltip content={<CustomTooltip />} />
            {trafficSeries.total && <Area type="monotone" dataKey="total" name="Total" stroke="#4488FF" strokeWidth={2} fill="url(#trafficGradient)" />}
            {trafficSeries.success && <Area type="monotone" dataKey="success" name="2xx Success" stroke="#10B981" strokeWidth={1} strokeDasharray="4 4" fill="transparent" />}
            {trafficSeries.redirect && <Area type="monotone" dataKey="redirect" name="3xx Redirect" stroke="#3B82F6" strokeWidth={1} strokeDasharray="2 2" fill="transparent" />}
            {trafficSeries.clientError && <Area type="monotone" dataKey="clientError" name="4xx Error" stroke="#F59E0B" strokeWidth={1} strokeDasharray="4 4" fill="transparent" />}
            {trafficSeries.serverError && <Area type="monotone" dataKey="serverError" name="5xx Error" stroke="#EF4444" strokeWidth={1} strokeDasharray="4 4" fill="transparent" />}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column row: Top APIs + Geographic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top APIs */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#E8ECF1]">Top APIs by Requests</h3>
            <Button variant="ghost" size="sm" className="text-[12px] text-[#4488FF] hover:text-[#5A9AFF] h-7">
              View All
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topApis} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3D434F30" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#3D434F30' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#9DA5B4' }} tickLine={false} axisLine={{ stroke: '#3D434F30' }} width={140} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="requests" name="Requests" radius={[0, 4, 4, 0]} barSize={20}>
                {topApis.map((_, idx) => (
                  <Cell key={idx} fill={`hsl(${217 + idx * 5}, 100%, ${60 - idx * 3}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#E8ECF1]">Geographic Distribution</h3>
            <span className="text-[12px] text-[#6B7280]">{totalRequestsFormatted} total</span>
          </div>
          {/* Simplified map visualization using dots */}
          <div className="relative h-[140px] bg-[#181A20] rounded-lg border border-[#3D434F] mb-4 overflow-hidden">
            <svg viewBox="0 0 360 180" className="w-full h-full opacity-60">
              {/* Simplified world map path - just continents outline */}
              <path
                d="M60,40 Q80,30 100,40 Q120,35 140,45 Q160,40 180,50 Q200,45 220,55 Q240,50 260,60 Q270,55 280,65 L280,80 Q275,90 280,100 Q285,110 280,120 Q275,130 260,135 Q240,140 220,135 Q200,140 180,135 Q160,140 140,135 Q120,140 100,135 Q80,140 60,130 Q50,120 55,100 Q50,80 55,60 Q50,50 60,40Z"
                fill="none"
                stroke="#3D434F"
                strokeWidth="0.5"
              />
              {/* North America */}
              <ellipse cx="80" cy="60" rx="35" ry="25" fill="#3D434F20" stroke="#3D434F40" strokeWidth="0.5" />
              {/* South America */}
              <ellipse cx="105" cy="115" rx="20" ry="30" fill="#3D434F20" stroke="#3D434F40" strokeWidth="0.5" />
              {/* Europe */}
              <ellipse cx="175" cy="55" rx="20" ry="15" fill="#3D434F20" stroke="#3D434F40" strokeWidth="0.5" />
              {/* Africa */}
              <ellipse cx="180" cy="95" rx="22" ry="28" fill="#3D434F20" stroke="#3D434F40" strokeWidth="0.5" />
              {/* Asia */}
              <ellipse cx="250" cy="65" rx="45" ry="30" fill="#3D434F20" stroke="#3D434F40" strokeWidth="0.5" />
              {/* Australia */}
              <ellipse cx="290" cy="120" rx="18" ry="12" fill="#3D434F20" stroke="#3D434F40" strokeWidth="0.5" />
            </svg>
            {/* City dots */}
            {[
              { name: 'New York', x: '22%', y: '35%', size: 12, color: '#EF4444' },
              { name: 'San Francisco', x: '12%', y: '38%', size: 10, color: '#F59E0B' },
              { name: 'London', x: '47%', y: '28%', size: 9, color: '#F59E0B' },
              { name: 'Frankfurt', x: '50%', y: '30%', size: 7, color: '#3B82F6' },
              { name: 'Singapore', x: '78%', y: '55%', size: 6, color: '#3B82F6' },
              { name: 'Tokyo', x: '88%', y: '35%', size: 6, color: '#3B82F6' },
              { name: 'Sydney', x: '85%', y: '72%', size: 5, color: '#3B82F6' },
              { name: 'Mumbai', x: '68%', y: '48%', size: 4, color: '#3B82F6' },
              { name: 'Toronto', x: '24%', y: '32%', size: 4, color: '#3B82F6' },
            ].map(city => (
              <div
                key={city.name}
                className="absolute rounded-full animate-pulse"
                style={{
                  left: city.x,
                  top: city.y,
                  width: city.size,
                  height: city.size,
                  backgroundColor: city.color,
                  boxShadow: `0 0 ${city.size}px ${city.color}60`,
                }}
                title={`${city.name}: ${(Math.random() * 500000 + 50000).toFixed(0)} reqs`}
              />
            ))}
          </div>
          {/* Top Countries List */}
          <div className="space-y-2">
            {geoData.map(geo => (
              <div key={geo.code} className="flex items-center gap-3">
                <span className="text-[16px] w-6 text-center flex-shrink-0">{countryFlag(geo.code)}</span>
                <span className="text-[12px] text-[#E8ECF1] w-28 flex-shrink-0 truncate">{geo.country}</span>
                <div className="flex-1 h-1.5 bg-[#181A20] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                    style={{ width: `${geo.percent}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#9DA5B4] w-10 text-right flex-shrink-0">{geo.percent}%</span>
                <span className="text-[11px] text-[#6B7280] w-14 text-right flex-shrink-0">{(geo.requests / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column row: Developer Engagement + Error Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Developer Engagement */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4">Developer Engagement</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={devEngagement} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3D434F30" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#3D434F30' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} tickLine={false} axisLine={{ stroke: '#3D434F30' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px' }}
                formatter={(value: string) => <span className="text-[#9DA5B4]">{value}</span>}
              />
              <Line type="monotone" dataKey="newSignups" name="New Signups" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="dailyActive" name="Daily Active" stroke="#4488FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[#3D434F50]">
            <div>
              <div className="text-[12px] text-[#6B7280]">New this week</div>
              <div className="flex items-center gap-1">
                <span className="text-[16px] font-bold text-[#E8ECF1]">28</span>
                <span className="text-[11px] text-[#10B981]">+12%</span>
              </div>
            </div>
            <div>
              <div className="text-[12px] text-[#6B7280]">Avg daily active</div>
              <span className="text-[16px] font-bold text-[#E8ECF1]">156</span>
            </div>
            <div>
              <div className="text-[12px] text-[#6B7280]">Total subscriptions</div>
              <span className="text-[16px] font-bold text-[#E8ECF1]">1,245</span>
            </div>
          </div>
        </div>

        {/* Error Analysis */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4">Error Analysis</h3>
          <div className="flex items-center gap-6">
            {/* Donut chart */}
            <div className="relative w-[180px] h-[180px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorAnalysis.breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="count"
                    nameKey="type"
                    strokeWidth={0}
                    paddingAngle={2}
                  >
                    {errorAnalysis.breakdown.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[20px] font-bold text-[#E8ECF1]">{kpiData.errorRate}%</span>
                <span className="text-[11px] text-[#6B7280]">error rate</span>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-2 flex-1">
              {errorAnalysis.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-[12px] text-[#9DA5B4]">{item.type}</span>
                  </div>
                  <span className="text-[12px] font-medium text-[#E8ECF1]">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Top error endpoints */}
          <div className="mt-4 pt-4 border-t border-[#3D434F50]">
            <div className="text-[12px] text-[#6B7280] uppercase mb-2">Top Error Endpoints</div>
            <div className="space-y-1.5">
              {errorAnalysis.topErrorEndpoints.map((ep, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[12px]">
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-bold',
                    ep.method === 'GET' ? 'bg-[#10B98120] text-[#10B981]' :
                    ep.method === 'POST' ? 'bg-[#F59E0B20] text-[#F59E0B]' :
                    'bg-[#3B82F620] text-[#3B82F6]'
                  )}>
                    {ep.method}
                  </span>
                  <code className="text-[#9DA5B4] flex-1 truncate font-mono">{ep.path}</code>
                  <span className="text-[#E8ECF1] font-medium w-10 text-right">{ep.count}</span>
                  <span className={cn(
                    'w-10 text-right',
                    ep.errorRate > 1 ? 'text-[#EF4444]' : ep.errorRate > 0.5 ? 'text-[#F59E0B]' : 'text-[#6B7280]'
                  )}>
                    {ep.errorRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Footer */}
      <div className="flex items-center justify-center gap-3 py-6 border-t border-[#3D434F]">
        <span className="text-[13px] text-[#9DA5B4] mr-2">Export this report</span>
        <Button
          variant="outline"
          size="sm"
          className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF50]"
          onClick={exportCSV}
        >
          <Download className="w-4 h-4 mr-2" />
          Export as CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF50]"
          onClick={exportCSV}
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF50]"
          onClick={() => setShowScheduleModal(true)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Report
        </Button>
      </div>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold">Schedule Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Frequency</label>
              <select className="w-full h-10 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Format</label>
              <select className="w-full h-10 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]">
                <option>CSV</option>
                <option>PDF</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Recipients</label>
              <Input placeholder="email1@example.com, email2@example.com" className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF]" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)} className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942]">Cancel</Button>
            <Button onClick={() => setShowScheduleModal(false)} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]">Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

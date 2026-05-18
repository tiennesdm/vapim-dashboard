import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 3200 }, { month: 'Feb', revenue: 3800 }, { month: 'Mar', revenue: 4500 },
  { month: 'Apr', revenue: 5200 }, { month: 'May', revenue: 6100 }, { month: 'Jun', revenue: 7800 }, { month: 'Jul', revenue: 8450 },
];

const planData = [
  { name: 'Free', value: 134 }, { name: 'Basic', value: 56 }, { name: 'Pro', value: 32 }, { name: 'Enterprise', value: 12 },
];
const PLAN_COLORS = ['#6B7280', '#4488FF', '#10B981', '#F59E0B'];

const plans = [
  { name: 'Free', price: '$0/mo', quota: '1,000 req/day', rateLimit: '10/min', subscribers: 134, revenue: '$0' },
  { name: 'Basic', price: '$29/mo', quota: '10,000 req/day', rateLimit: '100/min', subscribers: 56, revenue: '$1,624/mo' },
  { name: 'Pro', price: '$99/mo', quota: '100,000 req/day', rateLimit: '1000/min', subscribers: 32, revenue: '$3,168/mo' },
  { name: 'Enterprise', price: '$499/mo', quota: 'Unlimited', rateLimit: 'Unlimited', subscribers: 12, revenue: '$5,988/mo' },
];

const topCustomers = [
  { name: 'Acme Corporation', plan: 'Enterprise', revenue: '$5,988', apis: 12 },
  { name: 'TechStart Inc', plan: 'Pro', revenue: '$1,188', apis: 8 },
  { name: 'Global Logistics', plan: 'Pro', revenue: '$990', apis: 6 },
  { name: 'DataFlow Systems', plan: 'Basic', revenue: '$348', apis: 4 },
  { name: 'CloudFirst Labs', plan: 'Enterprise', revenue: '$5,988', apis: 10 },
];

export default function Monetization() {
  return (
    <Layout>
      <PageHeader title="Monetization" description="API usage plans and revenue tracking" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: '$45,230', icon: <DollarSign className="w-5 h-5" />, color: '#10B981' },
          { label: 'MRR', value: '$8,450', icon: <TrendingUp className="w-5 h-5" />, color: '#4488FF' },
          { label: 'Active Subscriptions', value: '234', icon: <Users className="w-5 h-5" />, color: '#F59E0B' },
          { label: 'ARPU', value: '$192', icon: <CreditCard className="w-5 h-5" />, color: '#8B5CF6' },
        ].map(kpi => (
          <Card key={kpi.label} className="bg-[#1A1D23] border-[#3D434F]">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}20`, color: kpi.color }}>
                {kpi.icon}
              </div>
              <div>
                <div className="text-[11px] text-[#6B7280] uppercase tracking-wider">{kpi.label}</div>
                <div className="text-xl font-bold text-[#E8ECF1]">{kpi.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2 bg-[#1A1D23] border-[#3D434F]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#E8ECF1]">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#353942" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} tickFormatter={v => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: '#1A1D23', border: '1px solid #3D434F', borderRadius: '8px', color: '#E8ECF1' }}
                  formatter={(value: number) => [`$${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="bg-[#1A1D23] border-[#3D434F]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#E8ECF1]">Subscribers by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={planData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {planData.map((_, index) => <Cell key={index} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1A1D23', border: '1px solid #3D434F', color: '#E8ECF1' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 mt-2">
              {planData.map((p, i) => (
                <div key={p.name} className="flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full" style={{ background: PLAN_COLORS[i] }} />
                  <span className="text-[#9DA5B4]">{p.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Table */}
      <Card className="mt-6 bg-[#1A1D23] border-[#3D434F]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[#E8ECF1]">Usage Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#3D434F] hover:bg-transparent">
                <TableHead className="text-[#6B7280]">Plan</TableHead>
                <TableHead className="text-[#6B7280]">Price</TableHead>
                <TableHead className="text-[#6B7280]">Quota</TableHead>
                <TableHead className="text-[#6B7280]">Rate Limit</TableHead>
                <TableHead className="text-[#6B7280]">Subscribers</TableHead>
                <TableHead className="text-[#6B7280]">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(p => (
                <TableRow key={p.name} className="border-[#3D434F] hover:bg-[#353942]/50">
                  <TableCell className="text-[#E8ECF1] font-medium">{p.name}</TableCell>
                  <TableCell className="text-[#E8ECF1]">{p.price}</TableCell>
                  <TableCell className="text-[#9DA5B4]">{p.quota}</TableCell>
                  <TableCell className="text-[#9DA5B4]">{p.rateLimit}</TableCell>
                  <TableCell className="text-[#E8ECF1]">{p.subscribers}</TableCell>
                  <TableCell className="text-[#10B981]">{p.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card className="mt-6 bg-[#1A1D23] border-[#3D434F]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-[#E8ECF1]">Top Paying Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#3D434F] hover:bg-transparent">
                <TableHead className="text-[#6B7280]">Customer</TableHead>
                <TableHead className="text-[#6B7280]">Plan</TableHead>
                <TableHead className="text-[#6B7280]">Monthly Revenue</TableHead>
                <TableHead className="text-[#6B7280]">APIs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map(c => (
                <TableRow key={c.name} className="border-[#3D434F] hover:bg-[#353942]/50">
                  <TableCell className="text-[#E8ECF1] font-medium">{c.name}</TableCell>
                  <TableCell><Badge className={c.plan === 'Enterprise' ? 'bg-[#F59E0B20] text-[#F59E0B]' : c.plan === 'Pro' ? 'bg-[#10B98120] text-[#10B981]' : 'bg-[#4488FF20] text-[#4488FF]'}>{c.plan}</Badge></TableCell>
                  <TableCell className="text-[#10B981]">{c.revenue}</TableCell>
                  <TableCell className="text-[#E8ECF1]">{c.apis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}

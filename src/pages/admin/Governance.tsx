import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, AlertTriangle, FileCheck, ClipboardList } from 'lucide-react';

const policies = [
  { name: 'Naming Convention', type: 'STANDARD', severity: 'MEDIUM', status: 'ACTIVE', apis: 15 },
  { name: 'Versioning Policy', type: 'STANDARD', severity: 'HIGH', status: 'ACTIVE', apis: 12 },
  { name: 'Security Headers', type: 'SECURITY', severity: 'CRITICAL', status: 'ACTIVE', apis: 15 },
  { name: 'OAuth2 Required', type: 'SECURITY', severity: 'CRITICAL', status: 'ACTIVE', apis: 13 },
  { name: 'Documentation Required', type: 'DOCUMENTATION', severity: 'MEDIUM', status: 'ACTIVE', apis: 11 },
  { name: 'Rate Limit Default', type: 'RATE_LIMIT', severity: 'HIGH', status: 'ACTIVE', apis: 15 },
  { name: 'CORS Policy', type: 'SECURITY', severity: 'HIGH', status: 'ACTIVE', apis: 14 },
  { name: 'Deprecation Timeline', type: 'STANDARD', severity: 'LOW', status: 'ACTIVE', apis: 8 },
  { name: 'HTTPS Enforcement', type: 'SECURITY', severity: 'CRITICAL', status: 'ACTIVE', apis: 15 },
  { name: 'API Categories', type: 'STANDARD', severity: 'LOW', status: 'INACTIVE', apis: 5 },
];

const approvals = [
  { api: 'Payment Processing API', requester: 'john@acme.com', type: 'PUBLISH', date: '2025-05-18' },
  { api: 'AI Chat Service', requester: 'sarah@tech.io', type: 'PUBLISH', date: '2025-05-17' },
  { api: 'Webhook v2', requester: 'mike@dev.co', type: 'DEPRECATE', date: '2025-05-16' },
  { api: 'User Profile GraphQL', requester: 'lisa@corp.com', type: 'PUBLISH', date: '2025-05-15' },
  { api: 'Shipping Calculator', requester: 'tom@logistics.com', type: 'BLOCK', date: '2025-05-14' },
  { api: 'Analytics Events', requester: 'admin@vedadb.io', type: 'RETIRE', date: '2025-05-13' },
  { api: 'Notification Service', requester: 'alex@app.io', type: 'PUBLISH', date: '2025-05-12' },
];

export default function Governance() {
  return (
    <Layout>
      <PageHeader title="API Governance" description="Policy enforcement and compliance management" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Policies', value: '10', icon: <ShieldCheck className="w-5 h-5" />, color: '#4488FF' },
          { label: 'Active Policies', value: '9', icon: <FileCheck className="w-5 h-5" />, color: '#10B981' },
          { label: 'Pending Approvals', value: '7', icon: <ClipboardList className="w-5 h-5" />, color: '#F59E0B' },
          { label: 'Violations', value: '3', icon: <AlertTriangle className="w-5 h-5" />, color: '#EF4444' },
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
        {/* Policies Table */}
        <Card className="xl:col-span-2 bg-[#1A1D23] border-[#3D434F]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#E8ECF1]">Governance Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#3D434F] hover:bg-transparent">
                  <TableHead className="text-[#6B7280]">Policy</TableHead>
                  <TableHead className="text-[#6B7280]">Type</TableHead>
                  <TableHead className="text-[#6B7280]">Severity</TableHead>
                  <TableHead className="text-[#6B7280]">Status</TableHead>
                  <TableHead className="text-[#6B7280]">APIs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map(p => (
                  <TableRow key={p.name} className="border-[#3D434F] hover:bg-[#353942]/50">
                    <TableCell className="text-[#E8ECF1] font-medium">{p.name}</TableCell>
                    <TableCell><Badge className="bg-[#4488FF20] text-[#4488FF]">{p.type}</Badge></TableCell>
                    <TableCell>
                      <Badge className={p.severity === 'CRITICAL' ? 'bg-[#EF444420] text-[#EF4444]' : p.severity === 'HIGH' ? 'bg-[#F59E0B20] text-[#F59E0B]' : 'bg-[#4488FF20] text-[#4488FF]'}>
                        {p.severity}
                      </Badge>
                    </TableCell>
                    <TableCell><Switch checked={p.status === 'ACTIVE'} /></TableCell>
                    <TableCell className="text-[#E8ECF1]">{p.apis}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Compliance Score */}
          <Card className="bg-[#1A1D23] border-[#3D434F]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#E8ECF1]">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#353942" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#10B981" strokeWidth="10" strokeDasharray="274.89" strokeDashoffset="35.74" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#E8ECF1]">87%</span>
                </div>
              </div>
              <div className="space-y-2 text-left">
                {[{ label: 'Security', score: 95 }, { label: 'Documentation', score: 78 }, { label: 'Standard', score: 85 }, { label: 'Rate Limit', score: 92 }].map(cat => (
                  <div key={cat.label}>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#9DA5B4]">{cat.label}</span>
                      <span className="text-[#E8ECF1]">{cat.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#353942] rounded-full overflow-hidden mt-0.5">
                      <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${cat.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="bg-[#1A1D23] border-[#3D434F]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#E8ECF1]">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {approvals.map(a => (
                <div key={a.api} className="p-3 bg-[#181A20] rounded-lg border border-[#3D434F]">
                  <div className="text-[12px] font-medium text-[#E8ECF1] mb-1">{a.api}</div>
                  <div className="text-[11px] text-[#6B7280] mb-2">{a.requester} · {a.type} · {a.date}</div>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 text-[11px] bg-[#10B981] hover:bg-[#10B981]/80">Approve</Button>
                    <Button size="sm" variant="outline" className="h-7 text-[11px] border-[#3D434F] text-[#EF4444] hover:bg-[#EF444420]">Reject</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

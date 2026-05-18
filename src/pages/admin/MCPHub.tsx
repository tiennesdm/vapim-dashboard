import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Bot, Wrench, Zap } from 'lucide-react';

const mcpServers = [
  { name: 'Payment MCP', desc: 'Payment processing tools', tools: 8, status: 'ACTIVE', synced: '2m ago' },
  { name: 'User Management MCP', desc: 'User CRUD operations', tools: 12, status: 'ACTIVE', synced: '5m ago' },
  { name: 'Inventory MCP', desc: 'Inventory queries', tools: 6, status: 'ACTIVE', synced: '1m ago' },
  { name: 'Analytics MCP', desc: 'Data aggregation tools', tools: 10, status: 'ACTIVE', synced: '12m ago' },
  { name: 'Notification MCP', desc: 'Push/email notifications', tools: 5, status: 'INACTIVE', synced: '1h ago' },
  { name: 'Search MCP', desc: 'Full-text search tools', tools: 7, status: 'ACTIVE', synced: '3m ago' },
  { name: 'Document MCP', desc: 'PDF/doc generation', tools: 9, status: 'ACTIVE', synced: '8m ago' },
  { name: 'Shipping MCP', desc: 'Logistics & tracking', tools: 4, status: 'ACTIVE', synced: '15m ago' },
];

const tools = [
  { name: 'processPayment', endpoint: '/payments/process', method: 'POST', desc: 'Process a payment transaction', params: 'amount, currency, source' },
  { name: 'getUserProfile', endpoint: '/users/:id', method: 'GET', desc: 'Retrieve user profile', params: 'userId' },
  { name: 'sendNotification', endpoint: '/notifications/send', method: 'POST', desc: 'Send push notification', params: 'userId, message, channel' },
  { name: 'searchProducts', endpoint: '/products/search', method: 'GET', desc: 'Search product catalog', params: 'query, filters, sort' },
  { name: 'generateInvoice', endpoint: '/documents/invoice', method: 'POST', desc: 'Generate PDF invoice', params: 'orderId, format' },
  { name: 'trackShipment', endpoint: '/shipping/track', method: 'GET', desc: 'Track package shipment', params: 'trackingNumber' },
  { name: 'getAnalytics', endpoint: '/analytics/query', method: 'POST', desc: 'Query analytics data', params: 'metric, period, filters' },
  { name: 'validateAddress', endpoint: '/shipping/validate', method: 'POST', desc: 'Validate shipping address', params: 'address, country' },
];

export default function MCPHub() {
  return (
    <Layout>
      <PageHeader title="MCP Hub" description="Model Context Protocol server catalog for AI agents" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'MCP Servers', value: '12', icon: <Network className="w-5 h-5" />, color: '#8B5CF6' },
          { label: 'Active Agents', value: '48', icon: <Bot className="w-5 h-5" />, color: '#10B981' },
          { label: 'Tool Calls', value: '89K', icon: <Wrench className="w-5 h-5" />, color: '#F59E0B' },
          { label: 'Avg Response', value: '45ms', icon: <Zap className="w-5 h-5" />, color: '#4488FF' },
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

      <Tabs defaultValue="servers" className="space-y-6">
        <TabsList className="bg-[#1A1D23] border border-[#3D434F]">
          <TabsTrigger value="servers" className="text-[#E8ECF1] data-[state=active]:bg-[#4488FF] data-[state=active]:text-white">MCP Servers</TabsTrigger>
          <TabsTrigger value="tools" className="text-[#E8ECF1] data-[state=active]:bg-[#4488FF] data-[state=active]:text-white">Tool Catalog</TabsTrigger>
        </TabsList>

        <TabsContent value="servers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mcpServers.map(s => (
              <Card key={s.name} className="bg-[#1A1D23] border-[#3D434F]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[14px] font-semibold text-[#E8ECF1]">{s.name}</h3>
                    <Badge className={s.status === 'ACTIVE' ? 'bg-[#10B98120] text-[#10B981]' : 'bg-[#6B728020] text-[#6B7280]'}>
                      {s.status}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-[#6B7280] mb-3">{s.desc}</p>
                  <div className="flex items-center gap-4 text-[11px] text-[#9DA5B4]">
                    <span>{s.tools} tools</span>
                    <span>Synced {s.synced}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <Card className="bg-[#1A1D23] border-[#3D434F]">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#3D434F] hover:bg-transparent">
                    <TableHead className="text-[#6B7280]">Tool</TableHead>
                    <TableHead className="text-[#6B7280]">Endpoint</TableHead>
                    <TableHead className="text-[#6B7280]">Method</TableHead>
                    <TableHead className="text-[#6B7280]">Description</TableHead>
                    <TableHead className="text-[#6B7280]">Parameters</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tools.map(t => (
                    <TableRow key={t.name} className="border-[#3D434F] hover:bg-[#353942]/50">
                      <TableCell className="text-[#E8ECF1] font-medium">{t.name}</TableCell>
                      <TableCell className="text-[#9DA5B4] font-mono text-[11px]">{t.endpoint}</TableCell>
                      <TableCell>
                        <Badge className={t.method === 'GET' ? 'bg-[#4488FF20] text-[#4488FF]' : t.method === 'POST' ? 'bg-[#10B98120] text-[#10B981]' : 'bg-[#F59E0B20] text-[#F59E0B]'}>
                          {t.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#9DA5B4] text-[12px]">{t.desc}</TableCell>
                      <TableCell className="text-[#9DA5B4] text-[11px]">{t.params}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

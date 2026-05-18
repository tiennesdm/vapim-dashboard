import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Brain, Bot, Shield, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const llmProviders = [
  { name: 'OpenAI', model: 'GPT-4o', status: 'ACTIVE', requests: '452K', latency: '120ms', cost: '$0.03' },
  { name: 'Anthropic', model: 'Claude 3.5', status: 'ACTIVE', requests: '310K', latency: '145ms', cost: '$0.04' },
  { name: 'Azure OpenAI', model: 'GPT-4', status: 'ACTIVE', requests: '228K', latency: '95ms', cost: '$0.02' },
  { name: 'AWS Bedrock', model: 'Claude 3', status: 'ACTIVE', requests: '134K', latency: '180ms', cost: '$0.025' },
  { name: 'Google Gemini', model: '1.5 Pro', status: 'ACTIVE', requests: '89K', latency: '110ms', cost: '$0.035' },
];

export default function AIGateway() {
  const [guardrails, setGuardrails] = useState({ contentSafety: true, piiMasking: true, promptFiltering: false, schemaValidation: true });
  const [cacheTTL, setCacheTTL] = useState([3600]);

  return (
    <Layout>
      <PageHeader title="AI Gateway" description="LLM routing, guardrails, and semantic caching" />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active LLM Providers', value: '5', icon: <Brain className="w-5 h-5" />, color: '#4488FF' },
          { label: 'Total AI Requests', value: '1.2M', icon: <Bot className="w-5 h-5" />, color: '#10B981' },
          { label: 'Avg Token Cost', value: '$0.04', icon: <DollarSign className="w-5 h-5" />, color: '#F59E0B' },
          { label: 'Guardrails Triggered', value: '234', icon: <Shield className="w-5 h-5" />, color: '#EF4444' },
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
        {/* LLM Providers Table */}
        <Card className="xl:col-span-2 bg-[#1A1D23] border-[#3D434F]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#E8ECF1]">LLM Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-[#3D434F] hover:bg-transparent">
                  <TableHead className="text-[#6B7280]">Provider</TableHead>
                  <TableHead className="text-[#6B7280]">Model</TableHead>
                  <TableHead className="text-[#6B7280]">Status</TableHead>
                  <TableHead className="text-[#6B7280]">Requests</TableHead>
                  <TableHead className="text-[#6B7280]">Latency</TableHead>
                  <TableHead className="text-[#6B7280]">Cost/1K</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {llmProviders.map(p => (
                  <TableRow key={p.name} className="border-[#3D434F] hover:bg-[#353942]/50">
                    <TableCell className="text-[#E8ECF1] font-medium">{p.name}</TableCell>
                    <TableCell className="text-[#9DA5B4]">{p.model}</TableCell>
                    <TableCell><StatusBadge status="PUBLISHED" /></TableCell>
                    <TableCell className="text-[#E8ECF1]">{p.requests}</TableCell>
                    <TableCell className="text-[#E8ECF1]">{p.latency}</TableCell>
                    <TableCell className="text-[#E8ECF1]">{p.cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI Guardrails */}
          <Card className="bg-[#1A1D23] border-[#3D434F]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#E8ECF1]">AI Guardrails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'contentSafety', label: 'Content Safety', desc: 'Block harmful content' },
                { key: 'piiMasking', label: 'PII Masking', desc: 'Remove personal information' },
                { key: 'promptFiltering', label: 'Prompt Filtering', desc: 'Filter injection attacks' },
                { key: 'schemaValidation', label: 'Schema Validation', desc: 'Validate response format' },
              ].map(g => (
                <div key={g.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-[13px] text-[#E8ECF1]">{g.label}</div>
                    <div className="text-[11px] text-[#6B7280]">{g.desc}</div>
                  </div>
                  <Switch
                    checked={guardrails[g.key as keyof typeof guardrails]}
                    onCheckedChange={v => setGuardrails(prev => ({ ...prev, [g.key]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Semantic Caching */}
          <Card className="bg-[#1A1D23] border-[#3D434F]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-[#E8ECF1]">Semantic Caching</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#E8ECF1]">Cache Hit Rate</span>
                <span className="text-[#10B981] font-medium">78%</span>
              </div>
              <div className="w-full h-2 bg-[#353942] rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#E8ECF1]">Cached Responses</span>
                <span className="text-[#E8ECF1] font-medium">24,892</span>
              </div>
              <div className="space-y-2">
                <div className="text-[12px] text-[#6B7280]">Cache TTL: {cacheTTL[0]}s</div>
                <Slider value={cacheTTL} onValueChange={setCacheTTL} min={60} max={7200} step={60} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

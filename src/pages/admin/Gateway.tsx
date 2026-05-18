import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { mockGateways } from '@/lib/data';
import type { Gateway } from '@/lib/data';
import {
  Plus, Pencil, Trash2, Activity, Server, ShieldCheck,
  ChevronDown, ChevronUp, Copy, Check, XCircle, HelpCircle
} from 'lucide-react';

// ---------- Helpers ----------

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'Just now';
}

function HealthBadge({ status }: { status: string }) {
  if (status === 'HEALTHY') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#10B981] bg-[#10B98120]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
        </span>
        HEALTHY
      </span>
    );
  }
  if (status === 'UNHEALTHY') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#EF4444] bg-[#EF444420]">
        <XCircle className="w-3 h-3" /> UNHEALTHY
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-[#6B7280] bg-[#6B728020]">
      <HelpCircle className="w-3 h-3" /> UNKNOWN
    </span>
  );
}

// ---------- Gateway Card ----------

function GatewayCard({ gateway, onEdit, onDelete }: { gateway: Gateway; onEdit: (g: Gateway) => void; onDelete: (g: Gateway) => void }) {
  const [sslOpen, setSslOpen] = useState(false);
  const [copiedHttp, setCopiedHttp] = useState(false);
  const [copiedHttps, setCopiedHttps] = useState(false);
  const [healthChecking, setHealthChecking] = useState(false);

  const copyEndpoint = (url: string, type: 'http' | 'https') => {
    navigator.clipboard.writeText(url).catch(() => {});
    if (type === 'http') { setCopiedHttp(true); setTimeout(() => setCopiedHttp(false), 2000); }
    else { setCopiedHttps(true); setTimeout(() => setCopiedHttps(false), 2000); }
  };

  const runHealthCheck = () => {
    setHealthChecking(true);
    setTimeout(() => setHealthChecking(false), 2000);
  };

  const protocolColors: Record<string, string> = {
    HTTP: '#6B7280',
    HTTPS: '#10B981',
    WS: '#4488FF',
    WSS: '#8B5CF6',
  };

  return (
    <Card className="bg-[#2B2F38] border-[#3D434F] hover:border-[#F59E0B20] transition-all duration-200 hover:-translate-y-px">
      <CardContent className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[16px] font-bold text-[#E8ECF1]">{gateway.name}</h3>
              <Badge variant="outline" className="text-[10px] border-[#8B5CF6] text-[#8B5CF6]">Default</Badge>
            </div>
            <Badge variant="outline" className="text-[10px] border-[#3D434F] text-[#9DA5B4]">{gateway.type}</Badge>
          </div>
          <HealthBadge status={gateway.healthStatus} />
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#9DA5B4] mb-4">{gateway.description}</p>

        {/* Endpoints */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between bg-[#181A20] rounded-md px-3 py-2">
            <code className="text-[12px] font-mono text-[#E8ECF1] truncate">{gateway.endpoints.http}</code>
            <button
              onClick={() => copyEndpoint(gateway.endpoints.http, 'http')}
              className="ml-2 text-[#6B7280] hover:text-[#4488FF] transition-colors flex-shrink-0"
            >
              {copiedHttp ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-center justify-between bg-[#181A20] rounded-md px-3 py-2">
            <code className="text-[12px] font-mono text-[#E8ECF1] truncate">{gateway.endpoints.https}</code>
            <button
              onClick={() => copyEndpoint(gateway.endpoints.https, 'https')}
              className="ml-2 text-[#6B7280] hover:text-[#4488FF] transition-colors flex-shrink-0"
            >
              {copiedHttps ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Protocol */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[12px] text-[#9DA5B4]">Protocol:</span>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: protocolColors[gateway.protocol] || '#6B7280',
              backgroundColor: (protocolColors[gateway.protocol] || '#6B7280') + '20'
            }}
          >
            {gateway.protocol}
          </span>
        </div>

        {/* Virtual Hosts */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[12px] text-[#9DA5B4]">VHosts:</span>
          <div className="flex flex-wrap gap-1">
            {gateway.virtualHosts.map((host) => (
              <span key={host} className="px-2 py-0.5 rounded text-[11px] bg-[#3D434F40] text-[#9DA5B4]">
                {host}
              </span>
            ))}
          </div>
        </div>

        {/* Meta Row */}
        <div className="flex items-center justify-between text-[12px] text-[#6B7280] mb-4">
          <span>Created: {formatDate(gateway.createdAt)}</span>
          <span>Last check: {formatRelativeTime(gateway.lastHealthCheck)}</span>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#3D434F50]">
          <button
            onClick={() => onEdit(gateway)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={runHealthCheck}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors"
          >
            {healthChecking ? (
              <span className="w-3.5 h-3.5 border-2 border-[#4488FF] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Activity className="w-3.5 h-3.5" />
            )}
            Health Check
          </button>
          <button
            onClick={() => onDelete(gateway)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium text-[#9DA5B4] hover:bg-[#EF444420] hover:text-[#EF4444] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>

        {/* SSL Section (collapsible) */}
        <div className="mt-3 pt-3 border-t border-[#3D434F30]">
          <button
            onClick={() => setSslOpen(!sslOpen)}
            className="flex items-center gap-1.5 text-[12px] text-[#9DA5B4] hover:text-[#E8ECF1] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            SSL Certificate
            {sslOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {sslOpen && (
            <div className="mt-3 space-y-2 bg-[#181A20] rounded-md p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280]">Issuer</span>
                <span className="text-[12px] text-[#E8ECF1] font-mono">Let&apos;s Encrypt R3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280]">Subject</span>
                <span className="text-[12px] text-[#E8ECF1] font-mono">CN=*.veda.io</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#6B7280]">Expires</span>
                <span className="text-[12px] text-[#10B981]">Oct 15, 2024</span>
              </div>
              <button className="mt-2 text-[11px] text-[#4488FF] hover:text-[#5A9AFF] font-medium">
                Renew Certificate
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Add/Edit Gateway Modal ----------

function GatewayModal({ gateway, open, onOpenChange }: { gateway: Gateway | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const isCreate = !gateway;
  const [form, setForm] = useState<{
    name: string; label: string; type: 'SYNAPSE' | 'CC'; description: string;
    http: string; https: string; protocol: 'HTTP' | 'HTTPS' | 'WS' | 'WSS'; vhosts: string;
  }>({
    name: gateway?.name || '',
    label: gateway?.label || '',
    type: gateway?.type || 'SYNAPSE',
    description: gateway?.description || '',
    http: gateway?.endpoints.http || '',
    https: gateway?.endpoints.https || '',
    protocol: (gateway?.protocol || 'HTTPS') as 'HTTP' | 'HTTPS' | 'WS' | 'WSS',
    vhosts: gateway?.virtualHosts.join(', ') || '',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#E8ECF1]">{isCreate ? 'Add Gateway' : 'Edit Gateway'}</DialogTitle>
          <DialogDescription className="text-[#9DA5B4]">
            Configure gateway endpoint settings and protocols.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Name *</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF] focus:ring-[#4488FF30]"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Label</label>
            <Input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. Gateway-1"
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Type</label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as 'SYNAPSE' | 'CC' })}>
              <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                <SelectItem value="SYNAPSE">Synapse</SelectItem>
                <SelectItem value="CC">Choreo Connect</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full h-16 bg-[#181A20] border border-[#3D434F] rounded-md px-3 py-2 text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30] resize-none"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">HTTP Endpoint URL</label>
            <Input
              value={form.http}
              onChange={(e) => setForm({ ...form, http: e.target.value })}
              placeholder="http://gateway.example.com:8280"
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] font-mono text-[12px] focus:border-[#4488FF] focus:ring-[#4488FF30]"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">HTTPS Endpoint URL</label>
            <Input
              value={form.https}
              onChange={(e) => setForm({ ...form, https: e.target.value })}
              placeholder="https://gateway.example.com:8243"
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] font-mono text-[12px] focus:border-[#4488FF] focus:ring-[#4488FF30]"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Protocol</label>
            <Select value={form.protocol} onValueChange={(v) => setForm({ ...form, protocol: v as 'HTTP' | 'HTTPS' | 'WS' | 'WSS' })}>
              <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                <SelectItem value="HTTP">HTTP</SelectItem>
                <SelectItem value="HTTPS">HTTPS</SelectItem>
                <SelectItem value="WS">WS</SelectItem>
                <SelectItem value="WSS">WSS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Virtual Hosts (comma-separated)</label>
            <Input
              value={form.vhosts}
              onChange={(e) => setForm({ ...form, vhosts: e.target.value })}
              placeholder="api.example.com, gateway.example.com"
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">SSL Certificate (optional)</label>
            <div className="border border-dashed border-[#3D434F] rounded-md p-4 text-center cursor-pointer hover:border-[#4488FF] transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#6B7280] mx-auto mb-1" />
              <p className="text-[12px] text-[#9DA5B4]">Drop certificate file or click to upload</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">Cancel</Button>
          <Button onClick={() => onOpenChange(false)} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]">
            {isCreate ? 'Save Gateway' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Delete Confirmation ----------

function DeleteDialog({ gateway, open, onOpenChange }: { gateway: Gateway | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!gateway) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#E8ECF1]">Delete Gateway</DialogTitle>
          <DialogDescription className="text-[#9DA5B4]">
            Are you sure you want to delete <strong className="text-[#E8ECF1]">{gateway.name}</strong>? All API deployments on this gateway will be affected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">Cancel</Button>
          <Button onClick={() => onOpenChange(false)} className="bg-[#EF4444] text-white hover:bg-[#DC2626]">
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Main Page ----------

export default function GatewayConfig() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editGateway, setEditGateway] = useState<Gateway | null>(null);
  const [deleteGateway, setDeleteGateway] = useState<Gateway | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openCreate = () => {
    setEditGateway(null);
    setModalOpen(true);
  };

  const openEdit = (gateway: Gateway) => {
    setEditGateway(gateway);
    setModalOpen(true);
  };

  const openDelete = (gateway: Gateway) => {
    setDeleteGateway(gateway);
    setDeleteOpen(true);
  };

  return (
    <Layout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-6 animate-in fade-in duration-200">
          <div>
            <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-tight">Gateway Configuration</h1>
            <p className="text-[13px] text-[#9DA5B4] mt-0.5">Manage API gateway endpoints, protocols, and SSL settings</p>
          </div>
          <Button onClick={openCreate} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF] text-[13px]">
            <Plus className="w-4 h-4 mr-1.5" /> Add Gateway
          </Button>
        </div>

        {/* Gateway Cards Grid */}
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))' }}>
          {mockGateways.map((gateway) => (
            <GatewayCard
              key={gateway.id}
              gateway={gateway}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>

        {mockGateways.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Server className="w-12 h-12 text-[#3D434F] mb-3" />
            <p className="text-[16px] font-medium text-[#E8ECF1]">No gateways configured</p>
            <p className="text-[13px] text-[#9DA5B4] mt-1">Add a gateway to get started</p>
          </div>
        )}
      </div>

      <GatewayModal gateway={editGateway} open={modalOpen} onOpenChange={setModalOpen} />
      <DeleteDialog gateway={deleteGateway} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </Layout>
  );
}

import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter
} from '@/components/ui/sheet';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { mockTenants } from '@/lib/data';
import type { Tenant } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Search, Plus, Download, Pencil, Settings, Trash2, Building2, CheckCircle, Layers,
  Copy, Check
} from 'lucide-react';

// ---------- Helpers ----------

const planConfig = {
  FREE: { color: '#6B7280', bg: '#6B728020', label: 'Free' },
  PROFESSIONAL: { color: '#4488FF', bg: '#4488FF20', label: 'Professional' },
  ENTERPRISE: { color: '#8B5CF6', bg: '#8B5CF620', label: 'Enterprise' },
};

function PlanBadge({ plan }: { plan: string }) {
  const cfg = planConfig[plan as keyof typeof planConfig] || planConfig.FREE;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'ACTIVE' ? '#10B981' : '#6B7280';
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider"
      style={{ color, backgroundColor: color + '20' }}
    >
      {status}
    </span>
  );
}

function UsageBar({ used, max, color }: { used: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((used / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#3D434F] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] text-[#6B7280] w-12 text-right">{used}/{max}</span>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ---------- Create/Edit Tenant Drawer ----------

function TenantDrawer({ tenant, open, onOpenChange }: { tenant: Tenant | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const isCreate = !tenant;
  const [form, setForm] = useState({
    domain: '', name: '', description: '', owner: '', plan: 'FREE', maxApis: 100, maxUsers: 50, maxApps: 25, maxRequests: 500000,
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#2B2F38] border-l border-[#3D434F] w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#E8ECF1]">{isCreate ? 'Create Tenant' : 'Edit Tenant'}</SheetTitle>
          <SheetDescription className="text-[#9DA5B4]">
            {isCreate ? 'Create a new tenant with quotas and settings.' : `Editing ${tenant?.name}`}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="bg-[#1E2128] border border-[#3D434F]">
            <TabsTrigger value="details" className="text-[#9DA5B4] data-[state=active]:bg-[#4488FF] data-[state=active]:text-white">Details</TabsTrigger>
            <TabsTrigger value="quota" className="text-[#9DA5B4] data-[state=active]:bg-[#4488FF] data-[state=active]:text-white">Quota</TabsTrigger>
            <TabsTrigger value="settings" className="text-[#9DA5B4] data-[state=active]:bg-[#4488FF] data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Domain *</label>
              <Input
                placeholder="e.g. acme.corp"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Name *</label>
              <Input
                placeholder="Tenant name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Description</label>
              <textarea
                placeholder="Brief description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full h-20 bg-[#181A20] border border-[#3D434F] rounded-md px-3 py-2 text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30] resize-none"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Owner Email</label>
              <Input
                type="email"
                placeholder="owner@example.com"
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Plan</label>
              <Select value={form.plan} onValueChange={(v) => setForm({ ...form, plan: v })}>
                <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="quota" className="mt-4 space-y-4">
            {[
              { key: 'maxApis', label: 'Max APIs', current: tenant?.usage.apis || 0 },
              { key: 'maxUsers', label: 'Max Users', current: tenant?.usage.users || 0 },
              { key: 'maxApps', label: 'Max Applications', current: tenant?.usage.applications || 0 },
              { key: 'maxRequests', label: 'Max Requests/Day', current: tenant?.usage.requestsToday || 0 },
            ].map((q) => (
              <div key={q.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-medium text-[#9DA5B4]">{q.label}</label>
                  <span className="text-[11px] text-[#6B7280]">Current: {q.current.toLocaleString()}</span>
                </div>
                <Input
                  type="number"
                  value={form[q.key as keyof typeof form] as number}
                  onChange={(e) => setForm({ ...form, [q.key]: parseInt(e.target.value) || 0 })}
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]"
                />
              </div>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-[13px] font-medium text-[#E8ECF1]">Enable Analytics</p>
                <p className="text-[11px] text-[#6B7280]">Allow tenant to access analytics dashboard</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-[13px] font-medium text-[#E8ECF1]">Custom Branding</p>
                <p className="text-[11px] text-[#6B7280]">Allow custom logo and theme colors</p>
              </div>
              <Switch />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Allowed IP Ranges</label>
              <textarea
                placeholder="10.0.0.0/8&#10;192.168.0.0/16"
                className="w-full h-20 bg-[#181A20] border border-[#3D434F] rounded-md px-3 py-2 text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30] resize-none font-mono"
              />
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]">
            {isCreate ? 'Create Tenant' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------- Delete Confirmation ----------

function DeleteTenantDialog({ tenant, open, onOpenChange }: { tenant: Tenant | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!tenant) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#E8ECF1]">Delete Tenant</DialogTitle>
          <DialogDescription className="text-[#9DA5B4]">
            Are you sure you want to delete <strong className="text-[#E8ECF1]">{tenant.name}</strong>? All data will be permanently removed.
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

export default function Tenants() {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [deleteTenant, setDeleteTenant] = useState<Tenant | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTenants = useMemo(() => {
    return mockTenants.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        if (!t.domain.toLowerCase().includes(q) && !t.name.toLowerCase().includes(q)) return false;
      }
      if (planFilter.length > 0 && !planFilter.includes(t.plan)) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      return true;
    });
  }, [search, planFilter, statusFilter]);

  const togglePlan = (plan: string) => {
    setPlanFilter((prev) => prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]);
  };

  const openEdit = (tenant: Tenant) => {
    setEditTenant(tenant);
    setDrawerOpen(true);
  };

  const openCreate = () => {
    setEditTenant(null);
    setDrawerOpen(true);
  };

  const copyDomain = (domain: string, id: string) => {
    navigator.clipboard.writeText(domain).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasFilters = search || planFilter.length > 0 || statusFilter !== 'all';

  return (
    <Layout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-6 animate-in fade-in duration-200">
          <div>
            <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-tight">Tenant Management</h1>
            <p className="text-[13px] text-[#9DA5B4] mt-0.5">Manage platform tenants and their configurations</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942] text-[13px]">
              <Download className="w-4 h-4 mr-1.5" /> Export CSV
            </Button>
            <Button onClick={openCreate} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF] text-[13px]">
              <Plus className="w-4 h-4 mr-1.5" /> Create Tenant
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="bg-[#2B2F38] border-[#3D434F]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-[#9DA5B4]">Total Tenants</p>
                  <p className="text-[28px] font-bold text-[#E8ECF1] mt-1">{mockTenants.length}</p>
                </div>
                <Building2 className="w-5 h-5 text-[#4488FF]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#2B2F38] border-[#3D434F]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-[#9DA5B4]">Active Tenants</p>
                  <p className="text-[28px] font-bold text-[#E8ECF1] mt-1">{mockTenants.filter(t => t.status === 'ACTIVE').length}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-[#10B981]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#2B2F38] border-[#3D434F]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-[#9DA5B4]">APIs Across All Tenants</p>
                  <p className="text-[28px] font-bold text-[#E8ECF1] mt-1">{mockTenants.reduce((s, t) => s + t.usage.apis, 0)}</p>
                </div>
                <Layers className="w-5 h-5 text-[#8B5CF6]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="bg-[#2B2F38] border-[#3D434F] mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <Input
                  placeholder="Search by domain or tenant name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[12px] text-[#6B7280] mr-1">Plan:</span>
                {(['FREE', 'PROFESSIONAL', 'ENTERPRISE'] as const).map((plan) => (
                  <button
                    key={plan}
                    onClick={() => togglePlan(plan)}
                    className={cn(
                      'px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-150',
                      planFilter.includes(plan)
                        ? 'bg-[#F59E0B] text-[#0D0E12]'
                        : 'bg-[#1E2128] text-[#9DA5B4] hover:bg-[#353942]'
                    )}
                  >
                    {planConfig[plan].label}
                  </button>
                ))}
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-[#181A20] border-[#3D434F] text-[#E8ECF1] text-[13px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {hasFilters && (
                <button onClick={() => { setSearch(''); setPlanFilter([]); setStatusFilter('all'); }} className="text-[12px] text-[#EF4444] hover:text-[#DC2626] font-medium">
                  Clear all
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tenants Table */}
        <Card className="bg-[#2B2F38] border-[#3D434F]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1E2128]">
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Domain</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Name</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Owner</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Plan</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Usage</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Status</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Expires</th>
                    <th className="text-right text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenants.map((tenant, i) => (
                    <tr
                      key={tenant.id}
                      className={cn(
                        'border-b border-[#3D434F50] transition-colors hover:bg-[#353942]',
                        i % 2 === 0 ? 'bg-[#21242B]' : 'bg-[#2B2F38]'
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium text-[#E8ECF1]">{tenant.domain}</span>
                          <button
                            onClick={() => copyDomain(tenant.domain, tenant.id)}
                            className="text-[#6B7280] hover:text-[#4488FF] transition-colors"
                          >
                            {copiedId === tenant.id ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-[13px] text-[#E8ECF1]">{tenant.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#4488FF] flex items-center justify-center text-[10px] font-bold text-white">
                            {tenant.owner[0].toUpperCase()}
                          </div>
                          <span className="text-[13px] text-[#E8ECF1]">{tenant.owner}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4"><PlanBadge plan={tenant.plan} /></td>
                      <td className="py-3 px-4 w-[160px]">
                        <div className="space-y-1">
                          <UsageBar used={tenant.usage.apis} max={tenant.quota.maxApis} color="#4488FF" />
                          <UsageBar used={tenant.usage.users} max={tenant.quota.maxUsers} color="#10B981" />
                          <UsageBar used={tenant.usage.applications} max={tenant.quota.maxApplications} color="#F59E0B" />
                        </div>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={tenant.status} /></td>
                      <td className="py-3 px-4 text-[13px] text-[#9DA5B4]">
                        {tenant.expiresAt ? formatDate(tenant.expiresAt) : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors" title="Configure">
                            <Settings className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEdit(tenant)} className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => { setDeleteTenant(tenant); setDeleteOpen(true); }} className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#EF444420] hover:text-[#EF4444] transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTenants.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Building2 className="w-12 h-12 text-[#3D434F] mb-3" />
                <p className="text-[16px] font-medium text-[#E8ECF1]">No tenants found</p>
                <p className="text-[13px] text-[#9DA5B4] mt-1">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TenantDrawer tenant={editTenant} open={drawerOpen} onOpenChange={setDrawerOpen} />
      <DeleteTenantDialog tenant={deleteTenant} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </Layout>
  );
}

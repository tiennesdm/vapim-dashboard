import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { mockThrottlingPolicies } from '@/lib/data';
import type { ThrottlingPolicy } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Plus, Download, Pencil, Trash2, Rocket, PauseCircle, Gauge, Zap
} from 'lucide-react';

// ---------- Helpers ----------

function formatLimit(policy: ThrottlingPolicy): string {
  return `${policy.defaultLimit.requestCount.toLocaleString()} req / ${policy.defaultLimit.unitTime} ${policy.defaultLimit.timeUnit}`;
}

function getLimitColor(policy: ThrottlingPolicy): string {
  const name = policy.name.toLowerCase();
  if (name.includes('unlimited')) return '#4488FF';
  if (name.includes('gold') || name.includes('premium') || name.includes('strict')) return '#F59E0B';
  return '#9DA5B4';
}

// ---------- Policy Editor Modal ----------

function PolicyEditorModal({
  policy, open, onOpenChange
}: { policy: ThrottlingPolicy | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const isCreate = !policy;
  const [form, setForm] = useState({
    name: '', displayName: '', description: '', type: 'subscription', requestCount: 1000, unitTime: 1, timeUnit: 'MIN', burstLimit: 50, stopOnQuota: true, billing: 'FREE'
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#E8ECF1]">{isCreate ? 'Create Throttling Policy' : 'Edit Policy'}</DialogTitle>
          <DialogDescription className="text-[#9DA5B4]">
            Configure rate limiting parameters for this policy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Name *</label>
              <Input
                placeholder="e.g. Gold"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Display Name</label>
              <Input
                placeholder="Gold Tier"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Description</label>
            <textarea
              placeholder="Describe this policy..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full h-16 bg-[#181A20] border border-[#3D434F] rounded-md px-3 py-2 text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30] resize-none"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Policy Type</label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger className={cn("bg-[#181A20] border-[#3D434F] text-[#E8ECF1]", !isCreate && "opacity-60")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                <SelectItem value="api">API Level</SelectItem>
                <SelectItem value="application">Application Level</SelectItem>
                <SelectItem value="subscription">Subscription Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-[#3D434F50] rounded-lg p-4 space-y-3">
            <h4 className="text-[13px] font-semibold text-[#E8ECF1]">Default Limit</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-[#9DA5B4] mb-1 block">Request Count</label>
                <Input
                  type="number"
                  value={form.requestCount}
                  onChange={(e) => setForm({ ...form, requestCount: parseInt(e.target.value) || 0 })}
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#9DA5B4] mb-1 block">Unit Time</label>
                <Input
                  type="number"
                  value={form.unitTime}
                  onChange={(e) => setForm({ ...form, unitTime: parseInt(e.target.value) || 0 })}
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#9DA5B4] mb-1 block">Time Unit</label>
                <Select value={form.timeUnit} onValueChange={(v) => setForm({ ...form, timeUnit: v })}>
                  <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                    <SelectItem value="MIN">MIN</SelectItem>
                    <SelectItem value="HOUR">HOUR</SelectItem>
                    <SelectItem value="DAY">DAY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Burst Limit</label>
              <Input
                type="number"
                placeholder="Optional"
                value={form.burstLimit}
                onChange={(e) => setForm({ ...form, burstLimit: parseInt(e.target.value) || 0 })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
              />
            </div>
          </div>

          <details className="border border-[#3D434F50] rounded-lg p-4">
            <summary className="text-[13px] font-medium text-[#9DA5B4] cursor-pointer hover:text-[#E8ECF1]">Advanced: Rate Limit</summary>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-[11px] text-[#9DA5B4] mb-1 block">Rate Limit Count</label>
                <Input type="number" className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]" />
              </div>
              <div>
                <label className="text-[11px] text-[#9DA5B4] mb-1 block">Time Unit</label>
                <Select>
                  <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                    <SelectItem value="MIN">MIN</SelectItem>
                    <SelectItem value="HOUR">HOUR</SelectItem>
                    <SelectItem value="DAY">DAY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </details>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-[13px] font-medium text-[#E8ECF1]">Stop on Quota Reach</p>
              <p className="text-[11px] text-[#6B7280]">Block requests when quota is exceeded</p>
            </div>
            <Switch checked={form.stopOnQuota} onCheckedChange={(v) => setForm({ ...form, stopOnQuota: v })} />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-2 block">Billing Plan</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="billing" value="FREE" checked={form.billing === 'FREE'} onChange={() => setForm({ ...form, billing: 'FREE' })} className="accent-[#4488FF]" />
                <span className="text-[13px] text-[#E8ECF1]">Free</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="billing" value="COMMERCIAL" checked={form.billing === 'COMMERCIAL'} onChange={() => setForm({ ...form, billing: 'COMMERCIAL' })} className="accent-[#4488FF]" />
                <span className="text-[13px] text-[#E8ECF1]">Commercial</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">Cancel</Button>
          <Button onClick={() => onOpenChange(false)} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]">
            {isCreate ? 'Save Policy' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Deploy Confirmation ----------

function DeployConfirmDialog({ policy, open, onOpenChange }: { policy: ThrottlingPolicy | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!policy) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#E8ECF1]">
            {policy.isDeployed ? 'Undeploy Policy' : 'Deploy Policy'}
          </DialogTitle>
          <DialogDescription className="text-[#9DA5B4]">
            {policy.isDeployed
              ? `Undeploying will remove "${policy.displayName}" from all APIs. The policy will become inactive.`
              : `Deploy "${policy.displayName}" to make it active immediately across all matching APIs.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">Cancel</Button>
          <Button
            onClick={() => onOpenChange(false)}
            className={policy.isDeployed ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]' : 'bg-[#10B981] text-white hover:bg-[#059669]'}
          >
            {policy.isDeployed ? (
              <><PauseCircle className="w-4 h-4 mr-1" /> Undeploy</>
            ) : (
              <><Rocket className="w-4 h-4 mr-1" /> Deploy</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Main Page ----------

export default function Throttling() {
  const [activeTab, setActiveTab] = useState('api');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editPolicy, setEditPolicy] = useState<ThrottlingPolicy | null>(null);
  const [deployPolicy, setDeployPolicy] = useState<ThrottlingPolicy | null>(null);
  const [deployOpen, setDeployOpen] = useState(false);

  const policies = useMemo(() => {
    return mockThrottlingPolicies.filter((p) => p.type === activeTab);
  }, [activeTab]);

  const counts = useMemo(() => ({
    api: mockThrottlingPolicies.filter((p) => p.type === 'api').length,
    application: mockThrottlingPolicies.filter((p) => p.type === 'application').length,
    subscription: mockThrottlingPolicies.filter((p) => p.type === 'subscription').length,
  }), []);

  const openEdit = (policy: ThrottlingPolicy) => {
    setEditPolicy(policy);
    setEditorOpen(true);
  };

  const openCreate = () => {
    setEditPolicy(null);
    setEditorOpen(true);
  };

  const openDeploy = (policy: ThrottlingPolicy) => {
    setDeployPolicy(policy);
    setDeployOpen(true);
  };

  return (
    <Layout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-6 animate-in fade-in duration-200">
          <div>
            <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-tight">Rate Limiting</h1>
            <p className="text-[13px] text-[#9DA5B4] mt-0.5">Configure throttling policies for API traffic control</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942] text-[13px]">
              <Download className="w-4 h-4 mr-1.5" /> Export CSV
            </Button>
            <Button onClick={openCreate} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF] text-[13px]">
              <Plus className="w-4 h-4 mr-1.5" /> Create Policy
            </Button>
          </div>
        </div>

        {/* Policy Type Tabs */}
        <div className="mb-6">
          <div className="border-b border-[#3D434F]">
            <div className="flex gap-0">
              {[
                { key: 'api', label: 'API Level', icon: Zap },
                { key: 'application', label: 'Application Level', icon: Gauge },
                { key: 'subscription', label: 'Subscription Level', icon: Rocket },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'relative flex items-center gap-2 px-5 py-3 text-[13px] font-medium transition-all duration-200',
                    activeTab === key ? 'text-[#F59E0B]' : 'text-[#9DA5B4] hover:text-[#E8ECF1]'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <span
                    className={cn(
                      'ml-1 px-1.5 py-0.5 rounded text-[10px] font-semibold',
                      activeTab === key ? 'bg-[#F59E0B20] text-[#F59E0B]' : 'bg-[#1E2128] text-[#6B7280]'
                    )}
                  >
                    {counts[key as keyof typeof counts]}
                  </span>
                  {activeTab === key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F59E0B]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Policies Table */}
        <Card className="bg-[#2B2F38] border-[#3D434F]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1E2128]">
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Policy Name</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Description</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Default Limit</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Burst Limit</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Billing</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Status</th>
                    <th className="text-right text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((policy, i) => (
                    <tr
                      key={policy.id}
                      className={cn(
                        'border-b border-[#3D434F50] transition-colors hover:bg-[#353942]',
                        i % 2 === 0 ? 'bg-[#21242B]' : 'bg-[#2B2F38]'
                      )}
                    >
                      <td className="py-3 px-4">
                        <p className="text-[14px] font-medium text-[#E8ECF1]">{policy.name}</p>
                        <p className="text-[12px] text-[#6B7280]">{policy.displayName}</p>
                      </td>
                      <td className="py-3 px-4 text-[13px] text-[#9DA5B4] max-w-[300px] truncate">{policy.description}</td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                          style={{ color: getLimitColor(policy), backgroundColor: getLimitColor(policy) + '20' }}
                        >
                          {formatLimit(policy)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[13px] text-[#E8ECF1]">
                        {policy.burstLimit > 0 ? policy.burstLimit.toLocaleString() : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase"
                          style={{
                            color: policy.billingPlan === 'FREE' ? '#10B981' : '#4488FF',
                            backgroundColor: (policy.billingPlan === 'FREE' ? '#10B981' : '#4488FF') + '20'
                          }}
                        >
                          {policy.billingPlan}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {policy.isDeployed ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-[#10B981] bg-[#10B98120]">
                            Deployed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold text-[#6B7280] bg-[#6B728020]">
                            Undeployed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(policy)} className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => openDeploy(policy)} className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors" title={policy.isDeployed ? 'Undeploy' : 'Deploy'}>
                            {policy.isDeployed ? <PauseCircle className="w-4 h-4 text-[#F59E0B]" /> : <Rocket className="w-4 h-4 text-[#10B981]" />}
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#EF444420] hover:text-[#EF4444] transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {policies.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Gauge className="w-12 h-12 text-[#3D434F] mb-3" />
                <p className="text-[16px] font-medium text-[#E8ECF1]">No policies found</p>
                <p className="text-[13px] text-[#9DA5B4] mt-1">Create a new policy to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PolicyEditorModal policy={editPolicy} open={editorOpen} onOpenChange={setEditorOpen} />
      <DeployConfirmDialog policy={deployPolicy} open={deployOpen} onOpenChange={setDeployOpen} />
    </Layout>
  );
}

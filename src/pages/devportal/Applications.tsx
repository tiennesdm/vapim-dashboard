import { useState, useCallback } from 'react';
import { mockApplications } from '@/lib/data';
import type { Application } from '@/lib/data';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Plus,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
  RefreshCw,
  Pencil,
  Trash2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function KeyRow({
  label,
  keyValue,
  env,
}: {
  label: string;
  keyValue: string;
  env: 'prod' | 'sandbox';
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [keyVal, setKeyVal] = useState(keyValue);
  const [spinning, setSpinning] = useState(false);

  const masked = keyVal.replace(/(?<=.{8})./g, '•');

  const handleCopy = () => {
    navigator.clipboard.writeText(keyVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setSpinning(true);
    setTimeout(() => {
      const prefix = env === 'prod' ? 'sk_prod_' : 'sk_sandbox_';
      const suffix = Math.random().toString(36).substring(2, 18);
      setKeyVal(`${prefix}${suffix}`);
      setSpinning(false);
    }, 500);
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-[11px] font-semibold text-[#6B7280] uppercase w-20 flex-shrink-0">
        {label}
      </span>
      <code className="flex-1 min-w-0 bg-[#181A20] rounded px-2 py-1 font-mono text-[12px] text-[#E8ECF1] truncate">
        {revealed ? keyVal : masked}
      </code>
      <button
        onClick={() => setRevealed(!revealed)}
        className="p-1.5 rounded hover:bg-[#353942] text-[#6B7280] hover:text-[#E8ECF1] transition-colors"
        title={revealed ? 'Hide' : 'Reveal'}
      >
        {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
      <button
        onClick={handleCopy}
        className="p-1.5 rounded hover:bg-[#353942] text-[#6B7280] hover:text-[#E8ECF1] transition-colors"
        title="Copy"
      >
        {copied ? <CheckCheck size={13} className="text-[#10B981]" /> : <Copy size={13} />}
      </button>
      <button
        onClick={handleRegenerate}
        className="p-1.5 rounded hover:bg-[#353942] text-[#6B7280] hover:text-[#E8ECF1] transition-colors"
        title="Regenerate"
      >
        <RefreshCw size={13} className={spinning ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status Badge                                                      */
/* ------------------------------------------------------------------ */

function AppStatusBadge({ status }: { status: Application['status'] }) {
  const config = {
    ACTIVE: { bg: '#10B98120', text: '#10B981', border: '#10B98140' },
    INACTIVE: { bg: '#6B728020', text: '#6B7280', border: '#6B728040' },
    REJECTED: { bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
  };
  const c = config[status];
  return (
    <Badge
      variant="outline"
      className="text-[11px] font-semibold uppercase"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {status}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Application Card                                                  */
/* ------------------------------------------------------------------ */

function ApplicationCard({
  app,
  onEdit,
  onDelete,
}: {
  app: Application;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}) {
  const quotaPct = app.quota > 0 ? Math.round((app.usedQuota / app.quota) * 100) : 0;

  return (
    <div className="bg-[#2B2F38] border border-[#3D434F] rounded-[10px] p-5 transition-all hover:border-[#10B98130] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[16px] font-bold text-[#E8ECF1] truncate">{app.name}</h3>
        <AppStatusBadge status={app.status} />
      </div>

      {/* Description */}
      <p className="text-[13px] text-[#9DA5B4] line-clamp-2 mb-3 min-h-[2.4em]">
        {app.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#6B7280] mb-3">
        {app.groupId && <span>Group: {app.groupId}</span>}
        <span>Token: {app.tokenType}</span>
        <span>
          Quota: {app.usedQuota.toLocaleString()}/{app.quota.toLocaleString()}
        </span>
      </div>

      {/* Quota bar */}
      {app.quota > 0 && (
        <div className="w-full h-1 bg-[#3D434F] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[#10B981] rounded-full transition-all duration-600"
            style={{ width: `${Math.min(quotaPct, 100)}%` }}
          />
        </div>
      )}

      {/* Keys */}
      <div className="border-t border-[#3D434F50] pt-4 mb-4">
        <h4 className="text-[14px] font-semibold text-[#E8ECF1] mb-3">API Keys</h4>
        <KeyRow label="Production" keyValue={app.productionKey} env="prod" />
        <KeyRow label="Sandbox" keyValue={app.sandboxKey} env="sandbox" />
      </div>

      {/* Callback URL */}
      {app.callbackUrl && (
        <div className="mb-3">
          <span className="text-[11px] text-[#6B7280] uppercase">Callback URL</span>
          <p className="text-[12px] text-[#4488FF] font-mono truncate">{app.callbackUrl}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#3D434F50]">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-[12px] text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]"
          onClick={() => onEdit(app)}
        >
          <Pencil size={13} className="mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-[12px] text-[#9DA5B4] hover:text-[#EF4444] hover:bg-[#EF444420]"
          onClick={() => onDelete(app)}
        >
          <Trash2 size={13} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create/Edit Modal                                                 */
/* ------------------------------------------------------------------ */

function ApplicationModal({
  open,
  onClose,
  onSave,
  editApp,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Application>) => void;
  editApp: Application | null;
}) {
  const [name, setName] = useState(editApp?.name || '');
  const [description, setDescription] = useState(editApp?.description || '');
  const [tokenType, setTokenType] = useState<'JWT' | 'OAUTH'>(editApp?.tokenType || 'JWT');
  const [callbackUrl, setCallbackUrl] = useState(editApp?.callbackUrl || '');
  const [groupId, setGroupId] = useState(editApp?.groupId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, tokenType, callbackUrl: callbackUrl || undefined, groupId: groupId || undefined });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-bold text-[#E8ECF1]">
            {editApp ? 'Edit Application' : 'Create New Application'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label className="text-[13px] text-[#E8ECF1]">
              Name <span className="text-[#EF4444]">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Application name"
              required
              minLength={3}
              maxLength={50}
              className="mt-1 h-9 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1]"
            />
          </div>
          <div>
            <Label className="text-[13px] text-[#E8ECF1]">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your application..."
              rows={3}
              maxLength={500}
              className="mt-1 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] resize-none"
            />
          </div>
          <div>
            <Label className="text-[13px] text-[#E8ECF1] mb-2 block">Token Type</Label>
            <RadioGroup value={tokenType} onValueChange={(v) => setTokenType(v as 'JWT' | 'OAUTH')} className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="JWT" id="jwt" className="border-[#3D434F]" />
                <Label htmlFor="jwt" className="text-[13px] text-[#9DA5B4] cursor-pointer">
                  JWT
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="OAUTH" id="oauth" className="border-[#3D434F]" />
                <Label htmlFor="oauth" className="text-[13px] text-[#9DA5B4] cursor-pointer">
                  OAuth
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="text-[13px] text-[#E8ECF1]">Callback URL</Label>
            <Input
              value={callbackUrl}
              onChange={(e) => setCallbackUrl(e.target.value)}
              placeholder="https://your-app.com/callback"
              className="mt-1 h-9 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1]"
            />
          </div>
          <div>
            <Label className="text-[13px] text-[#E8ECF1]">Group ID</Label>
            <Input
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="Optional group identifier"
              className="mt-1 h-9 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 text-[13px] border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9 text-[13px] bg-[#10B981] hover:bg-[#059669] text-white"
            >
              {editApp ? 'Save Changes' : 'Create Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation                                               */
/* ------------------------------------------------------------------ */

function DeleteDialog({
  open,
  app,
  onClose,
  onConfirm,
}: {
  open: boolean;
  app: Application | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-bold text-[#E8ECF1] flex items-center gap-2">
            <Trash2 size={20} className="text-[#EF4444]" />
            Delete {app?.name}?
          </DialogTitle>
        </DialogHeader>
        <p className="text-[13px] text-[#9DA5B4] mt-2">
          This will revoke all API keys and cancel all subscriptions. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 text-[13px] border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="h-9 text-[13px] bg-[#EF4444] hover:bg-[#DC2626] text-white"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */

export default function Applications() {
  const [apps, setApps] = useState<Application[]>(mockApplications);
  const [modalOpen, setModalOpen] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [deleteApp, setDeleteApp] = useState<Application | null>(null);

  const handleCreate = useCallback(() => {
    setEditApp(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((app: Application) => {
    setEditApp(app);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(
    (data: Partial<Application>) => {
      if (editApp) {
        setApps((prev) =>
          prev.map((a) => (a.id === editApp.id ? { ...a, ...data } : a))
        );
      } else {
        const newApp: Application = {
          id: `app-${Date.now()}`,
          name: data.name || 'New Application',
          description: data.description || '',
          owner: 'developer@vedadb.io',
          status: 'ACTIVE',
          productionKey: `sk_prod_${Math.random().toString(36).substring(2, 18)}`,
          sandboxKey: `sk_sandbox_${Math.random().toString(36).substring(2, 18)}`,
          tokenType: data.tokenType || 'JWT',
          callbackUrl: data.callbackUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          groupId: data.groupId,
          quota: 10000,
          usedQuota: 0,
        };
        setApps((prev) => [newApp, ...prev]);
      }
    },
    [editApp]
  );

  const handleDelete = useCallback(() => {
    if (deleteApp) {
      setApps((prev) => prev.filter((a) => a.id !== deleteApp.id));
      setDeleteApp(null);
    }
  }, [deleteApp]);

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#E8ECF1]">My Applications</h1>
          <p className="text-[13px] text-[#9DA5B4]">
            Manage your applications and API keys
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="h-9 text-[13px] bg-[#10B981] hover:bg-[#059669] text-white"
        >
          <Plus size={14} className="mr-1.5" />
          Create Application
        </Button>
      </div>

      {/* Applications Grid */}
      {apps.length > 0 ? (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          }}
        >
          {apps.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onEdit={handleEdit}
              onDelete={setDeleteApp}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16">
          <img
            src="/empty-state-apis.svg"
            alt="No applications"
            className="w-[240px] h-[180px] mb-4 opacity-60"
          />
          <h3 className="text-[16px] font-bold text-[#E8ECF1] mb-1">
            No applications yet
          </h3>
          <p className="text-[13px] text-[#9DA5B4] mb-4 text-center max-w-md">
            Create your first application to start subscribing to APIs
          </p>
          <Button
            onClick={handleCreate}
            className="h-9 text-[13px] bg-[#10B981] hover:bg-[#059669] text-white"
          >
            <Plus size={14} className="mr-1.5" />
            Create Application
          </Button>
        </div>
      )}

      {/* Modals */}
      <ApplicationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        editApp={editApp}
      />
      <DeleteDialog
        open={!!deleteApp}
        app={deleteApp}
        onClose={() => setDeleteApp(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import MethodBadge from '@/components/MethodBadge';
import {
  ArrowLeft,
  FileText,
  UploadCloud,
  Layers,
  Settings,
  CheckCircle,
  ChevronRight,
  Globe,
  Lock,
  Shield,
  Zap,
  Bell,
  Server,
  FileCode,
  Link,
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  Star,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { APIResource } from '@/lib/data';

// ===== Types =====
interface WizardData {
  name: string;
  context: string;
  version: string;
  description: string;
  provider: string;
  type: 'REST' | 'GRAPHQL' | 'WEBSOCKET' | 'WEBHOOK' | 'GRPC' | 'SOAP';
  visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  importMethod: 'openapi' | 'scratch' | null;
  resources: APIResource[];
  productionUrl: string;
  sandboxUrl: string;
  enableCors: boolean;
  tags: string[];
}

const initialWizardData: WizardData = {
  name: '',
  context: '',
  version: 'v1.0.0',
  description: '',
  provider: '',
  type: 'REST',
  visibility: 'PUBLIC',
  importMethod: null,
  resources: [],
  productionUrl: '',
  sandboxUrl: '',
  enableCors: false,
  tags: [],
};

const steps = [
  { id: 1, label: 'API Definition', icon: FileText },
  { id: 2, label: 'Import / Build', icon: UploadCloud },
  { id: 3, label: 'Resources', icon: Layers },
  { id: 4, label: 'Configuration', icon: Settings },
  { id: 5, label: 'Review & Create', icon: CheckCircle },
];

const apiTypes = [
  { value: 'REST' as const, label: 'REST', icon: Globe },
  { value: 'GRAPHQL' as const, label: 'GraphQL', icon: Zap },
  { value: 'WEBSOCKET' as const, label: 'WebSocket', icon: Zap },
  { value: 'WEBHOOK' as const, label: 'Webhook', icon: Bell },
  { value: 'GRPC' as const, label: 'gRPC', icon: Server },
  { value: 'SOAP' as const, label: 'SOAP', icon: FileCode },
];

const visibilityOptions = [
  { value: 'PUBLIC' as const, label: 'PUBLIC', desc: 'Available to all developers', icon: Globe, color: '#10B981' },
  { value: 'PRIVATE' as const, label: 'PRIVATE', desc: 'Only visible to your organization', icon: Lock, color: '#6B7280' },
  { value: 'RESTRICTED' as const, label: 'RESTRICTED', desc: 'Visible to specific roles', icon: Shield, color: '#F59E0B' },
];

// ===== Helper Components =====

function Stepper({ currentStep, completedSteps }: { currentStep: number; completedSteps: Set<number> }) {
  return (
    <div className="flex items-center justify-center max-w-[800px] mx-auto mb-8">
      {steps.map((step, idx) => {
        const isCompleted = completedSteps.has(step.id);
        const isActive = currentStep === step.id;
        const Icon = step.icon;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              {/* Step circle */}
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                  isCompleted && 'bg-[#10B981] text-white',
                  isActive && 'bg-[#4488FF] text-white ring-[3px] ring-[#4488FF30]',
                  !isCompleted && !isActive && 'bg-[#3D434F] text-[#6B7280]'
                )}
                style={isActive ? { animation: 'pulse 2s ease-in-out infinite' } : undefined}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              {/* Label */}
              <span
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-[0.04em]',
                  isCompleted && 'text-[#10B981]',
                  isActive && 'text-[#4488FF]',
                  !isCompleted && !isActive && 'text-[#6B7280]'
                )}
              >
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[1px] mx-3 mb-5">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    isCompleted ? 'bg-[#10B981]' : 'bg-[#3D434F]'
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ===== Step 1: API Definition =====
function StepDefinition({ data, onChange, errors }: {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex gap-8">
        {/* Left column (60%) */}
        <div className="flex-[60] space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-[#E8ECF1] mb-1.5">
              API Name <span className="text-[#EF4444]">*</span>
            </label>
            <Input
              placeholder="e.g., Payment Processing API"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={cn(
                'bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]',
                errors.name && 'border-[#EF4444] focus:ring-[#EF444430]'
              )}
            />
            {errors.name && <p className="text-[11px] text-[#EF4444] mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#E8ECF1] mb-1.5">
              Context Path <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] text-[14px]">/</span>
              <Input
                placeholder="payments"
                value={data.context}
                onChange={(e) => onChange({ context: e.target.value.replace(/\s/g, '').toLowerCase() })}
                className={cn(
                  'pl-6 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]',
                  errors.context && 'border-[#EF4444] focus:ring-[#EF444430]'
                )}
              />
            </div>
            {errors.context && <p className="text-[11px] text-[#EF4444] mt-1">{errors.context}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#E8ECF1] mb-1.5">
              Version <span className="text-[#EF4444]">*</span>
            </label>
            <Input
              placeholder="v1.0.0"
              value={data.version}
              onChange={(e) => onChange({ version: e.target.value })}
              className={cn(
                'bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]',
                errors.version && 'border-[#EF4444] focus:ring-[#EF444430]'
              )}
            />
            {errors.version && <p className="text-[11px] text-[#EF4444] mt-1">{errors.version}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#E8ECF1] mb-1.5">Description</label>
            <Textarea
              rows={4}
              placeholder="Describe what this API does..."
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value.slice(0, 500) })}
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] resize-none"
            />
            <p className="text-[11px] text-[#6B7280] mt-1 text-right">{data.description.length}/500</p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#E8ECF1] mb-1.5">Provider</label>
            <Input
              placeholder="Your team or organization name"
              value={data.provider}
              onChange={(e) => onChange({ provider: e.target.value })}
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
            />
          </div>
        </div>

        {/* Right column (40%) */}
        <div className="flex-[40] space-y-6">
          <div>
            <label className="block text-[13px] font-medium text-[#E8ECF1] mb-3">Protocol / Type</label>
            <div className="grid grid-cols-2 gap-2">
              {apiTypes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => onChange({ type: t.value })}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-3 rounded-lg border text-[12px] font-medium transition-all duration-150',
                      data.type === t.value
                        ? 'border-[#4488FF] bg-[#1E3A5F] text-[#4488FF]'
                        : 'border-[#3D434F] bg-[#2B2F38] text-[#9DA5B4] hover:bg-[#353942]'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#E8ECF1] mb-3">Visibility</label>
            <div className="space-y-2">
              {visibilityOptions.map((v) => {
                const Icon = v.icon;
                return (
                  <button
                    key={v.value}
                    onClick={() => onChange({ visibility: v.value })}
                    className={cn(
                      'flex items-center gap-3 w-full p-3 rounded-lg border text-left transition-all duration-150',
                      data.visibility === v.value
                        ? 'border-[#4488FF] bg-[#1E3A5F]'
                        : 'border-[#3D434F] bg-[#2B2F38] hover:bg-[#353942]'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: v.color }} />
                    <div>
                      <div className={cn('text-[12px] font-semibold', data.visibility === v.value ? 'text-[#4488FF]' : 'text-[#E8ECF1]')}>       
                        {v.label}
                      </div>
                      <div className="text-[11px] text-[#9DA5B4]">{v.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Step 2: Import / Build =====
function StepImportBuild({ data, onChange }: {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="grid grid-cols-2 gap-6">
        {/* Option A: Import OpenAPI */}
        <div
          className={cn(
            'bg-[#2B2F38] border rounded-xl p-8 transition-all duration-200 cursor-pointer',
            data.importMethod === 'openapi'
              ? 'border-[#4488FF] ring-2 ring-[#4488FF30]'
              : 'border-[#3D434F] hover:border-[#4488FF40]'
          )}
          onClick={() => onChange({ importMethod: 'openapi' })}
        >
          <UploadCloud className="w-12 h-12 text-[#4488FF] mb-4" />
          <h3 className="text-[16px] font-bold text-[#E8ECF1] mb-2">Import OpenAPI Specification</h3>
          <p className="text-[13px] text-[#9DA5B4] mb-5">
            Upload an existing OpenAPI 2.0/3.0 spec (YAML or JSON). We&apos;ll auto-generate all resources, models, and documentation.
          </p>

          {/* Drag-drop zone */}
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
              isDragging
                ? 'border-[#4488FF] bg-[#1E3A5F20]'
                : 'border-[#3D434F] bg-[#181A20]'
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          >
            <UploadCloud className="w-8 h-8 text-[#6B7280] mx-auto mb-2" />
            <p className="text-[14px] text-[#E8ECF1]">Drag &amp; drop your spec file here</p>
            <p className="text-[13px] text-[#4488FF] mt-1">or click to browse</p>
            <p className="text-[12px] text-[#6B7280] mt-2">Supports .yaml, .yml, .json (max 5MB)</p>
          </div>

          {/* OR separator */}
          <div className="flex items-center gap-3 my-4">
            <Separator className="flex-1 bg-[#3D434F]" />
            <span className="text-[12px] text-[#6B7280] font-medium">OR</span>
            <Separator className="flex-1 bg-[#3D434F]" />
          </div>

          {/* URL input */}
          <div className="relative">
            <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <Input
              placeholder="https://petstore.swagger.io/v2/swagger.json"
              className="pl-9 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
          >
            Fetch from URL
          </Button>
        </div>

        {/* Option B: Build from Scratch */}
        <div
          className={cn(
            'bg-[#2B2F38] border rounded-xl p-8 transition-all duration-200 cursor-pointer',
            data.importMethod === 'scratch'
              ? 'border-[#10B981] ring-2 ring-[#10B98130]'
              : 'border-[#3D434F] hover:border-[#10B98140]'
          )}
          onClick={() => onChange({ importMethod: 'scratch' })}
        >
          <Layers className="w-12 h-12 text-[#10B981] mb-4" />
          <h3 className="text-[16px] font-bold text-[#E8ECF1] mb-2">Build Resources Manually</h3>
          <p className="text-[13px] text-[#9DA5B4] mb-5">
            Start with an empty API and manually define each resource, method, parameter, and response. Full control over every detail.
          </p>
          <div className="flex items-center justify-center h-[180px] bg-[#181A20] rounded-lg border border-[#3D434F]">
            <div className="text-center">
              <Plus className="w-10 h-10 text-[#6B7280] mx-auto mb-2" />
              <p className="text-[13px] text-[#9DA5B4]">Define resources one by one</p>
              <p className="text-[12px] text-[#6B7280] mt-1">Full control over schema</p>
            </div>
          </div>
          <Button
            size="sm"
            className="mt-4 w-full bg-[#10B981] hover:bg-[#059669] text-white"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ importMethod: 'scratch' });
            }}
          >
            Start Building
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== Step 3: Resources =====
function StepResources({ data, onChange }: {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}) {
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editingResource, setEditingResource] = useState<APIResource | null>(null);

  const resources = data.resources;
  const filtered = search
    ? resources.filter((r) => r.path.toLowerCase().includes(search.toLowerCase()) || r.summary.toLowerCase().includes(search.toLowerCase()))
    : resources;

  const addResource = () => {
    const newRes: APIResource = {
      id: `r${Date.now()}`,
      path: '/new-endpoint',
      method: 'GET',
      summary: 'New endpoint',
      description: '',
      parameters: [],
      authType: 'OAuth2',
      throttlingTier: 'Unlimited',
      scope: '',
    };
    onChange({ resources: [newRes, ...resources] });
    setSelectedResourceId(newRes.id);
    setEditingResource(newRes);
  };

  const updateResource = (updated: APIResource) => {
    onChange({
      resources: resources.map((r) => (r.id === updated.id ? updated : r)),
    });
    setEditingResource(updated);
  };

  const deleteResource = (id: string) => {
    onChange({ resources: resources.filter((r) => r.id !== id) });
    if (selectedResourceId === id) {
      setSelectedResourceId(null);
      setEditingResource(null);
    }
  };

  const selectedResource = resources.find((r) => r.id === selectedResourceId) || null;

  return (
    <div className="flex gap-4 h-[550px]">
      {/* Left: Resource list */}
      <div className="w-[35%] flex flex-col bg-[#2B2F38] rounded-lg border border-[#3D434F]">
        <div className="flex items-center justify-between p-3 border-b border-[#3D434F]">
          <span className="text-[13px] font-semibold text-[#E8ECF1]">Resources</span>
          <Button size="sm" className="h-7 bg-[#4488FF] hover:bg-[#5A9AFF] text-white text-[12px]" onClick={addResource}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        </div>
        <div className="p-2 border-b border-[#3D434F]">
          <Input
            placeholder="Filter resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] text-[12px]"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Layers className="w-8 h-8 text-[#3D434F] mb-2" />
              <p className="text-[12px] text-[#9DA5B4]">No resources yet.</p>
              <p className="text-[11px] text-[#6B7280]">Add your first endpoint.</p>
            </div>
          ) : (
            filtered.map((r) => (
              <div
                key={r.id}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 border-b border-[#3D434F50] cursor-pointer transition-colors',
                  selectedResourceId === r.id
                    ? 'bg-[#1E3A5F] border-l-[3px] border-l-[#4488FF]'
                    : 'hover:bg-[#353942] border-l-[3px] border-l-transparent'
                )}
                onClick={() => {
                  setSelectedResourceId(r.id);
                  setEditingResource({ ...r });
                }}
              >
                <GripVertical className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0 cursor-grab" />
                <MethodBadge method={r.method} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#E8ECF1] font-mono truncate">{r.path}</p>
                  <p className="text-[11px] text-[#9DA5B4] truncate">{r.summary}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteResource(r.id); }}
                  className="text-[#6B7280] hover:text-[#EF4444] transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Resource editor */}
      <div className="flex-[65] bg-[#2B2F38] rounded-lg border border-[#3D434F] overflow-hidden">
        {editingResource ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-3 p-3 border-b border-[#3D434F]">
              <MethodBadge method={editingResource.method} />
              <Input
                value={editingResource.path}
                onChange={(e) => updateResource({ ...editingResource, path: e.target.value })}
                className="flex-1 h-8 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] font-mono text-[13px]"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Method</label>
                <select
                  value={editingResource.method}
                  onChange={(e) => updateResource({ ...editingResource, method: e.target.value as APIResource['method'] })}
                  className="w-full h-9 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] px-3"
                >
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Summary</label>
                <Input
                  value={editingResource.summary}
                  onChange={(e) => updateResource({ ...editingResource, summary: e.target.value })}
                  placeholder="Brief description of what this endpoint does"
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Description</label>
                <Textarea
                  value={editingResource.description}
                  onChange={(e) => updateResource({ ...editingResource, description: e.target.value })}
                  rows={3}
                  placeholder="Detailed description..."
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Auth Type</label>
                  <select
                    value={editingResource.authType}
                    onChange={(e) => updateResource({ ...editingResource, authType: e.target.value as APIResource['authType'] })}
                    className="w-full h-9 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] px-3"
                  >
                    <option value="OAuth2">OAuth 2.0</option>
                    <option value="APIKey">API Key</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Throttling Tier</label>
                  <select
                    value={editingResource.throttlingTier}
                    onChange={(e) => updateResource({ ...editingResource, throttlingTier: e.target.value })}
                    className="w-full h-9 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] px-3"
                  >
                    {['Unlimited', 'Gold', 'Silver', 'Bronze'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Layers className="w-10 h-10 text-[#3D434F] mb-3" />
            <p className="text-[14px] text-[#9DA5B4]">Select a resource to edit</p>
            <p className="text-[12px] text-[#6B7280] mt-1">or add a new resource to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Step 4: Configuration =====
function StepConfiguration({ data, onChange }: {
  data: WizardData;
  onChange: (d: Partial<WizardData>) => void;
}) {
  const [tagInput, setTagInput] = useState('');

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      onChange({ tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    onChange({ tags: data.tags.filter((t) => t !== tag) });
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      {/* Endpoint Configuration */}
      <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
        <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-4">Endpoint Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Production URL <span className="text-[#EF4444]">*</span></label>
            <Input
              placeholder="https://api.example.com/v1"
              value={data.productionUrl}
              onChange={(e) => onChange({ productionUrl: e.target.value })}
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Sandbox URL</label>
            <Input
              placeholder="https://sandbox-api.example.com/v1"
              value={data.sandboxUrl}
              onChange={(e) => onChange({ sandboxUrl: e.target.value })}
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
            />
          </div>
        </div>
      </div>

      {/* CORS Configuration */}
      <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-semibold text-[#E8ECF1]">CORS Configuration</h3>
          <Switch
            checked={data.enableCors}
            onCheckedChange={(checked) => onChange({ enableCors: checked })}
          />
        </div>
        {data.enableCors && (
          <div className="space-y-3">
            <div>
              <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Allow Origins</label>
              <Input
                placeholder="* or comma-separated origins"
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Allow Methods</label>
              <div className="flex flex-wrap gap-2">
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].map((m) => (
                  <label key={m} className="flex items-center gap-1.5 text-[12px] text-[#9DA5B4] cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded border-[#3D434F] bg-[#181A20]" />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
        <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-4">Tags</h3>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={addTag}
            className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
          >
            Add
          </Button>
        </div>
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[12px] bg-[#3D434F40] text-[#9DA5B4]"
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-[#EF4444]">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Step 5: Review & Create =====
function StepReview({ data }: { data: WizardData }) {
  return (
    <div className="max-w-[900px] mx-auto">
      <div className="flex gap-6">
        {/* Left: Summary */}
        <div className="flex-[60] space-y-4">
          {/* API Info */}
          <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#E8ECF1]">API Information</h3>
              <Check className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div><span className="text-[#6B7280]">Name:</span> <span className="text-[#E8ECF1]">{data.name || '-'}</span></div>
              <div><span className="text-[#6B7280]">Version:</span> <span className="text-[#E8ECF1]">{data.version}</span></div>
              <div><span className="text-[#6B7280]">Context:</span> <span className="text-[#E8ECF1] font-mono">/{data.context}</span></div>
              <div><span className="text-[#6B7280]">Type:</span> <span className="text-[#E8ECF1]">{data.type}</span></div>
              <div><span className="text-[#6B7280]">Visibility:</span> <StatusBadge status={data.visibility} /></div>
              <div><span className="text-[#6B7280]">Provider:</span> <span className="text-[#E8ECF1]">{data.provider || '-'}</span></div>
            </div>
            {data.description && (
              <p className="mt-3 text-[12px] text-[#9DA5B4]">{data.description}</p>
            )}
          </div>

          {/* Resources */}
          <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#E8ECF1]">Resources</h3>
              <Check className="w-4 h-4 text-[#10B981]" />
            </div>
            <p className="text-[13px] text-[#9DA5B4] mb-2">{data.resources.length} endpoint(s) defined</p>
            {data.resources.length > 0 && (
              <div className="space-y-1.5">
                {data.resources.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 text-[12px]">
                    <MethodBadge method={r.method} />
                    <span className="text-[#E8ECF1] font-mono">{r.path}</span>
                    <span className="text-[#9DA5B4]">— {r.summary}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Endpoints */}
          <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-semibold text-[#E8ECF1]">Endpoints</h3>
              <Check className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="space-y-2 text-[13px]">
              {data.productionUrl && (
                <div><span className="text-[#6B7280]">Production:</span> <span className="text-[#4488FF] font-mono">{data.productionUrl}</span></div>
              )}
              {data.sandboxUrl && (
                <div><span className="text-[#6B7280]">Sandbox:</span> <span className="text-[#4488FF] font-mono">{data.sandboxUrl}</span></div>
              )}
              {!data.productionUrl && !data.sandboxUrl && (
                <p className="text-[#9DA5B4]">No endpoints configured</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {data.tags.length > 0 && (
            <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
              <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[12px] bg-[#3D434F40] text-[#9DA5B4]">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Preview Card */}
        <div className="flex-[40]">
          <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5 sticky top-4">
            <h3 className="text-[13px] font-semibold text-[#9DA5B4] mb-3 uppercase tracking-wider">Preview</h3>
            <div className="border border-[#3D434F] rounded-lg p-4 bg-[#21242B]">
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status="CREATED" />
                <span className="text-[11px] text-[#6B7280]">{data.type}</span>
              </div>
              <h4 className="text-[14px] font-bold text-[#E8ECF1] mb-1">{data.name || 'Untitled API'}</h4>
              <p className="text-[11px] text-[#6B7280] mb-2">{data.version}</p>
              <p className="text-[12px] text-[#9DA5B4] mb-3 line-clamp-2">{data.description || 'No description'}</p>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 text-[#3D434F]" />
                ))}
                <span className="text-[11px] text-[#6B7280] ml-1">0 reviews</span>
              </div>
              {data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {data.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-[#3D434F40] text-[#9DA5B4]">{tag}</span>
                  ))}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-[#3D434F50]">
                <span className="text-[11px] text-[#6B7280] font-mono">/{data.context}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function APICreate() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [data, setData] = useState<WizardData>(initialWizardData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);

  // Restore from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vapim:api-create:draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed.data }));
        setCurrentStep(parsed.currentStep || 1);
        setCompletedSteps(new Set(parsed.completedSteps || []));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vapim:api-create:draft', JSON.stringify({
      data,
      currentStep,
      completedSteps: Array.from(completedSteps),
    }));
  }, [data, currentStep, completedSteps]);

  const updateData = useCallback((partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!data.name.trim() || data.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
      else if (data.name.length > 50) newErrors.name = 'Name must be at most 50 characters';
      if (!data.context.trim()) newErrors.context = 'Context path is required';
      if (!data.version.trim()) newErrors.version = 'Version is required';
    }
    if (step === 2) {
      if (!data.importMethod) newErrors.importMethod = 'Please select an option';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      localStorage.removeItem('vapim:api-create:draft');
      navigate('/publisher/apis/1');
    }, 1500);
  };

  const canClickStep = (stepId: number) => {
    return stepId <= currentStep || completedSteps.has(stepId);
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6 animate-[fadeIn_200ms_ease-out]">
        <button
          onClick={() => navigate('/publisher/apis')}
          className="flex items-center gap-1.5 text-[13px] text-[#9DA5B4] hover:text-[#E8ECF1] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          APIs
        </button>
        <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-tight">Create API</h1>
        <p className="text-[13px] text-[#9DA5B4] mt-1">Define your API specification step by step</p>
      </div>

      {/* Stepper */}
      <Stepper currentStep={currentStep} completedSteps={completedSteps} />

      {/* Step Content */}
      <div className="min-h-[400px] animate-[fadeIn_200ms_ease-out]">
        {currentStep === 1 && <StepDefinition data={data} onChange={updateData} errors={errors} />}
        {currentStep === 2 && <StepImportBuild data={data} onChange={updateData} />}
        {currentStep === 3 && <StepResources data={data} onChange={updateData} />}
        {currentStep === 4 && <StepConfiguration data={data} onChange={updateData} />}
        {currentStep === 5 && <StepReview data={data} />}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#3D434F]">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentStep === 1}
          className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942] disabled:opacity-40"
        >
          Back
        </Button>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => canClickStep(s.id) && setCurrentStep(s.id)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                currentStep === s.id ? 'bg-[#4488FF] w-4' : completedSteps.has(s.id) ? 'bg-[#10B981]' : 'bg-[#3D434F]',
                canClickStep(s.id) && 'cursor-pointer'
              )}
            />
          ))}
        </div>

        {currentStep < 5 ? (
          <Button
            onClick={goNext}
            className="bg-[#4488FF] hover:bg-[#5A9AFF] text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-[#4488FF] hover:bg-[#5A9AFF] text-white min-w-[140px]"
          >
            {isCreating ? (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4 animate-spin" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Create API
              </span>
            )}
          </Button>
        )}
      </div>
    </Layout>
  );
}

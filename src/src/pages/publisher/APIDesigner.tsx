import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import MethodBadge from '@/components/MethodBadge';
import {
  ArrowLeft,
  Save,
  Rocket,
  Plus,
  Upload,
  Download,
  Search,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Copy,
  Trash2,
  Layers,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { getAPIById } from '@/lib/data';
import type { API, APIResource } from '@/lib/data';

// ===== Extended Resource for Designer =====
interface DesignerResource extends APIResource {
  isExpanded: boolean;
  isDirty: boolean;
}

// ===== Mock initial resources =====
const mockResources: DesignerResource[] = [
  { id: 'r1', path: '/payments', method: 'POST', summary: 'Create a new payment', description: 'Process a payment transaction with full validation and fraud checks.', parameters: [{ name: 'amount', in: 'body', required: true, type: 'number' }, { name: 'currency', in: 'body', required: true, type: 'string' }], authType: 'OAuth2', throttlingTier: 'Gold', scope: 'payments:write', isExpanded: false, isDirty: false },
  { id: 'r2', path: '/payments', method: 'GET', summary: 'List all payments', description: 'Retrieve paginated payment history with filtering options.', parameters: [{ name: 'page', in: 'query', required: false, type: 'number' }, { name: 'limit', in: 'query', required: false, type: 'number' }], authType: 'OAuth2', throttlingTier: 'Silver', scope: 'payments:read', isExpanded: false, isDirty: false },
  { id: 'r3', path: '/payments/{id}', method: 'GET', summary: 'Get payment by ID', description: 'Retrieve a single payment transaction by its unique identifier.', parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }], authType: 'OAuth2', throttlingTier: 'Gold', scope: 'payments:read', isExpanded: false, isDirty: false },
  { id: 'r4', path: '/payments/{id}', method: 'PUT', summary: 'Update payment', description: 'Update an existing payment record with new information.', parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }], authType: 'OAuth2', throttlingTier: 'Gold', scope: 'payments:write', isExpanded: false, isDirty: false },
  { id: 'r5', path: '/payments/{id}', method: 'DELETE', summary: 'Cancel payment', description: 'Cancel a pending or authorized payment transaction.', parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }], authType: 'OAuth2', throttlingTier: 'Bronze', scope: 'payments:delete', isExpanded: false, isDirty: false },
  { id: 'r6', path: '/payments/{id}/refund', method: 'POST', summary: 'Refund payment', description: 'Process a full or partial refund for a completed payment.', parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }, { name: 'amount', in: 'body', required: false, type: 'number' }], authType: 'OAuth2', throttlingTier: 'Gold', scope: 'payments:refund', isExpanded: false, isDirty: false },
  { id: 'r7', path: '/payments/methods', method: 'GET', summary: 'List payment methods', description: 'Get available payment methods for the current merchant.', parameters: [], authType: 'APIKey', throttlingTier: 'Unlimited', scope: 'payments:read', isExpanded: false, isDirty: false },
  { id: 'r8', path: '/payments/methods/{id}', method: 'GET', summary: 'Get payment method', description: 'Get details of a specific payment method configuration.', parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }], authType: 'APIKey', throttlingTier: 'Unlimited', scope: 'payments:read', isExpanded: false, isDirty: false },
  { id: 'r9', path: '/payments/webhook', method: 'POST', summary: 'Webhook callback', description: 'Receive asynchronous payment provider webhooks.', parameters: [{ name: 'event', in: 'body', required: true, type: 'object' }], authType: 'None', throttlingTier: 'Unlimited', scope: '', isExpanded: false, isDirty: false },
  { id: 'r10', path: '/payments/reports', method: 'GET', summary: 'Payment reports', description: 'Generate payment analytics and reconciliation reports.', parameters: [{ name: 'from', in: 'query', required: true, type: 'string' }, { name: 'to', in: 'query', required: true, type: 'string' }], authType: 'OAuth2', throttlingTier: 'Silver', scope: 'payments:read', isExpanded: false, isDirty: false },
  { id: 'r11', path: '/payments/batch', method: 'POST', summary: 'Batch payments', description: 'Process multiple payments in a single batch request.', parameters: [{ name: 'items', in: 'body', required: true, type: 'array' }], authType: 'OAuth2', throttlingTier: 'Gold', scope: 'payments:write', isExpanded: false, isDirty: false },
  { id: 'r12', path: '/payments/verify', method: 'POST', summary: 'Verify payment', description: 'Verify a payment instrument without charging.', parameters: [{ name: 'token', in: 'body', required: true, type: 'string' }], authType: 'APIKey', throttlingTier: 'Silver', scope: 'payments:verify', isExpanded: false, isDirty: false },
];

// ===== Inline Resource Editor =====
function ResourceInlineEditor({ resource, onUpdate }: {
  resource: DesignerResource;
  onUpdate: (updated: DesignerResource) => void;
}) {
  const [activeTab, setActiveTab] = useState('definition');

  const tabs = [
    { id: 'definition', label: 'Definition' },
    { id: 'parameters', label: 'Parameters' },
    { id: 'requestBody', label: 'Request Body' },
    { id: 'responses', label: 'Responses' },
  ];

  return (
    <div className="border-t border-[#3D434F] bg-[#21242B] p-4 animate-[expandIn_250ms_cubic-bezier(0.16,1,0.3,1)]">
      {/* Sub-tabs */}
      <div className="flex border-b border-[#3D434F] mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-[12px] font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'text-[#4488FF] border-[#4488FF]'
                : 'text-[#9DA5B4] border-transparent hover:text-[#E8ECF1]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-[fadeIn_150ms_50ms_ease-out_both]">
        {activeTab === 'definition' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Path</label>
              <Input
                value={resource.path}
                onChange={(e) => onUpdate({ ...resource, path: e.target.value, isDirty: true })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] font-mono text-[13px]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Method</label>
              <select
                value={resource.method}
                onChange={(e) => onUpdate({ ...resource, method: e.target.value as APIResource['method'], isDirty: true })}
                className="w-full h-9 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] px-3"
              >
                {['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Summary</label>
              <Input
                value={resource.summary}
                onChange={(e) => onUpdate({ ...resource, summary: e.target.value, isDirty: true })}
                placeholder="Brief description of what this endpoint does"
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] text-[13px]"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Description</label>
              <textarea
                value={resource.description}
                onChange={(e) => onUpdate({ ...resource, description: e.target.value, isDirty: true })}
                rows={3}
                placeholder="Detailed description..."
                className="w-full bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] p-2.5 resize-none placeholder:text-[#6B7280]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Auth Type</label>
              <select
                value={resource.authType}
                onChange={(e) => onUpdate({ ...resource, authType: e.target.value as APIResource['authType'], isDirty: true })}
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
                value={resource.throttlingTier}
                onChange={(e) => onUpdate({ ...resource, throttlingTier: e.target.value, isDirty: true })}
                className="w-full h-9 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] px-3"
              >
                {['Unlimited', 'Gold', 'Silver', 'Bronze'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeTab === 'parameters' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-medium text-[#9DA5B4]">Parameters</span>
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-[10px] border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
                onClick={() => {
                  onUpdate({
                    ...resource,
                    parameters: [...resource.parameters, { name: 'newParam', in: 'query', required: false, type: 'string' }],
                    isDirty: true,
                  });
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            {resource.parameters.length === 0 ? (
              <p className="text-[12px] text-[#9DA5B4] text-center py-4">No parameters defined</p>
            ) : (
              <div className="space-y-1.5">
                {resource.parameters.map((param, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_100px_80px_60px_28px] gap-2 items-center p-2 bg-[#181A20] rounded-md border border-[#3D434F]">
                    <Input
                      value={param.name}
                      onChange={(e) => {
                        const newParams = [...resource.parameters];
                        newParams[idx] = { ...param, name: e.target.value };
                        onUpdate({ ...resource, parameters: newParams, isDirty: true });
                      }}
                      className="h-7 bg-[#21242B] border-[#3D434F] text-[#E8ECF1] text-[12px] font-mono"
                    />
                    <select
                      value={param.in}
                      onChange={(e) => {
                        const newParams = [...resource.parameters];
                        newParams[idx] = { ...param, in: e.target.value as 'query' | 'path' | 'header' | 'body' };
                        onUpdate({ ...resource, parameters: newParams, isDirty: true });
                      }}
                      className="h-7 bg-[#21242B] border border-[#3D434F] rounded text-[11px] text-[#E8ECF1] px-1"
                    >
                      <option value="query">query</option>
                      <option value="path">path</option>
                      <option value="header">header</option>
                      <option value="body">body</option>
                    </select>
                    <select
                      value={param.type}
                      onChange={(e) => {
                        const newParams = [...resource.parameters];
                        newParams[idx] = { ...param, type: e.target.value };
                        onUpdate({ ...resource, parameters: newParams, isDirty: true });
                      }}
                      className="h-7 bg-[#21242B] border border-[#3D434F] rounded text-[11px] text-[#E8ECF1] px-1"
                    >
                      <option value="string">string</option>
                      <option value="integer">integer</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                      <option value="array">array</option>
                    </select>
                    <label className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={param.required}
                        onChange={(e) => {
                          const newParams = [...resource.parameters];
                          newParams[idx] = { ...param, required: e.target.checked };
                          onUpdate({ ...resource, parameters: newParams, isDirty: true });
                        }}
                        className="accent-[#4488FF]"
                      />
                    </label>
                    <button
                      onClick={() => {
                        const newParams = resource.parameters.filter((_, i) => i !== idx);
                        onUpdate({ ...resource, parameters: newParams, isDirty: true });
                      }}
                      className="text-[#6B7280] hover:text-[#EF4444] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requestBody' && (
          <div>
            <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Content-Type</label>
            <select className="w-full h-9 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] px-3 mb-3">
              <option>application/json</option>
              <option>application/xml</option>
              <option>multipart/form-data</option>
            </select>
            <div className="bg-[#181A20] border border-[#3D434F] rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-[#6B7280]">Schema Editor</span>
                <Code2 className="w-3.5 h-3.5 text-[#6B7280]" />
              </div>
              <pre className="text-[12px] font-mono text-[#9DA5B4]">{`{
  "type": "object",
  "properties": {
    "amount": {
      "type": "number",
      "description": "Payment amount in cents"
    },
    "currency": {
      "type": "string",
      "enum": ["USD", "EUR", "GBP"]
    }
  },
  "required": ["amount", "currency"]
}`}</pre>
            </div>
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="space-y-3">
            {[
              { code: '200', desc: 'OK' },
              { code: '201', desc: 'Created' },
              { code: '400', desc: 'Bad Request' },
              { code: '401', desc: 'Unauthorized' },
              { code: '500', desc: 'Internal Server Error' },
            ].map((resp) => (
              <div key={resp.code} className="border border-[#3D434F] rounded-md overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-[#181A20]">
                  <span className={cn(
                    'text-[11px] font-bold',
                    resp.code.startsWith('2') ? 'text-[#10B981]' : resp.code.startsWith('4') ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                  )}>
                    {resp.code}
                  </span>
                  <span className="text-[12px] text-[#9DA5B4]">{resp.desc}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes expandIn {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 600px; }
        }
      `}</style>
    </div>
  );
}

// ===== Resource Card (Collapsed + Expanded) =====
function ResourceCard({
  resource,
  index,
  isCompact,
  onToggle,
  onUpdate,
  onDelete,
  onDuplicate,
  isDragging,
  isDragOver,
}: {
  resource: DesignerResource;
  index: number;
  isCompact: boolean;
  onToggle: () => void;
  onUpdate: (updated: DesignerResource) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isDragging: boolean;
  isDragOver: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-[#3D434F] bg-[#2B2F38] transition-all duration-150',
        resource.isExpanded && 'border-[#4488FF60]',
        isDragging && 'opacity-60 shadow-[0_8px_24px_rgba(0,0,0,0.4)] rotate-[1deg] scale-[1.01]',
        isDragOver && 'border-dashed border-[#4488FF] mt-3 mb-3',
        !resource.isExpanded && !isDragging && 'hover:border-[#4488FF40] hover:bg-[#353942]'
      )}
      style={{
        animationDelay: `${index * 30}ms`,
      }}
    >
      {/* Collapsed header - always visible */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={onToggle}
      >
        {/* Drag handle */}
        <button
          className="text-[#6B7280] hover:text-[#E8ECF1] cursor-grab active:cursor-grabbing flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Expand toggle */}
        <button className="text-[#6B7280] flex-shrink-0" onClick={onToggle}>
          {resource.isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200" />
          )}
        </button>

        {/* Method badge */}
        <MethodBadge method={resource.method} className="flex-shrink-0" />

        {/* Path */}
        <span className="text-[14px] text-[#E8ECF1] font-mono flex-1 truncate min-w-0">
          {resource.path}
        </span>

        {/* Summary (hidden in compact) */}
        {!isCompact && (
          <span className="text-[13px] text-[#9DA5B4] max-w-[250px] truncate flex-shrink-0 hidden lg:block">
            {resource.summary}
          </span>
        )}

        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#3D434F40] text-[#9DA5B4]">{resource.authType}</span>
          <span className={cn(
            'px-1.5 py-0.5 rounded text-[10px]',
            resource.throttlingTier === 'Gold' && 'bg-[#F59E0B20] text-[#F59E0B]',
            resource.throttlingTier === 'Silver' && 'bg-[#9DA5B420] text-[#9DA5B4]',
            resource.throttlingTier === 'Bronze' && 'bg-[#B4530920] text-[#B45309]',
            resource.throttlingTier === 'Unlimited' && 'bg-[#10B98120] text-[#10B981]',
          )}>
            {resource.throttlingTier}
          </span>
          {resource.isDirty && (
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse ml-1" title="Unsaved changes" />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            className="p-1.5 rounded text-[#6B7280] hover:text-[#E8ECF1] hover:bg-[#353942] transition-colors"
            onClick={onToggle}
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 rounded text-[#6B7280] hover:text-[#4488FF] hover:bg-[#353942] transition-colors"
            onClick={onDuplicate}
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 rounded text-[#6B7280] hover:text-[#EF4444] hover:bg-[#353942] transition-colors"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {resource.isExpanded && (
        <ResourceInlineEditor resource={resource} onUpdate={onUpdate} />
      )}
    </div>
  );
}

// ===== Main Component =====
export default function APIDesigner() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = getAPIById(id || '1');

  const [resources, setResources] = useState<DesignerResource[]>(mockResources);
  const [search, setSearch] = useState('');
  const [isCompact, setIsCompact] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const filtered = search
    ? resources.filter((r) =>
        r.path.toLowerCase().includes(search.toLowerCase()) ||
        r.summary.toLowerCase().includes(search.toLowerCase()) ||
        r.method.toLowerCase().includes(search.toLowerCase())
      )
    : resources;

  const toggleExpand = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isExpanded: !r.isExpanded } : r))
    );
  };

  const expandAll = () => {
    setResources((prev) => prev.map((r) => ({ ...r, isExpanded: true })));
  };

  const collapseAll = () => {
    setResources((prev) => prev.map((r) => ({ ...r, isExpanded: false })));
  };

  const updateResource = (updated: DesignerResource) => {
    setResources((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setHasChanges(true);
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    setHasChanges(true);
  };

  const duplicateResource = (id: string) => {
    const resource = resources.find((r) => r.id === id);
    if (!resource) return;
    const newRes: DesignerResource = {
      ...resource,
      id: `r${Date.now()}`,
      path: `${resource.path}/copy`,
      isExpanded: false,
      isDirty: true,
    };
    const idx = resources.findIndex((r) => r.id === id);
    const newResources = [...resources];
    newResources.splice(idx + 1, 0, newRes);
    setResources(newResources);
    setHasChanges(true);
  };

  const addResource = () => {
    const newRes: DesignerResource = {
      id: `r${Date.now()}`,
      path: '/new-endpoint',
      method: 'GET',
      summary: 'New endpoint',
      description: '',
      parameters: [],
      authType: 'OAuth2',
      throttlingTier: 'Unlimited',
      scope: '',
      isExpanded: true,
      isDirty: true,
    };
    setResources((prev) => [newRes, ...prev]);
    setHasChanges(true);
  };

  const saveDraft = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 800);
    setHasChanges(false);
    setResources((prev) => prev.map((r) => ({ ...r, isDirty: false })));
  };

  const publishChanges = () => {
    setShowPublishModal(false);
    navigate(`/publisher/apis/${id}`);
  };

  // Drag handlers
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const newResources = [...resources];
    const [removed] = newResources.splice(dragIndex, 1);
    newResources.splice(index, 0, removed);
    setResources(newResources);
    setDragIndex(null);
    setDragOverIndex(null);
    setHasChanges(true);
  };

  const dirtyCount = resources.filter((r) => r.isDirty).length;
  const addedCount = resources.filter((r) => r.id.startsWith('r') && !mockResources.find((m) => m.id === r.id)).length;

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate(`/publisher/apis/${id}`)}
          className="flex items-center gap-1.5 text-[13px] text-[#9DA5B4] hover:text-[#E8ECF1] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {api?.name || 'API'}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold text-[#E8ECF1] tracking-tight flex items-center gap-2">
              API Designer
              {hasChanges && (
                <span
                  className="w-3 h-3 rounded-full bg-[#F59E0B]"
                  style={{ animation: 'unsavedPulse 2s ease-in-out infinite' }}
                />
              )}
            </h1>
            <p className="text-[13px] text-[#9DA5B4] mt-0.5">
              {api?.name} {api?.version}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={saveDraft}
              className={cn(
                'border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942] transition-all',
                savedFlash && 'border-[#10B981] text-[#10B981]'
              )}
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={() => setShowPublishModal(true)}
              className="bg-[#4488FF] hover:bg-[#5A9AFF] text-white"
            >
              <Rocket className="w-4 h-4 mr-1.5" />
              Publish Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Designer Toolbar */}
      <div className="flex items-center gap-3 pb-3 mb-4 border-b border-[#3D434F50]">
        <Button
          size="sm"
          className="bg-[#4488FF] hover:bg-[#5A9AFF] text-white h-8 text-[12px]"
          onClick={addResource}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Resource
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowImportModal(true)}
          className="h-8 text-[12px] border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
        >
          <Upload className="w-3.5 h-3.5 mr-1" />
          Import from OpenAPI
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-[12px] border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Export OpenAPI
        </Button>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative w-[240px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
          <Input
            placeholder="Filter resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] text-[12px]"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-[#181A20] rounded-md p-0.5">
          <button
            onClick={() => setIsCompact(false)}
            className={cn(
              'px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors',
              !isCompact ? 'bg-[#2B2F38] text-[#E8ECF1]' : 'text-[#9DA5B4] hover:text-[#E8ECF1]'
            )}
          >
            List
          </button>
          <button
            onClick={() => setIsCompact(true)}
            className={cn(
              'px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors',
              isCompact ? 'bg-[#2B2F38] text-[#E8ECF1]' : 'text-[#9DA5B4] hover:text-[#E8ECF1]'
            )}
          >
            Compact
          </button>
        </div>

        {/* Expand/Collapse */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const allExpanded = resources.every((r) => r.isExpanded);
            allExpanded ? collapseAll() : expandAll();
          }}
          className="h-8 text-[12px] text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]"
        >
          {resources.every((r) => r.isExpanded) ? (
            <>
              <ChevronDown className="w-3.5 h-3.5 mr-1" />
              Collapse All
            </>
          ) : (
            <>
              <ChevronRight className="w-3.5 h-3.5 mr-1" />
              Expand All
            </>
          )}
        </Button>
      </div>

      {/* Resource Canvas */}
      <div className="space-y-2 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-[#2B2F38] rounded-lg border border-[#3D434F]">
            <Layers className="w-12 h-12 text-[#3D434F] mb-3" />
            <p className="text-[14px] text-[#9DA5B4] mb-1">No resources defined yet</p>
            <p className="text-[12px] text-[#6B7280] mb-4">Start building your API by adding resources</p>
            <Button
              size="sm"
              className="bg-[#4488FF] hover:bg-[#5A9AFF] text-white"
              onClick={addResource}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add First Resource
            </Button>
          </div>
        ) : (
          filtered.map((resource, idx) => (
            <div
              key={resource.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
            >
              <ResourceCard
                resource={resource}
                index={idx}
                isCompact={isCompact}
                onToggle={() => toggleExpand(resource.id)}
                onUpdate={updateResource}
                onDelete={() => deleteResource(resource.id)}
                onDuplicate={() => duplicateResource(resource.id)}
                isDragging={dragIndex === idx}
                isDragOver={dragOverIndex === idx && dragIndex !== idx}
              />
            </div>
          ))
        )}
      </div>

      {/* Import Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold">Import OpenAPI Specification</DialogTitle>
            <DialogDescription className="text-[13px] text-[#9DA5B4]">
              Import resources from an existing OpenAPI spec file or URL.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-[#3D434F] rounded-lg p-8 text-center hover:border-[#4488FF] hover:bg-[#1E3A5F20] transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8 text-[#4488FF] mx-auto mb-2" />
              <p className="text-[14px] text-[#E8ECF1]">Drag &amp; drop your spec file here</p>
              <p className="text-[13px] text-[#4488FF] mt-1">or click to browse</p>
              <p className="text-[12px] text-[#6B7280] mt-2">Supports .yaml, .yml, .json</p>
            </div>
            <div className="relative">
              <Input
                placeholder="https://example.com/openapi.json"
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280]"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[12px] text-[#9DA5B4] cursor-pointer">
                <input type="checkbox" className="accent-[#4488FF]" />
                Overwrite existing resources
              </label>
              <label className="flex items-center gap-2 text-[12px] text-[#9DA5B4] cursor-pointer">
                <input type="checkbox" className="accent-[#4488FF]" />
                Import documentation
              </label>
              <label className="flex items-center gap-2 text-[12px] text-[#9DA5B4] cursor-pointer">
                <input type="checkbox" className="accent-[#4488FF]" />
                Import server endpoints
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowImportModal(false)}
              className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              Cancel
            </Button>
            <Button className="bg-[#4488FF] hover:bg-[#5A9AFF] text-white">
              Import Resources
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1] max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4488FF20] flex items-center justify-center">
                <Rocket className="w-5 h-5 text-[#4488FF]" />
              </div>
              <DialogTitle className="text-[16px] font-bold">Publish Changes?</DialogTitle>
            </div>
            <DialogDescription className="text-[13px] text-[#9DA5B4] pt-2">
              This will publish your API changes to the production gateway. Review the summary below:
            </DialogDescription>
          </DialogHeader>
          <div className="bg-[#181A20] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#9DA5B4]">Resources added</span>
              <span className="text-[#10B981] font-semibold">+{addedCount}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#9DA5B4]">Resources modified</span>
              <span className="text-[#F59E0B] font-semibold">{dirtyCount}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#9DA5B4]">Total resources</span>
              <span className="text-[#E8ECF1] font-semibold">{resources.length}</span>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPublishModal(false)}
              className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              Cancel
            </Button>
            <Button
              onClick={publishChanges}
              className="bg-[#10B981] hover:bg-[#059669] text-white"
            >
              <Rocket className="w-4 h-4 mr-1.5" />
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes unsavedPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import StatusBadge, { type StatusType } from '@/components/StatusBadge';
import MethodBadge from '@/components/MethodBadge';
import {
  ArrowLeft,
  Pencil,
  Layout as LayoutIcon,
  GitBranch,
  MoreVertical,
  ExternalLink,
  Users,
  Star,
  Copy,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  X,
  FileText,
  Globe,
  Server,
  Clock,
  ArrowRight,
  ShieldX,
  AlertTriangle,
  Archive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAPIById, getSubscriptionsByApiId } from '@/lib/data';
import type { API, APIResource, Subscription, DocPage } from '@/lib/data';

// ===== Resource Detail Drawer =====
function ResourceDrawer({ resource, onClose }: { resource: APIResource; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('definition');

  const tabs = [
    { id: 'definition', label: 'Definition' },
    { id: 'parameters', label: 'Parameters' },
    { id: 'requestBody', label: 'Request Body' },
    { id: 'responses', label: 'Responses' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]" onClick={onClose} />
      {/* Panel */}
      <div
        className="relative w-[480px] h-full bg-[#2B2F38] border-l border-[#3D434F] overflow-hidden animate-[slideIn_300ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3D434F]">
          <div className="flex items-center gap-3">
            <MethodBadge method={resource.method} />
            <span className="text-[14px] font-mono text-[#E8ECF1]">{resource.path}</span>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#E8ECF1] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#3D434F]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-[12px] font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'text-[#4488FF] border-[#4488FF]'
                  : 'text-[#9DA5B4] border-transparent hover:text-[#E8ECF1]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4 space-y-4">
            {activeTab === 'definition' && (
              <>
                <div>
                  <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Path</label>
                  <Input
                    defaultValue={resource.path}
                    className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Method</label>
                  <select
                    defaultValue={resource.method}
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
                    defaultValue={resource.summary}
                    className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Description</label>
                  <textarea
                    defaultValue={resource.description}
                    rows={4}
                    className="w-full bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] p-2.5 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Auth Type</label>
                  <div className="flex gap-3">
                    {(['OAuth2', 'APIKey', 'None'] as const).map((auth) => (
                      <label key={auth} className="flex items-center gap-1.5 text-[12px] text-[#9DA5B4] cursor-pointer">
                        <input
                          type="radio"
                          name="authType"
                          defaultChecked={resource.authType === auth}
                          className="accent-[#4488FF]"
                        />
                        {auth}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#9DA5B4] mb-1">Throttling Tier</label>
                  <select
                    defaultValue={resource.throttlingTier}
                    className="w-full h-9 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] px-3"
                  >
                    {['Unlimited', 'Gold', 'Silver', 'Bronze'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {activeTab === 'parameters' && (
              <div>
                {resource.parameters.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[13px] text-[#9DA5B4]">No parameters defined.</p>
                    <Button size="sm" variant="outline" className="mt-2 border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Parameter
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resource.parameters.map((param, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-[#181A20] rounded-md border border-[#3D434F]">
                        <span className="text-[12px] font-mono text-[#4488FF] flex-1">{param.name}</span>
                        <Badge variant="outline" className="text-[10px] border-[#3D434F] text-[#9DA5B4]">{param.in}</Badge>
                        <Badge variant="outline" className="text-[10px] border-[#3D434F] text-[#9DA5B4]">{param.type}</Badge>
                        {param.required && <Badge className="text-[10px] bg-[#EF444420] text-[#EF4444] border-0">required</Badge>}
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
                  <pre className="text-[12px] font-mono text-[#9DA5B4]">{`{
  "type": "object",
  "properties": {
    // Define your schema here
  }
}`}</pre>
                </div>
              </div>
            )}
            {activeTab === 'responses' && (
              <div className="space-y-3">
                {['200', '201', '400', '401', '500'].map((code) => (
                  <div key={code} className="border border-[#3D434F] rounded-md overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#181A20]">
                      <span className={cn(
                        'text-[11px] font-bold',
                        code.startsWith('2') ? 'text-[#10B981]' : code.startsWith('4') ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                      )}>
                        {code}
                      </span>
                      <span className="text-[12px] text-[#9DA5B4]">
                        {code === '200' && 'OK'}
                        {code === '201' && 'Created'}
                        {code === '400' && 'Bad Request'}
                        {code === '401' && 'Unauthorized'}
                        {code === '500' && 'Internal Server Error'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ===== Overview Tab =====
function OverviewTab({ api }: { api: API }) {
  const methodCounts = api.resources.reduce((acc, r) => {
    acc[r.method] = (acc[r.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getCounts = api.resources.filter((r) => r.method === 'GET').length;
  const postCounts = api.resources.filter((r) => r.method === 'POST').length;

  return (
    <div className="flex gap-6">
      {/* Left Column (65%) */}
      <div className="flex-[65] space-y-5">
        {/* API Information */}
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#E8ECF1]">API Information</h3>
            <button className="text-[#6B7280] hover:text-[#E8ECF1] transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <span className="text-[12px] text-[#6B7280]">Name</span>
              <p className="text-[13px] text-[#E8ECF1]">{api.name}</p>
            </div>
            <div>
              <span className="text-[12px] text-[#6B7280]">Version</span>
              <p className="text-[13px] text-[#E8ECF1]">{api.version}</p>
            </div>
            <div>
              <span className="text-[12px] text-[#6B7280]">Context</span>
              <p className="text-[13px] text-[#E8ECF1] font-mono">{api.context}</p>
            </div>
            <div>
              <span className="text-[12px] text-[#6B7280]">Type</span>
              <Badge variant="outline" className="border-[#4488FF] text-[#4488FF] text-[11px] ml-1">{api.type}</Badge>
            </div>
            <div>
              <span className="text-[12px] text-[#6B7280]">Visibility</span>
              <div className="mt-0.5"><StatusBadge status={api.visibility} /></div>
            </div>
            <div>
              <span className="text-[12px] text-[#6B7280]">Status</span>
              <div className="mt-0.5"><StatusBadge status={api.status} /></div>
            </div>
            <div>
              <span className="text-[12px] text-[#6B7280]">Provider</span>
              <p className="text-[13px] text-[#E8ECF1]">{api.provider}</p>
            </div>
            <div>
              <span className="text-[12px] text-[#6B7280]">Created</span>
              <p className="text-[13px] text-[#E8ECF1]">{new Date(api.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="col-span-2">
              <span className="text-[12px] text-[#6B7280]">Description</span>
              <p className="text-[13px] text-[#9DA5B4] mt-0.5">{api.description}</p>
            </div>
          </div>
        </div>

        {/* Endpoint Configuration */}
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
          <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4">Endpoint Configuration</h3>
          <div className="space-y-3">
            {api.gatewayEndpoint && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#6B7280] w-[120px]">Production URL</span>
                  <a
                    href={api.gatewayEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-[#4488FF] font-mono hover:underline flex items-center gap-1"
                  >
                    {api.gatewayEndpoint}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#6B7280] w-[120px]">Transport</span>
                  <div className="flex gap-1.5">
                    <Badge variant="outline" className="text-[10px] border-[#10B981] text-[#10B981]">HTTPS</Badge>
                    <Badge variant="outline" className="text-[10px] border-[#9DA5B4] text-[#9DA5B4]">HTTP</Badge>
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[#6B7280] w-[120px]">Gateway</span>
              <span className="text-[13px] text-[#E8ECF1]">VAPIM Gateway (Default)</span>
            </div>
          </div>
        </div>

        {/* Tags & Categories */}
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
          <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-3">Tags &amp; Categories</h3>
          <div className="space-y-3">
            <div>
              <span className="text-[12px] text-[#6B7280]">Tags</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {api.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-[12px] bg-[#3D434F40] text-[#9DA5B4]">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[12px] text-[#6B7280]">Categories</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {api.categories.map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded text-[12px] bg-[#1E3A5F] text-[#4488FF]">{cat}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (35%) */}
      <div className="flex-[35] space-y-5">
        {/* Quick Stats */}
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#4488FF]" />
            <div>
              <p className="text-[24px] font-bold text-[#E8ECF1]">{api.subscribers}</p>
              <p className="text-[12px] text-[#9DA5B4]">Subscribers</p>
            </div>
          </div>
          <Separator className="bg-[#3D434F]" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[24px] font-bold text-[#E8ECF1]">{api.rating}</p>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn('w-3.5 h-3.5', s <= Math.round(api.rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#3D434F]')}
                  />
                ))}
              </div>
            </div>
            <p className="text-[12px] text-[#4488FF] hover:underline cursor-pointer">28 reviews</p>
          </div>
          <Separator className="bg-[#3D434F]" />
          <div>
            <p className="text-[20px] font-bold text-[#E8ECF1]">{api.resources.length} endpoints</p>
            {(getCounts > 0 || postCounts > 0) && (
              <div className="flex items-center gap-2 mt-2">
                {getCounts > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-[#181A20] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] rounded-full"
                        style={{ width: `${(getCounts / api.resources.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#10B981]">{getCounts} GET</span>
                  </div>
                )}
                {postCounts > 0 && (
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-[#181A20] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F59E0B] rounded-full"
                        style={{ width: `${(postCounts / api.resources.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#F59E0B]">{postCounts} POST</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
          <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-3">Recent Activity</h3>
          <div className="relative pl-4 space-y-4">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#3D434F]" />
            {api.lifecycleState.history.slice().reverse().map((event, idx) => (
              <div key={idx} className="relative">
                <div
                  className={cn(
                    'absolute -left-[13px] top-1 w-2 h-2 rounded-full',
                    idx === 0 ? 'bg-[#4488FF]' : 'bg-[#6B7280]'
                  )}
                />
                <p className="text-[12px] text-[#E8ECF1]">
                  API {event.state.toLowerCase()}
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Resources Tab =====
function ResourcesTab({ api }: { api: API }) {
  const [selectedResource, setSelectedResource] = useState<APIResource | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#9DA5B4]">{api.resources.length} Resources</h3>
        <Button size="sm" className="bg-[#4488FF] hover:bg-[#5A9AFF] text-white">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Resource
        </Button>
      </div>

      {api.resources.length === 0 ? (
        <div className="text-center py-12 bg-[#2B2F38] rounded-lg border border-[#3D434F]">
          <Server className="w-10 h-10 text-[#3D434F] mx-auto mb-3" />
          <p className="text-[14px] text-[#9DA5B4]">No resources defined</p>
          <Button size="sm" variant="outline" className="mt-3 border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">
            Add First Resource
          </Button>
        </div>
      ) : (
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_200px_100px_100px_80px] gap-2 px-4 py-2.5 bg-[#1E2128] text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em]">
            <span>Method</span>
            <span>Path</span>
            <span>Summary</span>
            <span>Auth</span>
            <span>Throttling</span>
            <span className="text-right">Actions</span>
          </div>
          {/* Table Rows */}
          {api.resources.map((resource, idx) => (
            <div
              key={resource.id}
              className={cn(
                'grid grid-cols-[80px_1fr_200px_100px_100px_80px] gap-2 px-4 py-3 border-t border-[#3D434F50] items-center cursor-pointer transition-colors hover:bg-[#353942]',
                idx % 2 === 0 ? 'bg-[#21242B]' : 'bg-[#2B2F38]'
              )}
              onClick={() => setSelectedResource(resource)}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <MethodBadge method={resource.method} />
              <span className="text-[13px] text-[#E8ECF1] font-mono truncate">{resource.path}</span>
              <span className="text-[13px] text-[#9DA5B4] truncate">{resource.summary}</span>
              <Badge variant="outline" className="text-[10px] border-[#3D434F] text-[#9DA5B4] w-fit">{resource.authType}</Badge>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] w-fit border-0',
                  resource.throttlingTier === 'Gold' && 'bg-[#F59E0B20] text-[#F59E0B]',
                  resource.throttlingTier === 'Silver' && 'bg-[#9DA5B420] text-[#9DA5B4]',
                  resource.throttlingTier === 'Bronze' && 'bg-[#B4530920] text-[#B45309]',
                  resource.throttlingTier === 'Unlimited' && 'bg-[#10B98120] text-[#10B981]',
                )}
              >
                {resource.throttlingTier}
              </Badge>
              <div className="flex items-center justify-end gap-1">
                <button className="p-1 text-[#6B7280] hover:text-[#E8ECF1] transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button className="p-1 text-[#6B7280] hover:text-[#EF4444] transition-colors" onClick={(e) => e.stopPropagation()}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedResource && (
        <ResourceDrawer resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </div>
  );
}

// ===== Documentation Tab =====
function DocumentationTab({ api }: { api: API }) {
  const [selectedDoc, setSelectedDoc] = useState<DocPage | null>(api.documentation[0] || null);
  const [editMode, setEditMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const docTree = [
    {
      id: 'overview',
      title: 'Overview',
      children: [
        { id: 'getting-started', title: 'Getting Started' },
        { id: 'authentication', title: 'Authentication' },
      ],
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      children: [],
    },
    {
      id: 'guides',
      title: 'Guides',
      children: [
        { id: 'quick-start', title: 'Quick Start' },
        { id: 'error-handling', title: 'Error Handling' },
      ],
    },
  ];

  if (api.documentation.length === 0) {
    return (
      <div className="text-center py-12 bg-[#2B2F38] rounded-lg border border-[#3D434F]">
        <FileText className="w-10 h-10 text-[#3D434F] mx-auto mb-3" />
        <p className="text-[14px] text-[#9DA5B4]">No documentation yet.</p>
        <Button size="sm" className="mt-3 bg-[#4488FF] hover:bg-[#5A9AFF] text-white">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Documentation
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Doc Sidebar */}
      <div className="w-[25%] bg-[#2B2F38] rounded-lg border border-[#3D434F] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-[#3D434F]">
          <span className="text-[13px] font-semibold text-[#E8ECF1]">Documentation</span>
          <Button size="sm" className="h-7 bg-[#4488FF] hover:bg-[#5A9AFF] text-white text-[12px]">
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add
          </Button>
        </div>
        <ScrollArea className="flex-1">
          {docTree.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="flex items-center gap-1.5 w-full px-3 py-2 text-left hover:bg-[#353942] transition-colors"
              >
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="w-3 h-3 text-[#6B7280]" />
                ) : (
                  <ChevronRight className="w-3 h-3 text-[#6B7280]" />
                )}
                <span className="text-[13px] font-medium text-[#E8ECF1]">{section.title}</span>
              </button>
              {expandedSections.has(section.id) && section.children.length > 0 && (
                <div className="pl-7">
                  {section.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedDoc(api.documentation.find((d) => d.title === child.title) || null)}
                      className={cn(
                        'block w-full px-3 py-1.5 text-left text-[12px] transition-colors rounded-md mx-1',
                        selectedDoc?.title === child.title
                          ? 'bg-[#1E3A5F] text-[#4488FF]'
                          : 'text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1]'
                      )}
                    >
                      {child.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Content Viewer */}
      <div className="flex-[75] bg-[#2B2F38] rounded-lg border border-[#3D434F] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#3D434F]">
          <div>
            <h3 className="text-[16px] font-semibold text-[#E8ECF1]">{selectedDoc?.title || 'Select a document'}</h3>
            {selectedDoc?.lastUpdated && (
              <p className="text-[11px] text-[#6B7280] mt-0.5">Last edited: {selectedDoc.lastUpdated}</p>
            )}
          </div>
          <div className="flex items-center gap-1 bg-[#181A20] rounded-md p-0.5">
            <button
              onClick={() => setEditMode(false)}
              className={cn(
                'px-3 py-1.5 text-[12px] font-medium rounded-sm transition-colors',
                !editMode ? 'bg-[#2B2F38] text-[#E8ECF1]' : 'text-[#9DA5B4] hover:text-[#E8ECF1]'
              )}
            >
              View
            </button>
            <button
              onClick={() => setEditMode(true)}
              className={cn(
                'px-3 py-1.5 text-[12px] font-medium rounded-sm transition-colors',
                editMode ? 'bg-[#2B2F38] text-[#E8ECF1]' : 'text-[#9DA5B4] hover:text-[#E8ECF1]'
              )}
            >
              Edit
            </button>
          </div>
        </div>
        <ScrollArea className="flex-1 p-5">
          {selectedDoc ? (
            <div className="prose prose-invert max-w-none">
              {editMode ? (
                <textarea
                  defaultValue={selectedDoc.content}
                  className="w-full h-[400px] bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] p-3 font-mono resize-none"
                />
              ) : (
                <div className="text-[13px] text-[#9DA5B4] leading-relaxed whitespace-pre-wrap">
                  {selectedDoc.content}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileText className="w-10 h-10 text-[#3D434F] mb-3" />
              <p className="text-[14px] text-[#9DA5B4]">Select a document from the sidebar</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

// ===== Subscriptions Tab =====
function SubscriptionsTab({ subscriptions }: { subscriptions: Subscription[] }) {
  const activeCount = subscriptions.filter((s) => s.status === 'ACTIVE').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#9DA5B4]">{activeCount} Active Subscriptions</h3>
        <Button size="sm" variant="outline" className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">
          Export CSV
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12 bg-[#2B2F38] rounded-lg border border-[#3D434F]">
          <Users className="w-10 h-10 text-[#3D434F] mx-auto mb-3" />
          <p className="text-[14px] text-[#9DA5B4]">No subscriptions yet.</p>
        </div>
      ) : (
        <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_120px_100px_100px_140px_100px] gap-2 px-4 py-2.5 bg-[#1E2128] text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em]">
            <span>Application</span>
            <span>Tier</span>
            <span>Status</span>
            <span>Owner</span>
            <span>Subscribed</span>
            <span className="text-right">Actions</span>
          </div>
          {/* Rows */}
          {subscriptions.map((sub, idx) => (
            <div
              key={sub.id}
              className={cn(
                'grid grid-cols-[1fr_120px_100px_100px_140px_100px] gap-2 px-4 py-3 border-t border-[#3D434F50] items-center',
                idx % 2 === 0 ? 'bg-[#21242B]' : 'bg-[#2B2F38]'
              )}
            >
              <div>
                <p className="text-[13px] text-[#E8ECF1] font-medium">{sub.applicationName}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] w-fit border-0',
                  sub.tier === 'Gold' && 'bg-[#F59E0B20] text-[#F59E0B]',
                  sub.tier === 'Silver' && 'bg-[#9DA5B420] text-[#9DA5B4]',
                  sub.tier === 'Bronze' && 'bg-[#B4530920] text-[#B45309]',
                  sub.tier === 'Unlimited' && 'bg-[#10B98120] text-[#10B981]',
                  sub.tier === 'Free' && 'bg-[#3B82F620] text-[#3B82F6]',
                )}
              >
                {sub.tier}
              </Badge>
              <StatusBadge status={sub.status} />
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#4488FF] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                  {sub.applicationName.charAt(0)}
                </div>
                <span className="text-[12px] text-[#9DA5B4] truncate">{sub.applicationName}</span>
              </div>
              <span className="text-[12px] text-[#9DA5B4]">
                {new Date(sub.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <div className="flex items-center justify-end gap-1">
                {sub.status === 'ON_HOLD' && (
                  <Button size="sm" className="h-6 text-[10px] bg-[#4488FF] hover:bg-[#5A9AFF] text-white px-2">Approve</Button>
                )}
                <button className="p-1 text-[#6B7280] hover:text-[#EF4444] transition-colors">
                  <ShieldX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Deployments Tab =====
function DeploymentsTab({ api }: { api: API }) {
  const environments = [
    { name: 'Production', status: api.deployments[0]?.status === 'DEPLOYED' ? 'Deployed' : 'Not Deployed', endpoint: api.gatewayEndpoint, lastDeployed: api.deployments[0]?.deployedAt, revision: api.version },
    { name: 'Sandbox', status: 'Deployed', endpoint: api.gatewayEndpoint.replace(/https?:\/\//, (m) => `${m}sandbox-`), lastDeployed: '2024-07-19T10:00:00Z', revision: api.version },
    { name: 'Staging', status: 'Not Deployed', endpoint: '-', lastDeployed: null, revision: null },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {environments.map((env, idx) => (
        <div
          key={env.name}
          className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-semibold text-[#E8ECF1]">{env.name}</h3>
            <StatusBadge status={env.status === 'Deployed' ? 'PUBLISHED' : 'RETIRED'} />
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[12px] text-[#6B7280]">Endpoint</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[12px] text-[#E8ECF1] font-mono truncate">{env.endpoint}</span>
                {env.endpoint !== '-' && (
                  <button className="text-[#6B7280] hover:text-[#4488FF] transition-colors flex-shrink-0">
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {env.lastDeployed && (
              <div>
                <span className="text-[12px] text-[#6B7280]">Last Deployed</span>
                <p className="text-[12px] text-[#9DA5B4] mt-0.5">
                  {new Date(env.lastDeployed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}

            {env.revision && (
              <div>
                <span className="text-[12px] text-[#6B7280]">Revision</span>
                <p className="text-[12px] text-[#E8ECF1] font-mono mt-0.5">{env.revision}</p>
              </div>
            )}

            <Button
              size="sm"
              variant="outline"
              className={cn(
                'w-full mt-2 text-[12px]',
                env.status === 'Deployed'
                  ? 'border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]'
                  : 'bg-[#4488FF] hover:bg-[#5A9AFF] text-white border-0'
              )}
            >
              {env.status === 'Deployed' ? 'Redeploy' : 'Deploy'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== Lifecycle Tab =====
function LifecycleTab({ api }: { api: API }) {
  const navigate = useNavigate();

  const states: Array<{ state: string; color: string; icon: React.ReactNode }> = [
    { state: 'CREATED', color: '#3B82F6', icon: <FileText className="w-4 h-4" /> },
    { state: 'PUBLISHED', color: '#10B981', icon: <Globe className="w-4 h-4" /> },
    { state: 'DEPRECATED', color: '#F59E0B', icon: <AlertTriangle className="w-4 h-4" /> },
    { state: 'RETIRED', color: '#6B7280', icon: <Archive className="w-4 h-4" /> },
    { state: 'BLOCKED', color: '#EF4444', icon: <ShieldX className="w-4 h-4" /> },
  ];

  const currentIdx = states.findIndex((s) => s.state === api.status);

  return (
    <div className="space-y-5">
      {/* Compact Workflow */}
      <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-6">
        <div className="flex items-center justify-center gap-0">
          {states.map((s, idx) => (
            <div key={s.state} className="flex items-center">
              <div
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full border-2 text-[11px] font-bold uppercase tracking-[0.06em]',
                  s.state === api.status && 'scale-105'
                )}
                style={{
                  borderColor: s.color,
                  backgroundColor: idx <= currentIdx ? `${s.color}20` : '#181A20',
                  color: s.color,
                  opacity: idx > currentIdx ? 0.4 : 1,
                  boxShadow: s.state === api.status ? `0 0 0 4px ${s.color}30, 0 0 20px ${s.color}20` : undefined,
                }}
              >
                {s.icon}
                {s.state}
              </div>
              {idx < states.length - 1 && (
                <ArrowRight
                  className="w-5 h-5 mx-2 flex-shrink-0"
                  style={{ color: idx < currentIdx ? '#10B981' : '#3D434F' }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#3D434F50]">
          <div>
            <span className="text-[12px] text-[#9DA5B4]">Current State: </span>
            <span className="text-[12px] font-semibold" style={{ color: states[currentIdx]?.color }}>{api.status}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/publisher/apis/${api.id}/lifecycle`)}
            className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
          >
            <GitBranch className="w-4 h-4 mr-1.5" />
            Manage Lifecycle
          </Button>
        </div>
      </div>

      {/* History */}
      <div className="bg-[#2B2F38] rounded-lg border border-[#3D434F] p-5">
        <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-3">Recent History</h3>
        <div className="space-y-2">
          {api.lifecycleState.history.slice().reverse().map((event, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[12px]">
              <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
              <StatusBadge status={event.state as StatusType} />
              <span className="text-[#9DA5B4]">by {event.user}</span>
              <span className="text-[#6B7280]">
                {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function APIDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [api, setApi] = useState<API | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const found = getAPIById(id || '1');
    if (found) {
      // Enrich with mock subscriptions if empty
      const subs = getSubscriptionsByApiId(found.id);
      setApi({
        ...found,
        subscriptions: subs.length > 0 ? subs : found.subscriptions,
      });
    }
  }, [id]);

  if (!api) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <p className="text-[16px] text-[#9DA5B4]">API not found</p>
            <Button
              variant="outline"
              className="mt-4 border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
              onClick={() => navigate('/publisher/apis')}
            >
              Back to APIs
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'resources', label: `Resources${api.resources.length > 0 ? ` (${api.resources.length})` : ''}` },
    { id: 'documentation', label: 'Documentation' },
    { id: 'subscriptions', label: `Subscriptions${api.subscribers > 0 ? ` (${api.subscribers})` : ''}` },
    { id: 'deployments', label: 'Deployments' },
    { id: 'lifecycle', label: 'Lifecycle' },
  ];

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/publisher/apis')}
          className="flex items-center gap-1.5 text-[13px] text-[#9DA5B4] hover:text-[#E8ECF1] transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          APIs
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-tight">{api.name}</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="px-2 py-0.5 rounded text-[12px] font-medium bg-[#4488FF20] text-[#4488FF]">
                {api.version}
              </span>
              <span className="text-[13px] text-[#6B7280] font-mono">{api.context}</span>
              <span className="text-[13px] text-[#9DA5B4]">by {api.provider}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={api.status} className="text-[12px] px-3 py-1" />
            <Button size="sm" variant="outline" className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">
              <Pencil className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/publisher/apis/${api.id}/design`)}
              className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              <LayoutIcon className="w-3.5 h-3.5 mr-1.5" />
              Design
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/publisher/apis/${api.id}/lifecycle`)}
              className="border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              <GitBranch className="w-3.5 h-3.5 mr-1.5" />
              Lifecycle
            </Button>

            {/* Three-dot menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-[#2E333D] border border-[#3D434F] rounded-lg shadow-xl z-50 py-1 animate-[fadeIn_100ms_ease-out]">
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#E8ECF1] hover:bg-[#353942] transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                      Delete
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#E8ECF1] hover:bg-[#353942] transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                      Export OpenAPI
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#E8ECF1] hover:bg-[#353942] transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Duplicate
                    </button>
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-[#E8ECF1] hover:bg-[#353942] transition-colors">
                      <Globe className="w-3.5 h-3.5" />
                      View in Portal
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-b border-[#3D434F] w-full justify-start h-auto p-0 rounded-none mb-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'px-5 py-3 text-[13px] font-medium rounded-none border-b-2 transition-colors data-[state=active]:shadow-none',
                activeTab === tab.id
                  ? 'border-[#4488FF] text-[#4488FF] bg-transparent'
                  : 'border-transparent text-[#9DA5B4] hover:text-[#E8ECF1] bg-transparent'
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0 animate-[fadeIn_200ms_ease-out]">
          <OverviewTab api={api} />
        </TabsContent>
        <TabsContent value="resources" className="mt-0 animate-[fadeIn_200ms_ease-out]">
          <ResourcesTab api={api} />
        </TabsContent>
        <TabsContent value="documentation" className="mt-0 animate-[fadeIn_200ms_ease-out]">
          <DocumentationTab api={api} />
        </TabsContent>
        <TabsContent value="subscriptions" className="mt-0 animate-[fadeIn_200ms_ease-out]">
          <SubscriptionsTab subscriptions={api.subscriptions} />
        </TabsContent>
        <TabsContent value="deployments" className="mt-0 animate-[fadeIn_200ms_ease-out]">
          <DeploymentsTab api={api} />
        </TabsContent>
        <TabsContent value="lifecycle" className="mt-0 animate-[fadeIn_200ms_ease-out]">
          <LifecycleTab api={api} />
        </TabsContent>
      </Tabs>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}

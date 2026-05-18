import { useState } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { mockWebhooks } from '@/lib/data';
import type { Webhook } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Plus,
  Pencil,
  Play,
  FileText,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Send,
  Webhook as WebhookIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// ---- Mock webhook logs ----
interface WebhookLog {
  id: string;
  timestamp: string;
  eventType: string;
  status: 'SUCCESS' | 'FAILED';
  responseStatus: number;
  responseTime: string;
  requestBody: string;
  responseBody: string;
}

const mockWebhookLogs: WebhookLog[] = [
  { id: 'wl1', timestamp: '2024-07-22T12:00:00Z', eventType: 'payment.success', status: 'SUCCESS', responseStatus: 200, responseTime: '124ms', requestBody: '{"event":"payment.success","data":{"id":"p_123","amount":99.99}}', responseBody: '{"received":true}' },
  { id: 'wl2', timestamp: '2024-07-22T11:45:00Z', eventType: 'payment.failed', status: 'SUCCESS', responseStatus: 200, responseTime: '89ms', requestBody: '{"event":"payment.failed","data":{"id":"p_124","reason":"card_declined"}}', responseBody: '{"received":true}' },
  { id: 'wl3', timestamp: '2024-07-22T11:30:00Z', eventType: 'payment.success', status: 'FAILED', responseStatus: 500, responseTime: '3012ms', requestBody: '{"event":"payment.success","data":{"id":"p_125","amount":49.99}}', responseBody: '{"error":"Internal Server Error"}' },
  { id: 'wl4', timestamp: '2024-07-22T11:15:00Z', eventType: 'payment.refunded', status: 'SUCCESS', responseStatus: 204, responseTime: '67ms', requestBody: '{"event":"payment.refunded","data":{"id":"p_126","amount":99.99}}', responseBody: '' },
  { id: 'wl5', timestamp: '2024-07-22T11:00:00Z', eventType: 'payment.success', status: 'SUCCESS', responseStatus: 200, responseTime: '112ms', requestBody: '{"event":"payment.success","data":{"id":"p_127","amount":199.99}}', responseBody: '{"received":true,"processed":"ok"}' },
  { id: 'wl6', timestamp: '2024-07-22T10:45:00Z', eventType: 'payment.failed', status: 'FAILED', responseStatus: 503, responseTime: '5034ms', requestBody: '{"event":"payment.failed","data":{"id":"p_128","reason":"expired_card"}}', responseBody: '{"error":"Service Unavailable"}' },
];

// ---- Mock test payloads ----
const testPayloads: Record<string, string> = {
  'payment.success': '{\n  "event": "payment.success",\n  "timestamp": "2024-07-22T12:00:00Z",\n  "data": {\n    "payment_id": "pay_abc123",\n    "amount": 99.99,\n    "currency": "USD",\n    "customer_id": "cust_456"\n  }\n}',
  'payment.failed': '{\n  "event": "payment.failed",\n  "timestamp": "2024-07-22T12:00:00Z",\n  "data": {\n    "payment_id": "pay_def456",\n    "amount": 49.99,\n    "reason": "insufficient_funds"\n  }\n}',
  'user.created': '{\n  "event": "user.created",\n  "timestamp": "2024-07-22T12:00:00Z",\n  "data": {\n    "user_id": "usr_789",\n    "email": "newuser@example.com",\n    "tenant": "acme.corp"\n  }\n}',
  'api.invoked': '{\n  "event": "api.invoked",\n  "timestamp": "2024-07-22T12:00:00Z",\n  "data": {\n    "api_id": "api_123",\n    "api_name": "Payment Processing API",\n    "method": "POST",\n    "path": "/payments",\n    "latency_ms": 45\n  }\n}',
};

function formatRelativeTime(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'Just now';
}

function WebhookCard({
  webhook,
  onToggle,
  onTest,
  onViewLogs,
  onEdit,
  onDelete,
}: {
  webhook: Webhook;
  onToggle: (id: string) => void;
  onTest: (webhook: Webhook) => void;
  onViewLogs: (webhook: Webhook) => void;
  onEdit: (webhook: Webhook) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isFailed = webhook.status === 'FAILED';
  const isActive = webhook.status === 'ACTIVE';

  const copyUrl = () => {
    navigator.clipboard.writeText(webhook.endpointUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate mock success rate
  const totalAttempts = webhook.failureCount + 20;
  const successRate = ((totalAttempts - webhook.failureCount) / totalAttempts * 100).toFixed(1);

  const visibleEvents = webhook.eventTypes.slice(0, 5);
  const overflowCount = webhook.eventTypes.length - 5;

  return (
    <div
      className={cn(
        'bg-[#2B2F38] border rounded-[10px] p-5 transition-all duration-200 hover:border-[#F59E0B20] hover:-translate-y-0.5',
        isFailed ? 'border-l-[3px] border-l-[#EF4444] border-[#3D434F] bg-[#EF444408]' : 'border-[#3D434F]'
      )}
    >
      {/* Header: name + toggle */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <WebhookIcon className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
          <h3 className="text-[16px] font-bold text-[#E8ECF1] truncate">{webhook.name}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('text-[12px] font-medium', isActive ? 'text-[#10B981]' : isFailed ? 'text-[#EF4444]' : 'text-[#6B7280]')}>
            {isActive ? 'Active' : isFailed ? 'Failed' : 'Inactive'}
          </span>
          <Switch
            checked={isActive}
            onCheckedChange={() => onToggle(webhook.id)}
            className="data-[state=checked]:bg-[#10B981]"
          />
        </div>
      </div>

      {/* Endpoint URL */}
      <div className="flex items-center gap-2 mb-3 bg-[#181A20] px-2 py-2 rounded-md">
        <code className="text-[12px] text-[#9DA5B4] font-mono flex-1 truncate">{webhook.endpointUrl}</code>
        <button
          onClick={copyUrl}
          className="text-[#6B7280] hover:text-[#E8ECF1] transition-colors flex-shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Event types */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {visibleEvents.map(evt => (
          <span key={evt} className="bg-[#3D434F40] text-[#9DA5B4] text-[11px] px-2 py-0.5 rounded">
            {evt}
          </span>
        ))}
        {overflowCount > 0 && (
          <span className="bg-[#3D434F40] text-[#6B7280] text-[11px] px-2 py-0.5 rounded" title={webhook.eventTypes.slice(5).join(', ')}>
            +{overflowCount} more
          </span>
        )}
      </div>

      {/* Health row */}
      <div className="flex items-center gap-4 mb-3 text-[13px]">
        <div className="flex items-center gap-1.5">
          {webhook.lastStatus === 'SUCCESS' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
          )}
          <span className={webhook.lastStatus === 'SUCCESS' ? 'text-[#10B981]' : 'text-[#EF4444]'}>
            {webhook.lastDeliveredAt ? formatRelativeTime(webhook.lastDeliveredAt) : 'Never'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#9DA5B4]">
          <span>Success rate:</span>
          <div className="w-16 h-1.5 bg-[#181A20] rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full', Number(successRate) >= 95 ? 'bg-[#10B981]' : Number(successRate) >= 80 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]')}
              style={{ width: `${successRate}%` }}
            />
          </div>
          <span className={Number(successRate) >= 95 ? 'text-[#10B981]' : Number(successRate) >= 80 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}>
            {successRate}%
          </span>
        </div>
        {webhook.failureCount > 0 && (
          <span className="text-[#EF4444]">{webhook.failureCount} failures</span>
        )}
      </div>

      {/* Retry policy */}
      <div className="text-[12px] text-[#6B7280] mb-4">
        Retries: {webhook.retryPolicy.maxRetries} × {webhook.retryPolicy.retryInterval}s (×{webhook.retryPolicy.backoffMultiplier} backoff)
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-1 pt-3 border-t border-[#3D434F50]">
        <Button variant="ghost" size="sm" className="h-8 text-[12px] text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]" onClick={() => onEdit(webhook)}>
          <Pencil className="w-3.5 h-3.5 mr-1" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-[12px] text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]" onClick={() => onTest(webhook)}>
          <Play className="w-3.5 h-3.5 mr-1" />
          Test
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-[12px] text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]" onClick={() => onViewLogs(webhook)}>
          <FileText className="w-3.5 h-3.5 mr-1" />
          View Logs
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-[12px] text-[#9DA5B4] hover:text-[#EF4444] hover:bg-[#EF444420] ml-auto" onClick={() => onDelete(webhook.id)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isLogsDrawerOpen, setIsLogsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [testEventType, setTestEventType] = useState('');
  const [testPayload, setTestPayload] = useState('');
  const [testResult, setTestResult] = useState<{ status: 'success' | 'failed'; message: string; responseTime?: string } | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  // Create form state
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const [formMaxRetries, setFormMaxRetries] = useState(3);
  const [formRetryInterval, setFormRetryInterval] = useState(30);
  const [formBackoff, setFormBackoff] = useState(2);

  const handleToggle = (id: string) => {
    setWebhooks(prev => prev.map(w =>
      w.id === id ? { ...w, status: w.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' as Webhook['status'] } : w
    ));
  };

  const handleTest = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setTestEventType(webhook.eventTypes[0] || 'payment.success');
    setTestPayload(testPayloads[webhook.eventTypes[0]] || testPayloads['payment.success']);
    setTestResult(null);
    setTestLoading(false);
    setIsTestModalOpen(true);
  };

  const runTest = () => {
    setTestLoading(true);
    setTestResult(null);
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setTestResult({
        status: success ? 'success' : 'failed',
        message: success ? 'Webhook delivered successfully' : 'Connection timeout after 5s',
        responseTime: success ? `${Math.floor(50 + Math.random() * 200)}ms` : undefined,
      });
      setTestLoading(false);
    }, 1500);
  };

  const handleViewLogs = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsLogsDrawerOpen(true);
  };

  const handleEdit = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setFormName(webhook.name);
    setFormUrl(webhook.endpointUrl);
    setFormDesc('');
    setFormEvents([...webhook.eventTypes]);
    setFormMaxRetries(webhook.retryPolicy.maxRetries);
    setFormRetryInterval(webhook.retryPolicy.retryInterval);
    setFormBackoff(webhook.retryPolicy.backoffMultiplier);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const resetForm = () => {
    setFormName('');
    setFormUrl('');
    setFormDesc('');
    setFormEvents([]);
    setFormMaxRetries(3);
    setFormRetryInterval(30);
    setFormBackoff(2);
  };

  const saveWebhook = (isEdit: boolean) => {
    if (!formName || !formUrl) return;
    if (isEdit && selectedWebhook) {
      setWebhooks(prev => prev.map(w => w.id === selectedWebhook.id ? {
        ...w,
        name: formName,
        endpointUrl: formUrl,
        eventTypes: formEvents.length > 0 ? formEvents : w.eventTypes,
        retryPolicy: { ...w.retryPolicy, maxRetries: formMaxRetries, retryInterval: formRetryInterval, backoffMultiplier: formBackoff },
      } : w));
      setIsEditModalOpen(false);
    } else {
      const newWebhook: Webhook = {
        id: `wh-${Date.now()}`,
        name: formName,
        endpointUrl: formUrl,
        eventTypes: formEvents.length > 0 ? formEvents : ['api.invoked'],
        status: 'ACTIVE',
        headers: { 'Content-Type': 'application/json' },
        retryPolicy: { maxRetries: formMaxRetries, retryInterval: formRetryInterval, backoffMultiplier: formBackoff },
        createdAt: new Date().toISOString(),
        failureCount: 0,
      };
      setWebhooks(prev => [...prev, newWebhook]);
      setIsCreateModalOpen(false);
    }
    resetForm();
  };

  const toggleEvent = (event: string) => {
    setFormEvents(prev => prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]);
  };

  const allEventTypes = Array.from(new Set(webhooks.flatMap(w => w.eventTypes)));

  return (
    <Layout>
      <PageHeader
        title="Webhooks"
        subtitle="Manage event-driven webhook integrations"
      >
        <Button
          className="bg-[#4488FF] text-white hover:bg-[#5A9AFF] text-[13px] font-medium"
          onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Webhook
        </Button>
      </PageHeader>

      {/* Webhooks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {webhooks.map(webhook => (
          <WebhookCard
            key={webhook.id}
            webhook={webhook}
            onToggle={handleToggle}
            onTest={handleTest}
            onViewLogs={handleViewLogs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {webhooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <WebhookIcon className="w-12 h-12 text-[#3D434F] mb-4" />
          <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-2">No webhooks configured</h3>
          <p className="text-[13px] text-[#9DA5B4] mb-4">Create your first webhook to start receiving event notifications</p>
          <Button
            className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]"
            onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Webhook
          </Button>
        </div>
      )}

      {/* ---- Test Modal ---- */}
      <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1] max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold flex items-center gap-2">
              <Play className="w-5 h-5 text-[#F59E0B]" />
              Test Webhook: {selectedWebhook?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Event type selector */}
            <div>
              <label className="text-[13px] font-medium text-[#9DA5B4] mb-2 block">Event Type</label>
              <select
                value={testEventType}
                onChange={(e) => {
                  setTestEventType(e.target.value);
                  setTestPayload(testPayloads[e.target.value] || testPayloads['payment.success']);
                  setTestResult(null);
                }}
                className="w-full h-9 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]"
              >
                {(selectedWebhook?.eventTypes || []).map(evt => (
                  <option key={evt} value={evt}>{evt}</option>
                ))}
              </select>
            </div>

            {/* Payload */}
            <div>
              <label className="text-[13px] font-medium text-[#9DA5B4] mb-2 block">Payload (JSON)</label>
              <pre className="bg-[#181A20] border border-[#3D434F] rounded-md p-3 font-mono text-[12px] text-[#9DA5B4] max-h-[200px] overflow-auto whitespace-pre-wrap">
                {testPayload}
              </pre>
            </div>

            {/* Result */}
            {testResult && (
              <div className={cn(
                'p-3 rounded-md border',
                testResult.status === 'success'
                  ? 'bg-[#10B98110] border-[#10B98140] text-[#10B981]'
                  : 'bg-[#EF444410] border-[#EF444440] text-[#EF4444]'
              )}>
                <div className="flex items-center gap-2">
                  {testResult.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-[13px] font-medium">{testResult.message}</span>
                </div>
                {testResult.responseTime && (
                  <div className="mt-1 text-[12px] ml-7">Response time: {testResult.responseTime}</div>
                )}
              </div>
            )}

            {/* Loading */}
            {testLoading && (
              <div className="flex items-center gap-2 text-[#9DA5B4]">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-[13px]">Sending test payload...</span>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsTestModalOpen(false)} className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942]">
              Close
            </Button>
            <Button
              onClick={runTest}
              disabled={testLoading}
              className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---- Logs Drawer ---- */}
      <Dialog open={isLogsDrawerOpen} onOpenChange={setIsLogsDrawerOpen}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1] max-w-[520px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F59E0B]" />
              Delivery Logs: {selectedWebhook?.name}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 mt-4">
            <div className="space-y-2 pr-2">
              {mockWebhookLogs.map((log, idx) => (
                <LogItem key={log.id} log={log} index={idx} />
              ))}
            </div>
          </ScrollArea>

          <div className="pt-4 border-t border-[#3D434F] flex justify-between items-center">
            <span className="text-[12px] text-[#6B7280]">{mockWebhookLogs.length} log entries</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLogsDrawerOpen(false)}
              className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---- Create/Edit Modal ---- */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) { setIsCreateModalOpen(false); setIsEditModalOpen(false); }
      }}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1] max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold">
              {isEditModalOpen ? 'Edit Webhook' : 'Create Webhook'}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details" className="mt-2">
            <TabsList className="bg-[#181A20] border border-[#3D434F]">
              <TabsTrigger value="details" className="text-[12px] data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-[#4488FF]">Details</TabsTrigger>
              <TabsTrigger value="events" className="text-[12px] data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-[#4488FF]">Events</TabsTrigger>
              <TabsTrigger value="retry" className="text-[12px] data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-[#4488FF]">Retry</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div>
                <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Name *</label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Payment Notifications"
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF]"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Endpoint URL *</label>
                <Input
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://hooks.example.com/webhook"
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF]"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Description</label>
                <Textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Optional description..."
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] min-h-[80px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4 mt-4">
              <div className="space-y-2">
                {['api.created', 'api.updated', 'api.deleted', 'api.published', 'api.deprecated', 'subscription.created', 'subscription.cancelled', 'user.login', 'user.logout', 'rate_limit.exceeded', 'application.created', 'payment.success', 'payment.failed'].map(evt => (
                  <label key={evt} className="flex items-center gap-2.5 cursor-pointer hover:bg-[#353942] p-1.5 rounded transition-colors">
                    <input
                      type="checkbox"
                      checked={formEvents.includes(evt)}
                      onChange={() => toggleEvent(evt)}
                      className="w-4 h-4 rounded border-[#3D434F] bg-[#181A20] text-[#4488FF] focus:ring-[#4488FF]"
                    />
                    <span className="text-[13px] text-[#E8ECF1]">{evt}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-[12px] text-[#4488FF] hover:text-[#5A9AFF]" onClick={() => setFormEvents(['api.created', 'api.updated', 'api.deleted', 'api.published', 'api.deprecated', 'subscription.created', 'subscription.cancelled', 'user.login', 'user.logout', 'rate_limit.exceeded', 'application.created', 'payment.success', 'payment.failed'])}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" className="text-[12px] text-[#9DA5B4] hover:text-[#E8ECF1]" onClick={() => setFormEvents([])}>
                  Deselect All
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="retry" className="space-y-4 mt-4">
              <div>
                <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Max Retries (0-10)</label>
                <Input
                  type="number"
                  min={0}
                  max={10}
                  value={formMaxRetries}
                  onChange={(e) => setFormMaxRetries(Number(e.target.value))}
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Retry Interval (seconds)</label>
                <Input
                  type="number"
                  min={1}
                  value={formRetryInterval}
                  onChange={(e) => setFormRetryInterval(Number(e.target.value))}
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]"
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Backoff Multiplier</label>
                <Input
                  type="number"
                  min={1}
                  step={0.5}
                  value={formBackoff}
                  onChange={(e) => setFormBackoff(Number(e.target.value))}
                  className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
              className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveWebhook(isEditModalOpen)}
              disabled={!formName || !formUrl}
              className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]"
            >
              {isEditModalOpen ? 'Save Changes' : 'Save Webhook'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

// ---- Log Item Component ----
function LogItem({ log, index }: { log: WebhookLog; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = log.status === 'SUCCESS' ? 'text-[#10B981]' : 'text-[#EF4444]';
  const responseColor = log.responseStatus >= 500 ? 'bg-[#EF444420] text-[#EF4444]' : log.responseStatus >= 400 ? 'bg-[#F59E0B20] text-[#F59E0B]' : 'bg-[#10B98120] text-[#10B981]';

  return (
    <div
      className={cn(
        'bg-[#21242B] border border-[#3D434F50] rounded-lg p-3 transition-all',
        expanded && 'border-[#3D434F]'
      )}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className={cn('w-2 h-2 rounded-full flex-shrink-0', log.status === 'SUCCESS' ? 'bg-[#10B981]' : 'bg-[#EF4444]')} />
        <span className="text-[12px] text-[#6B7280] w-16 flex-shrink-0">{formatRelativeTime(log.timestamp)}</span>
        <Badge variant="secondary" className="bg-[#3D434F40] text-[#9DA5B4] text-[11px] flex-shrink-0">
          {log.eventType}
        </Badge>
        <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0', responseColor)}>
          {log.responseStatus}
        </span>
        <span className="text-[12px] text-[#6B7280] ml-auto flex-shrink-0">{log.responseTime}</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[#6B7280] hover:text-[#E8ECF1] flex-shrink-0"
        >
          <ChevronRight className={cn('w-3.5 h-3.5 transition-transform', expanded && 'rotate-90')} />
        </button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-[#3D434F50] space-y-2">
          <div>
            <div className="text-[11px] text-[#6B7280] uppercase mb-1">Request Body</div>
            <pre className="bg-[#181A20] p-2 rounded font-mono text-[11px] text-[#9DA5B4] overflow-x-auto">
              {log.requestBody}
            </pre>
          </div>
          {log.responseBody && (
            <div>
              <div className="text-[11px] text-[#6B7280] uppercase mb-1">Response Body</div>
              <pre className="bg-[#181A20] p-2 rounded font-mono text-[11px] text-[#9DA5B4] overflow-x-auto">
                {log.responseBody}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

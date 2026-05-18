import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Webhook, Trash2, Plus, Send, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface WebhookItem {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secretKey: string;
  createdAt: string;
  deliveries: Delivery[];
}

interface Delivery {
  id: string;
  timestamp: string;
  status: 'success' | 'failed';
  statusCode: number;
  responseTime: number;
}

const availableEvents = [
  'API_CREATED', 'API_PUBLISHED', 'API_DEPRECATED', 'API_DELETED',
  'SUBSCRIPTION_CREATED', 'SUBSCRIPTION_DELETED',
  'USER_REGISTERED', 'USER_LOGIN',
  'APPLICATION_CREATED', 'APPLICATION_DELETED',
  'THROTTLE_POLICY_CHANGED',
];

const initialWebhooks: WebhookItem[] = [
  {
    id: 'wh-1',
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/T123/B456/xxxx',
    events: ['API_PUBLISHED', 'API_DEPRECATED', 'SUBSCRIPTION_CREATED'],
    status: 'active',
    secretKey: 'whsec_xxxxxxxxxxxx',
    createdAt: '2025-02-01T10:00:00Z',
    deliveries: [
      { id: 'd1', timestamp: '2025-05-17T10:30:00Z', status: 'success', statusCode: 200, responseTime: 120 },
      { id: 'd2', timestamp: '2025-05-17T09:15:00Z', status: 'success', statusCode: 200, responseTime: 98 },
      { id: 'd3', timestamp: '2025-05-16T14:00:00Z', status: 'failed', statusCode: 500, responseTime: 5200 },
    ],
  },
  {
    id: 'wh-2',
    name: 'Microsoft Teams Alerts',
    url: 'https://teams.webhook.office.com/webhookb2/abc/IncomingWebhook/xyz',
    events: ['USER_REGISTERED', 'APPLICATION_CREATED', 'THROTTLE_POLICY_CHANGED'],
    status: 'active',
    secretKey: 'whsec_yyyyyyyyyyyy',
    createdAt: '2025-02-15T10:00:00Z',
    deliveries: [
      { id: 'd4', timestamp: '2025-05-17T08:45:00Z', status: 'success', statusCode: 202, responseTime: 340 },
      { id: 'd5', timestamp: '2025-05-16T11:20:00Z', status: 'success', statusCode: 202, responseTime: 280 },
    ],
  },
  {
    id: 'wh-3',
    name: 'Custom Dashboard Sync',
    url: 'https://dashboard.internal.company.com/webhooks/vedadb',
    events: ['API_CREATED', 'API_DELETED', 'SUBSCRIPTION_CREATED', 'SUBSCRIPTION_DELETED'],
    status: 'inactive',
    secretKey: 'whsec_zzzzzzzzzzzz',
    createdAt: '2025-03-01T10:00:00Z',
    deliveries: [
      { id: 'd6', timestamp: '2025-05-15T16:00:00Z', status: 'failed', statusCode: 404, responseTime: 150 },
      { id: 'd7', timestamp: '2025-05-14T09:30:00Z', status: 'failed', statusCode: 503, responseTime: 3000 },
    ],
  },
  {
    id: 'wh-4',
    name: 'PagerDuty Incidents',
    url: 'https://events.pagerduty.com/v2/enqueue',
    events: ['API_DEPRECATED', 'THROTTLE_POLICY_CHANGED'],
    status: 'active',
    secretKey: 'whsec_pagerduty_key',
    createdAt: '2025-03-15T10:00:00Z',
    deliveries: [
      { id: 'd8', timestamp: '2025-05-17T07:00:00Z', status: 'success', statusCode: 202, responseTime: 210 },
      { id: 'd9', timestamp: '2025-05-12T13:45:00Z', status: 'success', statusCode: 202, responseTime: 185 },
    ],
  },
];

export function WebhooksPage() {
  usePageTitle('Webhooks | VedaDB API Manager');
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(initialWebhooks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedWebhook, setExpandedWebhook] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', url: '', events: [] as string[], secretKey: '' });

  const toggleStatus = (id: string) => {
    setWebhooks(prev => prev.map(wh => wh.id === id ? { ...wh, status: wh.status === 'active' ? 'inactive' : 'active' as const } : wh));
    toast.success('Webhook status updated');
  };

  const handleCreate = () => {
    if (!form.name || !form.url) { toast.error('Name and URL are required'); return; }
    const newWebhook: WebhookItem = {
      id: 'wh-' + Date.now(),
      name: form.name,
      url: form.url,
      events: form.events,
      status: 'active',
      secretKey: form.secretKey || 'whsec_' + Math.random().toString(36).substring(2, 14),
      createdAt: new Date().toISOString(),
      deliveries: [],
    };
    setWebhooks(prev => [...prev, newWebhook]);
    setDialogOpen(false);
    setForm({ name: '', url: '', events: [], secretKey: '' });
    toast.success('Webhook created');
  };

  const handleDelete = (id: string) => {
    setWebhooks(prev => prev.filter(wh => wh.id !== id));
    setConfirmDelete(null);
    toast.success('Webhook deleted');
  };

  const testWebhook = (wh: WebhookItem) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setWebhooks(prev => prev.map(w => {
            if (w.id !== wh.id) return w;
            return {
              ...w,
              deliveries: [{
                id: 'd-' + Date.now(),
                timestamp: new Date().toISOString(),
                status: 'success' as const,
                statusCode: 200,
                responseTime: Math.floor(Math.random() * 300) + 50,
              }, ...w.deliveries].slice(0, 10),
            };
          }));
          resolve(true);
        }, 1500);
      }),
      { loading: 'Sending test payload...', success: 'Webhook test delivered successfully', error: 'Webhook test failed' }
    );
  };

  const toggleEvent = (event: string) => {
    setForm(prev => ({
      ...prev,
      events: prev.events.includes(event) ? prev.events.filter(e => e !== event) : [...prev.events, event],
    }));
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Webhooks</h2>
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto gap-2"><Plus className="w-4 h-4" />Create Webhook</Button>
      </div>

      <div className="space-y-3">
        {webhooks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-xs sm:text-sm">No webhooks configured</div>
        ) : (
          webhooks.map(wh => (
            <Card key={wh.id}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Webhook className={`w-5 h-5 mt-0.5 shrink-0 ${wh.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm sm:text-base">{wh.name}</span>
                        <Badge variant={wh.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{wh.status}</Badge>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-mono mt-0.5">{wh.url}</p>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {wh.events.map(e => (
                          <Badge key={e} variant="outline" className="text-[10px]">{e}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-7 gap-1" onClick={() => testWebhook(wh)}><Send className="w-3 h-3" />Test</Button>
                    <Switch checked={wh.status === 'active'} onCheckedChange={() => toggleStatus(wh.id)} />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setConfirmDelete(wh.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpandedWebhook(expandedWebhook === wh.id ? null : wh.id)}>
                      {expandedWebhook === wh.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {expandedWebhook === wh.id && (
                  <div className="mt-3 pt-3 border-t">
                    <h4 className="text-xs sm:text-sm font-medium mb-2">Delivery History</h4>
                    {wh.deliveries.length === 0 ? (
                      <p className="text-[10px] sm:text-xs text-muted-foreground">No deliveries yet</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-[10px] sm:text-xs">Time</TableHead>
                            <TableHead className="text-[10px] sm:text-xs">Status</TableHead>
                            <TableHead className="text-[10px] sm:text-xs">Code</TableHead>
                            <TableHead className="text-[10px] sm:text-xs">Response Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {wh.deliveries.map(d => (
                            <TableRow key={d.id}>
                              <TableCell className="text-[10px] sm:text-xs whitespace-nowrap">{new Date(d.timestamp).toLocaleString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  {d.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                                  <span className="text-[10px] sm:text-xs capitalize">{d.status}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-[10px] sm:text-xs font-mono">{d.statusCode}</TableCell>
                              <TableCell className="text-[10px] sm:text-xs">{d.responseTime}ms</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">Create Webhook</DialogTitle><DialogDescription className="text-xs sm:text-sm">Configure a new webhook endpoint to receive event notifications.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Name</Label><Input className="text-xs sm:text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Slack Notifications" /></div>
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">URL</Label><Input className="text-xs sm:text-sm" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://hooks.example.com/..." /></div>
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Secret Key (optional)</Label><Input className="text-xs sm:text-sm" value={form.secretKey} onChange={e => setForm({...form, secretKey: e.target.value})} placeholder="whsec_..." /></div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Events</Label>
              <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                {availableEvents.map(event => (
                  <div key={event} className="flex items-center gap-2">
                    <input type="checkbox" id={event} checked={form.events.includes(event)} onChange={() => toggleEvent(event)} className="rounded" />
                    <Label htmlFor={event} className="text-[10px] sm:text-xs cursor-pointer">{event}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button onClick={handleCreate} className="w-full sm:w-auto text-xs sm:text-sm">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base">Delete Webhook?</DialogTitle><DialogDescription className="text-xs sm:text-sm">This will permanently remove the webhook configuration.</DialogDescription></DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)} className="w-full sm:w-auto text-xs sm:text-sm">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

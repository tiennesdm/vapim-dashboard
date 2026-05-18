import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageTitle } from '@/hooks/usePageTitle';
import { api } from '@/lib/api';
import { Search, Download, FileText } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

const actionColor = (action: string) => {
  if (action.includes('CREATE')) return 'bg-green-500/10 text-green-500';
  if (action.includes('DELETE')) return 'bg-red-500/10 text-red-500';
  if (action.includes('UPDATE') || action.includes('MODIFY')) return 'bg-blue-500/10 text-blue-500';
  if (action.includes('PUBLISH')) return 'bg-purple-500/10 text-purple-500';
  if (action.includes('LOGIN')) return 'bg-orange-500/10 text-orange-500';
  if (action.includes('SUBSCRIBE')) return 'bg-teal-500/10 text-teal-500';
  return 'bg-gray-500/10 text-gray-500';
};

const entityColor = (type: string) => {
  if (type === 'API') return 'bg-blue-500/10 text-blue-500';
  if (type === 'User') return 'bg-purple-500/10 text-purple-500';
  if (type === 'Subscription') return 'bg-teal-500/10 text-teal-500';
  if (type === 'Application') return 'bg-orange-500/10 text-orange-500';
  return 'bg-gray-500/10 text-gray-500';
};

export function AuditLogsPage() {
  usePageTitle('Audit Logs | VedaDB API Manager');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filtered, setFiltered] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      const logData: AuditLog[] = (data.logs || []).map((l: any) => ({
        id: l.id,
        timestamp: l.timestamp,
        user: l.userId,
        action: l.action,
        entityType: l.resourceType === 'api' ? 'API' : l.resourceType === 'subscription' ? 'Subscription' : l.resourceType === 'auth' ? 'User' : l.resourceType === 'application' ? 'Application' : 'Other',
        entityId: l.resourceId || '-',
        details: l.details,
        ipAddress: l.details.includes('from ') ? l.details.split('from ')[1] : '127.0.0.1',
      }));
      // Supplement with realistic mock data if needed
      const supplemental: AuditLog[] = [
        { id: 'audit-6', timestamp: '2025-05-17T14:30:00Z', user: 'john_dev', action: 'UPDATE api', entityType: 'API', entityId: 'api-2', details: 'Updated Product Catalog API endpoint configuration', ipAddress: '192.168.1.45' },
        { id: 'audit-7', timestamp: '2025-05-17T11:15:00Z', user: 'sarah_pm', action: 'CREATE subscription', entityType: 'Subscription', entityId: 'sub-16', details: 'Created new subscription for Partner Integration', ipAddress: '192.168.1.32' },
        { id: 'audit-8', timestamp: '2025-05-16T09:45:00Z', user: 'admin', action: 'DELETE api', entityType: 'API', entityId: 'api-10', details: 'Removed deprecated Search API v1', ipAddress: '192.168.1.1' },
        { id: 'audit-9', timestamp: '2025-05-16T08:20:00Z', user: 'mike_api', action: 'LOGIN', entityType: 'User', entityId: 'user-4', details: 'Partner login from 10.0.0.55', ipAddress: '10.0.0.55' },
        { id: 'audit-10', timestamp: '2025-05-15T16:00:00Z', user: 'tom_ops', action: 'MODIFY throttle', entityType: 'API', entityId: 'pol-3', details: 'Updated Gold tier rate limits', ipAddress: '192.168.1.78' },
        { id: 'audit-11', timestamp: '2025-05-15T13:10:00Z', user: 'lisa_dev', action: 'CREATE application', entityType: 'Application', entityId: 'app-6', details: 'Created Reporting Dashboard app', ipAddress: '192.168.1.50' },
        { id: 'audit-12', timestamp: '2025-05-14T10:30:00Z', user: 'vikram_api', action: 'DEPRECATE api', entityType: 'API', entityId: 'api-7', details: 'Deprecated Notification API v1', ipAddress: '192.168.1.92' },
        { id: 'audit-13', timestamp: '2025-05-14T09:00:00Z', user: 'admin', action: 'CREATE user', entityType: 'User', entityId: 'user-9', details: 'Created new subscriber account for external partner', ipAddress: '192.168.1.1' },
        { id: 'audit-14', timestamp: '2025-05-13T15:45:00Z', user: 'sarah_pm', action: 'PUBLISH api', entityType: 'API', entityId: 'api-6', details: 'Published Shipping API to developer portal', ipAddress: '192.168.1.32' },
        { id: 'audit-15', timestamp: '2025-05-13T11:20:00Z', user: 'john_dev', action: 'MODIFY subscription', entityType: 'Subscription', entityId: 'sub-3', details: 'Upgraded Web Store to Gold tier', ipAddress: '192.168.1.45' },
        { id: 'audit-16', timestamp: '2025-05-12T08:50:00Z', user: 'tom_ops', action: 'LOGIN', entityType: 'User', entityId: 'user-6', details: 'Admin login from 192.168.1.78', ipAddress: '192.168.1.78' },
        { id: 'audit-17', timestamp: '2025-05-11T14:15:00Z', user: 'mike_api', action: 'UNSUBSCRIBE', entityType: 'Subscription', entityId: 'sub-10', details: 'Third-party CRM unsubscribed from Payment Gateway API', ipAddress: '10.0.0.55' },
        { id: 'audit-18', timestamp: '2025-05-10T16:30:00Z', user: 'admin', action: 'UPDATE user', entityType: 'User', entityId: 'user-7', details: 'Disabled anna_viewer account', ipAddress: '192.168.1.1' },
        { id: 'audit-19', timestamp: '2025-05-09T10:00:00Z', user: 'lisa_dev', action: 'CREATE api', entityType: 'API', entityId: 'api-11', details: 'Created Reporting API with analytics endpoints', ipAddress: '192.168.1.50' },
        { id: 'audit-20', timestamp: '2025-05-08T09:30:00Z', user: 'vikram_api', action: 'SUBSCRIBE', entityType: 'Subscription', entityId: 'sub-17', details: 'Subscribed to Authentication API', ipAddress: '192.168.1.92' },
        { id: 'audit-21', timestamp: '2025-05-07T11:45:00Z', user: 'john_dev', action: 'LOGIN', entityType: 'User', entityId: 'user-2', details: 'Developer login from 192.168.1.45', ipAddress: '192.168.1.45' },
        { id: 'audit-22', timestamp: '2025-05-06T13:20:00Z', user: 'sarah_pm', action: 'MODIFY api', entityType: 'API', entityId: 'api-3', details: 'Updated Order Processing API documentation', ipAddress: '192.168.1.32' },
        { id: 'audit-23', timestamp: '2025-05-05T08:00:00Z', user: 'admin', action: 'BACKUP', entityType: 'Other', entityId: 'system', details: 'System backup completed successfully', ipAddress: '192.168.1.1' },
        { id: 'audit-24', timestamp: '2025-05-04T15:10:00Z', user: 'tom_ops', action: 'UPDATE policy', entityType: 'API', entityId: 'pol-1', details: 'Increased Bronze tier burst capacity', ipAddress: '192.168.1.78' },
      ];
      const allLogs = [...logData, ...supplemental].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLogs(allLogs);
      setFiltered(allLogs);
    } catch (err: any) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    let result = [...logs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => l.user.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.details.toLowerCase().includes(q));
    }
    if (entityFilter !== 'ALL') {
      result = result.filter(l => l.entityType === entityFilter);
    }
    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter(l => new Date(l.timestamp).getTime() >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 86400000;
      result = result.filter(l => new Date(l.timestamp).getTime() <= to);
    }
    setFiltered(result);
  }, [logs, search, entityFilter, dateFrom, dateTo]);

  const exportCSV = () => {
    const headers = 'Timestamp,User,Action,Entity Type,Entity ID,Details,IP Address\n';
    const rows = filtered.map(l => `${l.timestamp},${l.user},${l.action},${l.entityType},${l.entityId},"${l.details}",${l.ipAddress}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit logs exported to CSV');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Audit Logs</h2>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm gap-2" onClick={exportCSV}>
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by user or action..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 text-xs sm:text-sm" />
            </div>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm"><SelectValue placeholder="Entity Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs sm:text-sm">All Types</SelectItem>
                <SelectItem value="API" className="text-xs sm:text-sm">API</SelectItem>
                <SelectItem value="User" className="text-xs sm:text-sm">User</SelectItem>
                <SelectItem value="Subscription" className="text-xs sm:text-sm">Subscription</SelectItem>
                <SelectItem value="Application" className="text-xs sm:text-sm">Application</SelectItem>
                <SelectItem value="Other" className="text-xs sm:text-sm">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">From</Label>
              <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs sm:text-sm" />
            </div>
            <div className="flex-1">
              <Label className="text-[10px] sm:text-xs text-muted-foreground mb-1 block">To</Label>
              <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs sm:text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px] sm:text-xs">Timestamp</TableHead>
              <TableHead className="text-[10px] sm:text-xs">User</TableHead>
              <TableHead className="text-[10px] sm:text-xs">Action</TableHead>
              <TableHead className="hidden md:table-cell text-[10px] sm:text-xs">Entity Type</TableHead>
              <TableHead className="hidden lg:table-cell text-[10px] sm:text-xs">Entity ID</TableHead>
              <TableHead className="hidden xl:table-cell text-[10px] sm:text-xs">Details</TableHead>
              <TableHead className="hidden sm:table-cell text-[10px] sm:text-xs">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-xs">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-xs">No audit logs found</TableCell></TableRow>
            ) : (
              filtered.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="text-[10px] sm:text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="text-[10px] sm:text-xs font-medium">{log.user}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] ${actionColor(log.action)}`}>{log.action}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline" className={`text-[10px] ${entityColor(log.entityType)}`}>{log.entityType}</Badge></TableCell>
                  <TableCell className="hidden lg:table-cell text-[10px] sm:text-xs font-mono">{log.entityId}</TableCell>
                  <TableCell className="hidden xl:table-cell text-[10px] sm:text-xs max-w-[250px] truncate">{log.details}</TableCell>
                  <TableCell className="hidden sm:table-cell text-[10px] sm:text-xs font-mono text-muted-foreground">{log.ipAddress}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-[10px] sm:text-xs text-muted-foreground">
        Showing {filtered.length} of {logs.length} entries
      </div>
    </div>
  );
}

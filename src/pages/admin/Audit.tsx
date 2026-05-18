import { useState, useMemo, useCallback } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { mockAuditLogs, formatRelativeTime } from '@/lib/data';
import type { AuditLog } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Download,
  FileText,
  Search,
  X,
  ChevronDown,
  Copy,
  Check,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

// ---- Severity config ----
const severityConfig = {
  INFO: { bg: 'bg-[#3B82F620]', text: 'text-[#3B82F6]', border: 'border-[#3B82F640]', dot: 'bg-[#3B82F6]' },
  WARNING: { bg: 'bg-[#F59E0B20]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B40]', dot: 'bg-[#F59E0B]' },
  ERROR: { bg: 'bg-[#EF444420]', text: 'text-[#EF4444]', border: 'border-[#EF444440]', dot: 'bg-[#EF4444]' },
  CRITICAL: { bg: 'bg-[#EF4444]', text: 'text-white', border: 'border-[#EF4444]', dot: 'bg-white' },
};

const actionConfig: Record<string, { bg: string; text: string }> = {
  CREATE: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  UPDATE: { bg: 'bg-[#4488FF20]', text: 'text-[#4488FF]' },
  DELETE: { bg: 'bg-[#EF444420]', text: 'text-[#EF4444]' },
  LOGIN: { bg: 'bg-[#8B5CF620]', text: 'text-[#8B5CF6]' },
  LOGOUT: { bg: 'bg-[#8B5CF620]', text: 'text-[#8B5CF6]' },
  DEPLOY: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  SUBSCRIBE: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  USER_LOGIN: { bg: 'bg-[#8B5CF620]', text: 'text-[#8B5CF6]' },
  API_CREATED: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  API_DEPRECATED: { bg: 'bg-[#F59E0B20]', text: 'text-[#F59E0B]' },
  DEPLOYMENT_FAILED: { bg: 'bg-[#EF444420]', text: 'text-[#EF4444]' },
  SUBSCRIPTION_CREATED: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  API_BLOCKED: { bg: 'bg-[#EF444420]', text: 'text-[#EF4444]' },
  USER_CREATED: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  RATE_LIMIT_EXCEEDED: { bg: 'bg-[#F59E0B20]', text: 'text-[#F59E0B]' },
  API_PUBLISHED: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  TENANT_UPDATED: { bg: 'bg-[#4488FF20]', text: 'text-[#4488FF]' },
  WEBHOOK_DELIVERY_FAILED: { bg: 'bg-[#EF444420]', text: 'text-[#EF4444]' },
  POLICY_CREATED: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  CERT_EXPIRING: { bg: 'bg-[#F59E0B20]', text: 'text-[#F59E0B]' },
  APPLICATION_UPDATED: { bg: 'bg-[#4488FF20]', text: 'text-[#4488FF]' },
  SECURITY_ALERT: { bg: 'bg-[#EF444420]', text: 'text-[#EF4444]' },
  GATEWAY_HEALTH_CHECK: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  API_IMPORTED: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  QUOTA_WARNING: { bg: 'bg-[#F59E0B20]', text: 'text-[#F59E0B]' },
  SETTINGS_UPDATED: { bg: 'bg-[#4488FF20]', text: 'text-[#4488FF]' },
  DATABASE_BACKUP_FAILED: { bg: 'bg-[#EF444420]', text: 'text-[#EF4444]' },
  USER_ROLE_CHANGED: { bg: 'bg-[#4488FF20]', text: 'text-[#4488FF]' },
  API_SUBSCRIBED: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
  GATEWAY_SLOW_RESPONSE: { bg: 'bg-[#F59E0B20]', text: 'text-[#F59E0B]' },
  LIFECYCLE_CHANGED: { bg: 'bg-[#4488FF20]', text: 'text-[#4488FF]' },
  REPORT_GENERATED: { bg: 'bg-[#10B98120]', text: 'text-[#10B981]' },
};

// ---- Filter options ----
const severityOptions: Array<'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'> = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
const actionOptions = ['All Actions', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'DEPLOY', 'USER_LOGIN', 'API_CREATED', 'API_DEPRECATED', 'DEPLOYMENT_FAILED', 'SUBSCRIPTION_CREATED', 'API_BLOCKED', 'USER_CREATED', 'RATE_LIMIT_EXCEEDED', 'API_PUBLISHED', 'TENANT_UPDATED', 'WEBHOOK_DELIVERY_FAILED', 'POLICY_CREATED', 'CERT_EXPIRING', 'APPLICATION_UPDATED', 'SECURITY_ALERT', 'GATEWAY_HEALTH_CHECK', 'API_IMPORTED', 'QUOTA_WARNING', 'SETTINGS_UPDATED', 'DATABASE_BACKUP_FAILED', 'USER_ROLE_CHANGED', 'API_SUBSCRIBED', 'GATEWAY_SLOW_RESPONSE', 'LIFECYCLE_CHANGED', 'REPORT_GENERATED'];
const resourceTypeOptions = ['All Types', 'API', 'APPLICATION', 'USER', 'POLICY', 'GATEWAY', 'TENANT', 'SUBSCRIPTION', 'WEBHOOK', 'AUTH', 'DEPLOYMENT', 'THROTTLE', 'SECURITY', 'SETTINGS', 'QUOTA', 'DATABASE', 'REPORT'];
const statusOptions = ['All', 'SUCCESS', 'FAILED'];

function SeverityBadge({ severity }: { severity: AuditLog['severity'] }) {
  const cfg = severityConfig[severity];
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-[0.04em] border', cfg.bg, cfg.text, cfg.border)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {severity}
    </span>
  );
}

function ActionBadge({ action }: { action: string }) {
  const cfg = actionConfig[action] || { bg: 'bg-[#3D434F]', text: 'text-[#9DA5B4]' };
  return (
    <span className={cn('inline-flex px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-[0.04em]', cfg.bg, cfg.text)}>
      {action}
    </span>
  );
}

function StatusDot({ status }: { status: AuditLog['status'] }) {
  return (
    <div className="flex items-center justify-center">
      <div className={cn('w-2.5 h-2.5 rounded-full', status === 'SUCCESS' ? 'bg-[#10B981]' : 'bg-[#EF4444]')} />
    </div>
  );
}

function formatDateTime(ts: string) {
  const d = new Date(ts);
  return {
    absolute: d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    relative: formatRelativeTime(ts),
  };
}

// ---- Export helpers ----
function exportToCSV(logs: AuditLog[]) {
  const headers = ['Timestamp', 'Severity', 'Action', 'User', 'Resource', 'Resource Type', 'Details', 'IP Address', 'Status'];
  const rows = logs.map(l => [
    l.timestamp, l.severity, l.action, l.user, l.resource, l.resourceType, l.details, l.ipAddress, l.status
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToPDF(logs: AuditLog[]) {
  // Frontend PDF generation via window.print would need a print stylesheet
  // For now, export as formatted text
  let text = 'AUDIT LOGS REPORT\n';
  text += `Generated: ${new Date().toLocaleString()}\n\n`;
  text += '─'.repeat(120) + '\n';
  logs.forEach(l => {
    text += `[${l.timestamp}] ${l.severity} | ${l.action} | User: ${l.user} | Resource: ${l.resource} (${l.resourceType}) | IP: ${l.ipAddress} | ${l.status}\n`;
    text += `  Details: ${l.details}\n`;
    text += '─'.repeat(120) + '\n';
  });
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Audit() {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState('All Actions');
  const [selectedResourceType, setSelectedResourceType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [userFilter, setUserFilter] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Date range filter (simplified as last N days)
  const [dateRange, setDateRange] = useState('7');

  const filteredLogs = useMemo(() => {
    let result = [...mockAuditLogs];

    // Search across all fields
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.user.toLowerCase().includes(q) ||
        l.resource.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.ipAddress.includes(q)
      );
    }

    // Severity filter
    if (selectedSeverities.length > 0) {
      result = result.filter(l => selectedSeverities.includes(l.severity));
    }

    // Action filter
    if (selectedAction !== 'All Actions') {
      result = result.filter(l => l.action === selectedAction);
    }

    // Resource type filter
    if (selectedResourceType !== 'All Types') {
      result = result.filter(l => l.resourceType.toUpperCase() === selectedResourceType);
    }

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter(l => l.status === selectedStatus);
    }

    // User filter
    if (userFilter) {
      result = result.filter(l => l.user.toLowerCase().includes(userFilter.toLowerCase()));
    }

    // Sort by timestamp descending
    result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return result;
  }, [searchQuery, selectedSeverities, selectedAction, selectedResourceType, selectedStatus, userFilter]);

  // Stats
  const todayCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return mockAuditLogs.filter(l => l.timestamp.startsWith(today)).length;
  }, []);
  const weekCount = mockAuditLogs.length;
  const criticalCount = useMemo(() => mockAuditLogs.filter(l => l.severity === 'CRITICAL').length, []);

  const toggleSeverity = (s: string) => {
    setSelectedSeverities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSeverities([]);
    setSelectedAction('All Actions');
    setSelectedResourceType('All Types');
    setSelectedStatus('All');
    setUserFilter('');
  };

  const hasActiveFilters = searchQuery || selectedSeverities.length > 0 || selectedAction !== 'All Actions' ||
    selectedResourceType !== 'All Types' || selectedStatus !== 'All' || userFilter;

  const copyJson = useCallback((log: AuditLog) => {
    const json = JSON.stringify(log, null, 2);
    navigator.clipboard.writeText(json).catch(() => {});
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  }, []);

  return (
    <Layout>
      {/* Page Header */}
      <PageHeader
        title="Audit Logs"
        subtitle="Track all platform activities and changes"
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Stats */}
          <div className="flex items-center gap-2 mr-2">
            <Badge variant="secondary" className="bg-[#2B2F38] text-[#9DA5B4] border-[#3D434F]">
              Today: {todayCount} events
            </Badge>
            <Badge variant="secondary" className="bg-[#2B2F38] text-[#9DA5B4] border-[#3D434F]">
              This week: {weekCount} events
            </Badge>
            {criticalCount > 0 && (
              <Badge variant="destructive" className="bg-[#EF444420] text-[#EF4444] border-[#EF444440]">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Critical: {criticalCount}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF50]"
            onClick={() => exportToCSV(filteredLogs)}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF50]"
            onClick={() => exportToPDF(filteredLogs)}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </PageHeader>

      {/* Advanced Filter Bar */}
      <div className="mb-6 p-4 bg-[#2B2F38] border border-[#3D434F] rounded-lg">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF]"
            />
          </div>

          {/* Severity multi-select toggles */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#6B7280] mr-1">Severity:</span>
            {severityOptions.map(s => (
              <button
                key={s}
                onClick={() => toggleSeverity(s)}
                className={cn(
                  'px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-[0.04em] border transition-all duration-150',
                  selectedSeverities.includes(s)
                    ? severityConfig[s].bg + ' ' + severityConfig[s].text + ' ' + severityConfig[s].border
                    : 'bg-[#181A20] text-[#6B7280] border-[#3D434F] hover:border-[#9DA5B4]'
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Action dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#6B7280] mr-1">Action:</span>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="h-8 px-2 bg-[#181A20] border border-[#3D434F] rounded-md text-[12px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]"
            >
              {actionOptions.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Resource type */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#6B7280] mr-1">Type:</span>
            <select
              value={selectedResourceType}
              onChange={(e) => setSelectedResourceType(e.target.value)}
              className="h-8 px-2 bg-[#181A20] border border-[#3D434F] rounded-md text-[12px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]"
            >
              {resourceTypeOptions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-[#6B7280] mr-1">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-8 px-2 bg-[#181A20] border border-[#3D434F] rounded-md text-[12px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]"
            >
              {statusOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* User filter */}
          <div className="relative w-44">
            <Input
              placeholder="Filter by user..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="h-8 bg-[#181A20] border-[#3D434F] text-[12px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF]"
            />
          </div>

          {/* Clear all */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]"
              onClick={clearAllFilters}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {/* Active filter count */}
        {hasActiveFilters && (
          <div className="mt-2 text-[12px] text-[#6B7280]">
            Showing {filteredLogs.length} of {mockAuditLogs.length} logs
          </div>
        )}
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-x-auto rounded-lg border border-[#3D434F50]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#1E2128]">
              <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-[15%]">Timestamp</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-[8%]">Severity</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-[12%]">User</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-[10%]">Action</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-[13%]">Resource</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-[24%]">Details</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-[8%]">IP Address</th>
              <th className="px-4 py-3 text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] w-[5%] text-center">Status</th>
              <th className="px-4 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx) => {
              const dt = formatDateTime(log.timestamp);
              const isExpanded = expandedRow === log.id;
              return (
                <>
                  <tr
                    key={log.id}
                    className={cn(
                      'h-[52px] transition-colors duration-100 border-b border-[#3D434F50]',
                      idx % 2 === 0 ? 'bg-[#21242B]' : 'bg-[#2B2F38]',
                      'hover:bg-[#353942]'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="font-mono text-[13px] text-[#E8ECF1]">{dt.absolute}</div>
                      <div className="text-[12px] text-[#6B7280]">{dt.relative}</div>
                    </td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={log.severity} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#4488FF] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                          {log.user.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[13px] text-[#E8ECF1] truncate" title={log.user}>{log.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-semibold text-[#E8ECF1] truncate">{log.resource}</div>
                      <div className="text-[11px] text-[#6B7280] uppercase">{log.resourceType}</div>
                    </td>
                    <td
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                    >
                      <div className={cn('text-[13px] text-[#9DA5B4]', !isExpanded && 'line-clamp-2')}>
                        {log.details}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-[#6B7280]">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusDot status={log.status} />
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                        className="text-[#6B7280] hover:text-[#E8ECF1] transition-colors"
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')} />
                      </button>
                    </td>
                  </tr>
                  {/* Expanded row detail */}
                  {isExpanded && (
                    <tr key={`${log.id}-detail`}>
                      <td colSpan={9} className="bg-[#1E2128] border-l-[3px] border-l-[#4488FF]">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-[13px] font-semibold text-[#E8ECF1]">Full Log Entry (JSON)</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[12px] text-[#9DA5B4] hover:text-[#E8ECF1]"
                              onClick={() => copyJson(log)}
                            >
                              {copiedJson ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                              {copiedJson ? 'Copied' : 'Copy JSON'}
                            </Button>
                          </div>
                          <pre className="bg-[#181A20] p-3 rounded-md border border-[#3D434F] font-mono text-[12px] text-[#9DA5B4] overflow-x-auto">
                            {JSON.stringify(log, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="w-10 h-10 text-[#3D434F]" />
                    <p className="text-[16px] font-semibold text-[#E8ECF1]">No logs match your filters</p>
                    <p className="text-[13px] text-[#9DA5B4]">Try adjusting your filter criteria</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
                      onClick={clearAllFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

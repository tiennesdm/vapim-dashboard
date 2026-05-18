import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import { mockSubscriptions } from '@/lib/data';
import type { Subscription } from '@/lib/data';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const tierConfig: Record<string, { bg: string; text: string; border: string }> = {
  Gold:     { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40' },
  Silver:   { bg: '#9DA5B420', text: '#9DA5B4', border: '#9DA5B440' },
  Bronze:   { bg: '#B4530920', text: '#B45309', border: '#B4530940' },
  Unlimited:{ bg: '#4488FF20', text: '#4488FF', border: '#4488FF40' },
  Free:     { bg: '#10B98120', text: '#10B981', border: '#10B98140' },
};

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  ACTIVE:  { bg: '#10B98120', text: '#10B981', border: '#10B98140' },
  BLOCKED: { bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
  ON_HOLD: { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40' },
  REJECTED:{ bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
};

const filterStatusOptions = ['ACTIVE', 'BLOCKED', 'ON_HOLD', 'REJECTED'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function TierBadge({ tier }: { tier: string }) {
  const c = tierConfig[tier] || tierConfig.Free;
  return (
    <Badge
      variant="outline"
      className="text-[11px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
    >
      {tier}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] || statusConfig.ACTIVE;
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

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>(mockSubscriptions);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [unsubscribeSub, setUnsubscribeSub] = useState<Subscription | null>(null);

  /* ---- stats ---- */
  const stats = useMemo(() => {
    const active = subs.filter((s) => s.status === 'ACTIVE').length;
    const blocked = subs.filter((s) => s.status === 'BLOCKED').length;
    const onHold = subs.filter((s) => s.status === 'ON_HOLD').length;
    return { active, blocked, onHold };
  }, [subs]);

  /* ---- filtered ---- */
  const filtered = useMemo(() => {
    let result = [...subs];

    // Search
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.apiName.toLowerCase().includes(q) ||
          s.applicationName.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      result = result.filter((s) => statusFilter.includes(s.status));
    }

    return result;
  }, [subs, query, statusFilter]);

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleUnsubscribe = () => {
    if (unsubscribeSub) {
      setSubs((prev) => prev.filter((s) => s.id !== unsubscribeSub.id));
      setUnsubscribeSub(null);
    }
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#E8ECF1] mb-1">
          My Subscriptions
        </h1>
        <p className="text-[13px] text-[#9DA5B4] mb-4">
          Manage your API subscriptions across all applications
        </p>
        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#10B98120] border border-[#10B98140]">
            <span className="text-[13px] font-bold text-[#10B981]">
              {stats.active} Active
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#EF444420] border border-[#EF444440]">
            <span className="text-[13px] font-bold text-[#EF4444]">
              {stats.blocked} Blocked
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F59E0B20] border border-[#F59E0B40]">
            <span className="text-[13px] font-bold text-[#F59E0B]">
              {stats.onHold} On Hold
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-[#3D434F50]">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <Input
            placeholder="Search by API name or application..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-9 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280]"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {filterStatusOptions.map((s) => (
            <button
              key={s}
              onClick={() => toggleStatusFilter(s)}
              className={cn(
                'text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full border transition-all',
                statusFilter.includes(s)
                  ? 'bg-[#10B98120] text-[#10B981] border-[#10B98140]'
                  : 'bg-[#181A20] text-[#9DA5B4] border-[#3D434F] hover:bg-[#353942]'
              )}
            >
              {s}
            </button>
          ))}
          {statusFilter.length > 0 && (
            <button
              onClick={() => setStatusFilter([])}
              className="text-[11px] text-[#EF4444] hover:underline ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Subscriptions Table */}
      {filtered.length > 0 ? (
        <div className="bg-[#1E2128] rounded-lg border border-[#3D434F] overflow-hidden">
          {/* Header */}
          <div className="flex items-center px-4 py-2.5 bg-[#1A1D23] text-[12px] font-semibold text-[#9DA5B4] uppercase tracking-wider border-b border-[#3D434F]">
            <span className="w-[25%]">API Name</span>
            <span className="w-[20%]">Application</span>
            <span className="w-[15%]">Tier</span>
            <span className="w-[12%]">Status</span>
            <span className="w-[15%]">Subscribed</span>
            <span className="flex-1 text-right">Actions</span>
          </div>

          {/* Rows */}
          {filtered.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center px-4 py-3 border-b border-[#3D434F50] hover:bg-[#353942] transition-colors cursor-pointer"
              onClick={() => {}}
            >
              {/* API Name */}
              <div className="w-[25%] min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/devportal/apis/${sub.apiId}`}
                    className="text-[14px] font-bold text-[#E8ECF1] truncate hover:text-[#4488FF] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {sub.apiName}
                  </Link>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-[#4488FF20] text-[#4488FF] border-[#4488FF40] flex-shrink-0"
                  >
                    {sub.apiVersion}
                  </Badge>
                </div>
              </div>

              {/* Application */}
              <div className="w-[20%] min-w-0">
                <p className="text-[13px] text-[#E8ECF1] truncate">
                  {sub.applicationName}
                </p>
                <p className="text-[12px] text-[#6B7280]">{sub.applicationId}</p>
              </div>

              {/* Tier */}
              <div className="w-[15%]">
                <TierBadge tier={sub.tier} />
              </div>

              {/* Status */}
              <div className="w-[12%]">
                <StatusBadge status={sub.status} />
              </div>

              {/* Subscribed date */}
              <div className="w-[15%]">
                <p className="text-[13px] text-[#9DA5B4]">
                  {formatDate(sub.subscribedAt)}
                </p>
                <p className="text-[11px] text-[#6B7280]">
                  {formatRelativeTime(sub.subscribedAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex-1 flex items-center justify-end gap-3">
                <Link
                  to={`/devportal/apis/${sub.apiId}`}
                  className="text-[13px] text-[#4488FF] hover:underline flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} />
                  View API
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUnsubscribeSub(sub);
                  }}
                  className="text-[13px] text-[#EF4444] hover:underline"
                >
                  Unsubscribe
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16">
          <img
            src="/empty-state-apis.svg"
            alt="No subscriptions"
            className="w-[240px] h-[180px] mb-4 opacity-60"
          />
          <h3 className="text-[16px] font-bold text-[#E8ECF1] mb-1">
            No subscriptions yet
          </h3>
          <p className="text-[13px] text-[#9DA5B4] mb-4">
            Browse the API catalog to subscribe
          </p>
          <Link to="/devportal/catalog">
            <Button className="h-9 text-[13px] bg-[#10B981] hover:bg-[#059669] text-white">
              Browse APIs
            </Button>
          </Link>
        </div>
      )}

      {/* Unsubscribe Confirmation Modal */}
      <Dialog open={!!unsubscribeSub} onOpenChange={() => setUnsubscribeSub(null)}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold text-[#E8ECF1] flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#F59E0B]" />
              Unsubscribe from {unsubscribeSub?.apiName}?
            </DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-[#9DA5B4] mt-2">
            You will lose access to this API immediately. Your application keys
            will be revoked for this API.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setUnsubscribeSub(null)}
              className="h-9 text-[13px] border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnsubscribe}
              className="h-9 text-[13px] bg-[#EF4444] hover:bg-[#DC2626] text-white"
            >
              Unsubscribe
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

import { cn } from '@/lib/utils';

type APIStatus = 'CREATED' | 'PUBLISHED' | 'DEPRECATED' | 'RETIRED' | 'BLOCKED' | 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
type SubscriptionStatus = 'ACTIVE' | 'BLOCKED' | 'ON_HOLD' | 'REJECTED';
type AppStatus = 'ACTIVE' | 'INACTIVE' | 'REJECTED';
type WebhookStatus = 'ACTIVE' | 'INACTIVE' | 'FAILED';
type GatewayHealth = 'HEALTHY' | 'UNHEALTHY' | 'UNKNOWN';
type TenantStatus = 'ACTIVE' | 'INACTIVE';
type AuditSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type StatusType = APIStatus | SubscriptionStatus | AppStatus | WebhookStatus | GatewayHealth | TenantStatus | AuditSeverity;

const statusConfig: Record<string, { color: string; bg: string }> = {
  // API lifecycle
  CREATED: { color: '#3B82F6', bg: '#3B82F620' },
  PUBLISHED: { color: '#10B981', bg: '#10B98120' },
  DEPRECATED: { color: '#F59E0B', bg: '#F59E0B20' },
  RETIRED: { color: '#6B7280', bg: '#6B728020' },
  BLOCKED: { color: '#EF4444', bg: '#EF444420' },
  PUBLIC: { color: '#10B981', bg: '#10B98120' },
  PRIVATE: { color: '#EF4444', bg: '#EF444420' },
  RESTRICTED: { color: '#F59E0B', bg: '#F59E0B20' },
  // Subscription
  ACTIVE: { color: '#10B981', bg: '#10B98120' },
  ON_HOLD: { color: '#F59E0B', bg: '#F59E0B20' },
  REJECTED: { color: '#EF4444', bg: '#EF444420' },
  // App
  INACTIVE: { color: '#6B7280', bg: '#6B728020' },
  // Webhook
  FAILED: { color: '#EF4444', bg: '#EF444420' },
  // Gateway health
  HEALTHY: { color: '#10B981', bg: '#10B98120' },
  UNHEALTHY: { color: '#EF4444', bg: '#EF444420' },
  UNKNOWN: { color: '#6B7280', bg: '#6B728020' },
  // Tenant
  // Audit severity
  INFO: { color: '#3B82F6', bg: '#3B82F620' },
  WARNING: { color: '#F59E0B', bg: '#F59E0B20' },
  ERROR: { color: '#EF4444', bg: '#EF444420' },
  CRITICAL: { color: '#DC2626', bg: '#DC262620' },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { color: '#6B7280', bg: '#6B728020' };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-[0.04em]',
        className
      )}
      style={{
        color: config.color,
        backgroundColor: config.bg,
      }}
    >
      {status}
    </span>
  );
}

import { cn } from '@/lib/utils';

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

const methodColors: Record<HTTPMethod, { color: string; bg: string }> = {
  GET:    { color: '#10B981', bg: '#10B98120' },
  POST:   { color: '#F59E0B', bg: '#F59E0B20' },
  PUT:    { color: '#3B82F6', bg: '#3B82F620' },
  DELETE: { color: '#EF4444', bg: '#EF444420' },
  PATCH:  { color: '#8B5CF6', bg: '#8B5CF620' },
  OPTIONS:{ color: '#6B7280', bg: '#6B728020' },
};

interface MethodBadgeProps {
  method: HTTPMethod | string;
  className?: string;
}

export default function MethodBadge({ method, className }: MethodBadgeProps) {
  const config = methodColors[method as HTTPMethod] || { color: '#6B7280', bg: '#6B728020' };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-14 text-center text-[11px] font-bold uppercase py-[3px] rounded',
        className
      )}
      style={{
        color: config.color,
        backgroundColor: config.bg,
      }}
    >
      {method}
    </span>
  );
}

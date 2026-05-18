import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, description, subtitle, actions, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#3D434F50]', className)}>
      <div className="animate-fade-in-up">
        <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-[-0.02em] leading-[1.2]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-[#9DA5B4] mt-1">{subtitle}</p>
        )}
        {description && (
          <p className="text-[13px] text-[#9DA5B4] mt-1">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {actions}
        </div>
      )}
    </div>
  );
}

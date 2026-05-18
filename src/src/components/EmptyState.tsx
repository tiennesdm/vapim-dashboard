import { Package, Search, FileText, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: 'package' | 'search' | 'file' | 'chart';
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const iconMap = {
  package: Package,
  search: Search,
  file: FileText,
  chart: BarChart3,
};

export default function EmptyState({ icon = 'package', title, description, action, className }: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <div className="w-16 h-16 rounded-xl bg-[#2B2F38] border border-[#3D434F] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#6B7280]" />
      </div>
      <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-2">{title}</h3>
      <p className="text-[13px] text-[#9DA5B4] max-w-[320px] mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

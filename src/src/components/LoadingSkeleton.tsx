import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'chart' | 'text' | 'avatar';
  className?: string;
  count?: number;
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#353942] rounded animate-shimmer',
        className
      )}
      style={{
        backgroundImage: 'linear-gradient(90deg, #353942 0%, #3D434F 50%, #353942 100%)',
        backgroundSize: '200% 100%',
      }}
    />
  );
}

export default function LoadingSkeleton({ variant = 'text', className, count = 1 }: LoadingSkeletonProps) {
  if (variant === 'card') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
            <div className="flex justify-between mb-4">
              <SkeletonBlock className="h-5 w-20" />
              <SkeletonBlock className="h-5 w-16" />
            </div>
            <SkeletonBlock className="h-6 w-3/4 mb-2" />
            <SkeletonBlock className="h-4 w-full mb-1" />
            <SkeletonBlock className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-6 w-14" />
              <SkeletonBlock className="h-6 w-14" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('w-full', className)}>
        {/* Header */}
        <div className="flex gap-4 pb-3 border-b border-[#3D434F50]">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className={cn('h-4', i === 0 ? 'w-8' : 'flex-1')} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-b border-[#3D434F50]">
            {Array.from({ length: 6 }).map((_, j) => (
              <SkeletonBlock key={j} className={cn('h-4', j === 0 ? 'w-8' : 'flex-1')} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn('bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5', className)}>
        <SkeletonBlock className="h-6 w-40 mb-6" />
        <div className="flex items-end gap-2 h-48">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonBlock
              key={i}
              className="flex-1 rounded-t h-full"
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <SkeletonBlock className={cn('h-10 w-10 rounded-full', className)} />
    );
  }

  // text default
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlock key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}

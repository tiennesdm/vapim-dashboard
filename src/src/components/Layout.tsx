import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-[#21242B]">
      {/* Sidebar */}
      <Sidebar />

      {/* Top bar */}
      <TopBar />

      {/* Main content */}
      <main
        className={cn(
          'ml-[260px] pt-14 min-h-[100dvh] p-6',
          className
        )}
      >
        <div className="max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

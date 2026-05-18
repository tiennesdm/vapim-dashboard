import { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#21242B]">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Sheet */}
      <div className="md:hidden">
        <Sidebar
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      </div>

      {/* Top bar with hamburger for mobile */}
      <TopBar
        onMenuClick={() => setMobileSidebarOpen(true)}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      {/* Main content - responsive margin */}
      <main
        className={cn(
          'pt-14 min-h-[100dvh] p-4 md:p-6 transition-all duration-200',
          'ml-0 md:ml-[260px]',
          className
        )}
      >
        <div className="max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}

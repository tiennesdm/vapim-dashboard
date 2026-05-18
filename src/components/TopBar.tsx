import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Home,
  Menu,
} from 'lucide-react';
import { useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === '/' || pathname === '/publisher/apis') {
    return [{ label: 'Publisher' }, { label: 'APIs' }];
  }
  if (pathname === '/login') return [{ label: 'Login' }];

  const parts = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];

  if (parts[0] === 'publisher') items.push({ label: 'Publisher', href: '/publisher/apis' });
  else if (parts[0] === 'devportal') items.push({ label: 'Developer Portal', href: '/devportal/catalog' });
  else if (parts[0] === 'admin') items.push({ label: 'Admin', href: '/admin/dashboard' });
  else if (parts[0] === 'analytics') items.push({ label: 'Analytics', href: '/analytics' });

  if (parts[1]) {
    const pageMap: Record<string, string> = {
      apis: 'APIs', catalog: 'API Catalog', applications: 'Applications',
      subscriptions: 'Subscriptions', dashboard: 'Dashboard', users: 'Users',
      tenants: 'Tenants', throttling: 'Throttling', gateway: 'Gateway',
      audit: 'Audit Logs', webhooks: 'Webhooks', settings: 'Settings', create: 'Create',
    };
    const label = pageMap[parts[1]] || parts[1];
    items.push({ label });
  }

  return items;
}

interface TopBarProps {
  onMenuClick?: () => void;
  mobileSidebarOpen?: boolean;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-14 bg-[#1A1D23] border-b border-[#3D434F] z-50 flex items-center gap-4 px-4 md:px-6 transition-all duration-200',
        'left-0 md:left-[260px]'
      )}
    >
      {/* Mobile: Hamburger */}
      <button
        onClick={onMenuClick}
        className="md:hidden w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumbs - hidden on small mobile */}
      <div className="hidden sm:flex items-center gap-2 text-[13px] flex-shrink-0 min-w-0">
        <Link to="/" className="text-[#6B7280] hover:text-[#E8ECF1] transition-colors flex-shrink-0">
          <Home className="w-4 h-4" />
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[#6B7280]">/</span>
            {crumb.href ? (
              <Link
                to={crumb.href}
                className={cn(
                  'transition-colors truncate',
                  idx === breadcrumbs.length - 1
                    ? 'text-[#E8ECF1] font-medium'
                    : 'text-[#9DA5B4] hover:text-[#E8ECF1]'
                )}
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={cn(idx === breadcrumbs.length - 1 ? 'text-[#E8ECF1] font-medium' : 'text-[#9DA5B4]')}>
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Search - responsive: full width on mobile when visible, max-w on desktop */}
      <div className="flex-1 min-w-0 max-w-md mx-0 md:mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search APIs, users, settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30] transition-colors"
          />
        </div>
      </div>

      {/* Right utilities */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
        </button>
        <button className="hidden sm:w-8 sm:h-8 sm:flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>
        <button className="flex items-center gap-2 ml-1 sm:ml-2 pl-1 sm:pl-2 border-l border-[#3D434F]">
          <div className="w-7 h-7 rounded-full bg-[#4488FF] flex items-center justify-center text-[11px] font-bold text-white">
            A
          </div>
          <ChevronDown className="w-3 h-3 text-[#6B7280] hidden sm:block" />
        </button>
      </div>
    </header>
  );
}

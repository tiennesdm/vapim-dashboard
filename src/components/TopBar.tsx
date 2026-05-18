import { Link, useLocation, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Home,
  Menu,
  LogOut,
  UserCircle,
  Settings,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  if (pathname === '/' || pathname === '/publisher/apis') {
    return [{ label: 'Publisher' }, { label: 'APIs' }];
  }

  const parts = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];

  if (parts[0] === 'publisher') {
    items.push({ label: 'Publisher' });
    if (parts[1] === 'apis') {
      if (parts[2] === 'create') {
        items.push({ label: 'APIs', href: '/publisher/apis' });
        items.push({ label: 'Create' });
      } else if (parts[3] === 'design') {
        items.push({ label: 'APIs', href: '/publisher/apis' });
        items.push({ label: 'Design' });
      } else if (parts[3] === 'lifecycle') {
        items.push({ label: 'APIs', href: '/publisher/apis' });
        items.push({ label: 'Lifecycle' });
      } else if (parts[2]) {
        items.push({ label: 'APIs', href: '/publisher/apis' });
        items.push({ label: 'Detail' });
      } else {
        items.push({ label: 'APIs' });
      }
    }
  } else if (parts[0] === 'devportal') {
    items.push({ label: 'Developer Portal' });
    if (parts[1] === 'catalog') items.push({ label: 'API Catalog' });
    else if (parts[1] === 'apis' && parts[2]) {
      items.push({ label: 'API Catalog', href: '/devportal/catalog' });
      if (parts[3] === 'tryit') items.push({ label: 'Try It' });
      else if (parts[3] === 'sdk') items.push({ label: 'SDK' });
      else items.push({ label: 'Detail' });
    }
    else if (parts[1] === 'applications') items.push({ label: 'My Applications' });
    else if (parts[1] === 'subscriptions') items.push({ label: 'My Subscriptions' });
  } else if (parts[0] === 'admin') {
    items.push({ label: 'Admin' });
    const pageMap: Record<string, string> = {
      dashboard: 'Dashboard',
      users: 'Users',
      tenants: 'Tenants',
      throttling: 'Throttling',
      gateway: 'Gateway',
      audit: 'Audit Logs',
      webhooks: 'Webhooks',
      settings: 'Settings',
      'ai-gateway': 'AI Gateway',
      'mcp-hub': 'MCP Hub',
      governance: 'Governance',
      monetization: 'Monetization',
      'api-chat': 'API Chat',
      certificates: 'Certificates',
    };
    items.push({ label: pageMap[parts[1]] || parts[1] });
  } else if (parts[0] === 'analytics') {
    items.push({ label: 'Analytics' }, { label: 'Dashboard' });
  } else if (parts[0] === 'login') {
    items.push({ label: 'Login' });
  }

  return items;
}

interface TopBarProps {
  onMenuClick?: () => void;
  mobileSidebarOpen?: boolean;
}

export default function TopBar({ onMenuClick, mobileSidebarOpen: _mobileSidebarOpen }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 h-14 bg-[#151821]/80 backdrop-blur-md border-b border-[#3D434F] flex items-center px-4 gap-3 flex-shrink-0">
      {/* Left: Menu button + Breadcrumbs */}
      <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
        )}

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1 text-[12px]">
          <Link
            to="/"
            className="flex items-center text-[#6B7280] hover:text-[#E8ECF1] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-1">
              <span className="text-[#3D434F] mx-0.5">/</span>
              {item.href ? (
                <Link
                  to={item.href}
                  className="text-[#6B7280] hover:text-[#E8ECF1] transition-colors truncate max-w-[120px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    'truncate max-w-[160px]',
                    index === breadcrumbs.length - 1
                      ? 'text-[#E8ECF1] font-medium'
                      : 'text-[#6B7280]'
                  )}
                >
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Search */}
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

        {/* User Dropdown */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 ml-1 sm:ml-2 pl-1 sm:pl-2 border-l border-[#3D434F]">
                <div className="w-7 h-7 rounded-full bg-[#4488FF] flex items-center justify-center text-[11px] font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-[12px] text-[#E8ECF1] font-medium leading-tight">{user?.email || 'admin@vedadb.io'}</div>
                  <div className="text-[11px] text-[#6B7280] leading-tight">{user?.role || 'Super Admin'}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-[#6B7280] hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1A1D23] border-[#3D434F]">
              <DropdownMenuLabel className="text-[#E8ECF1]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#4488FF] flex items-center justify-center text-[12px] font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium">{user?.name || 'Administrator'}</div>
                    <div className="text-[11px] text-[#6B7280]">{user?.email || 'admin@vedadb.io'}</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#3D434F]" />
              <DropdownMenuItem className="text-[#E8ECF1] focus:bg-[#353942] cursor-pointer" onClick={() => navigate('/admin/settings')}>
                <UserCircle className="w-4 h-4 mr-2" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[#E8ECF1] focus:bg-[#353942] cursor-pointer" onClick={() => navigate('/admin/settings')}>
                <Settings className="w-4 h-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#3D434F]" />
              <DropdownMenuItem className="text-[#EF4444] focus:bg-[#353942] cursor-pointer" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 ml-1 sm:ml-2 pl-1 sm:pl-2 border-l border-[#3D434F] text-[#4488FF] hover:text-[#5C9DFF] text-[12px] font-medium"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

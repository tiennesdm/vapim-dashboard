import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import {
  LayoutGrid,
  Globe,
  Settings,
  Users,
  Building2,
  Gauge,
  ShieldCheck,
  FileText,
  Webhook,
  Server,
  BarChart3,
  ChevronDown,
  Hexagon,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  section: string;
}

const navItems: NavItem[] = [
  // Publisher
  { label: 'APIs', icon: <Globe className="w-5 h-5" />, href: '/publisher/apis', section: 'Publisher' },
  // Developer Portal
  { label: 'API Catalog', icon: <LayoutGrid className="w-5 h-5" />, href: '/devportal/catalog', section: 'Developer Portal' },
  { label: 'My Applications', icon: <FileText className="w-5 h-5" />, href: '/devportal/applications', section: 'Developer Portal' },
  { label: 'My Subscriptions', icon: <ShieldCheck className="w-5 h-5" />, href: '/devportal/subscriptions', section: 'Developer Portal' },
  // Admin
  { label: 'Dashboard', icon: <Gauge className="w-5 h-5" />, href: '/admin/dashboard', section: 'Admin' },
  { label: 'Users', icon: <Users className="w-5 h-5" />, href: '/admin/users', section: 'Admin' },
  { label: 'Tenants', icon: <Building2 className="w-5 h-5" />, href: '/admin/tenants', section: 'Admin' },
  { label: 'Throttling', icon: <Gauge className="w-5 h-5" />, href: '/admin/throttling', section: 'Admin' },
  { label: 'Gateway', icon: <Server className="w-5 h-5" />, href: '/admin/gateway', section: 'Admin' },
  { label: 'Audit Logs', icon: <FileText className="w-5 h-5" />, href: '/admin/audit', section: 'Admin' },
  { label: 'Webhooks', icon: <Webhook className="w-5 h-5" />, href: '/admin/webhooks', section: 'Admin' },
  { label: 'Settings', icon: <Settings className="w-5 h-5" />, href: '/admin/settings', section: 'Admin' },
  // Analytics
  { label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, href: '/analytics', section: 'Analytics' },
];

const sections = ['Publisher', 'Developer Portal', 'Admin', 'Analytics'];

interface SidebarProps {
  collapsed?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ collapsed = false, isMobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(sections);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const isActive = (href: string) => {
    if (href === '/publisher/apis' && location.pathname === '/') return true;
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  // Mobile version: Sheet drawer
  if (isMobileOpen !== undefined) {
    return (
      <>
        <aside
          className={cn(
            'fixed top-0 left-0 h-full w-[280px] bg-[#181A20] border-r border-[#3D434F] z-40 flex flex-col transition-transform duration-300 md:hidden',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {/* Logo + Close */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-[#3D434F]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4488FF] flex items-center justify-center flex-shrink-0">
                <Hexagon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[16px] font-bold text-[#E8ECF1] tracking-tight">VAPIM</span>
              </div>
            </div>
            <button
              onClick={onMobileClose}
              className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#2B2F38] hover:text-[#E8ECF1] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-4">
            {sections.map((section) => {
              const sectionItems = navItems.filter((item) => item.section === section);
              const isExpanded = expandedSections.includes(section);

              return (
                <div key={section} className="mb-2">
                  <button
                    onClick={() => toggleSection(section)}
                    className="flex items-center gap-2 px-4 py-2 w-full text-left"
                  >
                    <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-[0.08em] flex-1">
                      {section}
                    </span>
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 text-[#6B7280] transition-transform',
                        !isExpanded && '-rotate-90'
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className="space-y-0.5">
                      {sectionItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={onMobileClose}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2.5 mx-2 rounded-md text-[14px] font-medium transition-all duration-100',
                            isActive(item.href)
                              ? 'bg-[#1E3A5F] text-[#4488FF] border-l-[3px] border-[#4488FF]'
                              : 'text-[#9DA5B4] hover:bg-[#2B2F38] hover:text-[#E8ECF1] border-l-[3px] border-transparent'
                          )}
                        >
                          <span className="flex-shrink-0">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom: user */}
          <div className="p-3 border-t border-[#3D434F]">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2B2F38] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-[#4488FF] flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-[#E8ECF1] truncate">admin@vedadb.io</p>
                <p className="text-[11px] text-[#6B7280] truncate">Super Admin</p>
              </div>
              <Settings className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
            </div>
          </div>
        </aside>
      </>
    );
  }

  // Desktop version
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-[#181A20] border-r border-[#3D434F] z-40 flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-[#3D434F]">
        <div className="w-8 h-8 rounded-lg bg-[#4488FF] flex items-center justify-center flex-shrink-0">
          <Hexagon className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex items-baseline gap-2">
            <span className="text-[16px] font-bold text-[#E8ECF1] tracking-tight">VAPIM</span>
            <span className="text-[10px] text-[#4488FF] font-medium uppercase tracking-wider">Publisher</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        {sections.map((section) => {
          const sectionItems = navItems.filter((item) => item.section === section);
          const isExpanded = expandedSections.includes(section);

          return (
            <div key={section} className="mb-2">
              {!collapsed && (
                <button
                  onClick={() => toggleSection(section)}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left"
                >
                  <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-[0.08em] flex-1">
                    {section}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-3 h-3 text-[#6B7280] transition-transform',
                      !isExpanded && '-rotate-90'
                    )}
                  />
                </button>
              )}
              {isExpanded && (
                <div className="space-y-0.5">
                  {sectionItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 mx-2 rounded-md text-[13px] font-medium transition-all duration-100',
                        isActive(item.href)
                          ? 'bg-[#1E3A5F] text-[#4488FF] border-l-[3px] border-[#4488FF]'
                          : 'text-[#9DA5B4] hover:bg-[#2B2F38] hover:text-[#E8ECF1] border-l-[3px] border-transparent',
                        collapsed && 'justify-center px-2'
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom: user */}
      {!collapsed && (
        <div className="p-3 border-t border-[#3D434F]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2B2F38] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#4488FF] flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#E8ECF1] truncate">admin@vedadb.io</p>
              <p className="text-[11px] text-[#6B7280] truncate">Super Admin</p>
            </div>
            <Settings className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
          </div>
        </div>
      )}
    </aside>
  );
}

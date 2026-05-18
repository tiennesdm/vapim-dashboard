import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import {
  LayoutDashboard, Box, Store, AppWindow, CreditCard, BarChart3, Gauge, Users,
  Menu, Search, Bell, UserCircle, LogOut, Plus, Edit3, Trash2, Rocket,
  Eye, Download, Activity, AlertTriangle, ArrowLeft, Play, Copy, Terminal,
  Check, Clock, Tag, Shield, Globe, FileText, Layers, Zap,
  Sun, Moon, RefreshCw, Settings, Home, Webhook, User, ChevronRight
} from 'lucide-react';
import { api } from './lib/api';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { Sheet, SheetContent } from './components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from './components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePageTitle } from './hooks/usePageTitle';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { WebhooksPage } from './pages/WebhooksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

// ─── Unique Gradient ID Generator ────────────────────
let gradientCounter = 0;
function useGradientId(prefix: string) {
  const idRef = useRef<string>('');
  if (!idRef.current) {
    gradientCounter++;
    idRef.current = `${prefix}-${gradientCounter}-${Date.now()}`;
  }
  return idRef.current;
}

// ─── Types ───────────────────────────────────────────
interface APIItem { id: string; name: string; context: string; version: string; endpoint: string; status: string; authType: string; throttlePolicy: string; description: string; tags?: string[]; provider?: string; rating?: number; ratingCount?: number; visibility?: string; createdAt?: string; updatedAt?: string; documentation?: string; }
interface APIResource { method: string; path: string; description: string; }
interface AppItem { id: string; name: string; tier: string; description: string; consumerKey?: string; sandboxKey?: string; }
interface Subscription { id: string; apiId: string; apiName: string; appId: string; appName: string; tier: string; status: string; createdAt: string; }
interface Policy { id: string; name: string; type: string; rate: number; unit: string; burst: number; }
interface User { id: string; username: string; email: string; role: string; status: string; }
interface AnalyticsData { callsOverTime: { date: string; calls: number }[]; topApis: { name: string; calls: number }[]; latency: { name: string; ms: number }[]; }

// ─── Auth Context ────────────────────────────────────
const AuthCtx = createContext<{ token: string; setToken: (t: string) => void }>({ token: '', setToken: () => {} });

// ─── Theme Context ───────────────────────────────────
const ThemeCtx = createContext<{ theme: string; setTheme: (t: string) => void }>({ theme: 'system', setTheme: () => {} });

// ─── usePageTitle hook (inline) ──────────────────────
function useDocTitle(title: string) {
  useEffect(() => { document.title = title; }, [title]);
}

// ─── Sidebar ─────────────────────────────────────────
const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'APIs', icon: Box, path: '/apis' },
  { label: 'Store', icon: Store, path: '/store' },
  { label: 'Applications', icon: AppWindow, path: '/apps' },
  { label: 'Subscriptions', icon: CreditCard, path: '/subscriptions' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
];
const adminItems = [
  { label: 'Throttling', icon: Gauge, path: '/admin/throttle' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Audit Logs', icon: FileText, path: '/admin/audit-logs' },
  { label: 'Webhooks', icon: Webhook, path: '/admin/webhooks' },
];
const bottomItems = [
  { label: 'Settings', icon: Settings, path: '/settings' },
];

function Sidebar({ mobileOpen, setMobileOpen, collapsed }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void; collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useContext(AuthCtx);
  const isActive = (p: string) => location.pathname === p || (p !== '/' && location.pathname.startsWith(p));

  const NavButton = ({ item }: { item: typeof navItems[0] }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const btn = (
      <button
        onClick={() => { navigate(item.path); setMobileOpen(false); }}
        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
          ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
    if (collapsed) return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{btn}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
    return btn;
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 h-16 border-b shrink-0">
        <Box className="w-7 h-7 text-primary shrink-0" />
        {!collapsed && <span className="font-bold text-lg tracking-tight">VedaDB</span>}
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => <NavButton key={item.path} item={item} />)}
        </div>
        {!collapsed && <Separator className="my-4" />}
        {collapsed && <div className="my-2 border-t" />}
        <div className="space-y-1">
          {adminItems.map((item) => <NavButton key={item.path} item={item} />)}
        </div>
        <div className="mt-auto">
          {!collapsed && <Separator className="my-4" />}
          {collapsed && <div className="my-2 border-t" />}
          <div className="space-y-1">
            {bottomItems.map((item) => <NavButton key={item.path} item={item} />)}
          </div>
        </div>
      </ScrollArea>
      <div className="p-3 border-t">
        <Button variant="ghost" className={`w-full justify-start gap-3 text-sm ${collapsed ? 'px-2' : ''}`} onClick={() => { localStorage.removeItem('token'); setToken(''); }}>
          <LogOut className="w-4 h-4" />
          {!collapsed && 'Logout'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          {content}
        </SheetContent>
      </Sheet>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex h-screen border-r bg-background flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
        {content}
      </aside>
    </>
  );
}

// ─── RefreshButton ───────────────────────────────────
function RefreshButton({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const [refreshing, setRefreshing] = useState(false);
  const handle = async () => {
    setRefreshing(true);
    try { await onRefresh(); toast.success('Data refreshed'); }
    catch { toast.error('Refresh failed'); }
    finally { setRefreshing(false); }
  };
  return (
    <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={handle} disabled={refreshing}>
      <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
      {refreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
}

// ─── Breadcrumbs ─────────────────────────────────────
function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  if (path === '/' || path === '/login') return null;
  const segments: { label: string; path?: string }[] = [{ label: 'Home', path: '/' }];
  if (path.startsWith('/admin')) {
    segments.push({ label: 'Admin' });
    if (path === '/admin/throttle') segments.push({ label: 'Rate Limiting' });
    else if (path === '/admin/users') segments.push({ label: 'Users' });
    else if (path === '/admin/audit-logs') segments.push({ label: 'Audit Logs' });
    else if (path === '/admin/webhooks') segments.push({ label: 'Webhooks' });
  } else if (path === '/apis') segments.push({ label: 'APIs' });
  else if (path === '/store') segments.push({ label: 'Developer Portal' });
  else if (path === '/apps') segments.push({ label: 'Applications' });
  else if (path === '/subscriptions') segments.push({ label: 'Subscriptions' });
  else if (path === '/analytics') segments.push({ label: 'Analytics' });
  else if (path === '/settings') segments.push({ label: 'Settings' });
  else segments.push({ label: path.replace(/^\//, '').replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase()) });
  return (
    <nav className="px-3 md:px-6 pt-3 pb-0">
      <ol className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground">
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3 h-3" />}
            {seg.path ? (
              <button onClick={() => navigate(seg.path!)} className="hover:text-foreground transition-colors">{seg.label}</button>
            ) : (
              <span className="text-foreground font-medium">{seg.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── TopBar ──────────────────────────────────────────
function TopBar({ onMenu }: { onMenu: () => void }) {
  const { token, setToken } = useContext(AuthCtx);
  const { theme, setTheme } = useContext(ThemeCtx);
  const navigate = useNavigate();
  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    setTheme(next);
    toast.info(`Theme: ${next}`);
  };
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-3 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenu}>
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-base md:text-lg font-semibold truncate">VedaDB API Manager</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex items-center relative">
          <Search className="w-4 h-4 absolute left-2.5 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9 w-64" />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserCircle className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{token ? 'Administrator' : 'Guest'}</span>
                  <span className="text-xs text-muted-foreground">admin@vedadb.io</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2 text-xs" onClick={() => navigate('/settings?tab=profile')}>
              <User className="w-3.5 h-3.5" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-xs" onClick={() => navigate('/settings')}>
              <Settings className="w-3.5 h-3.5" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2 text-xs" onClick={cycleTheme}>
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {theme === 'dark' ? 'Light Mode' : theme === 'light' ? 'Dark Mode' : 'System Theme'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2 text-xs text-red-500 focus:text-red-500" onClick={() => { localStorage.removeItem('token'); setToken(''); }}>
              <LogOut className="w-3.5 h-3.5" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ─── Login Page ──────────────────────────────────────
function LoginPage() {
  useDocTitle('Login | VedaDB API Manager');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setToken } = useContext(AuthCtx);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(username, password);
      setToken(data.token);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      toast.error('Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
            <Box className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-xl">VedaDB API Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Dashboard Page ──────────────────────────────────
function DashboardPage() {
  useDocTitle('Dashboard | VedaDB API Manager');
  const [apis, setApis] = useState<APIItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ callsOverTime: [], topApis: [], latency: [] });
  const [loading, setLoading] = useState(true);
  const gradId = useGradientId('dash-calls');

  useEffect(() => {
    Promise.all([
      api.getAPIs().then(d => setApis(d.apis || d || [])).catch(() => setApis([])),
      api.getSubscriptions().then(d => setSubscriptions(d.subscriptions || d || [])).catch(() => setSubscriptions([])),
      api.getAnalytics('30d').then(d => setAnalytics(d || { callsOverTime: [], topApis: [], latency: [] })).catch(() => setAnalytics({ callsOverTime: [], topApis: [], latency: [] })),
    ]).finally(() => setLoading(false));
  }, []);

  const totalCalls = analytics.callsOverTime.reduce((a, b) => a + (b.calls || 0), 0);
  const errorRate = '0.4%';

  const statCards = [
    { label: 'Total APIs', value: apis.length, icon: Box, color: 'text-blue-500' },
    { label: 'Active Subscriptions', value: subscriptions.filter(s => s.status === 'ACTIVE').length, icon: CreditCard, color: 'text-green-500' },
    { label: 'Total Calls (30d)', value: totalCalls.toLocaleString(), icon: Activity, color: 'text-purple-500' },
    { label: 'Error Rate', value: errorRate, icon: AlertTriangle, color: 'text-orange-500' },
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">{loading ? '-' : s.value}</p>
                </div>
                <s.icon className={`w-8 h-8 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm sm:text-base">API Calls Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={analytics.callsOverTime}>
                <defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Area type="monotone" dataKey="calls" stroke="#8884d8" fillOpacity={1} fill={`url(#${gradId})`} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm sm:text-base">Top APIs by Calls</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analytics.topApis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Bar dataKey="calls" fill="#82ca9d" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── APIs Page ───────────────────────────────────────
function APIsPage() {
  useDocTitle('APIs | VedaDB API Manager');
  const [apis, setApis] = useState<APIItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<APIItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmPublish, setConfirmPublish] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', context: '', version: '', endpoint: '', authType: 'OAuth2', throttlePolicy: '', description: '' });
  const navigate = useNavigate();

  const fetch = useCallback(() => {
    setLoading(true);
    api.getAPIs().then(d => setApis(d.apis || d || [])).catch(() => toast.error('Failed to load APIs')).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const filtered = apis.filter(a => {
    const m = statusTab === 'ALL' || a.status === statusTab;
    const s = !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.context?.toLowerCase().includes(search.toLowerCase());
    return m && s;
  });

  const statusColor = (s: string) => {
    if (s === 'PUBLISHED') return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    if (s === 'CREATED') return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    if (s === 'DEPRECATED') return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
  };

  const openCreate = () => { setEditItem(null); setForm({ name: '', context: '', version: '', endpoint: '', authType: 'OAuth2', throttlePolicy: '', description: '' }); setDialogOpen(true); };
  const openEdit = (item: APIItem) => { setEditItem(item); setForm({ name: item.name, context: item.context, version: item.version, endpoint: item.endpoint, authType: item.authType, throttlePolicy: item.throttlePolicy, description: item.description }); setDialogOpen(true); };

  const handleSave = async () => {
    try {
      if (editItem) { await api.updateAPI(editItem.id, form); toast.success('API updated'); }
      else { await api.createAPI(form); toast.success('API created'); }
      setDialogOpen(false); fetch();
    } catch (e: any) { toast.error(e.message || 'Save failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await api.deleteAPI(id); toast.success('API deleted'); fetch(); } catch (e: any) { toast.error(e.message || 'Delete failed'); }
    setConfirmDelete(null);
  };

  const handlePublish = async (id: string) => {
    try { await api.publishAPI(id); toast.success('API published'); fetch(); } catch (e: any) { toast.error(e.message || 'Publish failed'); }
    setConfirmPublish(null);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">APIs</h2>
        <Button onClick={openCreate} className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" />Create API</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search APIs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <Tabs value={statusTab} onValueChange={setStatusTab}>
        <TabsList className="flex-wrap h-auto">
          {['ALL', 'PUBLISHED', 'CREATED', 'DEPRECATED', 'BLOCKED'].map(s => <TabsTrigger key={s} value={s} className="text-xs">{s}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Name</TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">Context</TableHead>
              <TableHead className="text-xs sm:text-sm">Version</TableHead>
              <TableHead className="hidden lg:table-cell text-xs sm:text-sm">Endpoint</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-xs">Loading...</TableCell></TableRow> :
             filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">No APIs found</TableCell></TableRow> :
             filtered.map(a => (
              <TableRow key={a.id} className="cursor-pointer" onClick={() => navigate(`/apis/${a.id}`)}>
                <TableCell className="text-xs sm:text-sm font-medium">{a.name}</TableCell>
                <TableCell className="hidden md:table-cell text-xs sm:text-sm">{a.context}</TableCell>
                <TableCell className="text-xs sm:text-sm">{a.version}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs sm:text-sm max-w-[200px] truncate">{a.endpoint}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] sm:text-xs ${statusColor(a.status)}`}>{a.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => openEdit(a)}><Edit3 className="w-3.5 h-3.5" /></Button>
                    {a.status !== 'PUBLISHED' && <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => setConfirmPublish(a.id)}><Rocket className="w-3.5 h-3.5" /></Button>}
                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-red-500" onClick={() => setConfirmDelete(a.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">{editItem ? 'Edit API' : 'Create API'}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            {['name','context','version','endpoint','throttlePolicy','description'].map(f => (
              <div key={f} className="space-y-1.5">
                <Label className="text-xs sm:text-sm capitalize">{f === 'throttlePolicy' ? 'Throttle Policy' : f}</Label>
                {f === 'description' ?
                  <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={(form as any)[f]} onChange={e => setForm({...form, [f]: e.target.value})} /> :
                  <Input className="text-xs sm:text-sm" value={(form as any)[f]} onChange={e => setForm({...form, [f]: e.target.value})} required={f !== 'description'} />}
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Auth Type</Label>
              <Select value={form.authType} onValueChange={v => setForm({...form, authType: v})}>
                <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['OAuth2','API Key','Basic Auth','None'].map(o => <SelectItem key={o} value={o} className="text-xs sm:text-sm">{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button onClick={handleSave} className="w-full sm:w-auto text-xs sm:text-sm">{editItem ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm dialogs */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base">Delete API?</DialogTitle><DialogDescription className="text-xs sm:text-sm">This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)} className="w-full sm:w-auto text-xs sm:text-sm">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!confirmPublish} onOpenChange={() => setConfirmPublish(null)}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base">Publish API?</DialogTitle><DialogDescription className="text-xs sm:text-sm">This will make the API available in the Developer Portal.</DialogDescription></DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setConfirmPublish(null)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button onClick={() => confirmPublish && handlePublish(confirmPublish)} className="w-full sm:w-auto text-xs sm:text-sm">Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── API Detail Page ─────────────────────────────────
function APIDetailPage() {
  useDocTitle('API Details | VedaDB API Manager');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apiItem, setApiItem] = useState<APIItem | null>(null);
  const [resources, setResources] = useState<APIResource[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Try It state
  const [tryMethod, setTryMethod] = useState('GET');
  const [tryPath, setTryPath] = useState('');
  const [tryHeaders, setTryHeaders] = useState<{key: string; value: string}[]>([{key: 'Content-Type', value: 'application/json'}]);
  const [tryBody, setTryBody] = useState('');
  const [tryResponse, setTryResponse] = useState<any>(null);
  const [tryLoading, setTryLoading] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.getAPIById(id).then(d => setApiItem(d)).catch(() => toast.error('Failed to load API')),
      api.getAPIResources(id).then(d => setResources(d || [])).catch(() => setResources([])),
      api.getSubscriptionsByApi(id).then(d => setSubscriptions(d || [])).catch(() => setSubscriptions([])),
    ]).finally(() => setLoading(false));
  }, [id]);

  const statusColor = (s: string) => {
    if (s === 'PUBLISHED') return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    if (s === 'CREATED') return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    if (s === 'DEPRECATED') return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
  };

  const methodColor = (m: string) => {
    if (m === 'GET') return 'bg-blue-500/10 text-blue-600';
    if (m === 'POST') return 'bg-green-500/10 text-green-600';
    if (m === 'PUT') return 'bg-yellow-500/10 text-yellow-600';
    if (m === 'DELETE') return 'bg-red-500/10 text-red-600';
    if (m === 'PATCH') return 'bg-purple-500/10 text-purple-600';
    return 'bg-gray-500/10 text-gray-600';
  };

  const handleSendRequest = () => {
    setTryLoading(true);
    setTimeout(() => {
      const mockResponses: Record<string, any> = {
        GET: {
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json', 'x-request-id': `req-${Date.now()}` },
          body: JSON.stringify({ id: '123', name: 'Sample Resource', createdAt: new Date().toISOString(), metadata: { version: '1.0', count: 42 } }, null, 2),
        },
        POST: {
          status: 201,
          statusText: 'Created',
          headers: { 'content-type': 'application/json', 'location': `/resources/123` },
          body: JSON.stringify({ id: '123', message: 'Resource created successfully', createdAt: new Date().toISOString() }, null, 2),
        },
        PUT: {
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: '123', message: 'Resource updated', updatedAt: new Date().toISOString() }, null, 2),
        },
        DELETE: {
          status: 204,
          statusText: 'No Content',
          headers: {},
          body: '',
        },
        PATCH: {
          status: 200,
          statusText: 'OK',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: '123', message: 'Resource patched', patchedFields: ['name', 'status'] }, null, 2),
        },
      };
      setTryResponse(mockResponses[tryMethod] || mockResponses['GET']);
      setTryLoading(false);
      toast.success(`Simulated ${tryMethod} response`);
    }, 800);
  };

  const generateCurl = () => {
    const baseUrl = apiItem?.endpoint || 'http://localhost:8080';
    const path = tryPath.startsWith('/') ? tryPath : `/${tryPath}`;
    const headers = tryHeaders.filter(h => h.key).map(h => `  -H "${h.key}: ${h.value}"`).join(' \\\n');
    const body = tryBody ? `  -d '${tryBody}'` : '';
    return `curl -X ${tryMethod} \\\n  "${baseUrl}${path}" \\\n${headers}${body ? ' \\\n' + body : ''}`;
  };

  const copyCurl = () => {
    navigator.clipboard.writeText(generateCurl());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
    toast.success('cURL copied to clipboard');
  };

  const addHeader = () => setTryHeaders([...tryHeaders, { key: '', value: '' }]);
  const removeHeader = (i: number) => setTryHeaders(tryHeaders.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: 'key' | 'value', val: string) => {
    const next = [...tryHeaders];
    next[i][field] = val;
    setTryHeaders(next);
  };

  const docHtml = (md: string) => {
    // Simple markdown-to-HTML renderer for the mock docs
    const escaped = md
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-6 mb-4">$1</h1>')
      .replace(/^> \*\*(.*?)\*\*(.*$)/gim, '<blockquote class="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 p-3 my-3 rounded text-sm"><strong>$1</strong>$2</blockquote>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-muted pl-4 py-1 my-2 text-muted-foreground italic">$1</blockquote>')
      .replace(/```json\n([\s\S]*?)\n```/gim, '<pre class="bg-muted rounded-lg p-4 my-3 overflow-x-auto text-xs font-mono"><code>$1</code></pre>')
      .replace(/```\n([\s\S]*?)\n```/gim, '<pre class="bg-muted rounded-lg p-4 my-3 overflow-x-auto text-xs font-mono"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 text-sm">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 text-sm">$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>');
    return escaped;
  };

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading API details...</div>;
  if (!apiItem) return <div className="p-6 text-sm text-red-500">API not found</div>;

  return (
    <div className="p-3 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate('/apis')} className="w-fit"><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold truncate">{apiItem.name}</h2>
            <Badge variant="secondary" className={`text-xs ${statusColor(apiItem.status)}`}>{apiItem.status}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{apiItem.description}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview" className="text-xs"><FileText className="w-3.5 h-3.5 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs"><Layers className="w-3.5 h-3.5 mr-1" />Resources</TabsTrigger>
          <TabsTrigger value="documentation" className="text-xs"><Globe className="w-3.5 h-3.5 mr-1" />Documentation</TabsTrigger>
          <TabsTrigger value="subscriptions" className="text-xs"><CreditCard className="w-3.5 h-3.5 mr-1" />Subscriptions</TabsTrigger>
          <TabsTrigger value="tryit" className="text-xs"><Zap className="w-3.5 h-3.5 mr-1" />Try It</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground"><Tag className="w-4 h-4" /><span className="text-xs font-medium">Version</span></div>
                <p className="text-sm font-semibold">{apiItem.version}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground"><Shield className="w-4 h-4" /><span className="text-xs font-medium">Auth Type</span></div>
                <p className="text-sm font-semibold">{apiItem.authType}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground"><Globe className="w-4 h-4" /><span className="text-xs font-medium">Context</span></div>
                <p className="text-sm font-semibold font-mono">{apiItem.context}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground"><Terminal className="w-4 h-4" /><span className="text-xs font-medium">Endpoint</span></div>
                <p className="text-sm font-semibold font-mono break-all">{apiItem.endpoint}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground"><Gauge className="w-4 h-4" /><span className="text-xs font-medium">Throttle Policy</span></div>
                <p className="text-sm font-semibold">{apiItem.throttlePolicy || 'None'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4" /><span className="text-xs font-medium">Provider</span></div>
                <p className="text-sm font-semibold">{apiItem.provider || 'Unknown'}</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Timestamps</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p><span className="text-muted-foreground">Created:</span> {apiItem.createdAt ? new Date(apiItem.createdAt).toLocaleString() : 'N/A'}</p>
                <p><span className="text-muted-foreground">Updated:</span> {apiItem.updatedAt ? new Date(apiItem.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
          {apiItem.tags && apiItem.tags.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {apiItem.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">API Resources</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm w-24">Method</TableHead>
                      <TableHead className="text-xs sm:text-sm">Path</TableHead>
                      <TableHead className="text-xs sm:text-sm">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.length === 0 ? (
                      <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground text-xs">No resources defined</TableCell></TableRow>
                    ) : resources.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell><Badge variant="secondary" className={`text-xs ${methodColor(r.method)}`}>{r.method}</Badge></TableCell>
                        <TableCell className="text-xs sm:text-sm font-mono">{r.path}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{r.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">API Documentation</CardTitle></CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: docHtml(apiItem.documentation || '# No Documentation\n\nNo documentation has been added for this API yet.') }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">Active Subscriptions</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs sm:text-sm">Application</TableHead>
                      <TableHead className="text-xs sm:text-sm">Tier</TableHead>
                      <TableHead className="text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-xs sm:text-sm">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-xs">No active subscriptions</TableCell></TableRow>
                    ) : subscriptions.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="text-xs sm:text-sm font-medium">{s.appName}</TableCell>
                        <TableCell className="text-xs sm:text-sm"><Badge variant="secondary" className="text-xs">{s.tier}</Badge></TableCell>
                        <TableCell className="text-xs sm:text-sm"><Badge variant="secondary" className="bg-green-500/10 text-green-500 text-xs">{s.status}</Badge></TableCell>
                        <TableCell className="text-xs sm:text-sm">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Try It Tab */}
        <TabsContent value="tryit" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base flex items-center gap-2"><Play className="w-4 h-4" />Try It Console</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {/* Method + Path */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={tryMethod} onValueChange={setTryMethod}>
                  <SelectTrigger className="w-full sm:w-28 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['GET','POST','PUT','DELETE','PATCH'].map(m => <SelectItem key={m} value={m} className="text-xs sm:text-sm">{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex-1 flex gap-2">
                  <span className="text-xs text-muted-foreground flex items-center font-mono shrink-0">{apiItem?.endpoint}</span>
                  <Input placeholder="/path" value={tryPath} onChange={e => setTryPath(e.target.value)} className="flex-1 text-xs sm:text-sm font-mono" />
                </div>
                <Button onClick={handleSendRequest} disabled={tryLoading || !tryPath} className="w-full sm:w-auto text-xs sm:text-sm">
                  {tryLoading ? 'Sending...' : <><Play className="w-3.5 h-3.5 mr-1" />Send</>}
                </Button>
              </div>

              {/* Headers */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs sm:text-sm font-medium">Headers</Label>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addHeader}>+ Add Header</Button>
                </div>
                <div className="space-y-2">
                  {tryHeaders.map((h, i) => (
                    <div key={i} className="flex gap-2">
                      <Input placeholder="Key" value={h.key} onChange={e => updateHeader(i, 'key', e.target.value)} className="text-xs font-mono flex-1" />
                      <Input placeholder="Value" value={h.value} onChange={e => updateHeader(i, 'value', e.target.value)} className="text-xs font-mono flex-1" />
                      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-red-500" onClick={() => removeHeader(i)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Body */}
              {tryMethod !== 'GET' && tryMethod !== 'DELETE' && (
                <div>
                  <Label className="text-xs sm:text-sm font-medium mb-2 block">Request Body (JSON)</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-xs font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder='{"key": "value"}'
                    value={tryBody}
                    onChange={e => setTryBody(e.target.value)}
                  />
                </div>
              )}

              {/* cURL */}
              {tryPath && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs sm:text-sm font-medium">cURL Command</Label>
                    <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={copyCurl}>
                      {copiedCurl ? <><Check className="w-3 h-3 mr-1" />Copied</> : <><Copy className="w-3 h-3 mr-1" />Copy</>}
                    </Button>
                  </div>
                  <pre className="bg-muted rounded-lg p-3 overflow-x-auto text-[10px] sm:text-xs font-mono whitespace-pre-wrap break-all">{generateCurl()}</pre>
                </div>
              )}

              {/* Response */}
              {tryResponse && (
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Response</Label>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-3 py-2 flex items-center gap-3 border-b">
                      <Badge variant="secondary" className={`text-xs ${tryResponse.status >= 200 && tryResponse.status < 300 ? 'bg-green-500/10 text-green-500' : tryResponse.status >= 400 ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {tryResponse.status} {tryResponse.statusText}
                      </Badge>
                    </div>
                    {Object.keys(tryResponse.headers).length > 0 && (
                      <div className="px-3 py-2 border-b bg-muted/30">
                        <p className="text-[10px] text-muted-foreground font-medium mb-1">Response Headers</p>
                        {Object.entries(tryResponse.headers).map(([k, v]) => (
                          <div key={k} className="text-[10px] sm:text-xs font-mono"><span className="text-muted-foreground">{k}:</span> {String(v)}</div>
                        ))}
                      </div>
                    )}
                    {tryResponse.body && (
                      <pre className="p-3 overflow-x-auto text-[10px] sm:text-xs font-mono bg-background">{tryResponse.body}</pre>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Store Page ──────────────────────────────────────
function StorePage() {
  useDocTitle('Developer Portal | VedaDB API Manager');
  const [apis, setApis] = useState<APIItem[]>([]);
  const [selected, setSelected] = useState<APIItem | null>(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [subForm, setSubForm] = useState({ appId: '', tier: 'Gold' });
  const navigate = useNavigate();

  useEffect(() => {
    api.getAPIs().then(d => setApis((d.apis || d || []).filter((a: APIItem) => a.status === 'PUBLISHED'))).catch(() => {});
    api.getApplications().then(d => setApps(d.applications || d || [])).catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    try {
      await api.subscribe({ apiId: selected?.id, applicationId: subForm.appId, tier: subForm.tier });
      toast.success('Subscribed successfully');
      setSubscribeOpen(false); setSelected(null);
    } catch (e: any) { toast.error(e.message || 'Subscription failed'); }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Developer Portal</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {apis.map(api => (
          <Card key={api.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/apis/${api.id}`)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base">{api.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{api.description || 'No description'}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">{api.version}</Badge>
                <Badge variant="outline" className="text-[10px] sm:text-xs">{api.authType}</Badge>
              </div>
              <div className="flex gap-2 pt-1" onClick={e => e.stopPropagation()}>
                <Button variant="outline" size="sm" className="text-xs flex-1" onClick={() => setSelected(api)}><Eye className="w-3 h-3 mr-1" />Details</Button>
                <Button size="sm" className="text-xs flex-1" onClick={() => { setSelected(api); setSubscribeOpen(true); }}>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {apis.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12 text-xs sm:text-sm">No published APIs available</div>}
      </div>
      {/* Detail Dialog */}
      <Dialog open={!!selected && !subscribeOpen} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">{selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-2 text-xs sm:text-sm">
            <p><strong>Context:</strong> {selected?.context}</p>
            <p><strong>Version:</strong> {selected?.version}</p>
            <p><strong>Endpoint:</strong> {selected?.endpoint}</p>
            <p><strong>Auth:</strong> {selected?.authType}</p>
            <p><strong>Description:</strong> {selected?.description || 'N/A'}</p>
          </div>
        </DialogContent>
      </Dialog>
      {/* Subscribe Dialog */}
      <Dialog open={subscribeOpen} onOpenChange={setSubscribeOpen}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base">Subscribe to {selected?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Application</Label>
              <Select value={subForm.appId} onValueChange={v => setSubForm({...subForm, appId: v})}>
                <SelectTrigger className="text-xs sm:text-sm"><SelectValue placeholder="Select app" /></SelectTrigger>
                <SelectContent>
                  {apps.map(a => <SelectItem key={a.id} value={a.id} className="text-xs sm:text-sm">{a.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Tier</Label>
              <Select value={subForm.tier} onValueChange={v => setSubForm({...subForm, tier: v})}>
                <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Bronze','Silver','Gold','Unlimited'].map(t => <SelectItem key={t} value={t} className="text-xs sm:text-sm">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setSubscribeOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button onClick={handleSubscribe} disabled={!subForm.appId} className="w-full sm:w-auto text-xs sm:text-sm">Subscribe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Applications Page ───────────────────────────────
function AppsPage() {
  useDocTitle('Applications | VedaDB API Manager');
  const [apps, setApps] = useState<AppItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<AppItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', tier: 'Gold', description: '' });
  const [editForm, setEditForm] = useState({ name: '', tier: 'Gold', description: '' });

  const fetch = useCallback(() => {
    api.getApplications().then(d => setApps(d.applications || d || [])).catch(() => toast.error('Failed to load applications'));
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => { setForm({ name: '', tier: 'Gold', description: '' }); setDialogOpen(true); };
  const openEdit = (app: AppItem) => { setEditItem(app); setEditForm({ name: app.name, tier: app.tier, description: app.description }); setEditDialogOpen(true); };

  const handleCreate = async () => {
    try { await api.createApp(form); toast.success('Application created'); setDialogOpen(false); fetch(); }
    catch (e: any) { toast.error(e.message || 'Create failed'); }
  };

  const handleEdit = async () => {
    if (!editItem) return;
    try { await api.updateApp(editItem.id, editForm); toast.success('Application updated'); setEditDialogOpen(false); fetch(); }
    catch (e: any) { toast.error(e.message || 'Update failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await api.deleteApp(id); toast.success('Application deleted'); fetch(); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
    setConfirmDelete(null);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Applications</h2>
        <Button onClick={openCreate} className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" />Create App</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {apps.map(app => (
          <Card key={app.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm sm:text-base">{app.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(app)}><Edit3 className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setConfirmDelete(app.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="secondary" className="text-[10px] sm:text-xs">{app.tier}</Badge>
              <p className="text-xs sm:text-sm text-muted-foreground">{app.description || 'No description'}</p>
              {app.consumerKey && <div className="text-[10px] sm:text-xs font-mono bg-muted rounded p-2 break-all"><span className="font-semibold">Key:</span> {app.consumerKey}</div>}
              {app.sandboxKey && <div className="text-[10px] sm:text-xs font-mono bg-muted rounded p-2 break-all"><span className="font-semibold">Sandbox:</span> {app.sandboxKey}</div>}
            </CardContent>
          </Card>
        ))}
        {apps.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12 text-xs sm:text-sm">No applications</div>}
      </div>
      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">Create Application</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Name</Label>
              <Input className="text-xs sm:text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Tier</Label>
              <Select value={form.tier} onValueChange={v => setForm({...form, tier: v})}>
                <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Bronze','Silver','Gold','Unlimited'].map(t => <SelectItem key={t} value={t} className="text-xs sm:text-sm">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Description</Label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button onClick={handleCreate} className="w-full sm:w-auto text-xs sm:text-sm">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">Edit Application</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Name</Label>
              <Input className="text-xs sm:text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Tier</Label>
              <Select value={editForm.tier} onValueChange={v => setEditForm({...editForm, tier: v})}>
                <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Bronze','Silver','Gold','Unlimited'].map(t => <SelectItem key={t} value={t} className="text-xs sm:text-sm">{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Description</Label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button onClick={handleEdit} className="w-full sm:w-auto text-xs sm:text-sm">Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm Delete */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base">Delete Application?</DialogTitle><DialogDescription className="text-xs sm:text-sm">This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)} className="w-full sm:w-auto text-xs sm:text-sm">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Subscriptions Page ──────────────────────────────
function SubscriptionsPage() {
  useDocTitle('Subscriptions | VedaDB API Manager');
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(() => {
    setLoading(true);
    api.getSubscriptions().then(d => setSubs(d.subscriptions || d || [])).catch(() => toast.error('Failed to load subscriptions')).finally(() => setLoading(false));
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const handleUnsubscribe = async (id: string) => {
    try { await api.unsubscribe(id); toast.success('Unsubscribed'); setSubs(prev => prev.filter(s => s.id !== id)); }
    catch (e: any) { toast.error(e.message || 'Unsubscribe failed'); }
  };

  return (
    <div className="p-3 sm:p-6 space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold">Subscriptions</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">API</TableHead>
              <TableHead className="text-xs sm:text-sm">Application</TableHead>
              <TableHead className="text-xs sm:text-sm">Tier</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">Created</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-xs">Loading...</TableCell></TableRow> :
             subs.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">No subscriptions</TableCell></TableRow> :
             subs.map(s => (
              <TableRow key={s.id}>
                <TableCell className="text-xs sm:text-sm font-medium">{s.apiName}</TableCell>
                <TableCell className="text-xs sm:text-sm">{s.appName}</TableCell>
                <TableCell className="text-xs sm:text-sm"><Badge variant="secondary" className="text-[10px] sm:text-xs">{s.tier}</Badge></TableCell>
                <TableCell className="text-xs sm:text-sm">{s.status}</TableCell>
                <TableCell className="hidden md:table-cell text-xs sm:text-sm">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-7" onClick={() => handleUnsubscribe(s.id)}>Unsubscribe</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Analytics Page ──────────────────────────────────
function AnalyticsPage() {
  useDocTitle('Analytics | VedaDB API Manager');
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState<AnalyticsData>({ callsOverTime: [], topApis: [], latency: [] });
  const gradId = useGradientId('analytics-calls');

  useEffect(() => {
    api.getAnalytics(period).then(d => setData(d || { callsOverTime: [], topApis: [], latency: [] })).catch(() => toast.error('Failed to load analytics'));
  }, [period]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  const exportCSV = () => {
    const rows = data.callsOverTime.map(r => `${r.date},${r.calls}`).join('\n');
    const blob = new Blob([`Date,Calls\n${rows}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'analytics.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Analytics</h2>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 text-xs sm:text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['7d','30d','90d'].map(p => <SelectItem key={p} value={p} className="text-xs sm:text-sm">Last {p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={exportCSV}><Download className="w-3.5 h-3.5 mr-1" />Export CSV</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm sm:text-base">Calls Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.callsOverTime}>
                <defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Area type="monotone" dataKey="calls" stroke="#8884d8" fill={`url(#${gradId})`} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm sm:text-base">Top APIs</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={data.topApis} dataKey="calls" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {data.topApis.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <ReTooltip />
                <Legend fontSize={12} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm sm:text-base">Latency by API</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.latency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <ReTooltip />
              <Bar dataKey="ms" fill="#8884d8" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Throttle Page ───────────────────────────────────
function ThrottlePage() {
  useDocTitle('Rate Limiting | VedaDB API Manager');
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: 'api', rate: 100, unit: 'requestsPerMin', burst: 10 });

  const fetch = useCallback(() => {
    api.getThrottlePolicies().then(d => setPolicies(d.policies || d || [])).catch(() => toast.error('Failed to load policies'));
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async () => {
    try { await api.createPolicy(form); toast.success('Policy created'); setDialogOpen(false); fetch(); }
    catch (e: any) { toast.error(e.message || 'Create failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await api.deletePolicy(id); toast.success('Policy deleted'); fetch(); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
    setConfirmDelete(null);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Throttle Policies</h2>
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" />Create Policy</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Name</TableHead>
              <TableHead className="text-xs sm:text-sm">Type</TableHead>
              <TableHead className="text-xs sm:text-sm">Rate</TableHead>
              <TableHead className="text-xs sm:text-sm">Unit</TableHead>
              <TableHead className="text-xs sm:text-sm">Burst</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">No policies</TableCell></TableRow> :
             policies.map(p => (
              <TableRow key={p.id}>
                <TableCell className="text-xs sm:text-sm font-medium">{p.name}</TableCell>
                <TableCell className="text-xs sm:text-sm capitalize">{p.type}</TableCell>
                <TableCell className="text-xs sm:text-sm">{p.rate}</TableCell>
                <TableCell className="text-xs sm:text-sm">{p.unit}</TableCell>
                <TableCell className="text-xs sm:text-sm">{p.burst}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setConfirmDelete(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">Create Policy</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Name</Label><Input className="text-xs sm:text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Type</Label>
              <Select value={form.type} onValueChange={v => setForm({...form, type: v})}>
                <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="api" className="text-xs sm:text-sm">API</SelectItem><SelectItem value="app" className="text-xs sm:text-sm">Application</SelectItem><SelectItem value="user" className="text-xs sm:text-sm">User</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Rate</Label><Input type="number" className="text-xs sm:text-sm" value={form.rate} onChange={e => setForm({...form, rate: Number(e.target.value)})} /></div>
              <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Burst</Label><Input type="number" className="text-xs sm:text-sm" value={form.burst} onChange={e => setForm({...form, burst: Number(e.target.value)})} /></div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Unit</Label>
              <Select value={form.unit} onValueChange={v => setForm({...form, unit: v})}>
                <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['requestsPerMin','requestsPerHour','requestsPerDay','requestsPerMonth'].map(u => <SelectItem key={u} value={u} className="text-xs sm:text-sm">{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button onClick={handleCreate} className="w-full sm:w-auto text-xs sm:text-sm">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base">Delete Policy?</DialogTitle><DialogDescription className="text-xs sm:text-sm">This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)} className="w-full sm:w-auto text-xs sm:text-sm">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Users Page ──────────────────────────────────────
function UsersPage() {
  useDocTitle('Users | VedaDB API Manager');
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'publisher' });

  const fetch = useCallback(() => {
    api.getUsers().then(d => setUsers(d.users || d || [])).catch(() => toast.error('Failed to load users'));
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async () => {
    try { await api.createUser(form); toast.success('User created'); setDialogOpen(false); fetch(); }
    catch (e: any) { toast.error(e.message || 'Create failed'); }
  };

  const handleDelete = async (id: string) => {
    try { await api.deleteUser(id); toast.success('User deleted'); fetch(); }
    catch (e: any) { toast.error(e.message || 'Delete failed'); }
    setConfirmDelete(null);
  };

  const roleColor = (r: string) => {
    if (r === 'admin') return 'bg-red-500/10 text-red-500';
    if (r === 'publisher') return 'bg-blue-500/10 text-blue-500';
    return 'bg-green-500/10 text-green-500';
  };

  return (
    <div className="p-3 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Users</h2>
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" />Create User</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs sm:text-sm">Username</TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">Email</TableHead>
              <TableHead className="text-xs sm:text-sm">Role</TableHead>
              <TableHead className="text-xs sm:text-sm">Status</TableHead>
              <TableHead className="text-xs sm:text-sm text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs">No users</TableCell></TableRow> :
             users.map(u => (
              <TableRow key={u.id}>
                <TableCell className="text-xs sm:text-sm font-medium">{u.username}</TableCell>
                <TableCell className="hidden md:table-cell text-xs sm:text-sm">{u.email}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] sm:text-xs capitalize ${roleColor(u.role)}`}>{u.role}</Badge></TableCell>
                <TableCell className="text-xs sm:text-sm">{u.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setConfirmDelete(u.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base sm:text-lg">Create User</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Username</Label><Input className="text-xs sm:text-sm" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required /></div>
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Email</Label><Input type="email" className="text-xs sm:text-sm" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
            <div className="space-y-1.5"><Label className="text-xs sm:text-sm">Password</Label><Input type="password" className="text-xs sm:text-sm" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm">Role</Label>
              <Select value={form.role} onValueChange={v => setForm({...form, role: v})}>
                <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['admin','publisher','subscriber'].map(r => <SelectItem key={r} value={r} className="text-xs sm:text-sm capitalize">{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button onClick={handleCreate} className="w-full sm:w-auto text-xs sm:text-sm">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm max-w-[95vw]">
          <DialogHeader><DialogTitle className="text-base">Delete User?</DialogTitle><DialogDescription className="text-xs sm:text-sm">This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)} className="w-full sm:w-auto text-xs sm:text-sm">Cancel</Button>
            <Button variant="destructive" onClick={() => confirmDelete && handleDelete(confirmDelete)} className="w-full sm:w-auto text-xs sm:text-sm">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Layout ──────────────────────────────────────────
function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    setCollapsed(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background w-full">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <Breadcrumbs />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token') || '');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme }}>
      <AuthCtx.Provider value={{ token, setToken }}>
        <Toaster position="top-right" richColors />
        <HashRouter>
          <Routes>
            <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="*" element={!token ? <Navigate to="/login" /> : (
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/apis" element={<APIsPage />} />
                  <Route path="/apis/:id" element={<APIDetailPage />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/apps" element={<AppsPage />} />
                  <Route path="/subscriptions" element={<SubscriptionsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/admin/throttle" element={<ThrottlePage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                  <Route path="/admin/webhooks" element={<WebhooksPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            )} />
          </Routes>
        </HashRouter>
      </AuthCtx.Provider>
    </ThemeCtx.Provider>
  );
}

export default App;

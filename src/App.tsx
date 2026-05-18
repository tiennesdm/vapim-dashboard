import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import {
  LayoutDashboard, Box, Store, AppWindow, CreditCard, BarChart3, Gauge, Users,
  Menu, Search, Bell, UserCircle, LogOut, Plus, Edit3, Trash2, Rocket,
  Eye, Download, Activity, AlertTriangle
} from 'lucide-react';
import { api } from './lib/api';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { Sheet, SheetContent } from './components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from './components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

// ─── Types ───────────────────────────────────────────
interface APIItem { id: string; name: string; context: string; version: string; endpoint: string; status: string; authType: string; throttlePolicy: string; description: string; }
interface AppItem { id: string; name: string; tier: string; description: string; consumerKey?: string; sandboxKey?: string; }
interface Subscription { id: string; apiId: string; apiName: string; appId: string; appName: string; tier: string; status: string; createdAt: string; }
interface Policy { id: string; name: string; type: string; rate: number; unit: string; burst: number; }
interface User { id: string; username: string; email: string; role: string; status: string; }
interface AnalyticsData { callsOverTime: { date: string; calls: number }[]; topApis: { name: string; calls: number }[]; latency: { name: string; ms: number }[]; }

// ─── Auth Context ────────────────────────────────────
const AuthCtx = createContext<{ token: string; setToken: (t: string) => void }>({ token: '', setToken: () => {} });

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
];

function Sidebar({ mobileOpen, setMobileOpen, collapsed }: { mobileOpen: boolean; setMobileOpen: (v: boolean) => void; collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useContext(AuthCtx);
  const isActive = (p: string) => location.pathname === p;

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
      <aside className={`hidden sm:flex h-screen border-r bg-background flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
        {content}
      </aside>
    </>
  );
}

// ─── TopBar ──────────────────────────────────────────
function TopBar({ onMenu }: { onMenu: () => void }) {
  const { token } = useContext(AuthCtx);
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-3 sm:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={onMenu}>
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-base sm:text-lg font-semibold">VedaDB API Manager</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center relative">
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>{token ? 'Administrator' : 'Guest'}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ─── Login Page ──────────────────────────────────────
function LoginPage() {
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
  const [apis, setApis] = useState<APIItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ callsOverTime: [], topApis: [], latency: [] });
  const [loading, setLoading] = useState(true);

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
                <defs><linearGradient id="c1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Area type="monotone" dataKey="calls" stroke="#8884d8" fillOpacity={1} fill="url(#c1)" />
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
  const [apis, setApis] = useState<APIItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<APIItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmPublish, setConfirmPublish] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', context: '', version: '', endpoint: '', authType: 'OAuth2', throttlePolicy: '', description: '' });

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
              <TableRow key={a.id}>
                <TableCell className="text-xs sm:text-sm font-medium">{a.name}</TableCell>
                <TableCell className="hidden md:table-cell text-xs sm:text-sm">{a.context}</TableCell>
                <TableCell className="text-xs sm:text-sm">{a.version}</TableCell>
                <TableCell className="hidden lg:table-cell text-xs sm:text-sm max-w-[200px] truncate">{a.endpoint}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] sm:text-xs ${statusColor(a.status)}`}>{a.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
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

// ─── Store Page ──────────────────────────────────────
function StorePage() {
  const [apis, setApis] = useState<APIItem[]>([]);
  const [selected, setSelected] = useState<APIItem | null>(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [subForm, setSubForm] = useState({ appId: '', tier: 'Gold' });

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
          <Card key={api.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm sm:text-base">{api.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{api.description || 'No description'}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">{api.version}</Badge>
                <Badge variant="outline" className="text-[10px] sm:text-xs">{api.authType}</Badge>
              </div>
              <div className="flex gap-2 pt-1">
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
  const [apps, setApps] = useState<AppItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', tier: 'Gold', description: '' });

  const fetch = useCallback(() => {
    api.getApplications().then(d => setApps(d.applications || d || [])).catch(() => toast.error('Failed to load applications'));
  }, []);
  useEffect(() => { fetch(); }, [fetch]);

  const handleCreate = async () => {
    try { await api.createApp(form); toast.success('Application created'); setDialogOpen(false); fetch(); }
    catch (e: any) { toast.error(e.message || 'Create failed'); }
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
        <Button onClick={() => setDialogOpen(true)} className="w-full sm:w-auto"><Plus className="w-4 h-4 mr-2" />Create App</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {apps.map(app => (
          <Card key={app.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm sm:text-base">{app.name}</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setConfirmDelete(app.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
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
  const [period, setPeriod] = useState('30d');
  const [data, setData] = useState<AnalyticsData>({ callsOverTime: [], topApis: [], latency: [] });

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm sm:text-base">Calls Over Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.callsOverTime}>
                <defs><linearGradient id="c2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/><stop offset="95%" stopColor="#8884d8" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ReTooltip />
                <Area type="monotone" dataKey="calls" stroke="#8884d8" fill="url(#c2)" />
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
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    setCollapsed(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenu={() => setMobileOpen(true)} />
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

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem('token') || '');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
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
                <Route path="/store" element={<StorePage />} />
                <Route path="/apps" element={<AppsPage />} />
                <Route path="/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/throttle" element={<ThrottlePage />} />
                <Route path="/admin/users" element={<UsersPage />} />
              </Routes>
            </Layout>
          )} />
        </Routes>
      </HashRouter>
    </AuthCtx.Provider>
  );
}

export default App;

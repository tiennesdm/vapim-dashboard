import { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter
} from '@/components/ui/sheet';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  Search, UserPlus, Download, Pencil, Lock, Unlock, Trash2,
  Mail, UsersRound
} from 'lucide-react';

// ---------- Helpers ----------

const roleConfig = {
  admin: { color: '#8B5CF6', bg: '#8B5CF620', label: 'Admin' },
  publisher: { color: '#4488FF', bg: '#4488FF20', label: 'Publisher' },
  subscriber: { color: '#10B981', bg: '#10B98120', label: 'Subscriber' },
};

const statusConfig = {
  active: { color: '#10B981', label: 'Active' },
  inactive: { color: '#6B7280', label: 'Inactive' },
  locked: { color: '#EF4444', label: 'Locked' },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = roleConfig[role as keyof typeof roleConfig] || roleConfig.subscriber;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider"
      style={{ color: cfg.color, backgroundColor: cfg.color + '20' }}
    >
      {cfg.label}
    </span>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) return `${Math.floor(diffDay / 30)} months ago`;
  if (diffDay > 0) return `${diffDay}d ago`;
  if (diffHour > 0) return `${diffHour}h ago`;
  if (diffMin > 0) return `${diffMin}m ago`;
  return 'Just now';
}

// ---------- Invite Modal ----------

function InviteUserModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', role: 'subscriber', tenant: 'carbon.super', message: '' });

  const handleSubmit = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#E8ECF1]">Invite New User</DialogTitle>
          <DialogDescription className="text-[#9DA5B4]">
            Send an invitation email to a new user to join the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Email *</label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">First Name</label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF] focus:ring-[#4488FF30]"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Last Name</label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF] focus:ring-[#4488FF30]"
              />
            </div>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Role</label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="publisher">Publisher</SelectItem>
                <SelectItem value="subscriber">Subscriber</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Tenant</label>
            <Select value={form.tenant} onValueChange={(v) => setForm({ ...form, tenant: v })}>
              <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                <SelectItem value="carbon.super">carbon.super</SelectItem>
                <SelectItem value="acme.corp">acme.corp</SelectItem>
                <SelectItem value="tech.startup">tech.startup</SelectItem>
                <SelectItem value="enterprise.io">enterprise.io</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Message (optional)</label>
            <textarea
              placeholder="Include a personal message in the invite email..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full h-20 bg-[#181A20] border border-[#3D434F] rounded-md px-3 py-2 text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] focus:ring-2 focus:ring-[#4488FF30] resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]">
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Edit User Drawer ----------

function EditUserDrawer({ user, open, onOpenChange }: { user: User | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', role: 'subscriber', tenant: '', status: 'active'
  });

  // Reset form when user changes
  useState(() => {
    if (user) {
      setForm({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenant: user.tenant,
        status: user.status,
      });
    }
  });

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-[#2B2F38] border-l border-[#3D434F] w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-[#E8ECF1]">Edit User</SheetTitle>
          <SheetDescription className="text-[#9DA5B4]">
            {user.firstName} {user.lastName} (@{user.username})
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="bg-[#1E2128] border border-[#3D434F]">
            <TabsTrigger value="details" className="text-[#9DA5B4] data-[state=active]:bg-[#4488FF] data-[state=active]:text-white">Details</TabsTrigger>
            <TabsTrigger value="permissions" className="text-[#9DA5B4] data-[state=active]:bg-[#4488FF] data-[state=active]:text-white">Permissions</TabsTrigger>
            <TabsTrigger value="activity" className="text-[#9DA5B4] data-[state=active]:bg-[#4488FF] data-[state=active]:text-white">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Email</label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">First Name</label>
                <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]" />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Last Name</label>
                <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]" />
              </div>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Role</label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="publisher">Publisher</SelectItem>
                  <SelectItem value="subscriber">Subscriber</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#9DA5B4] mb-1.5 block">Tenant</label>
              <Select value={form.tenant} onValueChange={(v) => setForm({ ...form, tenant: v })}>
                <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                  <SelectItem value="carbon.super">carbon.super</SelectItem>
                  <SelectItem value="acme.corp">acme.corp</SelectItem>
                  <SelectItem value="tech.startup">tech.startup</SelectItem>
                  <SelectItem value="enterprise.io">enterprise.io</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between py-2">
              <label className="text-[13px] font-medium text-[#E8ECF1]">Status</label>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#9DA5B4]">{form.status}</span>
                <Switch
                  checked={form.status === 'active'}
                  onCheckedChange={(checked) => setForm({ ...form, status: checked ? 'active' : 'inactive' })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-4">
            <div className="space-y-4">
              {['API Management', 'User Management', 'Analytics', 'Settings'].map((cat) => (
                <div key={cat}>
                  <h4 className="text-[13px] font-semibold text-[#E8ECF1] mb-2">{cat}</h4>
                  <div className="space-y-2">
                    {['Read', 'Write', 'Delete'].map((perm) => (
                      <label key={perm} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-[#3D434F] bg-[#181A20] accent-[#4488FF]"
                          defaultChecked={cat === 'API Management' && perm === 'Read'}
                        />
                        <span className="text-[13px] text-[#9DA5B4]">{cat.split(' ')[0].toLowerCase()}:{perm.toLowerCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <div className="space-y-0">
              {[
                { time: '2024-07-22T08:00:00Z', ip: '192.168.1.1', browser: 'Chrome 126', status: 'SUCCESS' },
                { time: '2024-07-21T16:00:00Z', ip: '192.168.1.45', browser: 'Firefox 127', status: 'SUCCESS' },
                { time: '2024-07-20T12:00:00Z', ip: '192.168.1.92', browser: 'Safari 17', status: 'SUCCESS' },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b border-[#3D434F30] last:border-0">
                  <div className="flex-1">
                    <p className="text-[13px] text-[#E8ECF1]">{formatRelativeTime(log.time)}</p>
                    <p className="text-[11px] text-[#6B7280]">{log.ip} &middot; {log.browser}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-[#10B981] text-[#10B981]">{log.status}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]">
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------- Delete Confirmation Dialog ----------

function DeleteConfirmDialog({ user, open, onOpenChange }: { user: User | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!user) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[#E8ECF1]">Delete User</DialogTitle>
          <DialogDescription className="text-[#9DA5B4]">
            Are you sure you want to delete <strong className="text-[#E8ECF1]">{user.firstName} {user.lastName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]">
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="bg-[#EF4444] text-white hover:bg-[#DC2626]">
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Main Page ----------

export default function Users() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          user.firstName.toLowerCase().includes(q) ||
          user.lastName.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.username.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (roleFilter.length > 0 && !roleFilter.includes(user.role)) return false;
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      if (sortBy === 'login') return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime();
      if (sortBy === 'created') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [search, roleFilter, statusFilter, sortBy]);

  const toggleRole = (role: string) => {
    setRoleFilter((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setEditOpen(true);
  };

  const openDelete = (user: User) => {
    setDeleteUser(user);
    setDeleteOpen(true);
  };

  const hasFilters = search || roleFilter.length > 0 || statusFilter !== 'all';

  return (
    <Layout>
      <div className="p-6 max-w-[1440px] mx-auto">
        {/* Page Header */}
        <div className="flex items-end justify-between mb-6 animate-in fade-in duration-200">
          <div>
            <h1 className="text-[28px] font-bold text-[#E8ECF1] tracking-tight">User Management</h1>
            <p className="text-[13px] text-[#9DA5B4] mt-0.5">Manage platform users, roles, and permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942] text-[13px]">
              <Download className="w-4 h-4 mr-1.5" />
              Export CSV
            </Button>
            <Button onClick={() => setInviteOpen(true)} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF] text-[13px]">
              <UserPlus className="w-4 h-4 mr-1.5" />
              Invite User
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <Card className="bg-[#2B2F38] border-[#3D434F] mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                <Input
                  placeholder="Search by name, email, username..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-[#181A20] border-[#3D434F] text-[#E8ECF1] placeholder:text-[#6B7280] focus:border-[#4488FF] focus:ring-[#4488FF30]"
                />
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[12px] text-[#6B7280] mr-1">Roles:</span>
                {(['admin', 'publisher', 'subscriber'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={cn(
                      'px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-all duration-150',
                      roleFilter.includes(role)
                        ? 'bg-[#F59E0B] text-[#0D0E12]'
                        : 'bg-[#1E2128] text-[#9DA5B4] hover:bg-[#353942]'
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] bg-[#181A20] border-[#3D434F] text-[#E8ECF1] text-[13px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px] bg-[#181A20] border-[#3D434F] text-[#E8ECF1] text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2F38] border-[#3D434F]">
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="login">Last Login</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                </SelectContent>
              </Select>

              {hasFilters && (
                <button
                  onClick={() => { setSearch(''); setRoleFilter([]); setStatusFilter('all'); }}
                  className="text-[12px] text-[#EF4444] hover:text-[#DC2626] font-medium"
                >
                  Clear all
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-[#2B2F38] border-[#3D434F]">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1E2128]">
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">User</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Email</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Role</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Tenant</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Status</th>
                    <th className="text-left text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Last Login</th>
                    <th className="text-right text-[11px] font-semibold text-[#9DA5B4] uppercase tracking-[0.05em] py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, i) => (
                    <tr
                      key={user.id}
                      className={cn(
                        'border-b border-[#3D434F50] transition-colors hover:bg-[#353942]',
                        i % 2 === 0 ? 'bg-[#21242B]' : 'bg-[#2B2F38]'
                      )}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#4488FF] flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-[#E8ECF1]">{user.firstName} {user.lastName}</p>
                            <p className="text-[12px] text-[#6B7280]">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#6B7280]" />
                          <span className="text-[13px] text-[#E8ECF1]">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4"><RoleBadge role={user.role} /></td>
                      <td className="py-3 px-4 text-[13px] text-[#E8ECF1]">{user.tenant}</td>
                      <td className="py-3 px-4"><StatusBadge status={user.status} /></td>
                      <td className="py-3 px-4 text-[13px] text-[#9DA5B4]">{formatRelativeTime(user.lastLogin)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(user)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors"
                            title={user.status === 'locked' ? 'Unlock' : 'Lock'}
                          >
                            {user.status === 'locked' ? <Unlock className="w-4 h-4 text-[#10B981]" /> : <Lock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openDelete(user)}
                            className="w-8 h-8 flex items-center justify-center rounded-md text-[#9DA5B4] hover:bg-[#EF444420] hover:text-[#EF4444] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <UsersRound className="w-12 h-12 text-[#3D434F] mb-3" />
                <p className="text-[16px] font-medium text-[#E8ECF1]">No users found</p>
                <p className="text-[13px] text-[#9DA5B4] mt-1">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <InviteUserModal open={inviteOpen} onOpenChange={setInviteOpen} />
      <EditUserDrawer user={editUser} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteConfirmDialog user={deleteUser} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </Layout>
  );
}

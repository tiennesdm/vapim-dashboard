import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Save, Globe, Shield, Mail, Palette, Server } from 'lucide-react';

interface SettingsState {
  // General
  platformName: string;
  defaultLanguage: string;
  timezone: string;
  // Security
  sessionTimeout: number;
  passwordMinLength: number;
  requireSpecialChar: boolean;
  corsEnabled: boolean;
  corsOrigins: string;
  // Email
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromAddress: string;
  // Appearance
  theme: string;
  accentColor: string;
  // API Gateway
  gatewayUrl: string;
  requestTimeout: number;
  maxRetries: number;
  retryInterval: number;
}

const defaultSettings: SettingsState = {
  platformName: 'VedaDB API Manager',
  defaultLanguage: 'en',
  timezone: 'UTC',
  sessionTimeout: 30,
  passwordMinLength: 8,
  requireSpecialChar: true,
  corsEnabled: true,
  corsOrigins: '*',
  smtpHost: 'smtp.mailtrap.io',
  smtpPort: 2525,
  smtpUser: 'api_user',
  smtpPassword: '',
  fromAddress: 'noreply@vedadb.io',
  theme: 'system',
  accentColor: 'blue',
  gatewayUrl: 'https://gateway.vedadb.io',
  requestTimeout: 30000,
  maxRetries: 3,
  retryInterval: 1000,
};

function loadSettings(): SettingsState {
  try {
    const saved = localStorage.getItem('vedadb_settings');
    if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return { ...defaultSettings };
}

function saveSettings(settings: SettingsState) {
  localStorage.setItem('vedadb_settings', JSON.stringify(settings));
}

const accentColors = [
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' },
  { value: 'teal', label: 'Teal' },
];

export function SettingsPage() {
  usePageTitle('Settings | VedaDB API Manager');
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState<SettingsState>(loadSettings);
  const activeTab = searchParams.get('tab') || 'general';

  const update = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    toast.success('Settings saved successfully');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Settings</h2>
        <Button onClick={handleSave} className="w-full sm:w-auto gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setSearchParams({ tab: v })} className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="general" className="text-xs gap-1.5"><Globe className="w-3.5 h-3.5" /> General</TabsTrigger>
          <TabsTrigger value="security" className="text-xs gap-1.5"><Shield className="w-3.5 h-3.5" /> Security</TabsTrigger>
          <TabsTrigger value="email" className="text-xs gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</TabsTrigger>
          <TabsTrigger value="appearance" className="text-xs gap-1.5"><Palette className="w-3.5 h-3.5" /> Appearance</TabsTrigger>
          <TabsTrigger value="gateway" className="text-xs gap-1.5"><Server className="w-3.5 h-3.5" /> API Gateway</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Platform Name</Label>
                <Input className="text-xs sm:text-sm" value={settings.platformName} onChange={e => update('platformName', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Default Language</Label>
                <Select value={settings.defaultLanguage} onValueChange={v => update('defaultLanguage', v)}>
                  <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['en', 'es', 'fr', 'de', 'zh', 'ja'].map(l => (
                      <SelectItem key={l} value={l} className="text-xs sm:text-sm">{l.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Timezone</Label>
                <Select value={settings.timezone} onValueChange={v => update('timezone', v)}>
                  <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata'].map(tz => (
                      <SelectItem key={tz} value={tz} className="text-xs sm:text-sm">{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Session Timeout (minutes)</Label>
                <Input type="number" className="text-xs sm:text-sm" value={settings.sessionTimeout} onChange={e => update('sessionTimeout', Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Minimum Password Length</Label>
                <Input type="number" className="text-xs sm:text-sm" value={settings.passwordMinLength} onChange={e => update('passwordMinLength', Number(e.target.value))} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-xs sm:text-sm">Require Special Characters</Label>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Passwords must contain at least one special character</p>
                </div>
                <Switch checked={settings.requireSpecialChar} onCheckedChange={v => update('requireSpecialChar', v)} />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-xs sm:text-sm">Enable CORS</Label>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Allow cross-origin requests</p>
                </div>
                <Switch checked={settings.corsEnabled} onCheckedChange={v => update('corsEnabled', v)} />
              </div>
              {settings.corsEnabled && (
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Allowed Origins</Label>
                  <Input className="text-xs sm:text-sm" placeholder="* or comma-separated URLs" value={settings.corsOrigins} onChange={e => update('corsOrigins', e.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">Email Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">SMTP Host</Label>
                  <Input className="text-xs sm:text-sm" value={settings.smtpHost} onChange={e => update('smtpHost', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">SMTP Port</Label>
                  <Input type="number" className="text-xs sm:text-sm" value={settings.smtpPort} onChange={e => update('smtpPort', Number(e.target.value))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">SMTP Username</Label>
                <Input className="text-xs sm:text-sm" value={settings.smtpUser} onChange={e => update('smtpUser', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">SMTP Password</Label>
                <Input type="password" className="text-xs sm:text-sm" placeholder="••••••" value={settings.smtpPassword} onChange={e => update('smtpPassword', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">From Address</Label>
                <Input className="text-xs sm:text-sm" type="email" value={settings.fromAddress} onChange={e => update('fromAddress', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Theme</Label>
                <Select value={settings.theme} onValueChange={v => update('theme', v)}>
                  <SelectTrigger className="text-xs sm:text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light" className="text-xs sm:text-sm">Light</SelectItem>
                    <SelectItem value="dark" className="text-xs sm:text-sm">Dark</SelectItem>
                    <SelectItem value="system" className="text-xs sm:text-sm">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Accent Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {accentColors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => update('accentColor', color.value)}
                      className={`px-3 py-1.5 rounded-md text-xs border transition-all ${
                        settings.accentColor === color.value
                          ? 'border-primary bg-primary/10 font-medium'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Gateway Tab */}
        <TabsContent value="gateway" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm sm:text-base">API Gateway Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Gateway URL</Label>
                <Input className="text-xs sm:text-sm" value={settings.gatewayUrl} onChange={e => update('gatewayUrl', e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Request Timeout (ms)</Label>
                  <Input type="number" className="text-xs sm:text-sm" value={settings.requestTimeout} onChange={e => update('requestTimeout', Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Max Retries</Label>
                  <Input type="number" className="text-xs sm:text-sm" value={settings.maxRetries} onChange={e => update('maxRetries', Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Retry Interval (ms)</Label>
                  <Input type="number" className="text-xs sm:text-sm" value={settings.retryInterval} onChange={e => update('retryInterval', Number(e.target.value))} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

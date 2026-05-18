import { useState } from 'react';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { cn } from '@/lib/utils';
import {
  Settings as SettingsIcon,
  Shield,
  Mail,
  Palette,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  X,
  Building2,
  Globe,
  Clock,
  Bell,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Moon,
  Sun,
  Monitor,
  Upload,
  Type,
  PanelLeft,
  Fingerprint,
  RefreshCw,
  Pencil
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

type SettingsTab = 'general' | 'security' | 'email' | 'appearance';

const tabs = [
  { id: 'general' as SettingsTab, label: 'General', icon: Settings },
  { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
  { id: 'email' as SettingsTab, label: 'Email', icon: Mail },
  { id: 'appearance' as SettingsTab, label: 'Appearance', icon: Palette },
];

// ---- General Settings ----
function GeneralSettings() {
  const [orgName, setOrgName] = useState('VedaDB Inc.');
  const [orgDomain, setOrgDomain] = useState('vedadb');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('ISO 8601');
  const [language, setLanguage] = useState('English');
  const [defaultVisibility, setDefaultVisibility] = useState('PUBLIC');
  const [requireApproval, setRequireApproval] = useState(true);
  const [autoDeprecate, setAutoDeprecate] = useState(false);
  const [defaultAuth, setDefaultAuth] = useState('OAuth 2.0');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [errorRateAlert, setErrorRateAlert] = useState(5);
  const [latencyAlert, setLatencyAlert] = useState(500);

  return (
    <div className="space-y-6">
      {/* Organization Settings */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#F59E0B]" />
          Organization Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Organization Name</label>
            <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Organization Domain</label>
            <div className="flex">
              <Input value={orgDomain} onChange={(e) => setOrgDomain(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF] rounded-r-none border-r-0" />
              <span className="px-3 py-2 bg-[#181A20] border border-[#3D434F] border-l-0 text-[#6B7280] text-[13px] rounded-r-md flex items-center">.vedadb.com</span>
            </div>
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full h-10 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]">
              <option>UTC</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
              <option>Europe/London</option>
              <option>Europe/Berlin</option>
              <option>Asia/Singapore</option>
              <option>Asia/Tokyo</option>
              <option>Australia/Sydney</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Date Format</label>
            <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full h-10 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]">
              <option>ISO 8601</option>
              <option>US (MM/DD/YYYY)</option>
              <option>EU (DD/MM/YYYY)</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Default Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full h-10 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#4488FF]" />
          API Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Default API Visibility</label>
            <select value={defaultVisibility} onChange={(e) => setDefaultVisibility(e.target.value)} className="w-full h-10 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]">
              <option>PUBLIC</option>
              <option>PRIVATE</option>
              <option>RESTRICTED</option>
            </select>
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Default Auth Type</label>
            <select value={defaultAuth} onChange={(e) => setDefaultAuth(e.target.value)} className="w-full h-10 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]">
              <option>OAuth 2.0</option>
              <option>API Key</option>
              <option>None</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <div>
              <div className="text-[13px] font-medium text-[#E8ECF1]">Require Approval for Publishing</div>
              <div className="text-[12px] text-[#6B7280]">New APIs must be approved before publishing</div>
            </div>
            <Switch checked={requireApproval} onCheckedChange={setRequireApproval} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <div>
              <div className="text-[13px] font-medium text-[#E8ECF1]">Auto-Deprecate on New Version</div>
              <div className="text-[12px] text-[#6B7280]">Automatically deprecate old API versions</div>
            </div>
            <Switch checked={autoDeprecate} onCheckedChange={setAutoDeprecate} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#F59E0B]" />
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <div>
              <div className="text-[13px] font-medium text-[#E8ECF1]">Enable Email Notifications</div>
              <div className="text-[12px] text-[#6B7280]">Receive email alerts for important events</div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Alert on Error Rate {'>'}</label>
              <div className="flex">
                <Input type="number" value={errorRateAlert} onChange={(e) => setErrorRateAlert(Number(e.target.value))} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF] rounded-r-none" />
                <span className="px-3 py-2 bg-[#181A20] border border-[#3D434F] border-l-0 text-[#6B7280] text-[13px] rounded-r-md flex items-center">%</span>
              </div>
            </div>
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Alert on Latency {'>'}</label>
              <div className="flex">
                <Input type="number" value={latencyAlert} onChange={(e) => setLatencyAlert(Number(e.target.value))} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF] rounded-r-none" />
                <span className="px-3 py-2 bg-[#181A20] border border-[#3D434F] border-l-0 text-[#6B7280] text-[13px] rounded-r-md flex items-center">ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Security Settings ----
function SecuritySettings() {
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [lockoutDuration, setLockoutDuration] = useState(15);
  const [requireMFA, setRequireMFA] = useState(false);
  const [mfaTotp, setMfaTotp] = useState(true);
  const [mfaSms, setMfaSms] = useState(false);
  const [mfaEmail, setMfaEmail] = useState(false);
  const [minPasswordLength, setMinPasswordLength] = useState(8);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecial, setRequireSpecial] = useState(false);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [hsts, setHsts] = useState(true);
  const [frameOptions, setFrameOptions] = useState(true);
  const [contentTypeOptions, setContentTypeOptions] = useState(true);
  const [csp, setCsp] = useState(true);
  const [corsEnabled, setCorsEnabled] = useState(true);
  const [corsOrigin, setCorsOrigin] = useState('*');
  const [ipAllowlist, setIpAllowlist] = useState(false);
  const [allowedIps, setAllowedIps] = useState('192.168.1.0/24\n10.0.0.0/8');

  return (
    <div className="space-y-6">
      {/* Authentication */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#F59E0B]" />
          Authentication
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Session Timeout (minutes)</label>
            <Input type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(Number(e.target.value))} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Max Login Attempts</label>
            <Input type="number" value={maxLoginAttempts} onChange={(e) => setMaxLoginAttempts(Number(e.target.value))} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Lockout Duration (minutes)</label>
            <Input type="number" value={lockoutDuration} onChange={(e) => setLockoutDuration(Number(e.target.value))} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
          <div>
            <div className="text-[13px] font-medium text-[#E8ECF1]">Require MFA</div>
            <div className="text-[12px] text-[#6B7280]">Enforce multi-factor authentication for all users</div>
          </div>
          <Switch checked={requireMFA} onCheckedChange={setRequireMFA} className="data-[state=checked]:bg-[#4488FF]" />
        </div>
        {requireMFA && (
          <div className="mt-3 ml-4 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={mfaTotp} onChange={(e) => setMfaTotp(e.target.checked)} className="rounded border-[#3D434F] bg-[#181A20] text-[#4488FF]" />
              <span className="text-[13px] text-[#E8ECF1]">TOTP Authenticator App</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={mfaSms} onChange={(e) => setMfaSms(e.target.checked)} className="rounded border-[#3D434F] bg-[#181A20] text-[#4488FF]" />
              <span className="text-[13px] text-[#E8ECF1]">SMS Verification</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={mfaEmail} onChange={(e) => setMfaEmail(e.target.checked)} className="rounded border-[#3D434F] bg-[#181A20] text-[#4488FF]" />
              <span className="text-[13px] text-[#E8ECF1]">Email Verification</span>
            </label>
          </div>
        )}
      </div>

      {/* Password Policy */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-[#4488FF]" />
          Password Policy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Min Password Length</label>
            <Input type="number" min={6} max={32} value={minPasswordLength} onChange={(e) => setMinPasswordLength(Number(e.target.value))} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Password Expiry (days)</label>
            <Input type="number" value={passwordExpiry} onChange={(e) => setPasswordExpiry(Number(e.target.value))} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <span className="text-[13px] text-[#E8ECF1]">Require Uppercase Letters</span>
            <Switch checked={requireUppercase} onCheckedChange={setRequireUppercase} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <span className="text-[13px] text-[#E8ECF1]">Require Numbers</span>
            <Switch checked={requireNumbers} onCheckedChange={setRequireNumbers} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <span className="text-[13px] text-[#E8ECF1]">Require Special Characters</span>
            <Switch checked={requireSpecial} onCheckedChange={setRequireSpecial} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
        </div>
      </div>

      {/* CORS & Security Headers */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#10B981]" />
          Security Headers & CORS
        </h3>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <span className="text-[13px] text-[#E8ECF1]">HSTS (HTTP Strict Transport Security)</span>
            <Switch checked={hsts} onCheckedChange={setHsts} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <span className="text-[13px] text-[#E8ECF1]">X-Frame-Options</span>
            <Switch checked={frameOptions} onCheckedChange={setFrameOptions} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <span className="text-[13px] text-[#E8ECF1]">X-Content-Type-Options</span>
            <Switch checked={contentTypeOptions} onCheckedChange={setContentTypeOptions} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <span className="text-[13px] text-[#E8ECF1]">Content Security Policy (CSP)</span>
            <Switch checked={csp} onCheckedChange={setCsp} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F] mb-3">
          <div>
            <div className="text-[13px] font-medium text-[#E8ECF1]">Enable CORS</div>
            <div className="text-[12px] text-[#6B7280]">Allow cross-origin requests</div>
          </div>
          <Switch checked={corsEnabled} onCheckedChange={setCorsEnabled} className="data-[state=checked]:bg-[#4488FF]" />
        </div>
        {corsEnabled && (
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Allowed Origins</label>
            <Input value={corsOrigin} onChange={(e) => setCorsOrigin(e.target.value)} placeholder="* or https://example.com" className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
        )}
      </div>

      {/* IP Allowlist */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#7C5CFF]" />
          IP Allowlist
        </h3>
        <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F] mb-3">
          <div>
            <div className="text-[13px] font-medium text-[#E8ECF1]">Enable IP Allowlist</div>
            <div className="text-[12px] text-[#6B7280]">Restrict access to specific IP ranges</div>
          </div>
          <Switch checked={ipAllowlist} onCheckedChange={setIpAllowlist} className="data-[state=checked]:bg-[#4488FF]" />
        </div>
        {ipAllowlist && (
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Allowed IPs (one per line, supports CIDR)</label>
            <textarea
              value={allowedIps}
              onChange={(e) => setAllowedIps(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] font-mono focus:outline-none focus:border-[#4488FF] resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Email Settings ----
function EmailSettings() {
  const [smtpHost, setSmtpHost] = useState('smtp.vedadb.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [encryption, setEncryption] = useState('TLS');
  const [smtpUser, setSmtpUser] = useState('notifications@vedadb.com');
  const [smtpPass, setSmtpPass] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);
  const [editTemplate, setEditTemplate] = useState<string | null>(null);
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');

  const emailTemplates = [
    { id: 'welcome', name: 'Welcome Email', subject: 'Welcome to VedaDB API Manager', body: 'Hi {{user.name}},\n\nWelcome to VedaDB API Manager. Your account has been successfully created.\n\nGet started by exploring our API catalog or creating your first application.\n\nBest regards,\nThe VedaDB Team' },
    { id: 'api-published', name: 'API Published Notification', subject: 'New API Available: {{api.name}}', body: 'Hi {{user.name}},\n\nA new API "{{api.name}}" has been published and is now available in the Developer Portal.\n\nCheck it out and subscribe to start using it.\n\nBest regards,\nThe VedaDB Team' },
    { id: 'subscription', name: 'Subscription Confirmation', subject: 'Subscription Confirmed', body: 'Hi {{user.name}},\n\nYour application "{{application.name}}" has been successfully subscribed to {{api.name}} ({{api.version}}) with {{tier}} tier.\n\nYou can start making API calls using your application key.\n\nBest regards,\nThe VedaDB Team' },
    { id: 'password-reset', name: 'Password Reset', subject: 'Password Reset Request', body: 'Hi {{user.name}},\n\nWe received a request to reset your password. Click the link below to set a new password:\n\n{{reset_link}}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nThe VedaDB Team' },
  ];

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTestResult(null);
    setTimeout(() => {
      setTestResult(Math.random() > 0.2 ? 'success' : 'failed');
      setTestingConnection(false);
    }, 1500);
  };

  const openTemplateEditor = (template: typeof emailTemplates[0]) => {
    setEditTemplate(template.id);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
  };

  return (
    <div className="space-y-6">
      {/* SMTP Configuration */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#F59E0B]" />
          SMTP Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">SMTP Host</label>
            <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">SMTP Port</label>
            <Input type="number" value={smtpPort} onChange={(e) => setSmtpPort(Number(e.target.value))} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Encryption</label>
            <select value={encryption} onChange={(e) => setEncryption(e.target.value)} className="w-full h-10 px-3 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] focus:outline-none focus:border-[#4488FF]">
              <option>TLS</option>
              <option>SSL</option>
              <option>None</option>
            </select>
          </div>
          <div />
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">SMTP Username</label>
            <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">SMTP Password</label>
            <Input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} placeholder="••••••••" className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={testingConnection}
            className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942]"
          >
            {testingConnection ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : null}
            Test Connection
          </Button>
          {testResult === 'success' && (
            <span className="flex items-center gap-1 text-[13px] text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" /> Connection successful
            </span>
          )}
          {testResult === 'failed' && (
            <span className="flex items-center gap-1 text-[13px] text-[#EF4444]">
              <AlertCircle className="w-4 h-4" /> Connection failed
            </span>
          )}
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Type className="w-4 h-4 text-[#4488FF]" />
          Email Templates
        </h3>
        <div className="space-y-2">
          {emailTemplates.map(template => (
            <div key={template.id} className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
              <div>
                <div className="text-[13px] font-medium text-[#E8ECF1]">{template.name}</div>
                <div className="text-[12px] text-[#6B7280]">{template.subject}</div>
              </div>
              <Button variant="ghost" size="sm" className="text-[12px] text-[#4488FF] hover:text-[#5A9AFF]" onClick={() => openTemplateEditor(template)}>
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Template Editor Modal */}
      <Dialog open={!!editTemplate} onOpenChange={() => setEditTemplate(null)}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1] max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold">Edit Email Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Subject</label>
              <Input value={templateSubject} onChange={(e) => setTemplateSubject(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Body</label>
                <textarea
                  value={templateBody}
                  onChange={(e) => setTemplateBody(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 bg-[#181A20] border border-[#3D434F] rounded-md text-[13px] text-[#E8ECF1] font-mono focus:outline-none focus:border-[#4488FF] resize-none"
                />
              </div>
              <div className="bg-[#181A20] border border-[#3D434F] rounded-md p-3">
                <div className="text-[11px] text-[#6B7280] uppercase mb-2">Variables</div>
                <div className="space-y-1">
                  {['{{user.name}}', '{{user.email}}', '{{api.name}}', '{{api.version}}', '{{application.name}}', '{{organization.name}}', '{{tier}}', '{{reset_link}}'].map(v => (
                    <button
                      key={v}
                      onClick={() => setTemplateBody(prev => prev + v)}
                      className="block w-full text-left text-[11px] text-[#4488FF] hover:bg-[#353942] px-2 py-1 rounded transition-colors font-mono"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditTemplate(null)} className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942]">Cancel</Button>
            <Button onClick={() => setEditTemplate(null)} className="bg-[#4488FF] text-white hover:bg-[#5A9AFF]">Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Appearance Settings ----
function AppearanceSettings() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark');
  const [primaryColor, setPrimaryColor] = useState('#4488FF');
  const [accentColor, setAccentColor] = useState('#7C5CFF');
  const [collapsedDefault, setCollapsedDefault] = useState(false);
  const [showOrgName, setShowOrgName] = useState(true);
  const [navStyle, setNavStyle] = useState<'icons-labels' | 'icons-only'>('icons-labels');
  const [publisherName, setPublisherName] = useState('Publisher Portal');
  const [devPortalName, setDevPortalName] = useState('Developer Portal');
  const [adminPortalName, setAdminPortalName] = useState('Admin Portal');

  const themeOptions: Array<{ id: typeof theme; label: string; icon: typeof Moon }> = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'auto', label: 'Auto', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#F59E0B]" />
          Theme
        </h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {themeOptions.map(opt => {
            const Icon = opt.icon;
            const isActive = theme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border transition-all',
                  isActive ? 'border-[#4488FF] bg-[#1E3A5F]' : 'border-[#3D434F] bg-[#181A20] hover:border-[#9DA5B4]'
                )}
              >
                <Icon className={cn('w-6 h-6', isActive ? 'text-[#4488FF]' : 'text-[#9DA5B4]')} />
                <span className={cn('text-[13px] font-medium', isActive ? 'text-[#4488FF]' : 'text-[#9DA5B4]')}>{opt.label}</span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Brand Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded bg-transparent border-0 cursor-pointer" />
              <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] font-mono text-[13px] focus:border-[#4488FF]" />
            </div>
            <div className="mt-2 h-3 rounded-full" style={{ background: primaryColor }} />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Brand Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-10 h-10 rounded bg-transparent border-0 cursor-pointer" />
              <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] font-mono text-[13px] focus:border-[#4488FF]" />
            </div>
            <div className="mt-2 h-3 rounded-full" style={{ background: accentColor }} />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <PanelLeft className="w-4 h-4 text-[#4488FF]" />
          Sidebar
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <div>
              <div className="text-[13px] font-medium text-[#E8ECF1]">Collapsed by Default</div>
              <div className="text-[12px] text-[#6B7280]">Start with collapsed sidebar</div>
            </div>
            <Switch checked={collapsedDefault} onCheckedChange={setCollapsedDefault} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#181A20] rounded-md border border-[#3D434F]">
            <div>
              <div className="text-[13px] font-medium text-[#E8ECF1]">Show Organization Name</div>
              <div className="text-[12px] text-[#6B7280]">Display org name in sidebar header</div>
            </div>
            <Switch checked={showOrgName} onCheckedChange={setShowOrgName} className="data-[state=checked]:bg-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-2 block">Navigation Style</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNavStyle('icons-labels')}
                className={cn(
                  'p-3 rounded-lg border text-center transition-all',
                  navStyle === 'icons-labels' ? 'border-[#4488FF] bg-[#1E3A5F]' : 'border-[#3D434F] bg-[#181A20] hover:border-[#9DA5B4]'
                )}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <PanelLeft className={cn('w-4 h-4', navStyle === 'icons-labels' ? 'text-[#4488FF]' : 'text-[#9DA5B4]')} />
                  <span className={cn('text-[12px]', navStyle === 'icons-labels' ? 'text-[#4488FF]' : 'text-[#9DA5B4]')}>Label</span>
                </div>
                <span className={cn('text-[11px]', navStyle === 'icons-labels' ? 'text-[#4488FF]' : 'text-[#6B7280]')}>Icons + Labels</span>
              </button>
              <button
                onClick={() => setNavStyle('icons-only')}
                className={cn(
                  'p-3 rounded-lg border text-center transition-all',
                  navStyle === 'icons-only' ? 'border-[#4488FF] bg-[#1E3A5F]' : 'border-[#3D434F] bg-[#181A20] hover:border-[#9DA5B4]'
                )}
              >
                <div className="flex items-center justify-center mb-1">
                  <PanelLeft className={cn('w-4 h-4', navStyle === 'icons-only' ? 'text-[#4488FF]' : 'text-[#9DA5B4]')} />
                </div>
                <span className={cn('text-[11px]', navStyle === 'icons-only' ? 'text-[#4488FF]' : 'text-[#6B7280]')}>Icons Only</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Branding */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
        <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#10B981]" />
          Portal Branding
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Publisher Portal Name</label>
            <Input value={publisherName} onChange={(e) => setPublisherName(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Developer Portal Name</label>
            <Input value={devPortalName} onChange={(e) => setDevPortalName(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
          <div>
            <label className="text-[13px] font-medium text-[#E8ECF1] mb-1.5 block">Admin Portal Name</label>
            <Input value={adminPortalName} onChange={(e) => setAdminPortalName(e.target.value)} className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] focus:border-[#4488FF]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const ActiveComponent = {
    general: GeneralSettings,
    security: SecuritySettings,
    email: EmailSettings,
    appearance: AppearanceSettings,
  }[activeTab];

  return (
    <Layout>
      <PageHeader
        title="Settings"
        subtitle="Configure platform settings and preferences"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-[#EF444440] bg-[#EF444410] text-[#EF4444] hover:bg-[#EF444420] hover:border-[#EF4444]"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset to Defaults
          </Button>
          <Button
            size="sm"
            className="bg-[#4488FF] text-white hover:bg-[#5A9AFF] text-[13px] font-medium"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </PageHeader>

      <div className="flex gap-0 min-h-[600px]">
        {/* Vertical Tab Nav - Left */}
        <nav className="w-[200px] flex-shrink-0 border-r border-[#3D434F] pr-1">
          <div className="space-y-0.5">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-4 py-2.5 rounded-md text-[13px] font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#F59E0B20] text-[#F59E0B] border-l-[3px] border-l-[#F59E0B]'
                      : 'text-[#9DA5B4] hover:bg-[#353942] border-l-[3px] border-l-transparent'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content - Right */}
        <div className="flex-1 pl-6">
          <ActiveComponent />
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <DialogContent className="bg-[#2B2F38] border-[#3D434F] text-[#E8ECF1]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#EF4444]" />
              Reset to Defaults
            </DialogTitle>
          </DialogHeader>
          <p className="text-[13px] text-[#9DA5B4] mt-2">
            This will reset all settings to their default values. Any custom configuration will be lost. This action cannot be undone.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowResetConfirm(false)} className="border-[#3D434F] bg-transparent text-[#E8ECF1] hover:bg-[#353942]">
              Cancel
            </Button>
            <Button
              onClick={() => setShowResetConfirm(false)}
              className="bg-[#EF4444] text-white hover:bg-[#DC2626]"
            >
              Reset Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import { mockAPIs } from '@/lib/data';
import type { API, APIResource } from '@/lib/data';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  Bell,
  Check,
  Play,
  Code,
  Share2,
  Copy,
  CheckCheck,
  Link2,
  ChevronRight,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function StarRating({ rating, size = 18 }: { rating: number; size?: number }) {
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const fill = i < fullStars ? 1 : i === fullStars ? partial : 0;
    stars.push(
      <div key={i} className="relative inline-block">
        <Star
          size={size}
          className="text-[#3D434F]"
          fill="#3D434F"
          strokeWidth={0}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fill * 100}%` }}
        >
          <Star
            size={size}
            className="text-[#F59E0B]"
            fill="#F59E0B"
            strokeWidth={0}
          />
        </div>
      </div>
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: '#10B98120', text: '#10B981' },
  POST: { bg: '#F59E0B20', text: '#F59E0B' },
  PUT: { bg: '#3B82F620', text: '#3B82F6' },
  DELETE: { bg: '#EF444420', text: '#EF4444' },
  PATCH: { bg: '#8B5CF620', text: '#8B5CF6' },
  OPTIONS: { bg: '#6B728020', text: '#6B7280' },
};

function MethodBadge({ method, size = 'sm' }: { method: string; size?: 'sm' | 'lg' }) {
  const colors = methodColors[method] || methodColors.OPTIONS;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded font-bold uppercase',
        size === 'sm' ? 'text-[11px] px-2 py-0.5 min-w-[56px]' : 'text-[14px] px-3 py-1'
      )}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {method}
    </span>
  );
}

const mockReviews = [
  { id: 'r1', user: 'Alex Johnson', avatar: '', rating: 5, text: 'Excellent API. Very well documented and the sandbox environment is great for testing.', date: '2024-07-15' },
  { id: 'r2', user: 'Maria Garcia', avatar: '', rating: 4, text: 'Solid API. Would love to see more GraphQL support in the future.', date: '2024-07-10' },
  { id: 'r3', user: 'James Wilson', avatar: '', rating: 5, text: 'The webhook integration for payment notifications is flawless.', date: '2024-07-05' },
  { id: 'r4', user: 'Linda Kim', avatar: '', rating: 4, text: 'Good API but the rate limiting on the Bronze tier is quite restrictive.', date: '2024-06-28' },
  { id: 'r5', user: 'David Brown', avatar: '', rating: 5, text: 'Best payment API we have used. PCI compliance handling is top notch.', date: '2024-06-20' },
];

const categoryColorMap: Record<string, string> = {
  'Financial Services': '#3B82F6',
  'Identity': '#8B5CF6',
  'Retail': '#10B981',
  'Communications': '#F59E0B',
  'Logistics': '#14B8A6',
  'Media': '#EC4899',
  'Data & Analytics': '#6366F1',
};

/* ------------------------------------------------------------------ */
/*  CopyButton                                                        */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-[#353942] transition-colors text-[#6B7280] hover:text-[#E8ECF1]"
      title="Copy"
    >
      {copied ? <CheckCheck size={14} className="text-[#10B981]" /> : <Copy size={14} />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Overview Tab                                                      */
/* ------------------------------------------------------------------ */

function OverviewTab({ api }: { api: API }) {
  const [activeDocItem, setActiveDocItem] = useState('overview');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Endpoint Card */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={16} className="text-[#9DA5B4]" />
            <h3 className="text-[14px] font-semibold text-[#E8ECF1]">Endpoints</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-[#181A20] rounded-md p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6B7280] uppercase">Production</span>
                <p className="font-mono text-[13px] text-[#E8ECF1]">
                  {api.gatewayEndpoint}
                </p>
              </div>
              <CopyButton text={api.gatewayEndpoint} />
            </div>
            <div className="bg-[#181A20] rounded-md p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#6B7280] uppercase">Sandbox</span>
                <p className="font-mono text-[13px] text-[#E8ECF1]">
                  {api.gatewayEndpoint.replace('gateway.', 'gateway-sandbox.')}
                </p>
              </div>
              <CopyButton text={api.gatewayEndpoint.replace('gateway.', 'gateway-sandbox.')} />
            </div>
          </div>
        </div>

        {/* Resources Card */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Code size={16} className="text-[#9DA5B4]" />
            <h3 className="text-[14px] font-semibold text-[#E8ECF1]">
              Available Resources
              <Badge variant="outline" className="ml-2 text-[11px] bg-[#3D434F40] text-[#9DA5B4] border-[#3D434F]">
                {api.resources.length}
              </Badge>
            </h3>
          </div>
          <div className="space-y-1">
            {api.resources.slice(0, 5).map((resource: APIResource) => (
              <div
                key={resource.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#353942] cursor-pointer transition-colors"
              >
                <MethodBadge method={resource.method} size="sm" />
                <span className="font-mono text-[13px] text-[#E8ECF1] flex-1 truncate">
                  {resource.path}
                </span>
                <span className="text-[12px] text-[#9DA5B4] truncate max-w-[200px]">
                  {resource.summary}
                </span>
                <ChevronRight size={14} className="text-[#6B7280]" />
              </div>
            ))}
          </div>
          {api.resources.length > 5 && (
            <p className="text-[13px] text-[#4488FF] mt-3 cursor-pointer hover:underline">
              View all {api.resources.length} resources
            </p>
          )}
        </div>

        {/* Authentication */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-[11px] bg-[#3B82F620] text-[#3B82F6] border-[#3B82F640]">
              OAuth 2.0
            </Badge>
            <h3 className="text-[14px] font-semibold text-[#E8ECF1]">Authentication</h3>
          </div>
          <p className="text-[13px] text-[#9DA5B4] mb-3">
            This API uses OAuth 2.0 Client Credentials flow. Obtain an access
            token from the token endpoint.
          </p>
          <div className="bg-[#181A20] rounded-md p-3 flex items-center justify-between">
            <span className="font-mono text-[13px] text-[#E8ECF1]">
              {api.gatewayEndpoint}/token
            </span>
            <CopyButton text={`${api.gatewayEndpoint}/token`} />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* API Info Card */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-4">API Information</h3>
          <div className="space-y-3">
            {[
              { label: 'Type', value: api.type },
              { label: 'Visibility', value: api.visibility },
              { label: 'Status', value: api.status },
              { label: 'Version', value: api.version },
              { label: 'Context', value: api.context },
              { label: 'Provider', value: api.provider },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-[12px] text-[#6B7280]">{item.label}</span>
                <span className="text-[13px] text-[#E8ECF1] font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Card */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-3">Rating</h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[36px] font-bold text-[#E8ECF1]">{api.rating}</span>
            <div>
              <StarRating rating={api.rating} size={20} />
              <span className="text-[12px] text-[#9DA5B4]">
                {api.subscribers} reviews
              </span>
            </div>
          </div>
          {/* Rating bars */}
          {[5, 4, 3, 2, 1].map((n) => {
            const count = mockReviews.filter((r) => r.rating === n).length;
            const pct = mockReviews.length > 0 ? (count / mockReviews.length) * 100 : 0;
            return (
              <div key={n} className="flex items-center gap-2 mb-1">
                <span className="text-[12px] text-[#9DA5B4] w-3">{n}</span>
                <div className="flex-1 h-1.5 bg-[#3D434F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#6B7280] w-4">{count}</span>
              </div>
            );
          })}
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-[13px] text-[#4488FF] hover:underline mt-3">
                Write a review
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#2B2F38] border-[#3D434F] max-w-md">
              <DialogHeader>
                <DialogTitle className="text-[16px] font-bold text-[#E8ECF1]">
                  Rate this API
                </DialogTitle>
              </DialogHeader>
              <ReviewForm apiName={api.name} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Subscribers */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-5">
          <h3 className="text-[14px] font-semibold text-[#E8ECF1] mb-3">Subscribers</h3>
          <span className="text-[24px] font-bold text-[#E8ECF1]">{api.subscribers}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review Form                                                       */
/* ------------------------------------------------------------------ */

function ReviewForm({ apiName }: { apiName: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-[#9DA5B4]">How would you rate {apiName}?</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(n)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={28}
              className={
                n <= (hoverRating || rating)
                  ? 'text-[#F59E0B]'
                  : 'text-[#3D434F]'
              }
              fill={n <= (hoverRating || rating) ? '#F59E0B' : '#3D434F'}
              strokeWidth={0}
            />
          </button>
        ))}
      </div>
      <textarea
        placeholder="Your review (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full h-24 bg-[#181A20] border border-[#3D434F] rounded-md p-3 text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] focus:outline-none focus:border-[#4488FF] resize-none"
      />
      <Button
        disabled={rating === 0}
        className="w-full bg-[#10B981] hover:bg-[#059669] text-white disabled:opacity-50"
      >
        Submit Review
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Documentation Tab                                                 */
/* ------------------------------------------------------------------ */

function DocumentationTab({ api }: { api: API }) {
  const [activeSection, setActiveSection] = useState('overview');

  const docNavItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'api-reference', label: 'API Reference', children: api.resources.map((r) => ({ id: r.id, label: `${r.method} ${r.path}`, method: r.method, path: r.path, summary: r.summary })) },
    { id: 'guides', label: 'Guides' },
  ];

  const selectedResource = api.resources.find((r) => r.id === activeSection);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] gap-6">
      {/* Left nav */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-3">
        <h3 className="text-[13px] font-semibold text-[#9DA5B4] mb-3 px-2">Contents</h3>
        <ScrollArea className="h-[500px]">
          <div className="space-y-0.5">
            {docNavItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors',
                    activeSection === item.id
                      ? 'bg-[#10B98120] text-[#10B981] border-l-[3px] border-[#10B981]'
                      : 'text-[#9DA5B4] hover:bg-[#353942] border-l-[3px] border-transparent'
                  )}
                >
                  {item.label}
                </button>
                {'children' in item && item.children && (
                  <div className="ml-3 space-y-0.5 mt-0.5">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setActiveSection(child.id)}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded-md text-[12px] transition-colors flex items-center gap-2',
                          activeSection === child.id
                            ? 'bg-[#10B98120] text-[#10B981] border-l-[3px] border-[#10B981]'
                            : 'text-[#9DA5B4] hover:bg-[#353942] border-l-[3px] border-transparent'
                        )}
                      >
                        <span
                          className="text-[10px] font-bold px-1 rounded"
                          style={{
                            backgroundColor: methodColors[child.method]?.bg,
                            color: methodColors[child.method]?.text,
                          }}
                        >
                          {child.method}
                        </span>
                        <span className="truncate font-mono">{child.path}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right content */}
      <div className="bg-[#2B2F38] border border-[#3D434F] rounded-lg p-6">
        {selectedResource ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <MethodBadge method={selectedResource.method} size="lg" />
              <span className="font-mono text-[16px] font-bold text-[#E8ECF1]">
                {selectedResource.path}
              </span>
            </div>
            <p className="text-[13px] text-[#9DA5B4] mb-4">
              {selectedResource.description}
            </p>

            {/* Parameters */}
            {selectedResource.parameters.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[14px] font-semibold text-[#E8ECF1] mb-2">Parameters</h4>
                <div className="border border-[#3D434F50] rounded-lg overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead className="bg-[#1E2128]">
                      <tr>
                        <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#9DA5B4] uppercase">Name</th>
                        <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#9DA5B4] uppercase">Type</th>
                        <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#9DA5B4] uppercase">In</th>
                        <th className="text-left px-4 py-2 text-[12px] font-semibold text-[#9DA5B4] uppercase">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResource.parameters.map((p) => (
                        <tr key={p.name} className="border-t border-[#3D434F50] hover:bg-[#353942]">
                          <td className="px-4 py-2 font-mono text-[#E8ECF1]">{p.name}</td>
                          <td className="px-4 py-2 text-[#9DA5B4]">{p.type}</td>
                          <td className="px-4 py-2 text-[#9DA5B4]">{p.in}</td>
                          <td className="px-4 py-2">
                            {p.required ? (
                              <span className="text-[#10B981] text-[11px] font-semibold">Required</span>
                            ) : (
                              <span className="text-[#6B7280] text-[11px]">Optional</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Auth */}
            <div className="mb-4">
              <h4 className="text-[14px] font-semibold text-[#E8ECF1] mb-2">Authentication</h4>
              <Badge variant="outline" className="text-[11px] bg-[#3B82F620] text-[#3B82F6] border-[#3B82F640]">
                {selectedResource.authType}
              </Badge>
              <span className="text-[12px] text-[#9DA5B4] ml-2">Scope: {selectedResource.scope}</span>
            </div>

            {/* Throttling */}
            <div>
              <h4 className="text-[14px] font-semibold text-[#E8ECF1] mb-2">Throttling</h4>
              <span className="text-[13px] text-[#9DA5B4]">Tier: {selectedResource.throttlingTier}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#E8ECF1]">
              {activeSection === 'overview' ? 'Overview' : activeSection === 'getting-started' ? 'Getting Started' : activeSection === 'authentication' ? 'Authentication' : 'Guides'}
            </h2>
            <div className="text-[14px] text-[#9DA5B4] leading-relaxed space-y-3">
              {activeSection === 'overview' && (
                <>
                  <p>Welcome to the <strong className="text-[#E8ECF1]">{api.name}</strong> documentation.</p>
                  <p>This API provides {api.description.toLowerCase()}</p>
                  <h3 className="text-[16px] font-semibold text-[#E8ECF1] mt-4 mb-2">Base URL</h3>
                  <div className="bg-[#181A20] border border-[#3D434F] rounded-md p-3 font-mono text-[13px] text-[#E8ECF1]">
                    {api.gatewayEndpoint}
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#E8ECF1] mt-4 mb-2">Version</h3>
                  <p>Current version: <code className="bg-[#181A20] px-1.5 py-0.5 rounded text-[#4488FF]">{api.version}</code></p>
                </>
              )}
              {activeSection === 'getting-started' && (
                <>
                  <p>To get started with the {api.name}, follow these steps:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-2">
                    <li>Sign up for a developer account</li>
                    <li>Create an application in the Developer Portal</li>
                    <li>Subscribe to this API with your application</li>
                    <li>Generate API keys for your application</li>
                    <li>Make your first API request using the Try It console</li>
                  </ol>
                </>
              )}
              {activeSection === 'authentication' && (
                <>
                  <p>This API uses OAuth 2.0 Client Credentials flow for authentication.</p>
                  <h3 className="text-[16px] font-semibold text-[#E8ECF1] mt-4 mb-2">Token Endpoint</h3>
                  <div className="bg-[#181A20] border border-[#3D434F] rounded-md p-3 font-mono text-[13px] text-[#E8ECF1] flex items-center justify-between">
                    {api.gatewayEndpoint}/token
                    <CopyButton text={`${api.gatewayEndpoint}/token`} />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#E8ECF1] mt-4 mb-2">Request Format</h3>
                  <pre className="bg-[#181A20] border border-[#3D434F] rounded-md p-4 font-mono text-[12px] text-[#E8ECF1] overflow-x-auto">
{`curl -X POST ${api.gatewayEndpoint}/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id=YOUR_CLIENT_ID" \\
  -d "client_secret=YOUR_CLIENT_SECRET"`}
                  </pre>
                </>
              )}
              {(activeSection === 'guides' || (!['overview', 'getting-started', 'authentication'].includes(activeSection) && !selectedResource)) && (
                <>
                  <h3 className="text-[16px] font-semibold text-[#E8ECF1] mb-2">Quick Start</h3>
                  <p>Learn how to integrate with {api.name} in minutes.</p>
                  <h3 className="text-[16px] font-semibold text-[#E8ECF1] mt-4 mb-2">Error Handling</h3>
                  <p>The API uses standard HTTP status codes and returns JSON error responses.</p>
                  <h3 className="text-[16px] font-semibold text-[#E8ECF1] mt-4 mb-2">Rate Limits</h3>
                  <p>Rate limits depend on your subscription tier. Check your response headers for current quota.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */

export default function APIDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const api = useMemo(() => mockAPIs.find((a) => a.id === id), [id]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!api) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16">
          <h1 className="text-2xl font-bold text-[#E8ECF1] mb-2">API Not Found</h1>
          <p className="text-[#9DA5B4] mb-4">The API you are looking for does not exist.</p>
          <Link to="/devportal/catalog" className="text-[#4488FF] hover:underline">
            Back to Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  const categoryColor = categoryColorMap[api.categories[0]] || '#4488FF';
  const formattedDate = new Date(api.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <Layout>
      {/* API Header Card */}
      <div
        className={cn(
          'bg-[#2B2F38] border border-[#3D434F] rounded-[10px] p-6 mb-6',
          'transition-all'
        )}
      >
        {/* Category strip */}
        <div
          className="h-[3px] w-full rounded-t-[10px] mb-4 -mt-6 -mx-6 px-6"
          style={{ backgroundColor: categoryColor, width: 'calc(100% + 48px)' }}
        />

        {/* Back link */}
        <Link
          to="/devportal/catalog"
          className="inline-flex items-center gap-1 text-[13px] text-[#9DA5B4] hover:text-[#E8ECF1] mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          API Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6">
          {/* Left Column */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[24px] font-bold text-[#E8ECF1]">{api.name}</h1>
              <Badge variant="outline" className="text-[11px] bg-[#4488FF20] text-[#4488FF] border-[#4488FF40]">
                {api.version}
              </Badge>
            </div>
            <p className="text-[13px] text-[#9DA5B4] mb-3">by {api.provider}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={api.rating} size={18} />
              <span className="text-[14px] text-[#E8ECF1]">
                {api.rating} out of 5
              </span>
              <span className="text-[13px] text-[#4488FF] cursor-pointer hover:underline">
                ({api.subscribers} reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-[14px] text-[#9DA5B4] mb-4">{api.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {api.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] text-[#9DA5B4] bg-[#3D434F40] px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="outline" className="text-[11px] bg-[#3D434F40] text-[#9DA5B4] border-[#3D434F]">
                {api.type}
              </Badge>
              <Badge variant="outline" className="text-[11px] bg-[#10B98120] text-[#10B981] border-[#10B98140]">
                {api.visibility}
              </Badge>
              <div className="flex items-center gap-1 text-[13px] text-[#9DA5B4]">
                <Users size={14} />
                <span>{api.subscribers} subscribers</span>
              </div>
              <div className="flex items-center gap-1 text-[13px] text-[#9DA5B4]">
                <Clock size={14} />
                <span>Updated {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setIsSubscribed(!isSubscribed)}
              className={cn(
                'w-full h-11 text-[14px] font-medium transition-all',
                isSubscribed
                  ? 'bg-[#10B98120] text-[#10B981] border border-[#10B98140] hover:bg-[#10B98130]'
                  : 'bg-[#10B981] text-white hover:bg-[#059669]'
              )}
              variant={isSubscribed ? 'outline' : 'default'}
            >
              {isSubscribed ? (
                <>
                  <Check size={16} className="mr-2" />
                  Subscribed
                </>
              ) : (
                <>
                  <Bell size={16} className="mr-2" />
                  Subscribe
                </>
              )}
            </Button>

            <Button
              onClick={() => navigate(`/devportal/apis/${api.id}/tryit`)}
              variant="outline"
              className="w-full h-10 text-[13px] bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF50]"
            >
              <Play size={14} className="mr-2" />
              Try It Now
            </Button>

            <Button
              onClick={() => navigate(`/devportal/apis/${api.id}/sdk`)}
              variant="outline"
              className="w-full h-10 text-[13px] bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942] hover:border-[#4488FF50]"
            >
              <Code size={14} className="mr-2" />
              Download SDK
            </Button>

            <Button
              onClick={handleShare}
              variant="ghost"
              className="w-full h-9 text-[13px] text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1]"
            >
              {shareCopied ? (
                <>
                  <CheckCheck size={14} className="mr-2 text-[#10B981]" />
                  Link Copied
                </>
              ) : (
                <>
                  <Share2 size={14} className="mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-[#3D434F] rounded-none h-auto p-0 mb-6">
          {[
            { value: 'overview', label: 'Overview' },
            { value: 'documentation', label: 'Documentation' },
            { value: 'tryit', label: 'Try It' },
            { value: 'sdk', label: 'SDK' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => {
                if (tab.value === 'tryit') {
                  navigate(`/devportal/apis/${api.id}/tryit`);
                } else if (tab.value === 'sdk') {
                  navigate(`/devportal/apis/${api.id}/sdk`);
                }
              }}
              className={cn(
                'px-5 py-3 rounded-none text-[13px] font-medium border-b-2 transition-all data-[state=active]:shadow-none',
                activeTab === tab.value
                  ? 'border-b-2 border-[#10B981] text-[#10B981] bg-[#10B98110]'
                  : 'border-transparent text-[#9DA5B4] hover:text-[#E8ECF1] hover:bg-[#353942]'
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <OverviewTab api={api} />
        </TabsContent>

        <TabsContent value="documentation" className="mt-0">
          <DocumentationTab api={api} />
        </TabsContent>

        <TabsContent value="tryit" className="mt-0">
          <div className="text-center py-12 text-[#9DA5B4]">
            <p>Redirecting to Try It console...</p>
          </div>
        </TabsContent>

        <TabsContent value="sdk" className="mt-0">
          <div className="text-center py-12 text-[#9DA5B4]">
            <p>Redirecting to SDK Download...</p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}

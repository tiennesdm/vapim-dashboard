import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { cn } from '@/lib/utils';
import { mockAPIs } from '@/lib/data';
import type { API, APIResource } from '@/lib/data';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Search,
  Play,
  Copy,
  CheckCheck,
  Clock,
  Download,
  ExternalLink,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const methodColors: Record<string, { bg: string; text: string; border: string }> = {
  GET:    { bg: '#10B98120', text: '#10B981', border: '#10B98140' },
  POST:   { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40' },
  PUT:    { bg: '#3B82F620', text: '#3B82F6', border: '#3B82F640' },
  DELETE: { bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
  PATCH:  { bg: '#8B5CF620', text: '#8B5CF6', border: '#8B5CF640' },
  OPTIONS:{ bg: '#6B728020', text: '#6B7280', border: '#6B728040' },
};

const methodFilterChips = ['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

/* ---- example request / response ---- */

const exampleRequestBody: Record<string, string> = {
  POST: JSON.stringify({
    amount: 99.99,
    currency: 'USD',
    payment_method: 'credit_card',
    card_token: 'tok_visa_4242',
    description: 'Monthly subscription - Premium Plan',
    metadata: { order_id: 'ord_12345', customer_id: 'cus_67890' },
  }, null, 2),
  PUT: JSON.stringify({
    amount: 49.99,
    description: 'Updated subscription',
  }, null, 2),
  PATCH: JSON.stringify({
    description: 'Patch update',
  }, null, 2),
};

interface MockResponse {
  status: number;
  statusText: string;
  time: number;
  size: string;
  headers: Record<string, string>;
  body: string;
}

const exampleResponse: MockResponse = {
  status: 200,
  statusText: 'OK',
  time: 124,
  size: '1.2 KB',
  headers: {
    'Content-Type': 'application/json',
    'X-Request-ID': 'req_abc123def456',
    'X-Rate-Limit': '1000',
    'X-Rate-Limit-Remaining': '998',
    'Cache-Control': 'no-cache',
    'Date': new Date().toUTCString(),
  },
  body: JSON.stringify({
    id: 'pay_abc123def456',
    status: 'succeeded',
    amount: 99.99,
    currency: 'USD',
    payment_method: 'credit_card',
    description: 'Monthly subscription - Premium Plan',
    created_at: '2024-07-20T14:30:00Z',
    receipt_url: 'https://api.vedadb.com/receipts/pay_abc123def456',
  }, null, 2),
};

const errorResponse: MockResponse = {
  status: 401,
  statusText: 'Unauthorized',
  time: 45,
  size: '0.3 KB',
  headers: {
    'Content-Type': 'application/json',
    'WWW-Authenticate': 'Bearer',
  },
  body: JSON.stringify({
    error: 'Unauthorized',
    message: 'Invalid or expired access token. Please obtain a new token.',
    code: 'AUTH_001',
  }, null, 2),
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function MethodBadge({ method }: { method: string }) {
  const c = methodColors[method] || methodColors.OPTIONS;
  return (
    <span
      className="inline-flex items-center justify-center rounded font-bold uppercase text-[11px] px-2 py-0.5 min-w-[56px]"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {method}
    </span>
  );
}

function MethodBadgeLg({ method }: { method: string }) {
  const c = methodColors[method] || methodColors.OPTIONS;
  return (
    <span
      className="inline-flex items-center justify-center rounded font-bold uppercase text-[14px] px-3 py-1"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {method}
    </span>
  );
}

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
    >
      {copied ? <CheckCheck size={14} className="text-[#10B981]" /> : <Copy size={14} />}
    </button>
  );
}

function StatusBadge({ status }: { status: number }) {
  let config = { bg: '#10B98120', text: '#10B981' };
  if (status >= 300 && status < 400) config = { bg: '#3B82F620', text: '#3B82F6' };
  else if (status >= 400 && status < 500) config = { bg: '#F59E0B20', text: '#F59E0B' };
  else if (status >= 500) config = { bg: '#EF444420', text: '#EF4444' };

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-md text-[14px] font-bold border"
      style={{ backgroundColor: config.bg, color: config.text, borderColor: config.bg }}
    >
      {status} {status < 300 ? 'OK' : status < 400 ? 'Redirect' : status < 500 ? 'Error' : 'Server Error'}
    </span>
  );
}

/* ---- Syntax highlighted JSON ---- */

function SyntaxHighlight({ code, lang = 'json' }: { code: string; lang?: string }) {
  const highlighted = useMemo(() => {
    try {
      const parsed = JSON.parse(code);
      const formatted = JSON.stringify(parsed, null, 2);
      return formatted
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/(".*?")/g, '<span style="color:#C3E88D">$1</span>')
        .replace(/\b(true|false)\b/g, '<span style="color:#C792EA">$1</span>')
        .replace(/\b(null)\b/g, '<span style="color:#6B7280">$1</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#F78C6C">$1</span>')
        .replace(/(\{|\}|\[|\])/g, '<span style="color:#89DDFF">$1</span>');
    } catch {
      return code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  }, [code]);

  return (
    <pre
      className="font-mono text-[12px] leading-relaxed p-4 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */

export default function TryIt() {
  const { id } = useParams<{ id: string }>();
  const api = useMemo(() => mockAPIs.find((a) => a.id === id), [id]);

  const [env, setEnv] = useState<'Production' | 'Sandbox'>('Sandbox');
  const [filterText, setFilterText] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState<Array<{ key: string; value: string; required: boolean }>>([]);
  const [headerParams] = useState<Array<{ key: string; value: string }>>([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer your-api-key' },
  ]);
  const [bodyContent, setBodyContent] = useState('');
  const [response, setResponse] = useState<MockResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [responseTab, setResponseTab] = useState('body');
  const [authType] = useState<'OAuth2' | 'APIKey' | 'None'>('OAuth2');
  const [token, setToken] = useState('');

  const selectedResource = useMemo(
    () => api?.resources.find((r) => r.id === selectedResourceId),
    [api, selectedResourceId]
  );

  // Filtered resources
  const filteredResources = useMemo(() => {
    if (!api) return [];
    let list = api.resources;
    if (methodFilter !== 'ALL') {
      list = list.filter((r) => r.method === methodFilter);
    }
    if (filterText) {
      const q = filterText.toLowerCase();
      list = list.filter(
        (r) =>
          r.path.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q)
      );
    }
    return list;
  }, [api, methodFilter, filterText]);

  // Select first resource by default
  useMemo(() => {
    if (filteredResources.length > 0 && !selectedResourceId) {
      setSelectedResourceId(filteredResources[0].id);
    }
  }, [filteredResources, selectedResourceId]);

  // Update body when resource changes
  useMemo(() => {
    if (selectedResource) {
      const defaultBody = exampleRequestBody[selectedResource.method] || '';
      setBodyContent(defaultBody);
      // Pre-fill query params from spec
      const specParams = selectedResource.parameters
        .filter((p) => p.in === 'query')
        .map((p) => ({ key: p.name, value: '', required: p.required }));
      setQueryParams(specParams.length > 0 ? specParams : []);
    }
  }, [selectedResource?.id]);

  const baseUrl = useMemo(() => {
    if (!api) return '';
    return env === 'Production'
      ? api.gatewayEndpoint
      : api.gatewayEndpoint.replace('gateway.', 'gateway-sandbox.');
  }, [api, env]);

  const fullUrl = useMemo(() => {
    if (!selectedResource) return baseUrl;
    let path = selectedResource.path;
    // Replace path params
    selectedResource.parameters.filter((p) => p.in === 'path').forEach((p) => {
      path = path.replace(`{${p.name}}`, 'example-id');
    });
    // Add query params
    const activeQueries = queryParams.filter((q) => q.key && q.value);
    if (activeQueries.length > 0) {
      const qs = activeQueries.map((q) => `${encodeURIComponent(q.key)}=${encodeURIComponent(q.value)}`).join('&');
      path += `?${qs}`;
    }
    return `${baseUrl}${path}`;
  }, [baseUrl, selectedResource, queryParams]);

  const handleSend = useCallback(() => {
    setIsSending(true);
    setResponse(null);
    setTimeout(() => {
      const isError = token === '' && authType !== 'None';
      setResponse(isError ? errorResponse : exampleResponse);
      setIsSending(false);
    }, 800);
  }, [token, authType]);

  const addQueryParam = () => {
    setQueryParams((prev) => [...prev, { key: '', value: '', required: false }]);
  };

  const removeQueryParam = (idx: number) => {
    setQueryParams((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQueryParam = (idx: number, field: 'key' | 'value', value: string) => {
    setQueryParams((prev) => prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  if (!api) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-[#E8ECF1]">API Not Found</h1>
          <Link to="/devportal/catalog" className="text-[#4488FF] hover:underline mt-4 inline-block">
            Back to Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div>
          <Link
            to={`/devportal/apis/${api.id}`}
            className="inline-flex items-center gap-1 text-[13px] text-[#9DA5B4] hover:text-[#E8ECF1] mb-2 transition-colors"
          >
            <ArrowLeft size={14} />
            API Detail
          </Link>
          <h1 className="text-[24px] font-bold text-[#E8ECF1]">Try It Console</h1>
          <p className="text-[13px] text-[#9DA5B4]">
            {api.name} {api.version}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Environment toggle */}
          <div className="flex items-center bg-[#2B2F38] border border-[#3D434F] rounded-md p-0.5">
            {(['Sandbox', 'Production'] as const).map((e) => (
              <button
                key={e}
                onClick={() => setEnv(e)}
                className={cn(
                  'text-[12px] font-medium px-3 py-1.5 rounded-md transition-all',
                  env === e
                    ? 'bg-[#10B981] text-white'
                    : 'text-[#9DA5B4] hover:text-[#E8ECF1]'
                )}
              >
                {e}
              </button>
            ))}
          </div>
          {/* Auth status */}
          <Badge
            variant="outline"
            className={cn(
              'text-[11px]',
              token
                ? 'bg-[#10B98120] text-[#10B981] border-[#10B98140]'
                : 'bg-[#EF444420] text-[#EF4444] border-[#EF444440]'
            )}
          >
            {token ? 'Authenticated' : 'Not Authenticated'}
          </Badge>
        </div>
      </div>

      {/* Two-column split */}
      <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-0 border border-[#3D434F] rounded-lg overflow-hidden min-h-[600px]">
        {/* Left: Endpoint List */}
        <div className="border-r border-[#3D434F] bg-[#21242B]">
          {/* Filter */}
          <div className="p-4 border-b border-[#3D434F]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                placeholder="Filter endpoints..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-9 h-8 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280]"
              />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {methodFilterChips.map((m) => {
                const c = methodColors[m] || { bg: '#3D434F', text: '#9DA5B4' };
                const isActive = methodFilter === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMethodFilter(m)}
                    className={cn(
                      'text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all',
                      isActive ? 'text-white' : 'text-[#9DA5B4] bg-[#3D434F] hover:bg-[#4B5260]'
                    )}
                    style={isActive ? { backgroundColor: c.text } : {}}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Endpoint list */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            {filteredResources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => setSelectedResourceId(resource.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 border-b border-[#3D434F50] text-left transition-all',
                  selectedResourceId === resource.id
                    ? 'bg-[#10B98120] border-l-[3px] border-l-[#10B981]'
                    : 'border-l-[3px] border-l-transparent hover:bg-[#353942]'
                )}
              >
                <MethodBadge method={resource.method} />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[13px] text-[#E8ECF1] truncate">
                    {resource.path}
                  </p>
                  <p className="text-[12px] text-[#9DA5B4] truncate hidden lg:block">
                    {resource.summary}
                  </p>
                </div>
              </button>
            ))}
            {filteredResources.length === 0 && (
              <div className="p-8 text-center text-[13px] text-[#6B7280]">
                No endpoints match your filter
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right: Request Builder + Response */}
        <div className="bg-[#21242B] flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-5">
              {selectedResource ? (
                <>
                  {/* Endpoint Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <MethodBadgeLg method={selectedResource.method} />
                      <span className="font-mono text-[16px] font-bold text-[#E8ECF1]">
                        {selectedResource.path}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#6B7280] hover:text-[#E8ECF1]"
                        onClick={() => window.open(fullUrl, '_blank')}
                      >
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                    <p className="text-[13px] text-[#9DA5B4]">{selectedResource.summary}</p>
                  </div>

                  {/* URL Bar */}
                  <div className="bg-[#181A20] border border-[#3D434F] rounded-lg p-3 flex items-center gap-3 mb-5">
                    <MethodBadge method={selectedResource.method} />
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[13px] text-[#6B7280]">{baseUrl}</span>
                      <span className="font-mono text-[13px] text-[#E8ECF1]">{selectedResource.path}</span>
                    </div>
                    <CopyButton text={fullUrl} />
                  </div>

                  {/* Auth Section */}
                  <div className="mb-5">
                    <div className="text-[14px] font-semibold text-[#E8ECF1] mb-2 flex items-center gap-2">
                      Authentication
                      <Badge variant="outline" className="text-[11px] bg-[#3D434F40] text-[#9DA5B4] border-[#3D434F]">
                        {authType}
                      </Badge>
                    </div>
                    {authType === 'OAuth2' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="password"
                            placeholder="Bearer token..."
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="flex-1 h-9 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] placeholder:text-[#6B7280] font-mono"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 text-[12px] border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
                            onClick={() => setToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...')}
                          >
                            Get Token
                          </Button>
                        </div>
                      </div>
                    )}
                    {authType === 'None' && (
                      <p className="text-[13px] text-[#9DA5B4]">No authentication required.</p>
                    )}
                  </div>

                  {/* Parameters */}
                  {queryParams.length > 0 && (
                    <div className="mb-5">
                      <div className="text-[14px] font-semibold text-[#E8ECF1] mb-2">
                        Parameters ({queryParams.length})
                      </div>
                      <div className="space-y-2">
                        {queryParams.map((p, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input
                              placeholder="Key"
                              value={p.key}
                              onChange={(e) => updateQueryParam(idx, 'key', e.target.value)}
                              className="h-8 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] font-mono"
                            />
                            <Input
                              placeholder="Value"
                              value={p.value}
                              onChange={(e) => updateQueryParam(idx, 'value', e.target.value)}
                              className="h-8 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] font-mono"
                            />
                            {p.required && (
                              <Badge variant="outline" className="text-[10px] bg-[#F59E0B20] text-[#F59E0B] border-[#F59E0B40]">
                                Req
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-[#6B7280] hover:text-[#EF4444]"
                              onClick={() => removeQueryParam(idx)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[12px] text-[#4488FF] hover:text-[#5A9AFF] mt-1"
                        onClick={addQueryParam}
                      >
                        + Add parameter
                      </Button>
                    </div>
                  )}

                  {/* Headers */}
                  <div className="mb-5">
                    <div className="text-[14px] font-semibold text-[#E8ECF1] mb-2">Headers</div>
                    <div className="space-y-2">
                      {headerParams.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={h.key}
                            readOnly
                            className="h-8 bg-[#181A20] border-[#3D434F] text-[13px] text-[#E8ECF1] font-mono"
                          />
                          <Input
                            value={h.value}
                            readOnly
                            className="h-8 bg-[#181A20] border-[#3D434F] text-[13px] text-[#9DA5B4] font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  {['POST', 'PUT', 'PATCH'].includes(selectedResource.method) && (
                    <div className="mb-5">
                      <div className="text-[14px] font-semibold text-[#E8ECF1] mb-2">Request Body</div>
                      <div className="bg-[#181A20] border border-[#3D434F] rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-[#3D434F] bg-[#1A1D23]">
                          <span className="text-[12px] text-[#6B7280]">JSON</span>
                          <span className="text-[11px] text-[#6B7280]">
                            {bodyContent.length} chars
                          </span>
                        </div>
                        <textarea
                          value={bodyContent}
                          onChange={(e) => setBodyContent(e.target.value)}
                          className="w-full h-48 bg-[#181A20] p-4 font-mono text-[12px] text-[#E8ECF1] resize-none focus:outline-none"
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  )}

                  {/* Execute */}
                  <Button
                    onClick={handleSend}
                    disabled={isSending}
                    className="w-full h-11 bg-[#10B981] hover:bg-[#059669] text-white text-[14px] font-medium"
                    style={{ borderLeft: '3px solid #059669' }}
                  >
                    {isSending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Play size={16} />
                        Send Request
                      </span>
                    )}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-[#6B7280]">
                  <Play size={32} />
                  <p className="text-[13px] mt-2">Select an endpoint to start</p>
                </div>
              )}

              {/* Response Area */}
              {response && (
                <div className="mt-6 bg-[#181A20] border border-[#3D434F] rounded-lg overflow-hidden">
                  {/* Response Header */}
                  <div className="flex flex-wrap items-center gap-4 px-4 py-3 border-b border-[#3D434F] bg-[#1A1D23]">
                    <StatusBadge status={response.status} />
                    <span className="text-[13px] text-[#9DA5B4] flex items-center gap-1">
                      <Clock size={14} />
                      Completed in {response.time}ms
                    </span>
                    <span className="text-[13px] text-[#9DA5B4]">{response.size}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <CopyButton text={response.body} />
                      <Button variant="ghost" size="sm" className="h-8 text-[#6B7280] hover:text-[#E8ECF1]">
                        <Download size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* Response Tabs */}
                  <Tabs value={responseTab} onValueChange={setResponseTab}>
                    <TabsList className="bg-transparent border-b border-[#3D434F] rounded-none h-auto p-0 w-full justify-start px-2">
                      {['body', 'headers', 'raw'].map((t) => (
                        <TabsTrigger
                          key={t}
                          value={t}
                          className="text-[12px] capitalize px-3 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[#10B981] data-[state=active]:text-[#10B981] data-[state=active]:shadow-none text-[#9DA5B4]"
                        >
                          {t}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <TabsContent value="body" className="m-0">
                      <SyntaxHighlight code={response.body} />
                    </TabsContent>
                    <TabsContent value="headers" className="m-0">
                      <div className="p-4 space-y-2">
                        {Object.entries(response.headers).map(([key, value]) => (
                          <div key={key} className="flex gap-3 text-[13px]">
                            <span className="font-bold text-[#E8ECF1] min-w-[200px]">{key}</span>
                            <span className="font-mono text-[#9DA5B4]">{value}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="raw" className="m-0">
                      <pre className="p-4 font-mono text-[12px] text-[#E8ECF1] whitespace-pre-wrap">
                        {response.body}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Layout>
  );
}

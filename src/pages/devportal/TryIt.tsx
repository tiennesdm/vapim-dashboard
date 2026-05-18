import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { mockAPIs } from '@/lib/data';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Trash2,
  Plus,
} from 'lucide-react';

const exampleResponse = {
  status: 200,
  statusText: 'OK',
  time: 142,
  size: '1.2 KB',
  body: JSON.stringify({
    id: 'pi_3O9xYp2eZvKYlo2C1sQJQK',
    status: 'succeeded',
    amount: 9999,
    currency: 'usd',
    created: 1716048000,
  }, null, 2),
};

const errorResponse = {
  status: 401,
  statusText: 'Unauthorized',
  time: 45,
  size: '0.4 KB',
  body: JSON.stringify({
    error: 'Unauthorized',
    message: 'Valid authentication credentials required',
    code: 'AUTH_001',
  }, null, 2),
};

export default function TryIt() {
  const { id } = useParams<{ id: string }>();
  const api = mockAPIs.find((a) => a.id === id);

  const [selectedResourceId, setSelectedResourceId] = useState('');
  const [bodyContent, setBodyContent] = useState('');
  const [response, setResponse] = useState<typeof exampleResponse | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [env, setEnv] = useState<'Production' | 'Sandbox'>('Production');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [queryParams, setQueryParams] = useState<{ key: string; value: string }[]>([]);
  const [authType, setAuthType] = useState<'OAuth2' | 'APIKey' | 'None'>('OAuth2');
  const [token, setToken] = useState('');
  const [responseTab, setResponseTab] = useState('body');

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

  const resources = api.resources || [];
  const filteredResources =
    methodFilter === 'ALL'
      ? resources
      : resources.filter((r) => r.method === methodFilter);

  const selectedResource = resources.find((r) => r.id === selectedResourceId);

  // Select first resource on first render only
  if (!selectedResourceId && filteredResources.length > 0) {
    setSelectedResourceId(filteredResources[0].id);
  }

  const baseUrl =
    env === 'Production'
      ? api.gatewayEndpoint
      : api.gatewayEndpoint.replace('gateway.', 'gateway-sandbox.');

  const handleSend = () => {
    setIsSending(true);
    setResponse(null);
    setTimeout(() => {
      setResponse(token === '' && authType !== 'None' ? errorResponse : exampleResponse);
      setIsSending(false);
    }, 800);
  };

  const methodColors: Record<string, string> = {
    GET: 'bg-[#4488FF20] text-[#4488FF]',
    POST: 'bg-[#10B98120] text-[#10B981]',
    PUT: 'bg-[#F59E0B20] text-[#F59E0B]',
    DELETE: 'bg-[#EF444420] text-[#EF4444]',
    PATCH: 'bg-[#8B5CF620] text-[#8B5CF6]',
  };

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
          <p className="text-[13px] text-[#9DA5B4]">{api.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6" style={{ minHeight: 'calc(100vh - 260px)' }}>
        {/* Left Panel - Endpoint List */}
        <Card className="bg-[#1A1D23] border-[#3D434F] h-fit">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-[#E8ECF1]">Endpoints</h3>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[100px] h-8 bg-[#181A20] border-[#3D434F] text-[12px] text-[#E8ECF1]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1D23] border-[#3D434F]">
                  {['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                    <SelectItem key={m} value={m} className="text-[#E8ECF1]">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {filteredResources.map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => {
                    setSelectedResourceId(resource.id);
                    setResponse(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedResourceId === resource.id
                      ? 'bg-[#4488FF10] border-[#4488FF]'
                      : 'bg-[#181A20] border-[#3D434F] hover:border-[#6B7280]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-[10px] ${methodColors[resource.method] || 'bg-[#6B728020] text-[#6B7280]'}`}>
                      {resource.method}
                    </Badge>
                    <span className="text-[11px] text-[#E8ECF1] font-mono truncate">{resource.path}</span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] truncate">{resource.summary}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Request Builder */}
        <div className="space-y-4">
          {selectedResource && (
            <>
              {/* URL Bar */}
              <Card className="bg-[#1A1D23] border-[#3D434F]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Badge className={methodColors[selectedResource.method] || ''}>
                      {selectedResource.method}
                    </Badge>
                    <Select value={env} onValueChange={(v) => setEnv(v as 'Production' | 'Sandbox')}>
                      <SelectTrigger className="w-[130px] h-9 bg-[#181A20] border-[#3D434F] text-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1D23] border-[#3D434F]">
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Sandbox">Sandbox</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex-1 bg-[#181A20] border border-[#3D434F] rounded-md px-3 py-2 text-[12px] text-[#E8ECF1] font-mono truncate">
                      {baseUrl}{selectedResource.path}
                    </div>
                    <Button
                      onClick={handleSend}
                      disabled={isSending}
                      className="bg-[#10B981] hover:bg-[#10B981]/80 h-9"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSending ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Request Configuration */}
              <Tabs defaultValue="auth" className="space-y-4">
                <TabsList className="bg-[#1A1D23] border border-[#3D434F]">
                  <TabsTrigger value="auth" className="text-[#E8ECF1] data-[state=active]:bg-[#4488FF]">Auth</TabsTrigger>
                  <TabsTrigger value="params" className="text-[#E8ECF1] data-[state=active]:bg-[#4488FF]">Query Params</TabsTrigger>
                  <TabsTrigger value="body" className="text-[#E8ECF1] data-[state=active]:bg-[#4488FF]">Body</TabsTrigger>
                </TabsList>

                <TabsContent value="auth">
                  <Card className="bg-[#1A1D23] border-[#3D434F]">
                    <CardContent className="p-4 space-y-4">
                      <Select value={authType} onValueChange={(v) => setAuthType(v as 'OAuth2' | 'APIKey' | 'None')}>
                        <SelectTrigger className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1D23] border-[#3D434F]">
                          <SelectItem value="OAuth2">OAuth 2.0</SelectItem>
                          <SelectItem value="APIKey">API Key</SelectItem>
                          <SelectItem value="None">None</SelectItem>
                        </SelectContent>
                      </Select>
                      {authType !== 'None' && (
                        <Input
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          placeholder={authType === 'OAuth2' ? 'Bearer token...' : 'API key...'}
                          className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] font-mono text-[12px]"
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="params">
                  <Card className="bg-[#1A1D23] border-[#3D434F]">
                    <CardContent className="p-4 space-y-3">
                      {queryParams.map((param, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={param.key}
                            onChange={(e) => {
                              const newParams = [...queryParams];
                              newParams[idx].key = e.target.value;
                              setQueryParams(newParams);
                            }}
                            placeholder="Key"
                            className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] text-[12px]"
                          />
                          <Input
                            value={param.value}
                            onChange={(e) => {
                              const newParams = [...queryParams];
                              newParams[idx].value = e.target.value;
                              setQueryParams(newParams);
                            }}
                            placeholder="Value"
                            className="bg-[#181A20] border-[#3D434F] text-[#E8ECF1] text-[12px]"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#EF4444]"
                            onClick={() => setQueryParams(queryParams.filter((_, i) => i !== idx))}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#3D434F] text-[#E8ECF1]"
                        onClick={() => setQueryParams([...queryParams, { key: '', value: '' }])}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Parameter
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="body">
                  <Card className="bg-[#1A1D23] border-[#3D434F]">
                    <CardContent className="p-4">
                      <textarea
                        value={bodyContent}
                        onChange={(e) => setBodyContent(e.target.value)}
                        placeholder="Request body (JSON)..."
                        className="w-full h-[200px] bg-[#181A20] border border-[#3D434F] rounded-md p-3 text-[12px] text-[#E8ECF1] font-mono resize-none focus:outline-none focus:border-[#4488FF]"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Response */}
              {response && (
                <Card className="bg-[#1A1D23] border-[#3D434F]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {response.status < 300 ? (
                          <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-[#EF4444]" />
                        )}
                        <span className={`text-[13px] font-medium ${response.status < 300 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {response.status} {response.statusText}
                        </span>
                        <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {response.time}ms
                        </span>
                        <span className="text-[11px] text-[#6B7280]">{response.size}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#9DA5B4]" onClick={() => navigator.clipboard.writeText(response.body)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <pre className="bg-[#181A20] rounded-md p-4 text-[12px] text-[#E8ECF1] font-mono overflow-x-auto whitespace-pre-wrap">
                      {response.body}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

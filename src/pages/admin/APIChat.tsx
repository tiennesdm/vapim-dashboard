import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedAPIs?: string[];
}

const samplePrompts = [
  'Test the Payment API with sample data',
  'Explain the User Management API endpoints',
  'Compare REST vs GraphQL for order data',
  'Generate curl commands for auth flow',
  'Check API health status summary',
  'What APIs support WebSocket?',
];

const mockResponses: Record<string, { content: string; relatedAPIs: string[] }> = {
  'Test the Payment API with sample data': {
    content: `Here is a test for the Payment Processing API:

**Request:**
\`\`\`json
POST /v1/payments/process
{
  "amount": 99.99,
  "currency": "USD",
  "source": "tok_visa_4242",
  "description": "Monthly subscription",
  "metadata": { "order_id": "ORD-12345" }
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "pi_3O9xYp2eZvKYlo2C1sQJQK",
  "status": "succeeded",
  "amount": 9999,
  "currency": "usd",
  "created": 1716048000
}
\`\`\`

The API responded with HTTP 200 in 142ms. Payment succeeded.`,
    relatedAPIs: ['Payment Processing API', 'Order Management API'],
  },
  'Explain the User Management API endpoints': {
    content: `The **User Management API** provides the following endpoints:

| Method | Path | Description |
|--------|------|-------------|
| GET | /users | List all users |
| POST | /users | Create a user |
| GET | /users/:id | Get user by ID |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |
| GET | /users/:id/roles | Get user roles |

All endpoints require OAuth 2.0 authentication with the **user:read** or **user:write** scope.`,
    relatedAPIs: ['User Management API', 'Authentication API'],
  },
  'Compare REST vs GraphQL for order data': {
    content: `**REST Approach:** Requires 3 requests
1. GET /orders/123 → basic info
2. GET /orders/123/items → line items
3. GET /orders/123/customer → customer

**GraphQL Approach:** 1 request
\`\`\`graphql
query { order(id: "123") { id total items { name price qty } customer { name email } } }
\`\`\`

**Verdict:** GraphQL reduces requests by 66% for nested data. Use REST for simple CRUD, GraphQL for complex queries.`,
    relatedAPIs: ['Order Processing API', 'GraphQL API'],
  },
};

const defaultResponse = {
  content: `I've analyzed your request. Here's what I found:

The API supports the requested operation. Based on your query:

- **Endpoint:** Available and documented
- **Authentication:** OAuth 2.0 required
- **Rate Limit:** 1000 req/min for Pro tier
- **Average Response Time:** 45ms (p95: 120ms)

Would you like me to generate sample code or test the endpoint with specific parameters?`,
  relatedAPIs: ['REST API Gateway', 'Authentication API'],
};

export default function APIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your API assistant. I can help you test APIs, generate code, compare approaches, and explore the API catalog. How can I help?',
      timestamp: 'Just now',
      relatedAPIs: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 1500));

    const response = mockResponses[text] || defaultResponse;
    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      relatedAPIs: response.relatedAPIs,
    };
    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <Layout>
      <PageHeader title="API Chat" description="AI-assisted API testing and exploration" />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Chat Area */}
        <Card className="xl:col-span-3 bg-[#1A1D23] border-[#3D434F] flex flex-col">
          <CardContent className="flex flex-col flex-1 p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'assistant' ? 'bg-[#8B5CF620] text-[#8B5CF6]' : 'bg-[#4488FF20] text-[#4488FF]'
                    }`}>
                      {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'assistant' ? 'bg-[#181A20] border border-[#3D434F]' : 'bg-[#4488FF] text-white'
                    }`}>
                      <div className="text-[13px] whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                      <div className={`text-[10px] mt-2 ${msg.role === 'assistant' ? 'text-[#6B7280]' : 'text-[#ffffff80]'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#8B5CF620] text-[#8B5CF6] flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-[#181A20] border border-[#3D434F] p-3 rounded-lg">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[#3D434F]">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about APIs, test endpoints, generate code..."
                  className="flex-1 bg-[#181A20] border-[#3D434F] text-[#E8ECF1]"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} className="bg-[#4488FF] hover:bg-[#5C9DFF]">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Sample Prompts */}
          <Card className="bg-[#1A1D23] border-[#3D434F]">
            <CardContent className="p-4">
              <h3 className="text-[13px] font-medium text-[#E8ECF1] mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F59E0B]" /> Sample Prompts
              </h3>
              <div className="space-y-2">
                {samplePrompts.map(p => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="w-full text-left p-2 rounded-md bg-[#181A20] border border-[#3D434F] text-[12px] text-[#9DA5B4] hover:bg-[#353942] hover:text-[#E8ECF1] transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 flex-shrink-0" />
                    {p}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related APIs */}
          {messages.filter(m => m.role === 'assistant' && m.relatedAPIs?.length).slice(-1)[0]?.relatedAPIs && (
            <Card className="bg-[#1A1D23] border-[#3D434F]">
              <CardContent className="p-4">
                <h3 className="text-[13px] font-medium text-[#E8ECF1] mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#10B981]" /> Related APIs
                </h3>
                <div className="space-y-2">
                  {messages.filter(m => m.role === 'assistant' && m.relatedAPIs?.length).slice(-1)[0]?.relatedAPIs?.map(api => (
                    <Badge key={api} className="w-full justify-start bg-[#4488FF20] text-[#4488FF] hover:bg-[#4488FF30] cursor-pointer py-1.5">
                      {api}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

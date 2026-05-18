import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router';
import { cn } from '@/lib/utils';
import { mockAPIs } from '@/lib/data';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Copy,
  CheckCheck,
  Download,
  Github,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

type Lang = 'javascript' | 'python' | 'java' | 'go' | 'curl';

const languages: { id: Lang; label: string; ext: string; icon: string }[] = [
  { id: 'javascript', label: 'JavaScript', ext: 'js', icon: 'JS' },
  { id: 'python',     label: 'Python',     ext: 'py', icon: 'PY' },
  { id: 'java',       label: 'Java',       ext: 'java', icon: 'JV' },
  { id: 'go',         label: 'Go',         ext: 'go', icon: 'GO' },
  { id: 'curl',       label: 'curl',       ext: 'sh', icon: 'cURL' },
];

const codeExamples: Record<Lang, string> = {
  javascript: `import { VedaDBClient } from '@vedadb/sdk-payments';

const client = new VedaDBClient({
  baseUrl: 'https://gw.vedadb.com/payments/2.1.0',
  apiKey: 'your-api-key',
  environment: 'sandbox' // or 'production'
});

// Create a payment
const payment = await client.payments.create({
  amount: 99.99,
  currency: 'USD',
  payment_method: 'credit_card',
  card_token: 'tok_visa_4242',
  description: 'Monthly subscription'
});

console.log(payment.id); // pay_abc123...
console.log(payment.status); // 'succeeded'

// List payments
const payments = await client.payments.list({
  limit: 10,
  status: 'succeeded'
});

// Get a payment
const retrieved = await client.payments.get('pay_abc123');

// Refund a payment
const refund = await client.payments.refund('pay_abc123', {
  amount: 99.99,
  reason: 'Customer request'
});`,

  python: `from vedadb.payments import VedaDBClient

client = VedaDBClient(
    base_url='https://gw.vedadb.com/payments/2.1.0',
    api_key='your-api-key',
    environment='sandbox'
)

# Create a payment
payment = client.payments.create(
    amount=99.99,
    currency='USD',
    payment_method='credit_card',
    card_token='tok_visa_4242',
    description='Monthly subscription'
)

print(payment.id)  # pay_abc123...
print(payment.status)  # 'succeeded'

# List payments
payments = client.payments.list(limit=10, status='succeeded')

# Get a payment
retrieved = client.payments.get('pay_abc123')

# Refund a payment
refund = client.payments.refund('pay_abc123', amount=99.99, reason='Customer request')`,

  java: `import com.vedadb.payments.VedaDBClient;
import com.vedadb.payments.models.*;

VedaDBClient client = VedaDBClient.builder()
    .baseUrl("https://gw.vedadb.com/payments/2.1.0")
    .apiKey("your-api-key")
    .environment(Environment.SANDBOX)
    .build();

// Create a payment
CreatePaymentRequest request = CreatePaymentRequest.builder()
    .amount(99.99)
    .currency("USD")
    .paymentMethod("credit_card")
    .cardToken("tok_visa_4242")
    .description("Monthly subscription")
    .build();

Payment payment = client.payments().create(request);
System.out.println(payment.getId()); // pay_abc123...
System.out.println(payment.getStatus()); // 'succeeded'

// List payments
PaymentList payments = client.payments().list(ListPaymentsRequest.builder()
    .limit(10)
    .status("succeeded")
    .build());

// Get a payment
Payment retrieved = client.payments().get("pay_abc123");

// Refund a payment
Refund refund = client.payments().refund("pay_abc123", RefundRequest.builder()
    .amount(99.99)
    .reason("Customer request")
    .build());`,

  go: `package main

import (
    "context"
    "fmt"
    "github.com/vedadb/payments-go-sdk"
)

func main() {
    client := payments.NewClient(
        payments.WithBaseURL("https://gw.vedadb.com/payments/2.1.0"),
        payments.WithAPIKey("your-api-key"),
        payments.WithEnvironment(payments.Sandbox),
    )

    ctx := context.Background()

    // Create a payment
    payment, err := client.Payments.Create(ctx, &payments.CreatePaymentRequest{
        Amount:        99.99,
        Currency:      "USD",
        PaymentMethod: "credit_card",
        CardToken:     "tok_visa_4242",
        Description:   "Monthly subscription",
    })
    if err != nil {
        panic(err)
    }

    fmt.Println(payment.ID)      // pay_abc123...
    fmt.Println(payment.Status)  // 'succeeded'

    // List payments
    payments_list, err := client.Payments.List(ctx, &payments.ListPaymentsRequest{
        Limit:  10,
        Status: "succeeded",
    })

    // Get a payment
    retrieved, err := client.Payments.Get(ctx, "pay_abc123")

    // Refund a payment
    refund, err := client.Payments.Refund(ctx, "pay_abc123", &payments.RefundRequest{
        Amount: 99.99,
        Reason: "Customer request",
    })
}`,

  curl: `# Base URL and authentication
BASE_URL="https://gw-sandbox.vedadb.com/payments/2.1.0"
API_KEY="your-api-key"

# Create a payment
curl -X POST "$BASE_URL/payments" \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 99.99,
    "currency": "USD",
    "payment_method": "credit_card",
    "card_token": "tok_visa_4242",
    "description": "Monthly subscription"
  }'

# List payments
curl -X GET "$BASE_URL/payments?limit=10&status=succeeded" \\
  -H "Authorization: Bearer $API_KEY"

# Get a payment
curl -X GET "$BASE_URL/payments/pay_abc123" \\
  -H "Authorization: Bearer $API_KEY"

# Refund a payment
curl -X POST "$BASE_URL/payments/pay_abc123/refund" \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 99.99,
    "reason": "Customer request"
  }'`,
};

const sdkInfo: Record<Lang, { title: string; desc: string; prereq: string; install: string; packageManagers?: { label: string; cmd: string }[] }> = {
  javascript: {
    title: 'JavaScript SDK',
    desc: 'Node.js and browser compatible. Uses fetch API. Supports async/await.',
    prereq: 'Node.js >= 16',
    install: 'npm install @vedadb/sdk-payments',
    packageManagers: [
      { label: 'npm', cmd: 'npm install @vedadb/sdk-payments' },
      { label: 'yarn', cmd: 'yarn add @vedadb/sdk-payments' },
      { label: 'pnpm', cmd: 'pnpm add @vedadb/sdk-payments' },
    ],
  },
  python: {
    title: 'Python SDK',
    desc: 'Python 3.8+ compatible. Uses requests library. Supports async with aiohttp.',
    prereq: 'Python >= 3.8',
    install: 'pip install vedadb-payments',
    packageManagers: [
      { label: 'pip', cmd: 'pip install vedadb-payments' },
      { label: 'pipenv', cmd: 'pipenv install vedadb-payments' },
      { label: 'poetry', cmd: 'poetry add vedadb-payments' },
    ],
  },
  java: {
    title: 'Java SDK',
    desc: 'Java 11+ compatible. Maven/Gradle support.',
    prereq: 'Java >= 11',
    install: 'Maven: com.vedadb:sdk-payments:2.1.0',
    packageManagers: [
      { label: 'Maven', cmd: '<dependency>\n  <groupId>com.vedadb</groupId>\n  <artifactId>sdk-payments</artifactId>\n  <version>2.1.0</version>\n</dependency>' },
      { label: 'Gradle', cmd: "implementation 'com.vedadb:sdk-payments:2.1.0'" },
    ],
  },
  go: {
    title: 'Go SDK',
    desc: 'Go 1.20+ compatible. Native net/http with context support.',
    prereq: 'Go >= 1.20',
    install: 'go get github.com/vedadb/payments-go-sdk',
  },
  curl: {
    title: 'cURL Examples',
    desc: 'Direct HTTP requests using curl. No dependencies.',
    prereq: 'curl (pre-installed on most systems)',
    install: '',
  },
};

/* ------------------------------------------------------------------ */
/*  Syntax Highlight                                                  */
/* ------------------------------------------------------------------ */

function SyntaxHighlight({ code, lang }: { code: string; lang: Lang }) {
  const highlighted = useMemo(() => {
    if (lang === 'javascript' || lang === 'java' || lang === 'go') {
      return (
        code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          // Strings
          .replace(/('.*?'|".*?"|`[\s\S]*?`)/g, '<span style="color:#C3E88D">$1</span>')
          // Comments (single line)
          .replace(/(\/\/.*$)/gm, '<span style="color:#546E7A">$1</span>')
          // Keywords
          .replace(/\b(import|export|from|const|let|var|function|return|async|await|new|class|if|else|for|while|switch|case|break|default|try|catch|throw|package|func|interface|struct|type|map|chan|defer|go|range|select|nil|true|false|null|undefined|this|static|public|private|void|int|long|double|float|boolean|char|byte|String|System|out|println|print|func|context|Background|panic)\b/g, '<span style="color:#C792EA">$1</span>')
          // Numbers
          .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#F78C6C">$1</span>')
          // Functions
          .replace(/(\w+)(\()/g, '<span style="color:#82AAFF">$1</span>$2')
      );
    }
    if (lang === 'python') {
      return (
        code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          // Comments
          .replace(/(#.*$)/gm, '<span style="color:#546E7A">$1</span>')
          // Strings
          .replace(/('.*?'|".*?")/g, '<span style="color:#C3E88D">$1</span>')
          // Keywords
          .replace(/\b(from|import|def|class|return|if|else|elif|for|while|try|except|raise|with|as|pass|None|True|False|print|self|lambda|yield|async|await)\b/g, '<span style="color:#C792EA">$1</span>')
          // Numbers
          .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#F78C6C">$1</span>')
          // Functions
          .replace(/(\w+)(\()/g, '<span style="color:#82AAFF">$1</span>$2')
      );
    }
    // curl / bash
    return (
      code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Comments
        .replace(/(#.*$)/gm, '<span style="color:#546E7A">$1</span>')
        // Strings
        .replace(/('.*?'|".*?")/g, '<span style="color:#C3E88D">$1</span>')
        // Variables
        .replace(/(\w+)=/g, '<span style="color:#C792EA">$1</span>=')
        // Commands
        .replace(/\b(curl|echo|cat|ls|cd|mkdir|rm|cp|mv|grep|awk|sed)\b/g, '<span style="color:#82AAFF">$1</span>')
        // Flags
        .replace(/(\s)(-[A-Za-z]+)/g, '$1<span style="color:#F78C6C">$2</span>')
    );
  }, [code, lang]);

  const lines = code.split('\n');

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, i) => (
            <tr key={i} className="hover:bg-[#1E2128] transition-colors">
              <td className="text-right select-none pr-4 pl-2 py-0.5 text-[12px] text-[#6B7280] w-10 min-w-[40px]">
                {i + 1}
              </td>
              <td className="py-0.5 pr-4">
                <pre
                  className="font-mono text-[12px] leading-relaxed text-[#E8ECF1] m-0 p-0"
                  dangerouslySetInnerHTML={{
                    __html: highlighted.split('\n')[i] || '&nbsp;',
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */

export default function SDK() {
  const { id } = useParams<{ id: string }>();
  const api = useMemo(() => mockAPIs.find((a) => a.id === id), [id]);
  const [activeLang, setActiveLang] = useState<Lang>('javascript');
  const [copied, setCopied] = useState(false);
  const [pkgTab, setPkgTab] = useState(0);

  const currentInfo = sdkInfo[activeLang];
  const currentCode = codeExamples[activeLang];

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentCode]);

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
      <div className="mb-6">
        <Link
          to={`/devportal/apis/${api.id}`}
          className="inline-flex items-center gap-1 text-[13px] text-[#9DA5B4] hover:text-[#E8ECF1] mb-2 transition-colors"
        >
          <ArrowLeft size={14} />
          API Detail
        </Link>
        <h1 className="text-[24px] font-bold text-[#E8ECF1]">SDK Download</h1>
        <p className="text-[13px] text-[#9DA5B4]">{api.name}</p>
      </div>

      {/* Language Selector */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {languages.map((lang) => {
          const isActive = activeLang === lang.id;
          return (
            <button
              key={lang.id}
              onClick={() => {
                setActiveLang(lang.id);
                setPkgTab(0);
              }}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium border transition-all',
                isActive
                  ? 'bg-[#10B98120] border-[#10B981] text-[#10B981] shadow-[0_0_8px_#10B98120]'
                  : 'bg-[#2B2F38] border-[#3D434F] text-[#9DA5B4] hover:bg-[#353942] hover:border-[#4488FF40]'
              )}
            >
              <span
                className={cn(
                  'w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold',
                  isActive ? 'bg-[#10B981] text-white' : 'bg-[#3D434F] text-[#9DA5B4]'
                )}
              >
                {lang.icon}
              </span>
              {lang.label}
            </button>
          );
        })}
      </div>

      {/* Two-column: Info + Code */}
      <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6">
        {/* Left: SDK Info Card */}
        <div className="bg-[#2B2F38] border border-[#3D434F] rounded-[10px] p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded bg-[#10B981] text-white flex items-center justify-center text-[12px] font-bold">
              {languages.find((l) => l.id === activeLang)?.icon}
            </span>
            <div>
              <h3 className="text-[16px] font-bold text-[#E8ECF1]">
                {currentInfo.title}
              </h3>
              <p className="text-[12px] text-[#9DA5B4]">{currentInfo.desc}</p>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="mb-4">
            <span className="text-[11px] text-[#6B7280] uppercase">Prerequisites</span>
            <Badge
              variant="outline"
              className="ml-2 text-[11px] bg-[#3D434F40] text-[#9DA5B4] border-[#3D434F]"
            >
              {currentInfo.prereq}
            </Badge>
          </div>

          {/* Install command */}
          {currentInfo.install && (
            <div className="mb-4">
              <span className="text-[11px] text-[#6B7280] uppercase block mb-2">
                Install
              </span>

              {/* Package manager tabs */}
              {currentInfo.packageManagers && currentInfo.packageManagers.length > 0 ? (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    {currentInfo.packageManagers.map((pm, idx) => (
                      <button
                        key={pm.label}
                        onClick={() => setPkgTab(idx)}
                        className={cn(
                          'text-[11px] font-medium px-2 py-1 rounded transition-all',
                          pkgTab === idx
                            ? 'bg-[#10B98120] text-[#10B981]'
                            : 'text-[#9DA5B4] hover:bg-[#353942]'
                        )}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                  <div className="bg-[#181A20] border border-[#3D434F] rounded-md p-3 font-mono text-[12px] text-[#E8ECF1] relative group">
                    <pre className="whitespace-pre-wrap break-all">
                      {currentInfo.packageManagers[pkgTab].cmd}
                    </pre>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentInfo.packageManagers![pkgTab].cmd);
                      }}
                      className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[#353942] transition-all"
                    >
                      <Copy size={12} className="text-[#6B7280]" />
                    </button>
                  </div>
                </div>
              ) : activeLang === 'curl' ? null : (
                <div className="bg-[#181A20] border border-[#3D434F] rounded-md p-3 font-mono text-[12px] text-[#E8ECF1] relative group">
                  <code>{currentInfo.install}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(currentInfo.install)}
                    className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-[#353942] transition-all"
                  >
                    <Copy size={12} className="text-[#6B7280]" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 mt-5">
            <Button className="w-full h-10 text-[13px] bg-[#10B981] hover:bg-[#059669] text-white">
              <Download size={14} className="mr-2" />
              Download SDK
            </Button>
            <Button
              variant="outline"
              className="w-full h-9 text-[13px] bg-transparent border-[#3D434F] text-[#E8ECF1] hover:bg-[#353942]"
            >
              <Github size={14} className="mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Right: Code Preview */}
        <div className="bg-[#181A20] border border-[#3D434F] rounded-[10px] overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#1A1D23] border-b border-[#3D434F]">
            <span className="font-mono text-[12px] text-[#6B7280]">
              example.{languages.find((l) => l.id === activeLang)?.ext}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#6B7280]">
                {currentCode.split('\n').length} lines
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-[#353942] transition-colors text-[#6B7280] hover:text-[#E8ECF1]"
              >
                {copied ? (
                  <CheckCheck size={14} className="text-[#10B981]" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Code area */}
          <div className="p-2 overflow-y-auto max-h-[600px]">
            <SyntaxHighlight code={currentCode} lang={activeLang} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

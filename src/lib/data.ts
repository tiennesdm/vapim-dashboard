// ===== TypeScript Types =====

export interface APIResource {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
  summary: string;
  description: string;
  parameters: Array<{
    name: string;
    in: 'query' | 'path' | 'header' | 'body';
    required: boolean;
    type: string;
  }>;
  authType: 'OAuth2' | 'APIKey' | 'None';
  throttlingTier: string;
  scope: string;
}

export interface DocPage {
  id: string;
  title: string;
  type: 'markdown' | 'swagger' | 'inline';
  content: string;
  lastUpdated: string;
}

export interface Subscription {
  id: string;
  apiId: string;
  apiName: string;
  apiVersion: string;
  applicationId: string;
  applicationName: string;
  tier: string;
  status: 'ACTIVE' | 'BLOCKED' | 'ON_HOLD' | 'REJECTED';
  subscribedAt: string;
  updatedAt: string;
}

export interface Deployment {
  id: string;
  gateway: string;
  status: 'DEPLOYED' | 'UNDEPLOYED';
  deployedAt?: string;
}

export interface LifecycleState {
  currentState: 'CREATED' | 'PUBLISHED' | 'DEPRECATED' | 'RETIRED' | 'BLOCKED';
  history: Array<{
    state: string;
    timestamp: string;
    user: string;
  }>;
}

export interface API {
  id: string;
  name: string;
  version: string;
  description: string;
  context: string;
  provider: string;
  status: 'CREATED' | 'PUBLISHED' | 'DEPRECATED' | 'RETIRED' | 'BLOCKED';
  type: 'REST' | 'GRAPHQL' | 'WEBSOCKET' | 'WEBHOOK' | 'GRPC' | 'SOAP';
  visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  tags: string[];
  categories: string[];
  rating: number;
  subscribers: number;
  createdAt: string;
  updatedAt: string;
  resources: APIResource[];
  documentation: DocPage[];
  subscriptions: Subscription[];
  deployments: Deployment[];
  lifecycleState: LifecycleState;
  gatewayEndpoint: string;
  thumbnailUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'publisher' | 'subscriber';
  tenant: string;
  status: 'active' | 'inactive' | 'locked';
  avatarUrl?: string;
  createdAt: string;
  lastLogin: string;
  permissions: string[];
}

export interface Application {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: 'ACTIVE' | 'INACTIVE' | 'REJECTED';
  productionKey: string;
  sandboxKey: string;
  tokenType: 'JWT' | 'OAUTH';
  callbackUrl?: string;
  createdAt: string;
  updatedAt: string;
  groupId?: string;
  quota: number;
  usedQuota: number;
}

export interface ThrottlingPolicy {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: 'api' | 'application' | 'subscription';
  defaultLimit: {
    requestCount: number;
    unitTime: number;
    timeUnit: 'MIN' | 'HOUR' | 'DAY';
  };
  burstLimit: number;
  rateLimitCount?: number;
  rateLimitTimeUnit?: 'MIN' | 'HOUR' | 'DAY';
  stopOnQuotaReach: boolean;
  billingPlan: 'FREE' | 'COMMERCIAL';
  customAttributes: Array<{ name: string; value: string }>;
  isDeployed: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  action: string;
  user: string;
  resource: string;
  resourceType: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface Webhook {
  id: string;
  name: string;
  endpointUrl: string;
  eventTypes: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'FAILED';
  headers: Record<string, string>;
  retryPolicy: {
    maxRetries: number;
    retryInterval: number;
    backoffMultiplier: number;
  };
  createdAt: string;
  lastDeliveredAt?: string;
  lastStatus?: 'SUCCESS' | 'FAILED';
  failureCount: number;
}

export interface Tenant {
  id: string;
  domain: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  owner: string;
  plan: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  quota: {
    maxApis: number;
    maxUsers: number;
    maxApplications: number;
    maxRequestsPerDay: number;
  };
  createdAt: string;
  expiresAt: string;
  usage: {
    apis: number;
    users: number;
    applications: number;
    requestsToday: number;
  };
}

export interface Gateway {
  id: string;
  name: string;
  label: string;
  type: 'SYNAPSE' | 'CC';
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  endpoints: {
    http: string;
    https: string;
  };
  protocol: 'HTTP' | 'HTTPS' | 'WS' | 'WSS';
  virtualHosts: string[];
  createdAt: string;
  lastHealthCheck: string;
  healthStatus: 'HEALTHY' | 'UNHEALTHY' | 'UNKNOWN';
}

export interface AnalyticsDataPoint {
  date: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgLatency: number;
  uniqueUsers: number;
  newSubscriptions: number;
}

// ===== Mock Data =====

export const mockAPIs: API[] = [
  {
    id: '1',
    name: 'Payment Processing API',
    version: 'v2.1.0',
    description: 'Secure payment gateway for credit cards, digital wallets, and bank transfers with PCI DSS compliance.',
    context: '/payments',
    provider: 'Finance Team',
    status: 'PUBLISHED',
    type: 'REST',
    visibility: 'PUBLIC',
    tags: ['payments', 'finance', 'pci-dss'],
    categories: ['Financial Services'],
    rating: 4.8,
    subscribers: 142,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-07-20T14:22:00Z',
    resources: [
      { id: 'r1', path: '/payments', method: 'POST', summary: 'Process payment', description: 'Process a new payment transaction', parameters: [{ name: 'amount', in: 'body', required: true, type: 'number' }], authType: 'OAuth2', throttlingTier: 'Gold', scope: 'payments:write' },
      { id: 'r2', path: '/payments/{id}', method: 'GET', summary: 'Get payment', description: 'Retrieve payment details', parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }], authType: 'OAuth2', throttlingTier: 'Gold', scope: 'payments:read' },
    ],
    documentation: [{ id: 'd1', title: 'Getting Started', type: 'markdown', content: '# Getting Started\n\nWelcome...', lastUpdated: '2024-07-01' }],
    subscriptions: [],
    deployments: [{ id: 'dep1', gateway: 'Gateway-1', status: 'DEPLOYED', deployedAt: '2024-07-20' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-01-15', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-01-20', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/payments/v2.1.0',
  },
  {
    id: '2',
    name: 'User Management Service',
    version: 'v3.0.0',
    description: 'Authentication, authorization, user profiles, roles, and session management.',
    context: '/users',
    provider: 'Platform Team',
    status: 'PUBLISHED',
    type: 'REST',
    visibility: 'PUBLIC',
    tags: ['auth', 'users', 'identity'],
    categories: ['Identity'],
    rating: 4.5,
    subscribers: 89,
    createdAt: '2024-02-10T08:15:00Z',
    updatedAt: '2024-07-18T11:00:00Z',
    resources: [
      { id: 'r3', path: '/users', method: 'GET', summary: 'List users', description: 'Get all users', parameters: [{ name: 'page', in: 'query', required: false, type: 'number' }], authType: 'OAuth2', throttlingTier: 'Silver', scope: 'users:read' },
      { id: 'r4', path: '/users', method: 'POST', summary: 'Create user', description: 'Register new user', parameters: [{ name: 'body', in: 'body', required: true, type: 'object' }], authType: 'OAuth2', throttlingTier: 'Gold', scope: 'users:write' },
    ],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep2', gateway: 'Gateway-1', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-02-10', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-02-15', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/users/v3.0.0',
  },
  {
    id: '3',
    name: 'Inventory GraphQL',
    version: 'v1.2.0',
    description: 'Real-time inventory management with GraphQL subscriptions for stock updates.',
    context: '/inventory',
    provider: 'Retail Team',
    status: 'PUBLISHED',
    type: 'GRAPHQL',
    visibility: 'PUBLIC',
    tags: ['inventory', 'retail', 'real-time'],
    categories: ['Retail'],
    rating: 4.2,
    subscribers: 56,
    createdAt: '2024-03-05T14:30:00Z',
    updatedAt: '2024-07-15T09:45:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep3', gateway: 'Gateway-2', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-03-05', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-03-10', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/inventory/v1.2.0',
  },
  {
    id: '4',
    name: 'Notification Webhook API',
    version: 'v1.0.0',
    description: 'Event-driven webhook delivery for push notifications across channels.',
    context: '/notifications',
    provider: 'Comms Team',
    status: 'DEPRECATED',
    type: 'WEBHOOK',
    visibility: 'PUBLIC',
    tags: ['notifications', 'webhooks', 'events'],
    categories: ['Communications'],
    rating: 3.8,
    subscribers: 34,
    createdAt: '2023-11-20T16:00:00Z',
    updatedAt: '2024-06-30T12:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep4', gateway: 'Gateway-1', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'DEPRECATED', history: [{ state: 'CREATED', timestamp: '2023-11-20', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2023-11-25', user: 'admin' }, { state: 'DEPRECATED', timestamp: '2024-06-30', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/notifications/v1.0.0',
  },
  {
    id: '5',
    name: 'Order Service',
    version: 'v2.0.0',
    description: 'Order creation, tracking, fulfillment, and cancellation workflows.',
    context: '/orders',
    provider: 'Retail Team',
    status: 'CREATED',
    type: 'REST',
    visibility: 'PRIVATE',
    tags: ['orders', 'retail', 'workflow'],
    categories: ['Retail'],
    rating: 0,
    subscribers: 0,
    createdAt: '2024-07-10T09:00:00Z',
    updatedAt: '2024-07-10T09:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [],
    lifecycleState: { currentState: 'CREATED', history: [{ state: 'CREATED', timestamp: '2024-07-10', user: 'admin' }] },
    gatewayEndpoint: '',
  },
  {
    id: '6',
    name: 'Real-time Chat WebSocket',
    version: 'v1.0.0',
    description: 'Bidirectional messaging for customer support and internal chat.',
    context: '/chat',
    provider: 'Comms Team',
    status: 'PUBLISHED',
    type: 'WEBSOCKET',
    visibility: 'RESTRICTED',
    tags: ['chat', 'real-time', 'messaging'],
    categories: ['Communications'],
    rating: 4.0,
    subscribers: 21,
    createdAt: '2024-04-12T11:30:00Z',
    updatedAt: '2024-07-12T15:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep5', gateway: 'Gateway-2', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-04-12', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-04-18', user: 'admin' }] },
    gatewayEndpoint: 'wss://gateway.veda.io/chat/v1.0.0',
  },
  {
    id: '7',
    name: 'Shipping Calculator',
    version: 'v1.5.0',
    description: 'Multi-carrier shipping rates, label generation, and tracking integration.',
    context: '/shipping',
    provider: 'Logistics Team',
    status: 'PUBLISHED',
    type: 'REST',
    visibility: 'PUBLIC',
    tags: ['shipping', 'logistics', 'carriers'],
    categories: ['Logistics'],
    rating: 4.3,
    subscribers: 67,
    createdAt: '2024-01-25T13:45:00Z',
    updatedAt: '2024-07-08T10:30:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep6', gateway: 'Gateway-1', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-01-25', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-01-28', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/shipping/v1.5.0',
  },
  {
    id: '8',
    name: 'Legacy SOAP Billing Service',
    version: 'v4.2.0',
    description: 'Enterprise billing service with SOAP protocol for legacy integrations.',
    context: '/billing/soap',
    provider: 'Finance Team',
    status: 'BLOCKED',
    type: 'SOAP',
    visibility: 'PRIVATE',
    tags: ['billing', 'soap', 'legacy'],
    categories: ['Financial Services'],
    rating: 2.5,
    subscribers: 5,
    createdAt: '2022-06-01T08:00:00Z',
    updatedAt: '2024-05-15T16:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep7', gateway: 'Gateway-1', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'BLOCKED', history: [{ state: 'CREATED', timestamp: '2022-06-01', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2022-06-10', user: 'admin' }, { state: 'BLOCKED', timestamp: '2024-05-15', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/billing/soap/v4.2.0',
  },
  {
    id: '9',
    name: 'gRPC Product Catalog',
    version: 'v1.0.0',
    description: 'High-performance product catalog service using gRPC with Protocol Buffers.',
    context: '/products',
    provider: 'Retail Team',
    status: 'PUBLISHED',
    type: 'GRPC',
    visibility: 'PUBLIC',
    tags: ['products', 'grpc', 'protobuf'],
    categories: ['Retail'],
    rating: 4.6,
    subscribers: 43,
    createdAt: '2024-05-20T10:00:00Z',
    updatedAt: '2024-07-05T14:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep8', gateway: 'Gateway-2', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-05-20', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-05-25', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/products/v1.0.0',
  },
  {
    id: '10',
    name: 'Analytics Events API',
    version: 'v1.0.0',
    description: 'Event ingestion and analytics data collection endpoint.',
    context: '/analytics/events',
    provider: 'Data Team',
    status: 'RETIRED',
    type: 'REST',
    visibility: 'PUBLIC',
    tags: ['analytics', 'events', 'data'],
    categories: ['Data & Analytics'],
    rating: 3.5,
    subscribers: 12,
    createdAt: '2023-08-15T09:30:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [],
    lifecycleState: { currentState: 'RETIRED', history: [{ state: 'CREATED', timestamp: '2023-08-15', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2023-08-20', user: 'admin' }, { state: 'RETIRED', timestamp: '2024-04-01', user: 'admin' }] },
    gatewayEndpoint: '',
  },
  {
    id: '11',
    name: 'Document Generation Service',
    version: 'v2.3.0',
    description: 'PDF generation, document templates, and digital signatures for enterprise workflows.',
    context: '/documents',
    provider: 'Platform Team',
    status: 'PUBLISHED',
    type: 'REST',
    visibility: 'PUBLIC',
    tags: ['documents', 'pdf', 'signatures'],
    categories: ['Productivity'],
    rating: 4.4,
    subscribers: 78,
    createdAt: '2024-02-28T10:00:00Z',
    updatedAt: '2024-07-22T16:30:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep9', gateway: 'Gateway-1', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-02-28', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-03-05', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/documents/v2.3.0',
  },
  {
    id: '12',
    name: 'Email Delivery Service',
    version: 'v1.1.0',
    description: 'Transactional email delivery with templates, tracking, and analytics.',
    context: '/email',
    provider: 'Comms Team',
    status: 'PUBLISHED',
    type: 'REST',
    visibility: 'RESTRICTED',
    tags: ['email', 'notifications', 'delivery'],
    categories: ['Communications'],
    rating: 4.1,
    subscribers: 31,
    createdAt: '2024-04-01T09:00:00Z',
    updatedAt: '2024-07-10T11:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep10', gateway: 'Gateway-2', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-04-01', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-04-05', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/email/v1.1.0',
  },
  {
    id: '13',
    name: 'Search & Discovery API',
    version: 'v3.0.0',
    description: 'Full-text search, faceted filtering, and recommendation engine.',
    context: '/search',
    provider: 'Data Team',
    status: 'CREATED',
    type: 'REST',
    visibility: 'PRIVATE',
    tags: ['search', 'discovery', 'recommendations'],
    categories: ['Data & Analytics'],
    rating: 0,
    subscribers: 0,
    createdAt: '2024-07-01T08:00:00Z',
    updatedAt: '2024-07-01T08:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [],
    lifecycleState: { currentState: 'CREATED', history: [{ state: 'CREATED', timestamp: '2024-07-01', user: 'admin' }] },
    gatewayEndpoint: '',
  },
  {
    id: '14',
    name: 'Video Streaming Gateway',
    version: 'v1.0.0',
    description: 'Adaptive bitrate streaming, video upload, and transcoding pipeline.',
    context: '/video',
    provider: 'Media Team',
    status: 'PUBLISHED',
    type: 'WEBSOCKET',
    visibility: 'PUBLIC',
    tags: ['video', 'streaming', 'media'],
    categories: ['Media'],
    rating: 4.7,
    subscribers: 95,
    createdAt: '2024-03-15T12:00:00Z',
    updatedAt: '2024-07-19T14:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep11', gateway: 'Gateway-3', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'PUBLISHED', history: [{ state: 'CREATED', timestamp: '2024-03-15', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2024-03-20', user: 'admin' }] },
    gatewayEndpoint: 'wss://gateway.veda.io/video/v1.0.0',
  },
  {
    id: '15',
    name: 'Currency Exchange Rates',
    version: 'v2.0.0',
    description: 'Real-time and historical foreign exchange rates for 150+ currencies.',
    context: '/fx-rates',
    provider: 'Finance Team',
    status: 'DEPRECATED',
    type: 'REST',
    visibility: 'PUBLIC',
    tags: ['fx', 'currency', 'finance', 'rates'],
    categories: ['Financial Services'],
    rating: 4.0,
    subscribers: 52,
    createdAt: '2023-10-01T08:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
    resources: [],
    documentation: [],
    subscriptions: [],
    deployments: [{ id: 'dep12', gateway: 'Gateway-1', status: 'DEPLOYED' }],
    lifecycleState: { currentState: 'DEPRECATED', history: [{ state: 'CREATED', timestamp: '2023-10-01', user: 'admin' }, { state: 'PUBLISHED', timestamp: '2023-10-10', user: 'admin' }, { state: 'DEPRECATED', timestamp: '2024-05-01', user: 'admin' }] },
    gatewayEndpoint: 'https://gateway.veda.io/fx-rates/v2.0.0',
  },
];

export const mockApplications: Application[] = [
  { id: '1', name: 'E-Commerce Mobile App', description: 'Native mobile shopping application', owner: 'John Doe', status: 'ACTIVE', productionKey: 'prod-key-abc123', sandboxKey: 'sandbox-key-abc123', tokenType: 'JWT', callbackUrl: 'https://mobile.app/callback', createdAt: '2024-01-10T08:00:00Z', updatedAt: '2024-07-20T10:00:00Z', quota: 100000, usedQuota: 45230 },
  { id: '2', name: 'Merchant Dashboard', description: 'Analytics dashboard for merchants', owner: 'Jane Smith', status: 'ACTIVE', productionKey: 'prod-key-def456', sandboxKey: 'sandbox-key-def456', tokenType: 'OAUTH', callbackUrl: 'https://dashboard.app/callback', createdAt: '2024-02-15T10:00:00Z', updatedAt: '2024-07-18T14:00:00Z', quota: 50000, usedQuota: 12340 },
  { id: '3', name: 'POS Integration', description: 'Point of sale system integration', owner: 'Bob Johnson', status: 'ACTIVE', productionKey: 'prod-key-ghi789', sandboxKey: 'sandbox-key-ghi789', tokenType: 'JWT', createdAt: '2024-03-01T09:00:00Z', updatedAt: '2024-07-15T11:00:00Z', quota: 200000, usedQuota: 156780 },
  { id: '4', name: 'Inventory Manager', description: 'Warehouse inventory tracking app', owner: 'Alice Brown', status: 'INACTIVE', productionKey: 'prod-key-jkl012', sandboxKey: 'sandbox-key-jkl012', tokenType: 'OAUTH', createdAt: '2024-04-10T12:00:00Z', updatedAt: '2024-06-30T16:00:00Z', quota: 30000, usedQuota: 8200 },
  { id: '5', name: 'Customer Support Portal', description: 'Support ticket management system', owner: 'Charlie Wilson', status: 'ACTIVE', productionKey: 'prod-key-mno345', sandboxKey: 'sandbox-key-mno345', tokenType: 'JWT', callbackUrl: 'https://support.app/callback', createdAt: '2024-05-20T07:00:00Z', updatedAt: '2024-07-19T09:00:00Z', quota: 75000, usedQuota: 34100 },
  { id: '6', name: 'Marketing Automation', description: 'Campaign management and analytics', owner: 'Diana Lee', status: 'ACTIVE', productionKey: 'prod-key-pqr678', sandboxKey: 'sandbox-key-pqr678', tokenType: 'OAUTH', createdAt: '2024-06-01T11:00:00Z', updatedAt: '2024-07-21T13:00:00Z', quota: 60000, usedQuota: 28700 },
  { id: '7', name: 'Shipping Partner API', description: 'Third-party logistics integration', owner: 'Eve Martinez', status: 'REJECTED', productionKey: 'prod-key-stu901', sandboxKey: 'sandbox-key-stu901', tokenType: 'JWT', createdAt: '2024-06-15T14:00:00Z', updatedAt: '2024-06-20T10:00:00Z', quota: 40000, usedQuota: 0 },
  { id: '8', name: 'Developer Sandbox', description: 'Testing environment for developers', owner: 'Frank Chen', status: 'ACTIVE', productionKey: 'prod-key-vwx234', sandboxKey: 'sandbox-key-vwx234', tokenType: 'JWT', callbackUrl: 'https://sandbox.dev/callback', createdAt: '2024-07-01T08:00:00Z', updatedAt: '2024-07-22T15:00:00Z', quota: 5000, usedQuota: 2100 },
];

export const mockSubscriptions: Subscription[] = [
  { id: '1', apiId: '1', apiName: 'Payment Processing API', apiVersion: 'v2.1.0', applicationId: '1', applicationName: 'E-Commerce Mobile App', tier: 'Gold', status: 'ACTIVE', subscribedAt: '2024-01-20T10:00:00Z', updatedAt: '2024-07-20T10:00:00Z' },
  { id: '2', apiId: '1', apiName: 'Payment Processing API', apiVersion: 'v2.1.0', applicationId: '3', applicationName: 'POS Integration', tier: 'Gold', status: 'ACTIVE', subscribedAt: '2024-03-05T09:00:00Z', updatedAt: '2024-07-18T11:00:00Z' },
  { id: '3', apiId: '2', apiName: 'User Management Service', apiVersion: 'v3.0.0', applicationId: '1', applicationName: 'E-Commerce Mobile App', tier: 'Silver', status: 'ACTIVE', subscribedAt: '2024-02-15T08:00:00Z', updatedAt: '2024-07-15T14:00:00Z' },
  { id: '4', apiId: '3', apiName: 'Inventory GraphQL', apiVersion: 'v1.2.0', applicationId: '4', applicationName: 'Inventory Manager', tier: 'Bronze', status: 'ACTIVE', subscribedAt: '2024-04-12T12:00:00Z', updatedAt: '2024-07-10T16:00:00Z' },
  { id: '5', apiId: '6', apiName: 'Real-time Chat WebSocket', apiVersion: 'v1.0.0', applicationId: '5', applicationName: 'Customer Support Portal', tier: 'Silver', status: 'ACTIVE', subscribedAt: '2024-05-22T10:00:00Z', updatedAt: '2024-07-12T09:00:00Z' },
  { id: '6', apiId: '7', apiName: 'Shipping Calculator', apiVersion: 'v1.5.0', applicationId: '6', applicationName: 'Marketing Automation', tier: 'Gold', status: 'ACTIVE', subscribedAt: '2024-06-10T11:00:00Z', updatedAt: '2024-07-08T10:00:00Z' },
  { id: '7', apiId: '9', apiName: 'gRPC Product Catalog', apiVersion: 'v1.0.0', applicationId: '1', applicationName: 'E-Commerce Mobile App', tier: 'Unlimited', status: 'ACTIVE', subscribedAt: '2024-05-25T14:00:00Z', updatedAt: '2024-07-05T15:00:00Z' },
  { id: '8', apiId: '2', apiName: 'User Management Service', apiVersion: 'v3.0.0', applicationId: '5', applicationName: 'Customer Support Portal', tier: 'Gold', status: 'BLOCKED', subscribedAt: '2024-06-01T09:00:00Z', updatedAt: '2024-07-01T00:00:00Z' },
  { id: '9', apiId: '11', apiName: 'Document Generation Service', apiVersion: 'v2.3.0', applicationId: '2', applicationName: 'Merchant Dashboard', tier: 'Silver', status: 'ACTIVE', subscribedAt: '2024-03-10T10:00:00Z', updatedAt: '2024-07-22T12:00:00Z' },
  { id: '10', apiId: '14', apiName: 'Video Streaming Gateway', apiVersion: 'v1.0.0', applicationId: '6', applicationName: 'Marketing Automation', tier: 'Gold', status: 'ACTIVE', subscribedAt: '2024-03-25T08:00:00Z', updatedAt: '2024-07-19T11:00:00Z' },
  { id: '11', apiId: '15', apiName: 'Currency Exchange Rates', apiVersion: 'v2.0.0', applicationId: '2', applicationName: 'Merchant Dashboard', tier: 'Bronze', status: 'ON_HOLD', subscribedAt: '2024-04-15T13:00:00Z', updatedAt: '2024-05-01T00:00:00Z' },
  { id: '12', apiId: '12', apiName: 'Email Delivery Service', apiVersion: 'v1.1.0', applicationId: '8', applicationName: 'Developer Sandbox', tier: 'Free', status: 'ACTIVE', subscribedAt: '2024-07-05T10:00:00Z', updatedAt: '2024-07-21T14:00:00Z' },
];

export const mockUsers: User[] = [
  { id: '1', username: 'admin', email: 'admin@vedadb.io', firstName: 'System', lastName: 'Administrator', role: 'admin', tenant: 'carbon.super', status: 'active', createdAt: '2023-01-01T00:00:00Z', lastLogin: '2024-07-22T08:00:00Z', permissions: ['all'] },
  { id: '2', username: 'john.doe', email: 'john@example.com', firstName: 'John', lastName: 'Doe', role: 'publisher', tenant: 'carbon.super', status: 'active', createdAt: '2024-01-10T10:00:00Z', lastLogin: '2024-07-21T16:00:00Z', permissions: ['api:create', 'api:publish', 'api:delete'] },
  { id: '3', username: 'jane.smith', email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', role: 'publisher', tenant: 'carbon.super', status: 'active', createdAt: '2024-02-15T09:00:00Z', lastLogin: '2024-07-20T12:00:00Z', permissions: ['api:create', 'api:publish'] },
  { id: '4', username: 'bob.wilson', email: 'bob@example.com', firstName: 'Bob', lastName: 'Wilson', role: 'subscriber', tenant: 'carbon.super', status: 'active', createdAt: '2024-03-01T08:00:00Z', lastLogin: '2024-07-19T10:00:00Z', permissions: ['api:subscribe', 'app:create'] },
  { id: '5', username: 'alice.chen', email: 'alice@example.com', firstName: 'Alice', lastName: 'Chen', role: 'subscriber', tenant: 'carbon.super', status: 'active', createdAt: '2024-03-20T11:00:00Z', lastLogin: '2024-07-22T09:00:00Z', permissions: ['api:subscribe', 'app:create'] },
  { id: '6', username: 'charlie.brown', email: 'charlie@example.com', firstName: 'Charlie', lastName: 'Brown', role: 'publisher', tenant: 'acme.corp', status: 'active', createdAt: '2024-04-10T07:00:00Z', lastLogin: '2024-07-18T14:00:00Z', permissions: ['api:create', 'api:publish'] },
  { id: '7', username: 'diana.prince', email: 'diana@example.com', firstName: 'Diana', lastName: 'Prince', role: 'subscriber', tenant: 'acme.corp', status: 'locked', createdAt: '2024-05-01T12:00:00Z', lastLogin: '2024-06-15T08:00:00Z', permissions: ['api:subscribe'] },
  { id: '8', username: 'eve.davis', email: 'eve@example.com', firstName: 'Eve', lastName: 'Davis', role: 'admin', tenant: 'tech.startup', status: 'active', createdAt: '2024-06-15T06:00:00Z', lastLogin: '2024-07-22T07:00:00Z', permissions: ['all'] },
  { id: '9', username: 'frank.miller', email: 'frank@example.com', firstName: 'Frank', lastName: 'Miller', role: 'subscriber', tenant: 'tech.startup', status: 'inactive', createdAt: '2024-06-20T10:00:00Z', lastLogin: '2024-06-25T11:00:00Z', permissions: ['api:subscribe'] },
  { id: '10', username: 'grace.lee', email: 'grace@example.com', firstName: 'Grace', lastName: 'Lee', role: 'publisher', tenant: 'enterprise.io', status: 'active', createdAt: '2024-07-01T09:00:00Z', lastLogin: '2024-07-21T15:00:00Z', permissions: ['api:create', 'api:publish', 'api:delete'] },
];

export const mockTenants: Tenant[] = [
  { id: '1', domain: 'carbon.super', name: 'Super Tenant', description: 'Default super tenant with full platform access', status: 'ACTIVE', owner: 'admin@vedadb.io', plan: 'ENTERPRISE', quota: { maxApis: 1000, maxUsers: 500, maxApplications: 200, maxRequestsPerDay: 10000000 }, createdAt: '2023-01-01T00:00:00Z', expiresAt: '2025-12-31T23:59:59Z', usage: { apis: 156, users: 342, applications: 89, requestsToday: 2847500 } },
  { id: '2', domain: 'acme.corp', name: 'Acme Corporation', description: 'Enterprise manufacturing solutions', status: 'ACTIVE', owner: 'charlie@example.com', plan: 'ENTERPRISE', quota: { maxApis: 500, maxUsers: 200, maxApplications: 100, maxRequestsPerDay: 5000000 }, createdAt: '2024-02-01T00:00:00Z', expiresAt: '2025-02-01T00:00:00Z', usage: { apis: 67, users: 89, applications: 34, requestsToday: 1250000 } },
  { id: '3', domain: 'tech.startup', name: 'TechStartup Inc', description: 'Early stage tech startup', status: 'ACTIVE', owner: 'eve@example.com', plan: 'PROFESSIONAL', quota: { maxApis: 100, maxUsers: 50, maxApplications: 25, maxRequestsPerDay: 500000 }, createdAt: '2024-04-15T00:00:00Z', expiresAt: '2024-10-15T00:00:00Z', usage: { apis: 23, users: 31, applications: 12, requestsToday: 189500 } },
  { id: '4', domain: 'dev.shop', name: 'Dev Shop', description: 'Small development agency', status: 'ACTIVE', owner: 'hank@dev.shop', plan: 'FREE', quota: { maxApis: 20, maxUsers: 10, maxApplications: 5, maxRequestsPerDay: 50000 }, createdAt: '2024-06-01T00:00:00Z', expiresAt: '2025-06-01T00:00:00Z', usage: { apis: 8, users: 5, applications: 3, requestsToday: 12400 } },
  { id: '5', domain: 'megacorp.global', name: 'MegaCorp Global', description: 'Multinational enterprise', status: 'INACTIVE', owner: 'irene@megacorp.global', plan: 'ENTERPRISE', quota: { maxApis: 1000, maxUsers: 1000, maxApplications: 500, maxRequestsPerDay: 50000000 }, createdAt: '2024-01-15T00:00:00Z', expiresAt: '2024-07-15T00:00:00Z', usage: { apis: 0, users: 0, applications: 0, requestsToday: 0 } },
];

export const mockThrottlingPolicies: ThrottlingPolicy[] = [
  { id: '1', name: 'Bronze', displayName: 'Bronze Tier', description: 'Basic rate limiting for trial users', type: 'subscription', defaultLimit: { requestCount: 1000, unitTime: 1, timeUnit: 'MIN' }, burstLimit: 50, stopOnQuotaReach: true, billingPlan: 'FREE', customAttributes: [], isDeployed: true },
  { id: '2', name: 'Silver', displayName: 'Silver Tier', description: 'Standard rate limiting for regular subscribers', type: 'subscription', defaultLimit: { requestCount: 5000, unitTime: 1, timeUnit: 'MIN' }, burstLimit: 200, stopOnQuotaReach: true, billingPlan: 'FREE', customAttributes: [], isDeployed: true },
  { id: '3', name: 'Gold', displayName: 'Gold Tier', description: 'Premium rate limiting for high-volume users', type: 'subscription', defaultLimit: { requestCount: 20000, unitTime: 1, timeUnit: 'MIN' }, burstLimit: 1000, stopOnQuotaReach: false, billingPlan: 'COMMERCIAL', customAttributes: [], isDeployed: true },
  { id: '4', name: 'Unlimited', displayName: 'Unlimited Tier', description: 'No rate limiting for enterprise customers', type: 'subscription', defaultLimit: { requestCount: 999999, unitTime: 1, timeUnit: 'MIN' }, burstLimit: 10000, stopOnQuotaReach: false, billingPlan: 'COMMERCIAL', customAttributes: [], isDeployed: true },
  { id: '5', name: 'App_Basic', displayName: 'Basic Application', description: 'Basic application-level throttling', type: 'application', defaultLimit: { requestCount: 10000, unitTime: 1, timeUnit: 'HOUR' }, burstLimit: 100, stopOnQuotaReach: true, billingPlan: 'FREE', customAttributes: [], isDeployed: true },
  { id: '6', name: 'App_Premium', displayName: 'Premium Application', description: 'Premium application-level throttling', type: 'application', defaultLimit: { requestCount: 100000, unitTime: 1, timeUnit: 'HOUR' }, burstLimit: 500, stopOnQuotaReach: false, billingPlan: 'COMMERCIAL', customAttributes: [], isDeployed: true },
  { id: '7', name: 'API_Default', displayName: 'Default API Policy', description: 'Default API-level throttling policy', type: 'api', defaultLimit: { requestCount: 50000, unitTime: 1, timeUnit: 'MIN' }, burstLimit: 500, rateLimitCount: 100000, rateLimitTimeUnit: 'HOUR', stopOnQuotaReach: false, billingPlan: 'FREE', customAttributes: [], isDeployed: true },
  { id: '8', name: 'API_Strict', displayName: 'Strict API Policy', description: 'Strict rate limiting for sensitive APIs', type: 'api', defaultLimit: { requestCount: 5000, unitTime: 1, timeUnit: 'MIN' }, burstLimit: 100, rateLimitCount: 10000, rateLimitTimeUnit: 'HOUR', stopOnQuotaReach: true, billingPlan: 'FREE', customAttributes: [], isDeployed: true },
];

export const mockAuditLogs: AuditLog[] = [
  { id: '1', timestamp: '2024-07-22T08:00:00Z', severity: 'INFO', action: 'USER_LOGIN', user: 'admin', resource: 'Authentication', resourceType: 'auth', details: 'Successful login from 192.168.1.1', ipAddress: '192.168.1.1', status: 'SUCCESS' },
  { id: '2', timestamp: '2024-07-22T08:05:00Z', severity: 'INFO', action: 'API_CREATED', user: 'john.doe', resource: 'Order Service', resourceType: 'api', details: 'Created new REST API: Order Service v2.0.0', ipAddress: '192.168.1.45', status: 'SUCCESS' },
  { id: '3', timestamp: '2024-07-22T08:15:00Z', severity: 'WARNING', action: 'API_DEPRECATED', user: 'jane.smith', resource: 'Currency Exchange Rates', resourceType: 'api', details: 'API Currency Exchange Rates marked as deprecated', ipAddress: '192.168.1.62', status: 'SUCCESS' },
  { id: '4', timestamp: '2024-07-22T08:30:00Z', severity: 'ERROR', action: 'DEPLOYMENT_FAILED', user: 'system', resource: 'Search & Discovery API', resourceType: 'deployment', details: 'Deployment failed: Gateway timeout after 30s', ipAddress: '10.0.0.5', status: 'FAILED' },
  { id: '5', timestamp: '2024-07-22T09:00:00Z', severity: 'INFO', action: 'SUBSCRIPTION_CREATED', user: 'bob.wilson', resource: 'Payment Processing API', resourceType: 'subscription', details: 'New Gold tier subscription for E-Commerce Mobile App', ipAddress: '192.168.1.78', status: 'SUCCESS' },
  { id: '6', timestamp: '2024-07-22T09:15:00Z', severity: 'CRITICAL', action: 'API_BLOCKED', user: 'admin', resource: 'Legacy SOAP Billing Service', resourceType: 'api', details: 'API blocked due to security vulnerability CVE-2024-1234', ipAddress: '192.168.1.1', status: 'SUCCESS' },
  { id: '7', timestamp: '2024-07-22T09:30:00Z', severity: 'INFO', action: 'USER_CREATED', user: 'admin', resource: 'grace.lee', resourceType: 'user', details: 'New publisher user created for enterprise.io tenant', ipAddress: '192.168.1.1', status: 'SUCCESS' },
  { id: '8', timestamp: '2024-07-22T10:00:00Z', severity: 'WARNING', action: 'RATE_LIMIT_EXCEEDED', user: 'system', resource: 'Inventory GraphQL', resourceType: 'throttle', details: 'Application POS Integration exceeded Bronze tier limit', ipAddress: '10.0.0.12', status: 'FAILED' },
  { id: '9', timestamp: '2024-07-22T10:30:00Z', severity: 'INFO', action: 'API_PUBLISHED', user: 'john.doe', resource: 'Document Generation Service', resourceType: 'api', details: 'API published to Developer Portal', ipAddress: '192.168.1.45', status: 'SUCCESS' },
  { id: '10', timestamp: '2024-07-22T11:00:00Z', severity: 'INFO', action: 'TENANT_UPDATED', user: 'admin', resource: 'acme.corp', resourceType: 'tenant', details: 'Tenant plan upgraded to ENTERPRISE', ipAddress: '192.168.1.1', status: 'SUCCESS' },
  { id: '11', timestamp: '2024-07-22T11:15:00Z', severity: 'ERROR', action: 'WEBHOOK_DELIVERY_FAILED', user: 'system', resource: 'Payment Notifications', resourceType: 'webhook', details: 'Webhook delivery failed after 3 retries: Connection refused', ipAddress: '10.0.0.8', status: 'FAILED' },
  { id: '12', timestamp: '2024-07-22T11:30:00Z', severity: 'INFO', action: 'POLICY_CREATED', user: 'admin', resource: 'API_Strict', resourceType: 'policy', details: 'New strict throttling policy created for financial APIs', ipAddress: '192.168.1.1', status: 'SUCCESS' },
  { id: '13', timestamp: '2024-07-22T12:00:00Z', severity: 'WARNING', action: 'CERT_EXPIRING', user: 'system', resource: 'gateway.veda.io', resourceType: 'gateway', details: 'SSL certificate expires in 15 days', ipAddress: '10.0.0.1', status: 'SUCCESS' },
  { id: '14', timestamp: '2024-07-22T12:30:00Z', severity: 'INFO', action: 'APPLICATION_UPDATED', user: 'alice.chen', resource: 'Inventory Manager', resourceType: 'application', details: 'Callback URL updated', ipAddress: '192.168.1.92', status: 'SUCCESS' },
  { id: '15', timestamp: '2024-07-22T13:00:00Z', severity: 'CRITICAL', action: 'SECURITY_ALERT', user: 'system', resource: 'Authentication Service', resourceType: 'security', details: 'Multiple failed login attempts detected from IP 45.22.11.8', ipAddress: '45.22.11.8', status: 'FAILED' },
  { id: '16', timestamp: '2024-07-22T13:15:00Z', severity: 'INFO', action: 'GATEWAY_HEALTH_CHECK', user: 'system', resource: 'Gateway-1', resourceType: 'gateway', details: 'Gateway health check passed - all services operational', ipAddress: '10.0.0.2', status: 'SUCCESS' },
  { id: '17', timestamp: '2024-07-22T13:30:00Z', severity: 'INFO', action: 'API_IMPORTED', user: 'jane.smith', resource: 'OpenAPI Spec', resourceType: 'api', details: 'Imported OpenAPI 3.0 specification for Shipping Calculator', ipAddress: '192.168.1.62', status: 'SUCCESS' },
  { id: '18', timestamp: '2024-07-22T14:00:00Z', severity: 'WARNING', action: 'QUOTA_WARNING', user: 'system', resource: 'E-Commerce Mobile App', resourceType: 'quota', details: 'Application has used 85% of monthly quota', ipAddress: '10.0.0.15', status: 'SUCCESS' },
  { id: '19', timestamp: '2024-07-22T14:30:00Z', severity: 'INFO', action: 'SETTINGS_UPDATED', user: 'admin', resource: 'Email Configuration', resourceType: 'settings', details: 'SMTP server settings updated', ipAddress: '192.168.1.1', status: 'SUCCESS' },
  { id: '20', timestamp: '2024-07-22T15:00:00Z', severity: 'ERROR', action: 'DATABASE_BACKUP_FAILED', user: 'system', resource: 'analytics_db', resourceType: 'database', details: 'Automated backup failed: insufficient disk space', ipAddress: '10.0.0.3', status: 'FAILED' },
  { id: '21', timestamp: '2024-07-22T15:15:00Z', severity: 'INFO', action: 'USER_ROLE_CHANGED', user: 'admin', resource: 'bob.wilson', resourceType: 'user', details: 'Role updated from subscriber to publisher', ipAddress: '192.168.1.1', status: 'SUCCESS' },
  { id: '22', timestamp: '2024-07-22T15:30:00Z', severity: 'INFO', action: 'API_SUBSCRIBED', user: 'alice.chen', resource: 'Email Delivery Service', resourceType: 'subscription', details: 'Subscribed Developer Sandbox to Email Delivery Service', ipAddress: '192.168.1.92', status: 'SUCCESS' },
  { id: '23', timestamp: '2024-07-22T16:00:00Z', severity: 'WARNING', action: 'GATEWAY_SLOW_RESPONSE', user: 'system', resource: 'Gateway-2', resourceType: 'gateway', details: 'Average response time exceeds 500ms threshold', ipAddress: '10.0.0.6', status: 'SUCCESS' },
  { id: '24', timestamp: '2024-07-22T16:30:00Z', severity: 'INFO', action: 'LIFECYCLE_CHANGED', user: 'john.doe', resource: 'Analytics Events API', resourceType: 'api', details: 'Lifecycle state changed from PUBLISHED to RETIRED', ipAddress: '192.168.1.45', status: 'SUCCESS' },
  { id: '25', timestamp: '2024-07-22T17:00:00Z', severity: 'INFO', action: 'REPORT_GENERATED', user: 'admin', resource: 'Monthly Usage Report', resourceType: 'report', details: 'July 2024 usage report generated and emailed', ipAddress: '192.168.1.1', status: 'SUCCESS' },
];

export const mockWebhooks: Webhook[] = [
  { id: '1', name: 'Payment Notifications', endpointUrl: 'https://hooks.example.com/payments', eventTypes: ['payment.success', 'payment.failed', 'payment.refunded'], status: 'ACTIVE', headers: { 'Authorization': 'Bearer wh-pay-123', 'Content-Type': 'application/json' }, retryPolicy: { maxRetries: 3, retryInterval: 30, backoffMultiplier: 2 }, createdAt: '2024-01-15T10:00:00Z', lastDeliveredAt: '2024-07-22T12:00:00Z', lastStatus: 'SUCCESS', failureCount: 0 },
  { id: '2', name: 'User Signup Events', endpointUrl: 'https://hooks.example.com/users', eventTypes: ['user.created', 'user.updated', 'user.deleted'], status: 'ACTIVE', headers: { 'Authorization': 'Bearer wh-user-456', 'X-Webhook-Secret': 'secret789' }, retryPolicy: { maxRetries: 5, retryInterval: 60, backoffMultiplier: 2 }, createdAt: '2024-02-20T08:00:00Z', lastDeliveredAt: '2024-07-22T11:00:00Z', lastStatus: 'SUCCESS', failureCount: 2 },
  { id: '3', name: 'Order Status Updates', endpointUrl: 'https://hooks.example.com/orders', eventTypes: ['order.created', 'order.shipped', 'order.delivered'], status: 'FAILED', headers: { 'Authorization': 'Bearer wh-order-789' }, retryPolicy: { maxRetries: 3, retryInterval: 30, backoffMultiplier: 1.5 }, createdAt: '2024-03-10T14:00:00Z', lastDeliveredAt: '2024-07-20T09:00:00Z', lastStatus: 'FAILED', failureCount: 12 },
  { id: '4', name: 'API Analytics Export', endpointUrl: 'https://hooks.example.com/analytics', eventTypes: ['api.invoked', 'quota.exceeded', 'rate.limit.hit'], status: 'ACTIVE', headers: { 'Authorization': 'Bearer wh-analytics-012', 'Content-Type': 'application/json' }, retryPolicy: { maxRetries: 2, retryInterval: 15, backoffMultiplier: 2 }, createdAt: '2024-04-05T11:00:00Z', lastDeliveredAt: '2024-07-22T10:00:00Z', lastStatus: 'SUCCESS', failureCount: 1 },
  { id: '5', name: 'Security Alerts', endpointUrl: 'https://hooks.example.com/security', eventTypes: ['security.alert', 'login.failed', 'token.revoked'], status: 'ACTIVE', headers: { 'Authorization': 'Bearer wh-sec-345', 'X-Priority': 'high' }, retryPolicy: { maxRetries: 5, retryInterval: 10, backoffMultiplier: 3 }, createdAt: '2024-05-15T09:00:00Z', lastDeliveredAt: '2024-07-22T08:30:00Z', lastStatus: 'SUCCESS', failureCount: 0 },
];

export const mockGateways: Gateway[] = [
  { id: '1', name: 'Production Gateway - US East', label: 'Gateway-1', type: 'SYNAPSE', description: 'Primary production gateway serving US East traffic', status: 'ACTIVE', endpoints: { http: 'http://gateway-us-east.veda.io:8280', https: 'https://gateway-us-east.veda.io:8243' }, protocol: 'HTTPS', virtualHosts: ['api.veda.io', 'gateway.veda.io'], createdAt: '2023-06-01T00:00:00Z', lastHealthCheck: '2024-07-22T17:00:00Z', healthStatus: 'HEALTHY' },
  { id: '2', name: 'Production Gateway - EU West', label: 'Gateway-2', type: 'SYNAPSE', description: 'European production gateway for GDPR compliance', status: 'ACTIVE', endpoints: { http: 'http://gateway-eu-west.veda.io:8280', https: 'https://gateway-eu-west.veda.io:8243' }, protocol: 'HTTPS', virtualHosts: ['api-eu.veda.io', 'gateway-eu.veda.io'], createdAt: '2023-09-15T00:00:00Z', lastHealthCheck: '2024-07-22T16:55:00Z', healthStatus: 'HEALTHY' },
  { id: '3', name: 'Staging Gateway', label: 'Gateway-3', type: 'CC', description: 'Choreo Connect staging environment for testing', status: 'ACTIVE', endpoints: { http: 'http://gateway-staging.veda.io:8280', https: 'https://gateway-staging.veda.io:8243' }, protocol: 'WSS', virtualHosts: ['api-staging.veda.io'], createdAt: '2024-01-10T00:00:00Z', lastHealthCheck: '2024-07-22T16:50:00Z', healthStatus: 'HEALTHY' },
];

export const mockAnalyticsData: AnalyticsDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date('2024-06-22');
  date.setDate(date.getDate() + i);
  const baseRequests = 80000 + Math.sin(i / 5) * 20000;
  return {
    date: date.toISOString().split('T')[0],
    totalRequests: Math.floor(baseRequests + Math.random() * 30000),
    successfulRequests: Math.floor(baseRequests * 0.92 + Math.random() * 10000),
    failedRequests: Math.floor(baseRequests * 0.05 + Math.random() * 5000),
    avgLatency: Math.floor(45 + Math.sin(i / 3) * 20 + Math.random() * 30),
    uniqueUsers: Math.floor(1200 + Math.sin(i / 7) * 400 + Math.random() * 200),
    newSubscriptions: Math.floor(10 + Math.random() * 25),
  };
});

// ===== Helper functions =====

export function getAPIById(id: string): API | undefined {
  return mockAPIs.find((api) => api.id === id);
}

export function getSubscriptionsByApiId(apiId: string): Subscription[] {
  return mockSubscriptions.filter((sub) => sub.apiId === apiId);
}

export function getApplicationsByOwner(owner: string): Application[] {
  return mockApplications.filter((app) => app.owner === owner);
}

export function getRecentAuditLogs(count: number = 10): AuditLog[] {
  return [...mockAuditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, count);
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) return `${Math.floor(diffDay / 30)} months ago`;
  if (diffDay > 0) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHour > 0) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffMin > 0) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return 'Just now';
}

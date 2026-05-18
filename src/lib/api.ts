// VedaDB API Manager - API Client
// Auto-detects backend availability, falls back to in-memory mock database

// API client - in-memory mock database for demo (no backend required)

// ===== IN-MEMORY MOCK DATABASE =====
let MOCK_APIS: any[] = JSON.parse(localStorage.getItem('mock_apis') || 'null') || [
  { id: 'api-1', name: 'User Management API', context: '/api/v1/users', version: '1.0.0', endpoint: 'http://user-service:8080', authType: 'oauth2', status: 'PUBLISHED', provider: 'Platform Team', description: 'CRUD operations for users', tags: ['REST','User'], rating: 4.5, ratingCount: 12, visibility: 'public', throttlePolicy: 'Gold', createdAt: '2025-01-15T10:00:00Z' },
  { id: 'api-2', name: 'Product Catalog API', context: '/api/v1/products', version: '1.0.0', endpoint: 'http://product-service:8080', authType: 'oauth2', status: 'PUBLISHED', provider: 'Commerce Team', description: 'Product catalog with search and filters', tags: ['REST','Product'], rating: 4.2, ratingCount: 8, visibility: 'public', throttlePolicy: 'Silver', createdAt: '2025-01-20T10:00:00Z' },
  { id: 'api-3', name: 'Order Processing API', context: '/api/v1/orders', version: '1.0.0', endpoint: 'http://order-service:8080', authType: 'oauth2', status: 'PUBLISHED', provider: 'Commerce Team', description: 'Order lifecycle management', tags: ['REST','Order'], rating: 4.8, ratingCount: 15, visibility: 'public', throttlePolicy: 'Gold', createdAt: '2025-01-25T10:00:00Z' },
  { id: 'api-4', name: 'Payment Gateway API', context: '/api/v1/payments', version: '1.0.0', endpoint: 'http://payment-service:8080', authType: 'apikey', status: 'PUBLISHED', provider: 'Finance Team', description: 'Payment processing and refunds', tags: ['REST','Payment'], rating: 4.7, ratingCount: 20, visibility: 'public', throttlePolicy: 'Gold', createdAt: '2025-02-01T10:00:00Z' },
  { id: 'api-5', name: 'Inventory API', context: '/api/v1/inventory', version: '1.0.0', endpoint: 'http://inventory-service:8080', authType: 'oauth2', status: 'PUBLISHED', provider: 'Warehouse Team', description: 'Real-time inventory tracking', tags: ['REST','Inventory'], rating: 3.9, ratingCount: 6, visibility: 'public', throttlePolicy: 'Silver', createdAt: '2025-02-05T10:00:00Z' },
  { id: 'api-6', name: 'Shipping API', context: '/api/v1/shipping', version: '1.0.0', endpoint: 'http://shipping-service:8080', authType: 'oauth2', status: 'CREATED', provider: 'Logistics Team', description: 'Shipping label generation and tracking', tags: ['REST','Shipping'], rating: 0, ratingCount: 0, visibility: 'public', throttlePolicy: 'Bronze', createdAt: '2025-03-01T10:00:00Z' },
  { id: 'api-7', name: 'Notification API', context: '/api/v1/notifications', version: '1.0.0', endpoint: 'http://notification-service:8080', authType: 'apikey', status: 'PUBLISHED', provider: 'Platform Team', description: 'Email, SMS, push notifications', tags: ['REST','Notification'], rating: 4.0, ratingCount: 9, visibility: 'public', throttlePolicy: 'Silver', createdAt: '2025-02-10T10:00:00Z' },
  { id: 'api-8', name: 'Analytics API', context: '/api/v1/analytics', version: '1.0.0', endpoint: 'http://analytics-service:8080', authType: 'oauth2', status: 'PUBLISHED', provider: 'Data Team', description: 'Event tracking and analytics', tags: ['REST','Analytics'], rating: 4.3, ratingCount: 11, visibility: 'public', throttlePolicy: 'Silver', createdAt: '2025-02-15T10:00:00Z' },
  { id: 'api-9', name: 'Authentication API', context: '/api/v1/auth', version: '1.0.0', endpoint: 'http://auth-service:8080', authType: 'apikey', status: 'PUBLISHED', provider: 'Security Team', description: 'OAuth2, JWT, API key management', tags: ['REST','Auth'], rating: 4.9, ratingCount: 25, visibility: 'public', throttlePolicy: 'Unlimited', createdAt: '2025-01-10T10:00:00Z' },
  { id: 'api-10', name: 'Search API', context: '/api/v1/search', version: '1.0.0', endpoint: 'http://search-service:8080', authType: 'oauth2', status: 'DEPRECATED', provider: 'Search Team', description: 'Full-text search with Elasticsearch', tags: ['REST','Search'], rating: 4.1, ratingCount: 7, visibility: 'public', throttlePolicy: 'Bronze', createdAt: '2025-01-05T10:00:00Z' },
];

let MOCK_APPS: any[] = JSON.parse(localStorage.getItem('mock_apps') || 'null') || [
  { id: 'app-1', name: 'Mobile App', description: 'iOS and Android mobile application', ownerId: 'user-2', tier: 'Gold', status: 'active', consumerKey: 'ck-mobile-abc123', sandboxKey: 'sk-mobile-xyz789', subscriptions: 5, createdAt: '2025-01-15T10:00:00Z' },
  { id: 'app-2', name: 'Web Store', description: 'E-commerce web frontend', ownerId: 'user-2', tier: 'Silver', status: 'active', consumerKey: 'ck-webstore-def456', sandboxKey: 'sk-webstore-uvw012', subscriptions: 4, createdAt: '2025-02-01T10:00:00Z' },
  { id: 'app-3', name: 'Partner Integration', description: 'B2B partner API integration', ownerId: 'user-3', tier: 'Gold', status: 'active', consumerKey: 'ck-partner-ghi789', sandboxKey: 'sk-partner-rst345', subscriptions: 3, createdAt: '2025-02-10T10:00:00Z' },
  { id: 'app-4', name: 'Internal Dashboard', description: 'Internal analytics dashboard', ownerId: 'user-1', tier: 'Unlimited', status: 'active', consumerKey: 'ck-internal-jkl012', sandboxKey: 'sk-internal-opq678', subscriptions: 8, createdAt: '2025-01-20T10:00:00Z' },
  { id: 'app-5', name: 'Third-party CRM', description: 'CRM system integration', ownerId: 'user-4', tier: 'Bronze', status: 'active', consumerKey: 'ck-crm-mno345', sandboxKey: 'sk-crm-lmn901', subscriptions: 2, createdAt: '2025-03-01T10:00:00Z' },
];

let MOCK_SUBS: any[] = JSON.parse(localStorage.getItem('mock_subs') || 'null') || [
  { id: 'sub-1', apiId: 'api-1', appId: 'app-1', apiName: 'User Management API', appName: 'Mobile App', tier: 'Gold', status: 'ACTIVE', createdAt: '2025-02-01T10:00:00Z' },
  { id: 'sub-2', apiId: 'api-2', appId: 'app-1', apiName: 'Product Catalog API', appName: 'Mobile App', tier: 'Gold', status: 'ACTIVE', createdAt: '2025-02-01T10:00:00Z' },
  { id: 'sub-3', apiId: 'api-3', appId: 'app-2', apiName: 'Order Processing API', appName: 'Web Store', tier: 'Silver', status: 'ACTIVE', createdAt: '2025-02-05T10:00:00Z' },
  { id: 'sub-4', apiId: 'api-4', appId: 'app-2', apiName: 'Payment Gateway API', appName: 'Web Store', tier: 'Gold', status: 'ACTIVE', createdAt: '2025-02-05T10:00:00Z' },
  { id: 'sub-5', apiId: 'api-1', appId: 'app-3', apiName: 'User Management API', appName: 'Partner Integration', tier: 'Gold', status: 'ACTIVE', createdAt: '2025-02-15T10:00:00Z' },
  { id: 'sub-6', apiId: 'api-7', appId: 'app-4', apiName: 'Notification API', appName: 'Internal Dashboard', tier: 'Unlimited', status: 'ACTIVE', createdAt: '2025-01-25T10:00:00Z' },
  { id: 'sub-7', apiId: 'api-8', appId: 'app-4', apiName: 'Analytics API', appName: 'Internal Dashboard', tier: 'Unlimited', status: 'ACTIVE', createdAt: '2025-01-25T10:00:00Z' },
  { id: 'sub-8', apiId: 'api-9', appId: 'app-1', apiName: 'Authentication API', appName: 'Mobile App', tier: 'Gold', status: 'ACTIVE', createdAt: '2025-02-01T10:00:00Z' },
  { id: 'sub-9', apiId: 'api-5', appId: 'app-3', apiName: 'Inventory API', appName: 'Partner Integration', tier: 'Silver', status: 'ACTIVE', createdAt: '2025-02-15T10:00:00Z' },
  { id: 'sub-10', apiId: 'api-4', appId: 'app-5', apiName: 'Payment Gateway API', appName: 'Third-party CRM', tier: 'Bronze', status: 'ACTIVE', createdAt: '2025-03-05T10:00:00Z' },
  { id: 'sub-11', apiId: 'api-2', appId: 'app-4', apiName: 'Product Catalog API', appName: 'Internal Dashboard', tier: 'Unlimited', status: 'ACTIVE', createdAt: '2025-01-25T10:00:00Z' },
  { id: 'sub-12', apiId: 'api-3', appId: 'app-3', apiName: 'Order Processing API', appName: 'Partner Integration', tier: 'Gold', status: 'ACTIVE', createdAt: '2025-02-15T10:00:00Z' },
  { id: 'sub-13', apiId: 'api-9', appId: 'app-4', apiName: 'Authentication API', appName: 'Internal Dashboard', tier: 'Unlimited', status: 'ACTIVE', createdAt: '2025-01-25T10:00:00Z' },
  { id: 'sub-14', apiId: 'api-1', appId: 'app-2', apiName: 'User Management API', appName: 'Web Store', tier: 'Silver', status: 'ACTIVE', createdAt: '2025-02-05T10:00:00Z' },
  { id: 'sub-15', apiId: 'api-7', appId: 'app-2', apiName: 'Notification API', appName: 'Web Store', tier: 'Silver', status: 'ACTIVE', createdAt: '2025-02-05T10:00:00Z' },
];

const MOCK_USERS = [
  { id: 'user-1', username: 'admin', email: 'admin@vedadb.io', role: 'super_admin', status: 'active', tenantId: 'tenant-1', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'user-2', username: 'john_dev', email: 'john@company.com', role: 'publisher', status: 'active', tenantId: 'tenant-1', createdAt: '2025-01-10T00:00:00Z' },
  { id: 'user-3', username: 'sarah_pm', email: 'sarah@company.com', role: 'publisher', status: 'active', tenantId: 'tenant-1', createdAt: '2025-01-15T00:00:00Z' },
  { id: 'user-4', username: 'mike_api', email: 'mike@partner.com', role: 'subscriber', status: 'active', tenantId: 'tenant-1', createdAt: '2025-02-01T00:00:00Z' },
  { id: 'user-5', username: 'lisa_dev', email: 'lisa@company.com', role: 'subscriber', status: 'active', tenantId: 'tenant-1', createdAt: '2025-02-10T00:00:00Z' },
  { id: 'user-6', username: 'tom_ops', email: 'tom@company.com', role: 'admin', status: 'active', tenantId: 'tenant-1', createdAt: '2025-02-15T00:00:00Z' },
  { id: 'user-7', username: 'anna_viewer', email: 'anna@company.com', role: 'subscriber', status: 'inactive', tenantId: 'tenant-1', createdAt: '2025-03-01T00:00:00Z' },
  { id: 'user-8', username: 'vikram_api', email: 'vikram@partner.com', role: 'publisher', status: 'active', tenantId: 'tenant-1', createdAt: '2025-03-05T00:00:00Z' },
];

let MOCK_POLICIES: any[] = JSON.parse(localStorage.getItem('mock_policies') || 'null') || [
  { id: 'pol-1', name: 'Bronze', type: 'API', rate: 100, burst: 150, unit: 'per_minute' },
  { id: 'pol-2', name: 'Silver', type: 'API', rate: 1000, burst: 1500, unit: 'per_minute' },
  { id: 'pol-3', name: 'Gold', type: 'API', rate: 10000, burst: 15000, unit: 'per_minute' },
  { id: 'pol-4', name: 'Unlimited', type: 'API', rate: 100000, burst: 200000, unit: 'per_minute' },
  { id: 'pol-5', name: 'Basic App', type: 'Application', rate: 500, burst: 750, unit: 'per_hour' },
  { id: 'pol-6', name: 'Pro App', type: 'Application', rate: 5000, burst: 7500, unit: 'per_hour' },
  { id: 'pol-7', name: 'Enterprise', type: 'Subscription', rate: 50000, burst: 100000, unit: 'per_hour' },
  { id: 'pol-8', name: 'Burst Protection', type: 'API', rate: 1000, burst: 2000, unit: 'per_second' },
];

function generateAnalytics() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 50000) + 30000,
      errors: Math.floor(Math.random() * 500) + 50,
      latency: Math.floor(Math.random() * 80) + 20,
    });
  }
  return data;
}

function saveAll() {
  localStorage.setItem('mock_apis', JSON.stringify(MOCK_APIS));
  localStorage.setItem('mock_apps', JSON.stringify(MOCK_APPS));
  localStorage.setItem('mock_subs', JSON.stringify(MOCK_SUBS));
  localStorage.setItem('mock_policies', JSON.stringify(MOCK_POLICIES));
}

// ===== API CLIENT =====
class APIMClient {
  private token: string;
  
  constructor() {
    this.token = localStorage.getItem('token') || '';
  }
  
  async login(username: string, password: string) {
    // Always use mock for login (backend may not be running)
    const user = MOCK_USERS.find(u => u.username === username);
    if (!user) throw new Error('Invalid username or password');
    if (username === 'admin' && password === 'admin') {
      const data = { token: 'mock-jwt-' + Date.now(), user };
      this.token = data.token;
      localStorage.setItem('token', this.token);
      localStorage.setItem('use_mock', 'true');
      return data;
    }
    throw new Error('Invalid username or password');
  }
  
  async getAPIs() {
    return { apis: [...MOCK_APIS], total: MOCK_APIS.length };
  }
  async createAPI(data: any) {
    const newAPI = { ...data, id: 'api-' + Date.now(), createdAt: new Date().toISOString(), rating: 0, ratingCount: 0 };
    MOCK_APIS.push(newAPI);
    saveAll();
    return newAPI;
  }
  async updateAPI(id: string, data: any) {
    const idx = MOCK_APIS.findIndex((a: any) => a.id === id);
    if (idx === -1) throw new Error('API not found');
    MOCK_APIS[idx] = { ...MOCK_APIS[idx], ...data, updatedAt: new Date().toISOString() };
    saveAll();
    return MOCK_APIS[idx];
  }
  async deleteAPI(id: string) {
    MOCK_APIS = MOCK_APIS.filter((a: any) => a.id !== id);
    MOCK_SUBS = MOCK_SUBS.filter((s: any) => s.apiId !== id);
    saveAll();
    return { success: true };
  }
  async publishAPI(id: string) {
    const idx = MOCK_APIS.findIndex((a: any) => a.id === id);
    if (idx === -1) throw new Error('API not found');
    MOCK_APIS[idx].status = 'PUBLISHED';
    saveAll();
    return MOCK_APIS[idx];
  }
  
  async getApplications() {
    return { applications: [...MOCK_APPS], total: MOCK_APPS.length };
  }
  async createApp(data: any) {
    const newApp = { ...data, id: 'app-' + Date.now(), consumerKey: 'ck-' + Math.random().toString(36).substring(2, 10), sandboxKey: 'sk-' + Math.random().toString(36).substring(2, 10), subscriptions: 0, createdAt: new Date().toISOString() };
    MOCK_APPS.push(newApp);
    saveAll();
    return newApp;
  }
  async deleteApp(id: string) {
    MOCK_APPS = MOCK_APPS.filter((a: any) => a.id !== id);
    MOCK_SUBS = MOCK_SUBS.filter((s: any) => s.appId !== id);
    saveAll();
    return { success: true };
  }
  
  async getSubscriptions() {
    return { subscriptions: [...MOCK_SUBS], total: MOCK_SUBS.length };
  }
  async subscribe(data: any) {
    const api = MOCK_APIS.find((a: any) => a.id === data.apiId);
    const app = MOCK_APPS.find((a: any) => a.id === data.appId);
    const newSub = { id: 'sub-' + Date.now(), apiId: data.apiId, appId: data.appId, apiName: api?.name || 'Unknown', appName: app?.name || 'Unknown', tier: data.tier || 'Bronze', status: 'ACTIVE', createdAt: new Date().toISOString() };
    MOCK_SUBS.push(newSub);
    saveAll();
    return newSub;
  }
  async unsubscribe(id: string) {
    MOCK_SUBS = MOCK_SUBS.filter((s: any) => s.id !== id);
    saveAll();
    return { success: true };
  }
  
  async getAnalytics(_period: string) {
    const analytics = generateAnalytics();
    return {
      callsOverTime: analytics.map((d: any) => ({ date: d.date, calls: d.calls })),
      topApis: [
        { name: 'Authentication API', calls: 45200 },
        { name: 'Payment Gateway API', calls: 38900 },
        { name: 'Order Processing API', calls: 32100 },
        { name: 'User Management API', calls: 28700 },
        { name: 'Product Catalog API', calls: 25400 },
        { name: 'Analytics API', calls: 18900 },
        { name: 'Notification API', calls: 14300 },
        { name: 'Inventory API', calls: 9800 },
        { name: 'Shipping API', calls: 6500 },
        { name: 'Search API', calls: 4200 },
      ],
      latency: [
        { name: 'Auth', ms: 24 },
        { name: 'Payment', ms: 45 },
        { name: 'Orders', ms: 38 },
        { name: 'Users', ms: 22 },
        { name: 'Products', ms: 31 },
        { name: 'Analytics', ms: 52 },
        { name: 'Notify', ms: 18 },
        { name: 'Inventory', ms: 67 },
      ],
    };
  }
  
  async getThrottlePolicies() {
    return { policies: [...MOCK_POLICIES], total: MOCK_POLICIES.length };
  }
  async createPolicy(data: any) {
    const newPol = { ...data, id: 'pol-' + Date.now() };
    MOCK_POLICIES.push(newPol);
    saveAll();
    return newPol;
  }
  async deletePolicy(id: string) {
    MOCK_POLICIES = MOCK_POLICIES.filter((p: any) => p.id !== id);
    saveAll();
    return { success: true };
  }
  
  async getUsers() {
    return { users: [...MOCK_USERS], total: MOCK_USERS.length };
  }
  async createUser(data: any) {
    const newUser = { ...data, id: 'user-' + Date.now(), createdAt: new Date().toISOString() };
    return newUser;
  }
  async deleteUser(_id: string) {
    return { success: true };
  }
  
  async getAuditLogs() {
    return { logs: [
      { id: 'audit-1', action: 'CREATE api', resourceType: 'api', resourceId: 'api-1', userId: 'user-2', timestamp: '2025-01-15T10:00:00Z', details: 'Created User Management API' },
      { id: 'audit-2', action: 'PUBLISH api', resourceType: 'api', resourceId: 'api-1', userId: 'user-2', timestamp: '2025-01-16T08:00:00Z', details: 'Published User Management API' },
      { id: 'audit-3', action: 'SUBSCRIBE', resourceType: 'subscription', resourceId: 'sub-1', userId: 'user-2', timestamp: '2025-02-01T10:00:00Z', details: 'Mobile App subscribed to User Management API' },
      { id: 'audit-4', action: 'CREATE api', resourceType: 'api', resourceId: 'api-4', userId: 'user-3', timestamp: '2025-02-01T14:00:00Z', details: 'Created Payment Gateway API' },
      { id: 'audit-5', action: 'LOGIN', resourceType: 'auth', resourceId: '', userId: 'user-1', timestamp: '2025-05-18T09:00:00Z', details: 'Admin login from 192.168.1.1' },
    ], total: 5 };
  }
  
  async getWebhooks() {
    return { webhooks: [
      { id: 'wh-1', url: 'https://hooks.slack.com/services/T123/B456', events: ['API_PUBLISHED', 'API_DEPRECATED'], status: 'active', createdAt: '2025-02-01T10:00:00Z' },
      { id: 'wh-2', url: 'https://teams.webhook.office.com/webhookb2/abc', events: ['SUBSCRIPTION_CREATED'], status: 'active', createdAt: '2025-02-15T10:00:00Z' },
    ], total: 2 };
  }
  async createWebhook(data: any) {
    return { ...data, id: 'wh-' + Date.now(), createdAt: new Date().toISOString() };
  }
  async deleteWebhook(_id: string) {
    return { success: true };
  }
  
  logout() {
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('use_mock');
  }
}

export const api = new APIMClient();

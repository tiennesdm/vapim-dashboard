// VedaDB API Manager - API Client
// Auto-detects backend availability, falls back to in-memory mock database

// API client - in-memory mock database for demo (no backend required)

// ===== IN-MEMORY MOCK DATABASE =====
const API_DOCUMENTATION: Record<string, string> = {
  'api-1': `# User Management API

## Overview
The User Management API provides comprehensive CRUD operations for user accounts in the VedaDB platform.

## Authentication
All endpoints require OAuth2 authentication. Include the Bearer token in the Authorization header.

## Base URL
\`http://user-service:8080\`

## Endpoints

### GET /users
Retrieve a list of all users with pagination support.

**Query Parameters:**
- \`page\` (integer): Page number, default 0
- \`size\` (integer): Page size, default 20
- \`search\` (string): Search query for username or email

**Response:**
\`\`\`json
{
  "content": [
    { "id": "1", "username": "john", "email": "john@example.com" }
  ],
  "totalElements": 100,
  "totalPages": 5
}
\`\`\`

### POST /users
Create a new user account.

**Request Body:**
\`\`\`json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "user"
}
\`\`\`

### GET /users/{id}
Retrieve a specific user by ID.

### PUT /users/{id}
Update user information.

### DELETE /users/{id}
Delete a user account.
`,
  'api-2': `# Product Catalog API

## Overview
Product Catalog API manages products, categories, and inventory search.

## Authentication
OAuth2 Bearer token required.

## Endpoints

### GET /products
List all products with filtering and pagination.

**Query Parameters:**
- \`category\` (string): Filter by category
- \`minPrice\` (number): Minimum price
- \`maxPrice\` (number): Maximum price
- \`inStock\` (boolean): Only in-stock items

### GET /products/{id}
Get product details by ID.

### POST /products
Create a new product (Admin only).

### GET /categories
List all product categories.
`,
  'api-3': `# Order Processing API

## Overview
Manage the complete order lifecycle from creation to fulfillment.

## Authentication
OAuth2 Bearer token required.

## Endpoints

### POST /orders
Create a new order.

**Request Body:**
\`\`\`json
{
  "items": [
    { "productId": "string", "quantity": 1 }
  ],
  "shippingAddress": { ... }
}
\`\`\`

### GET /orders/{id}
Get order status and details.

### PUT /orders/{id}/cancel
Cancel an existing order.
`,
  'api-4': `# Payment Gateway API

## Overview
Process payments, handle refunds, and manage payment methods.

## Authentication
API Key required in \`X-API-Key\` header.

## Endpoints

### POST /payments/charge
Process a payment charge.

### POST /payments/refund
Refund an existing transaction.

### GET /payments/{id}/status
Check payment status.
`,
  'api-5': `# Inventory API

## Overview
Real-time inventory tracking and stock management.

## Authentication
OAuth2 Bearer token required.

## Endpoints

### GET /inventory
List inventory items.

### GET /inventory/{productId}
Get stock level for a product.

### PUT /inventory/{productId}/adjust
Adjust stock quantity.
`,
  'api-6': `# Shipping API

## Overview
Shipping label generation, carrier management, and package tracking.

## Authentication
OAuth2 Bearer token required.

## Endpoints

### POST /shipments
Create a new shipment.

### GET /shipments/{id}/track
Track shipment status.

### GET /carriers
List available shipping carriers.
`,
  'api-7': `# Notification API

## Overview
Send email, SMS, and push notifications to users.

## Authentication
API Key required in \`X-API-Key\` header.

## Endpoints

### POST /notifications/email
Send an email notification.

### POST /notifications/sms
Send an SMS message.

### POST /notifications/push
Send a push notification.
`,
  'api-8': `# Analytics API

## Overview
Event tracking, metrics collection, and analytics queries.

## Authentication
OAuth2 Bearer token required.

## Endpoints

### POST /events/track
Track a custom event.

### GET /metrics
Get aggregated metrics.

### GET /reports/{reportId}
Retrieve a generated report.
`,
  'api-9': `# Authentication API

## Overview
Central authentication service for OAuth2, JWT tokens, and API key management.

## Authentication
None required for token endpoints. API Key for management endpoints.

## Endpoints

### POST /auth/token
Obtain an access token.

**Request Body:**
\`\`\`json
{
  "grant_type": "password",
  "username": "string",
  "password": "string"
}
\`\`\`

### POST /auth/refresh
Refresh an access token.

### GET /auth/keys
List API keys for the authenticated user.
`,
  'api-10': `# Search API

## Overview
Full-text search powered by Elasticsearch.

> **Deprecation Notice:** This API is deprecated. Please migrate to the new Search API v2.

## Authentication
OAuth2 Bearer token required.

## Endpoints

### GET /search
Perform a search query.

### GET /search/suggest
Get search suggestions.
`,
};

const API_RESOURCES: Record<string, any[]> = {
  'api-1': [
    { method: 'GET', path: '/users', description: 'List all users with pagination' },
    { method: 'POST', path: '/users', description: 'Create a new user' },
    { method: 'GET', path: '/users/{id}', description: 'Get user by ID' },
    { method: 'PUT', path: '/users/{id}', description: 'Update user' },
    { method: 'DELETE', path: '/users/{id}', description: 'Delete user' },
    { method: 'GET', path: '/users/{id}/roles', description: 'Get user roles' },
    { method: 'POST', path: '/users/{id}/activate', description: 'Activate user account' },
  ],
  'api-2': [
    { method: 'GET', path: '/products', description: 'List products with filters' },
    { method: 'POST', path: '/products', description: 'Create product' },
    { method: 'GET', path: '/products/{id}', description: 'Get product details' },
    { method: 'PUT', path: '/products/{id}', description: 'Update product' },
    { method: 'DELETE', path: '/products/{id}', description: 'Delete product' },
    { method: 'GET', path: '/categories', description: 'List categories' },
  ],
  'api-3': [
    { method: 'POST', path: '/orders', description: 'Create order' },
    { method: 'GET', path: '/orders/{id}', description: 'Get order details' },
    { method: 'PUT', path: '/orders/{id}', description: 'Update order' },
    { method: 'PUT', path: '/orders/{id}/cancel', description: 'Cancel order' },
    { method: 'GET', path: '/orders/{id}/status', description: 'Get order status' },
  ],
  'api-4': [
    { method: 'POST', path: '/payments/charge', description: 'Process payment' },
    { method: 'POST', path: '/payments/refund', description: 'Refund payment' },
    { method: 'GET', path: '/payments/{id}', description: 'Get payment details' },
    { method: 'GET', path: '/payments/{id}/status', description: 'Check payment status' },
  ],
  'api-5': [
    { method: 'GET', path: '/inventory', description: 'List inventory' },
    { method: 'GET', path: '/inventory/{productId}', description: 'Get stock level' },
    { method: 'PUT', path: '/inventory/{productId}/adjust', description: 'Adjust stock' },
    { method: 'GET', path: '/inventory/low-stock', description: 'Low stock alerts' },
  ],
  'api-6': [
    { method: 'POST', path: '/shipments', description: 'Create shipment' },
    { method: 'GET', path: '/shipments/{id}', description: 'Get shipment' },
    { method: 'GET', path: '/shipments/{id}/track', description: 'Track shipment' },
    { method: 'GET', path: '/carriers', description: 'List carriers' },
  ],
  'api-7': [
    { method: 'POST', path: '/notifications/email', description: 'Send email' },
    { method: 'POST', path: '/notifications/sms', description: 'Send SMS' },
    { method: 'POST', path: '/notifications/push', description: 'Send push notification' },
    { method: 'GET', path: '/notifications/templates', description: 'List templates' },
  ],
  'api-8': [
    { method: 'POST', path: '/events/track', description: 'Track event' },
    { method: 'GET', path: '/metrics', description: 'Get metrics' },
    { method: 'GET', path: '/reports/{reportId}', description: 'Get report' },
    { method: 'POST', path: '/reports', description: 'Generate report' },
  ],
  'api-9': [
    { method: 'POST', path: '/auth/token', description: 'Get access token' },
    { method: 'POST', path: '/auth/refresh', description: 'Refresh token' },
    { method: 'GET', path: '/auth/keys', description: 'List API keys' },
    { method: 'POST', path: '/auth/keys', description: 'Create API key' },
    { method: 'DELETE', path: '/auth/keys/{id}', description: 'Revoke API key' },
  ],
  'api-10': [
    { method: 'GET', path: '/search', description: 'Search' },
    { method: 'GET', path: '/search/suggest', description: 'Suggestions' },
    { method: 'GET', path: '/search/advanced', description: 'Advanced search' },
  ],
};

let MOCK_APIS: any[] = JSON.parse(localStorage.getItem('mock_apis') || 'null') || [
  { id: 'api-1', name: 'User Management API', context: '/api/v1/users', version: '1.0.0', endpoint: 'http://user-service:8080', authType: 'OAuth2', status: 'PUBLISHED', provider: 'Platform Team', description: 'CRUD operations for users', tags: ['REST','User'], rating: 4.5, ratingCount: 12, visibility: 'public', throttlePolicy: 'Gold', createdAt: '2025-01-15T10:00:00Z', documentation: API_DOCUMENTATION['api-1'] },
  { id: 'api-2', name: 'Product Catalog API', context: '/api/v1/products', version: '1.0.0', endpoint: 'http://product-service:8080', authType: 'OAuth2', status: 'PUBLISHED', provider: 'Commerce Team', description: 'Product catalog with search and filters', tags: ['REST','Product'], rating: 4.2, ratingCount: 8, visibility: 'public', throttlePolicy: 'Silver', createdAt: '2025-01-20T10:00:00Z', documentation: API_DOCUMENTATION['api-2'] },
  { id: 'api-3', name: 'Order Processing API', context: '/api/v1/orders', version: '1.0.0', endpoint: 'http://order-service:8080', authType: 'OAuth2', status: 'PUBLISHED', provider: 'Commerce Team', description: 'Order lifecycle management', tags: ['REST','Order'], rating: 4.8, ratingCount: 15, visibility: 'public', throttlePolicy: 'Gold', createdAt: '2025-01-25T10:00:00Z', documentation: API_DOCUMENTATION['api-3'] },
  { id: 'api-4', name: 'Payment Gateway API', context: '/api/v1/payments', version: '1.0.0', endpoint: 'http://payment-service:8080', authType: 'API Key', status: 'PUBLISHED', provider: 'Finance Team', description: 'Payment processing and refunds', tags: ['REST','Payment'], rating: 4.7, ratingCount: 20, visibility: 'public', throttlePolicy: 'Gold', createdAt: '2025-02-01T10:00:00Z', documentation: API_DOCUMENTATION['api-4'] },
  { id: 'api-5', name: 'Inventory API', context: '/api/v1/inventory', version: '1.0.0', endpoint: 'http://inventory-service:8080', authType: 'OAuth2', status: 'PUBLISHED', provider: 'Warehouse Team', description: 'Real-time inventory tracking', tags: ['REST','Inventory'], rating: 3.9, ratingCount: 6, visibility: 'public', throttlePolicy: 'Silver', createdAt: '2025-02-05T10:00:00Z', documentation: API_DOCUMENTATION['api-5'] },
  { id: 'api-6', name: 'Shipping API', context: '/api/v1/shipping', version: '1.0.0', endpoint: 'http://shipping-service:8080', authType: 'OAuth2', status: 'CREATED', provider: 'Logistics Team', description: 'Shipping label generation and tracking', tags: ['REST','Shipping'], rating: 0, ratingCount: 0, visibility: 'public', throttlePolicy: 'Bronze', createdAt: '2025-03-01T10:00:00Z', documentation: API_DOCUMENTATION['api-6'] },
  { id: 'api-7', name: 'Notification API', context: '/api/v1/notifications', version: '1.0.0', endpoint: 'http://notification-service:8080', authType: 'API Key', status: 'PUBLISHED', provider: 'Platform Team', description: 'Email, SMS, push notifications', tags: ['REST','Notification'], rating: 4.0, ratingCount: 9, visibility: 'public', throttlePolicy: 'Silver', createdAt: '2025-02-10T10:00:00Z', documentation: API_DOCUMENTATION['api-7'] },
  { id: 'api-8', name: 'Analytics API', context: '/api/v1/analytics', version: '1.0.0', endpoint: 'http://analytics-service:8080', authType: 'OAuth2', status: 'PUBLISHED', provider: 'Data Team', description: 'Event tracking and analytics', tags: ['REST','Analytics'], rating: 4.3, ratingCount: 11, visibility: 'public', throttlePolicy: 'Silver', createdAt: '2025-02-15T10:00:00Z', documentation: API_DOCUMENTATION['api-8'] },
  { id: 'api-9', name: 'Authentication API', context: '/api/v1/auth', version: '1.0.0', endpoint: 'http://auth-service:8080', authType: 'API Key', status: 'PUBLISHED', provider: 'Security Team', description: 'OAuth2, JWT, API key management', tags: ['REST','Auth'], rating: 4.9, ratingCount: 25, visibility: 'public', throttlePolicy: 'Unlimited', createdAt: '2025-01-10T10:00:00Z', documentation: API_DOCUMENTATION['api-9'] },
  { id: 'api-10', name: 'Search API', context: '/api/v1/search', version: '1.0.0', endpoint: 'http://search-service:8080', authType: 'OAuth2', status: 'DEPRECATED', provider: 'Search Team', description: 'Full-text search with Elasticsearch', tags: ['REST','Search'], rating: 4.1, ratingCount: 7, visibility: 'public', throttlePolicy: 'Bronze', createdAt: '2025-01-05T10:00:00Z', documentation: API_DOCUMENTATION['api-10'] },
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
  async getAPIById(id: string) {
    const api = MOCK_APIS.find((a: any) => a.id === id);
    if (!api) throw new Error('API not found');
    return { ...api };
  }
  async getAPIResources(id: string) {
    return API_RESOURCES[id] || [];
  }
  async createAPI(data: any) {
    const newAPI = { ...data, id: 'api-' + Date.now(), createdAt: new Date().toISOString(), rating: 0, ratingCount: 0, documentation: data.documentation || '# API Documentation\\n\\nNo documentation available yet.' };
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
  async updateApp(id: string, data: any) {
    const idx = MOCK_APPS.findIndex((a: any) => a.id === id);
    if (idx === -1) throw new Error('Application not found');
    MOCK_APPS[idx] = { ...MOCK_APPS[idx], ...data, updatedAt: new Date().toISOString() };
    saveAll();
    return MOCK_APPS[idx];
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
  async getSubscriptionsByApi(apiId: string) {
    return MOCK_SUBS.filter((s: any) => s.apiId === apiId);
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
      { id: 'audit-1', action: 'CREATE api', resourceType: 'api', resourceId: 'api-1', userId: 'john_dev', timestamp: '2025-01-15T10:00:00Z', details: 'Created User Management API', ipAddress: '192.168.1.45' },
      { id: 'audit-2', action: 'PUBLISH api', resourceType: 'api', resourceId: 'api-1', userId: 'john_dev', timestamp: '2025-01-16T08:00:00Z', details: 'Published User Management API', ipAddress: '192.168.1.45' },
      { id: 'audit-3', action: 'SUBSCRIBE', resourceType: 'subscription', resourceId: 'sub-1', userId: 'john_dev', timestamp: '2025-02-01T10:00:00Z', details: 'Mobile App subscribed to User Management API', ipAddress: '192.168.1.45' },
      { id: 'audit-4', action: 'CREATE api', resourceType: 'api', resourceId: 'api-4', userId: 'sarah_pm', timestamp: '2025-02-01T14:00:00Z', details: 'Created Payment Gateway API', ipAddress: '192.168.1.32' },
      { id: 'audit-5', action: 'LOGIN', resourceType: 'auth', resourceId: '', userId: 'admin', timestamp: '2025-05-18T09:00:00Z', details: 'Admin login from 192.168.1.1', ipAddress: '192.168.1.1' },
      { id: 'audit-6', action: 'UPDATE api', resourceType: 'api', resourceId: 'api-2', userId: 'john_dev', timestamp: '2025-05-17T14:30:00Z', details: 'Updated Product Catalog API endpoint configuration', ipAddress: '192.168.1.45' },
      { id: 'audit-7', action: 'CREATE subscription', resourceType: 'subscription', resourceId: 'sub-16', userId: 'sarah_pm', timestamp: '2025-05-17T11:15:00Z', details: 'Created new subscription for Partner Integration', ipAddress: '192.168.1.32' },
      { id: 'audit-8', action: 'DELETE api', resourceType: 'api', resourceId: 'api-10', userId: 'admin', timestamp: '2025-05-16T09:45:00Z', details: 'Removed deprecated Search API v1', ipAddress: '192.168.1.1' },
      { id: 'audit-9', action: 'LOGIN', resourceType: 'auth', resourceId: '', userId: 'mike_api', timestamp: '2025-05-16T08:20:00Z', details: 'Partner login from 10.0.0.55', ipAddress: '10.0.0.55' },
      { id: 'audit-10', action: 'MODIFY throttle', resourceType: 'api', resourceId: 'pol-3', userId: 'tom_ops', timestamp: '2025-05-15T16:00:00Z', details: 'Updated Gold tier rate limits', ipAddress: '192.168.1.78' },
      { id: 'audit-11', action: 'CREATE application', resourceType: 'application', resourceId: 'app-6', userId: 'lisa_dev', timestamp: '2025-05-15T13:10:00Z', details: 'Created Reporting Dashboard app', ipAddress: '192.168.1.50' },
      { id: 'audit-12', action: 'DEPRECATE api', resourceType: 'api', resourceId: 'api-7', userId: 'vikram_api', timestamp: '2025-05-14T10:30:00Z', details: 'Deprecated Notification API v1', ipAddress: '192.168.1.92' },
      { id: 'audit-13', action: 'CREATE user', resourceType: 'user', resourceId: 'user-9', userId: 'admin', timestamp: '2025-05-14T09:00:00Z', details: 'Created new subscriber account for external partner', ipAddress: '192.168.1.1' },
      { id: 'audit-14', action: 'PUBLISH api', resourceType: 'api', resourceId: 'api-6', userId: 'sarah_pm', timestamp: '2025-05-13T15:45:00Z', details: 'Published Shipping API to developer portal', ipAddress: '192.168.1.32' },
      { id: 'audit-15', action: 'MODIFY subscription', resourceType: 'subscription', resourceId: 'sub-3', userId: 'john_dev', timestamp: '2025-05-13T11:20:00Z', details: 'Upgraded Web Store to Gold tier', ipAddress: '192.168.1.45' },
      { id: 'audit-16', action: 'LOGIN', resourceType: 'auth', resourceId: '', userId: 'tom_ops', timestamp: '2025-05-12T08:50:00Z', details: 'Admin login from 192.168.1.78', ipAddress: '192.168.1.78' },
      { id: 'audit-17', action: 'UNSUBSCRIBE', resourceType: 'subscription', resourceId: 'sub-10', userId: 'mike_api', timestamp: '2025-05-11T14:15:00Z', details: 'Third-party CRM unsubscribed from Payment Gateway API', ipAddress: '10.0.0.55' },
      { id: 'audit-18', action: 'UPDATE user', resourceType: 'user', resourceId: 'user-7', userId: 'admin', timestamp: '2025-05-10T16:30:00Z', details: 'Disabled anna_viewer account', ipAddress: '192.168.1.1' },
      { id: 'audit-19', action: 'CREATE api', resourceType: 'api', resourceId: 'api-11', userId: 'lisa_dev', timestamp: '2025-05-09T10:00:00Z', details: 'Created Reporting API with analytics endpoints', ipAddress: '192.168.1.50' },
      { id: 'audit-20', action: 'SUBSCRIBE', resourceType: 'subscription', resourceId: 'sub-17', userId: 'vikram_api', timestamp: '2025-05-08T09:30:00Z', details: 'Subscribed to Authentication API', ipAddress: '192.168.1.92' },
      { id: 'audit-21', action: 'LOGIN', resourceType: 'auth', resourceId: '', userId: 'john_dev', timestamp: '2025-05-07T11:45:00Z', details: 'Developer login from 192.168.1.45', ipAddress: '192.168.1.45' },
      { id: 'audit-22', action: 'MODIFY api', resourceType: 'api', resourceId: 'api-3', userId: 'sarah_pm', timestamp: '2025-05-06T13:20:00Z', details: 'Updated Order Processing API documentation', ipAddress: '192.168.1.32' },
      { id: 'audit-23', action: 'BACKUP', resourceType: 'other', resourceId: 'system', userId: 'admin', timestamp: '2025-05-05T08:00:00Z', details: 'System backup completed successfully', ipAddress: '192.168.1.1' },
      { id: 'audit-24', action: 'UPDATE policy', resourceType: 'api', resourceId: 'pol-1', userId: 'tom_ops', timestamp: '2025-05-04T15:10:00Z', details: 'Increased Bronze tier burst capacity', ipAddress: '192.168.1.78' },
    ], total: 24 };
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

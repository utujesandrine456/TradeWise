export const mockDashboardData = {
  user: {
    id: 1,
    company_name: 'TradeWise Inc.',
    email: 'admin@tradewise.com',
    role: 'admin'
  },
  today: {
    sales: {
      total: 12450.75,
      count: 24,
      change: 12.5
    },
    purchases: {
      total: 8560.30,
      count: 18,
      change: 5.2
    }
  },
  this_month: {
    sales: {
      total: 189450.25,
      count: 342,
      change: 8.7
    },
    purchases: {
      total: 124560.80,
      count: 215,
      change: 3.4
    }
  },
  inventory: {
    total_items: 1245,
    low_stock: 42,
    out_of_stock: 7,
    categories: 18,
    stats: {
      total_products: 1245,
      in_stock: 1196,
      low_stock: 42,
      out_of_stock: 7
    },
    low_stock_alerts: [
      { id: 1, name: 'Premium Widget', quantity: 5, min_stock_level: 10, category: 'Widgets' },
      { id: 2, name: 'Basic Components', quantity: 8, min_stock_level: 15, category: 'Electronics' }
    ],
    out_of_stock_alerts: [
      { id: 3, name: 'Power Adapter', category: 'Electronics' },
      { id: 4, name: 'USB Cable', category: 'Accessories' }
    ]
  },
  recent_activity: {
    sales: [
      { id: 1, product: 'Premium Widget', customer: 'John Doe', total_price: 1250.50, created_at: new Date().toISOString() },
      { id: 2, product: 'Deluxe Package', customer: 'Acme Corp', total_price: 3420.00, created_at: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, product: 'Starter Kit', customer: 'Jane Smith', total_price: 845.99, created_at: new Date(Date.now() - 172800000).toISOString() },
      { id: 4, product: 'Add-on Module', customer: 'Tech Solutions', total_price: 560.75, created_at: new Date(Date.now() - 259200000).toISOString() },
      { id: 5, product: 'Extended Warranty', customer: 'Global Systems', total_price: 1200.00, created_at: new Date(Date.now() - 345600000).toISOString() }
    ],
    purchases: [
      { id: 1, product: 'Raw Materials', supplier: 'Material Co', total_price: 845.25, created_at: new Date().toISOString() },
      { id: 2, product: 'Office Supplies', supplier: 'OfficePlus', total_price: 1560.75, created_at: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, product: 'Electronics', supplier: 'TechParts Inc', total_price: 3240.50, created_at: new Date(Date.now() - 172800000).toISOString() },
      { id: 4, product: 'Packaging', supplier: 'PackRight', total_price: 780.30, created_at: new Date(Date.now() - 259200000).toISOString() },
      { id: 5, product: 'Shipping Materials', supplier: 'ShipEase', total_price: 920.45, created_at: new Date(Date.now() - 345600000).toISOString() }
    ]
  },
  business_profile: {
    business_type: 'Retail & Wholesale',
    industry: 'Electronics',
    employee_count: '25-50',
    established: 2015
  }
};

export const mockNotifications = [
  {
    id: 1,
    title: 'New Order Received',
    message: 'Order #1234 has been placed by John Doe',
    priority: 'high',
    created_at: new Date().toISOString(),
    read: false
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    message: 'Widget X is running low on stock (5 remaining)',
    priority: 'medium',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: 3,
    title: 'Monthly Report',
    message: 'Your monthly sales report is ready',
    priority: 'low',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    read: false
  }
];

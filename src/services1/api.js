const API_BASE_URL = 'http://localhost:4000/api';


const apiCall = async (endpoint, options = {}) => {
  try {
    // Get authentication token
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists AND endpoint is not public
    const publicEndpoints = ['/users/register', '/users/login', '/users/verify-email', '/users/resend-verification'];
    const isPublicEndpoint = publicEndpoints.some(publicEndpoint => endpoint.includes(publicEndpoint));
    
    if (token && !isPublicEndpoint) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Authentication required');
      }
      
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};


export const productAPI = {
  getAll: () => apiCall('/products'),
  getById: (id) => apiCall(`/products/${id}`),
  create: (data) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),
  search: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/products/search?${queryString}`);
  },
  getStats: () => apiCall('/products/stats'),
};


export const purchaseAPI = {
  getAll: () => apiCall('/purchases'),
  getById: (id) => apiCall(`/purchases/${id}`),
  create: (data) => apiCall('/purchases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/purchases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/purchases/${id}`, {
    method: 'DELETE',
  }),
  search: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/purchases/search?${queryString}`);
  },
  getStats: () => apiCall('/purchases/stats'),
};



export const saleAPI = {
  getAll: () => apiCall('/sales'),
  getById: (id) => apiCall(`/sales/${id}`),
  create: (data) => apiCall('/sales', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/sales/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/sales/${id}`, {
    method: 'DELETE',
  }),
  search: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/sales/search?${queryString}`);
  },
  getStats: () => apiCall('/sales/stats'),
};



export const transactionAPI = {
  getAll: () => apiCall('/transactions'),
  getById: (id) => apiCall(`/transactions/${id}`),
  create: (data) => apiCall('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/transactions/${id}`, {
    method: 'DELETE',
  }),
  search: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/transactions/search?${queryString}`);
  },
  getStats: () => apiCall('/transactions/stats'),
};

// New API endpoints
export const businessProfileAPI = {
  create: (data) => apiCall('/business-profile', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getByUserId: (userId) => apiCall(`/business-profile/user/${userId}`),
  getAll: () => apiCall('/business-profile/all'),
  delete: (id) => apiCall(`/business-profile/${id}`, {
    method: 'DELETE',
  }),
};

export const orderAPI = {
  create: (data) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getUserOrders: (userId) => apiCall(`/orders/user/${userId}`),
  getOrderDetails: (orderId) => apiCall(`/orders/${orderId}`),
  updateStatus: (orderId, status) => apiCall(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  getAll: () => apiCall('/orders/all'),
};

export const notificationAPI = {
  create: (data) => apiCall('/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getUserNotifications: (userId, status = 'all', limit = 50) => {
    const params = new URLSearchParams({ status, limit });
    return apiCall(`/notifications/user/${userId}?${params}`);
  },
  markAsRead: (notificationId) => apiCall(`/notifications/${notificationId}/read`, {
    method: 'PUT',
  }),
  markAllAsRead: (userId) => apiCall(`/notifications/user/${userId}/read-all`, {
    method: 'PUT',
  }),
  delete: (notificationId) => apiCall(`/notifications/${notificationId}`, {
    method: 'DELETE',
  }),
  getUnreadCount: (userId) => apiCall(`/notifications/user/${userId}/unread-count`),
};

export const dashboardAPI = {
  getData: () => apiCall('/dashboard/data'),
  getMetrics: (period = 'month') => apiCall(`/dashboard/metrics?period=${period}`),
};

// Enhanced user API with authentication
export const userAPI = {
  register: (data) => apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  login: (data) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  verifyEmail: (data) => apiCall('/users/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  resendVerification: (data) => apiCall('/users/resend-verification', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getDashboard: () => apiCall('/users/dashboard'),
  getBusinessProfile: (userId) => apiCall(`/business-profile/user/${userId}`),
  getAll: () => apiCall('/users'),
  getById: (id) => apiCall(`/users/${id}`),
  update: (id, data) => apiCall(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/users/${id}`, {
    method: 'DELETE',
  }),
};

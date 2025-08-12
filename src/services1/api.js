const API_BASE_URL = 'http://localhost:4000/api';


const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5103';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    // Transform error message
    const message = error.response?.data?.error || 
                   error.response?.data?.message || 
                   error.message || 
                   'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);

export default api;

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    changePassword: '/api/auth/change-password',
  },
  
  // Patients
  patients: {
    list: '/api/patient',
    paged: '/api/patient/paged',
    byId: (id) => `/api/patient/${id}`,
    create: '/api/patient',
    update: (id) => `/api/patient/${id}`,
    delete: (id) => `/api/patient/${id}`,
  },
  
  // Appointments
  appointments: {
    list: '/api/appointment',
    paged: '/api/appointment/paged',
    byId: (id) => `/api/appointment/${id}`,
    create: '/api/appointment',
    update: (id) => `/api/appointment/${id}`,
    delete: (id) => `/api/appointment/${id}`,
  },
  
  // Units
  units: {
    list: '/api/unit',
    paged: '/api/unit/paged',
    byId: (id) => `/api/unit/${id}`,
    create: '/api/unit',
    update: (id) => `/api/unit/${id}`,
    delete: (id) => `/api/unit/${id}`,
  },
  
  // Examinations
  examinations: {
    list: '/api/examination',
    all: '/api/examination/all',
    paged: '/api/examination/paged',
    byId: (id) => `/api/examination/${id}`,
    create: '/api/examination',
    update: (id) => `/api/examination/${id}`,
    delete: (id) => `/api/examination/${id}`,
  },
  
  // Insurance Providers
  insuranceProviders: {
    list: '/api/insuranceprovider',
    byId: (id) => `/api/insuranceprovider/${id}`,
    create: '/api/insuranceprovider',
    update: (id) => `/api/insuranceprovider/${id}`,
    delete: (id) => `/api/insuranceprovider/${id}`,
  },
  
  // Contracts
  contracts: {
    list: '/api/contract',
    byId: (id) => `/api/contract/${id}`,
    create: '/api/contract',
    update: (id) => `/api/contract/${id}`,
    delete: (id) => `/api/contract/${id}`,
  },
  
  // Users
  users: {
    list: '/api/user',
    byId: (id) => `/api/user/${id}`,
    update: (id) => `/api/user/${id}`,
    delete: (id) => `/api/user/${id}`,
    activate: (id) => `/api/user/${id}/activate`,
    deactivate: (id) => `/api/user/${id}/deactivate`,
  },
  
  // Accounting
  accounting: {
    reports: '/api/accounting/reports',
    payments: '/api/accounting/payments',
    allPayments: '/api/accounting/payments/all',
    paymentById: (id) => `/api/accounting/payments/${id}`,
    createPayment: '/api/accounting/payments',
    updatePayment: (id) => `/api/accounting/payments/${id}`,
    deletePayment: (id) => `/api/accounting/payments/${id}`,
  },
};
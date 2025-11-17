import axios from 'axios';

// Get base URL and ensure it ends with /api
let API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://ecommerce-backend-sy1e.onrender.com/api'
    : 'http://localhost:5000/api');

// Fix: Remove trailing slash and ensure /api is present
API_URL = API_URL.replace(/\/$/, ''); // Remove trailing slash
if (!API_URL.endsWith('/api')) {
  API_URL = API_URL + '/api';
}

// Debug log
console.log('🔧 API Configuration:', {
  MODE: import.meta.env.MODE,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  FINAL_API_URL: API_URL
});

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

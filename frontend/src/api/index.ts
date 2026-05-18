import axios from 'axios';

// Use relative path so Vite proxy handles the connection to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

/**
 * Custom Axios instance pointing to the GigFlow Express API
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically injects JWT Bearer token into outgoing calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gigflow_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch expired/invalid JWTs (401s) and clear local session state
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend returns 401 Unauthorized, token is likely expired or tampered
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('gigflow_token');
      localStorage.removeItem('gigflow_user');
      
      // Optionally redirect to login or let the AuthContext hook handle it
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

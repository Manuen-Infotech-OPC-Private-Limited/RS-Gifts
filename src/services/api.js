import axios from 'axios';

// Create a configured Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor (e.g. for attaching auth tokens)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rs_gifts_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (e.g. for global error handling)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;

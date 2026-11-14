import axios from 'axios';

// Resolve backend API URL (Defaults to live Render Cloud backend so both local and online operate seamlessly)
const resolveBaseURL = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return 'https://rs-gifts-backend.onrender.com/api';
};

// Create a configured Axios instance
export const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 60000, // 60s timeout to gracefully accommodate Render cloud cold-starts
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor (e.g. for attaching auth tokens)
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('rs_gifts_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (e.g. for global error handling)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    if (status === 401) {
      // Clean up stale/expired authentication tokens to prevent endless 401 retry loops
      try {
        localStorage.removeItem('rs_gifts_token');
        localStorage.removeItem('rs_gifts_user');
      } catch {}
      window.dispatchEvent(new CustomEvent('rs_auth_expired', { detail: { message } }));
      console.warn('[RS-Gifts Auth] Session expired or invalid token. Cached credentials cleared.');
    } else {
      console.error('API Error:', message);
    }
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase();
    const fullUrl = config.baseURL
      ? `${config.baseURL}${config.url}`
      : config.url;

    if (!config.url) {
      console.error('🚨 Axios request URL is undefined!');
      console.trace('Stack trace of the axios call with undefined URL:');
    } else {
      console.log(`📡 [AXIOS] ${method} ${fullUrl}`);
    }

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    console.error('❌ Axios interceptor error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

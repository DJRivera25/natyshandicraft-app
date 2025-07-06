// utils/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ⬅️ this allows sending cookies (including the NextAuth session token)
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

    return config;
  },
  (error) => {
    console.error('❌ Axios interceptor error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

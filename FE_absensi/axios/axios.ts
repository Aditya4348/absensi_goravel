import axios from 'axios';
import { User } from '../types';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:3000/', // Ganti dengan base URL API Anda
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token otentikasi ke header
apiClient.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('absenflow_user');
    if (userString) {
      const user: User & { token?: string } = JSON.parse(userString);
      // Asumsikan token disimpan di dalam objek user
      if (user.token && config.headers) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

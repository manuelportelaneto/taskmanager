import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Interceptor para adicionar o token JWT a todas as requisições
api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('auth-token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
import axios from 'axios';
import { API_BASE_URL } from '../config/environment';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: adicionar interceptors para token ou log
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na API:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
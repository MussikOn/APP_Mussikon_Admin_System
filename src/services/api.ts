import axios from 'axios';

const api = axios.create({
  baseURL: 'http://172.20.10.2:1000',
  withCredentials: true,
});

// Interceptor para agregar token si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta para manejo global de errores
api.interceptors.response.use(
  response => response,
  error => {
    // Aquí puedes personalizar el manejo global de errores
    // Por ejemplo, desloguear si 401, mostrar toast, etc.
    return Promise.reject(error);
  }
);

export default api; 
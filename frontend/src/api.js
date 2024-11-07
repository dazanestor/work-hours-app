// src/api.js
import axios from 'axios';

// Configuración de Axios usando la URL del backend desde .env
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export default api;

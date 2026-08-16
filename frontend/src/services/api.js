import axios from 'axios';

// Normaliza a URL base da API garantindo que termine em /api
const getNormalizedBaseUrl = () => {
  let rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').trim();

  // Remove barra final se houver
  rawUrl = rawUrl.replace(/\/+$/, '');

  // Se não contiver /api no final, adiciona
  if (!rawUrl.endsWith('/api')) {
    rawUrl = `${rawUrl}/api`;
  }

  return rawUrl;
};

export const apiClient = axios.create({
  baseURL: getNormalizedBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export default apiClient;

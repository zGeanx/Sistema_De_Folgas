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

const AUTH_SESSION_KEY = 'folgas.auth.session';

export const getAuthSession = () => {
  try {
    const rawSession = sessionStorage.getItem(AUTH_SESSION_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch {
    return null;
  }
};

export const saveAuthSession = (session) => {
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
};

export const apiClient = axios.create({
  baseURL: getNormalizedBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: getNormalizedBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAuthSession()?.tokens?.access;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshRequest;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getAuthSession()?.tokens?.refresh;

    if (
      error.response?.status !== 401
      || originalRequest?._retry
      || !refreshToken
      || originalRequest?.url?.includes('/auth/token/refresh/')
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest ??= refreshClient.post('/auth/token/refresh/', { refresh: refreshToken });
      const response = await refreshRequest;
      const currentSession = getAuthSession();
      const nextSession = {
        ...currentSession,
        tokens: {
          ...currentSession.tokens,
          access: response.data.access,
          refresh: response.data.refresh ?? currentSession.tokens.refresh,
        },
      };

      saveAuthSession(nextSession);
      originalRequest.headers.Authorization = `Bearer ${nextSession.tokens.access}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      return Promise.reject(refreshError);
    } finally {
      refreshRequest = undefined;
    }
  },
);

export default apiClient;

import apiClient, {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from './api';

export const authService = {
  getSession: getAuthSession,

  login: async ({ username, password }) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    const { access, refresh, tokens, user } = response.data;

    return {
      user,
      tokens: tokens ?? { access, refresh },
    };
  },

  saveSession: saveAuthSession,

  logout: async () => {
    const refresh = getAuthSession()?.tokens?.refresh;

    try {
      if (refresh) {
        await apiClient.post('/auth/logout/', { refresh });
      }
    } finally {
      clearAuthSession();
    }
  },
};

export default authService;

import apiClient from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

export const authService = {
    register: async (userData) => {
        const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);

        if (response.data.tokens) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.access);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refresh);
        }

        if (response.data.user) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        return response.data;
    },

    login: async (username, password) => {
        const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
            username,
            password,
        });

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh);

        if (response.data.user) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
        }

        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        try {
            if (refreshToken) {
                await apiClient.post(API_ENDPOINTS.LOGOUT, {
                    refresh: refreshToken,
                });
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        } finally {
            localStorage.clear();
        }
    },

    getCurrentUser: async () => {
        const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
        return response.data;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    getUserFromStorage: () => {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    },

    refreshToken: async () => {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await apiClient.post(API_ENDPOINTS.REFRESH_TOKEN, {
            refresh: refreshToken,
        });

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);

        return response.data;
    },
};

export default authService;

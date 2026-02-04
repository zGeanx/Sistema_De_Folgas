import axios from 'axios';
import { STORAGE_KEYS } from '../utils/constants';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

                if (!refreshToken) {
                    localStorage.clear();
                    window.location.href = '/';
                    return Promise.reject(error);
                }

                // Tentar refresh
                const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                const { access } = response.data;

                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);

                apiClient.defaults.headers.Authorization = `Bearer ${access}`;
                originalRequest.headers.Authorization = `Bearer ${access}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;

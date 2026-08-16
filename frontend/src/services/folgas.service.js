import apiClient from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const folgasService = {
  getFolgas: async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.SOLICITACOES, { params });
    return response.data;
  },
  createFolga: async (dados) => {
    const response = await apiClient.post(API_ENDPOINTS.SOLICITACOES, dados);
    return response.data;
  },
  updateFolga: async (id, dados) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.SOLICITACOES}${id}/`,
      dados
    );
    return response.data;
  },
  deleteFolga: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.SOLICITACOES}${id}/`);
  },
};

export default folgasService;

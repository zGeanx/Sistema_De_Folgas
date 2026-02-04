import apiClient from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const folgasService = {
    getFolgas: async (params = {}) => {
        const response = await apiClient.get(API_ENDPOINTS.SOLICITACOES, { params });
        return response.data;
    },
    getFolgasAprovadas: async () => {
        const response = await apiClient.get(API_ENDPOINTS.SOLICITACOES, {
            params: { status: 'aprovada' },
        });
        return response.data;
    },
    getMinhasFolgas: async () => {
        const response = await apiClient.get(API_ENDPOINTS.MINHAS_FOLGAS);
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
    aprovarFolga: async (id, observacao = '') => {
        const response = await apiClient.post(
            `${API_ENDPOINTS.SOLICITACOES}${id}/aprovar/`,
            { observacao }
        );
        return response.data;
    },
    recusarFolga: async (id, observacao) => {
        const response = await apiClient.post(
            `${API_ENDPOINTS.SOLICITACOES}${id}/recusar/`,
            { observacao }
        );
        return response.data;
    },
    getEstatisticas: async () => {
        const response = await apiClient.get(API_ENDPOINTS.ESTATISTICAS);
        return response.data;
    },
};

export default folgasService;

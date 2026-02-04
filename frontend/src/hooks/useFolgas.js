import { useState, useCallback } from 'react';
import { folgasService } from '../services/folgas.service';
import { toast } from 'react-toastify';

export const useFolgas = () => {
    const [folgas, setFolgas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const carregarFolgas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await folgasService.getFolgas();
            setFolgas(data);
        } catch (err) {
            setError(err.message);
            toast.error('Erro ao carregar folgas');
        } finally {
            setLoading(false);
        }
    }, []);

    const solicitarFolga = useCallback(async (dados) => {
        try {
            setLoading(true);
            const novaFolga = await folgasService.createFolga(dados);
            setFolgas((prev) => [novaFolga, ...prev]);
            toast.success('Solicitação enviada com sucesso!');
            return novaFolga;
        } catch (err) {
            setError(err.message);
            const mensagem = err.response?.data?.non_field_errors?.[0] ||
                err.response?.data?.detail ||
                'Erro ao solicitar folga';
            toast.error(mensagem);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        folgas,
        loading,
        error,
        carregarFolgas,
        solicitarFolga,
    };
};

export default useFolgas;

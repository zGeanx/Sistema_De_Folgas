import { useState, useCallback } from 'react';
import { folgasService } from '../services/folgas.service';
import { toast } from 'react-toastify';

export const useFolgas = () => {
  const [folgas, setFolgas] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarFolgas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await folgasService.getFolgas();
      setFolgas(Array.isArray(data) ? data : []);
      return data;
    } catch {
      toast.error('Erro ao carregar folgas');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const solicitarFolga = useCallback(async (dados) => {
    try {
      setLoading(true);
      const novaFolga = await folgasService.createFolga(dados);
      setFolgas((prev) => [novaFolga, ...prev]);
      toast.success('✨ Solicitação de folga enviada aos astros!');
      return novaFolga;
    } catch (err) {
      const mensagem =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        'Erro ao solicitar folga';
      toast.error(mensagem);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const aprovarFolga = useCallback(async (id) => {
    try {
      await folgasService.updateFolga(id, { status: 'aprovada' });
      setFolgas((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'aprovada' } : f))
      );
      toast.success('Folga aprovada com sucesso!');
    } catch (err) {
      toast.error('Erro ao aprovar folga');
      throw err;
    }
  }, []);

  const recusarFolga = useCallback(async (id) => {
    try {
      await folgasService.updateFolga(id, { status: 'recusada' });
      setFolgas((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: 'recusada' } : f))
      );
      toast.info('Solicitação recusada.');
    } catch (err) {
      toast.error('Erro ao recusar folga');
      throw err;
    }
  }, []);

  const excluirFolga = useCallback(async (id) => {
    try {
      await folgasService.deleteFolga(id);
      setFolgas((prev) => prev.filter((f) => f.id !== id));
      toast.success('Solicitação removida.');
    } catch (err) {
      toast.error('Erro ao remover solicitação');
      throw err;
    }
  }, []);

  return {
    folgas,
    loading,
    carregarFolgas,
    solicitarFolga,
    aprovarFolga,
    recusarFolga,
    excluirFolga,
  };
};

export default useFolgas;

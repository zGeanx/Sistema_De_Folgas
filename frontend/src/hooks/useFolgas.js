import { useState, useCallback } from 'react';
import { folgasService } from '../services/folgas.service';
import { toast } from 'sonner';

export const useFolgas = () => {
  const [folgas, setFolgas] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarFolgas = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await folgasService.getFolgas();
      setFolgas(Array.isArray(data) ? data : []);
      return data;
    } catch {
      if (!silent) {
        toast.error('Erro ao carregar folgas', {
          description: 'Verifique sua conexão com o servidor.',
        });
      }
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const solicitarFolga = useCallback(async (dados) => {
    try {
      setLoading(true);
      const novaFolga = await folgasService.createFolga(dados);
      setFolgas((prev) => [novaFolga, ...prev]);
      toast.success('✨ Solicitação enviada aos astros!', {
        description: `${novaFolga.cartomante_nome} solicitou folga para ${novaFolga.dia_semana_display || novaFolga.dia_semana}.`,
      });
      return novaFolga;
    } catch (err) {
      const mensagem =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        'Erro ao solicitar folga';
      toast.error('Não foi possível solicitar', {
        description: mensagem,
      });
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
      toast.success('Folga aprovada com sucesso!', {
        description: 'A escala semanal foi atualizada.',
      });
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
      toast.warning('Solicitação recusada', {
        description: 'A solicitação foi marcada como recusada.',
      });
    } catch (err) {
      toast.error('Erro ao recusar folga');
      throw err;
    }
  }, []);

  const excluirFolga = useCallback(async (id) => {
    try {
      await folgasService.deleteFolga(id);
      setFolgas((prev) => prev.filter((f) => f.id !== id));
      toast.success('Solicitação removida', {
        description: 'O registro foi excluído permanentemente.',
      });
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

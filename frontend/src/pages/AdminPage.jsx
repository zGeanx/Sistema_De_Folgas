import React, { useEffect, useState, useCallback } from 'react';
import { LayoutDashboard, FileText, Calendar, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { SolicitacoesGestao } from '@/components/gestao/SolicitacoesGestao';
import { TabelaEscala } from '@/components/tabela/TabelaEscala';
import { useFolgas } from '@/hooks/useFolgas';
import { Button } from '@/components/ui/button';

const MOBILE_NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'solicitacoes', label: 'Solicitações', icon: FileText },
  { id: 'escala', label: 'Escala', icon: Calendar },
];

export function AdminPage() {
  const {
    folgas,
    loading,
    carregarFolgas,
    aprovarFolga,
    recusarFolga,
    excluirFolga,
  } = useFolgas();

  const [activeSection, setActiveSection] = useState('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Carregamento inicial e sincronização em tempo real (Polling a cada 8s + Focus)
  useEffect(() => {
    carregarFolgas();

    // Polling em segundo plano a cada 8 segundos
    const interval = setInterval(() => {
      carregarFolgas(true);
    }, 8000);

    // Atualiza imediatamente quando o usuário volta para a aba do navegador
    const handleFocus = () => {
      carregarFolgas(true);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [carregarFolgas]);

  // Atualização manual com feedback visual
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await carregarFolgas();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [carregarFolgas]);

  const handleAprovar = async (id) => {
    await aprovarFolga(id);
    await carregarFolgas(true);
  };

  const handleRecusar = async (id) => {
    await recusarFolga(id);
    await carregarFolgas(true);
  };

  const handleExcluir = async (id) => {
    await excluirFolga(id);
    await carregarFolgas(true);
  };

  return (
    <div className="min-h-screen bg-obsidian text-moonlight flex">
      {/* Desktop Sidebar */}
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header variant="admin" />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-5xl mx-auto w-full">
          {/* Top Bar with Live Sync indicator */}
          <div className="flex items-center justify-end mb-6">

            <Button
              size="sm"
              variant="outline"
              onClick={handleManualRefresh}
              disabled={isRefreshing || loading}
              className="h-8 px-2.5 text-xs bg-midnight border-white/[0.08] hover:bg-white/[0.04] text-silver-mist hover:text-moonlight rounded-xl gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-gold' : ''}`} aria-hidden="true" />
              <span>Atualizar</span>
            </Button>
          </div>

          {/* Dashboard Section */}
          <div className={`space-y-6 ${activeSection === 'dashboard' ? 'block' : 'hidden'}`}>
            <div>
              <h2 className="text-lg font-heading text-moonlight">Visão Geral</h2>
              <p className="text-xs text-silver-mist mt-1">Resumo de todas as solicitações de folga</p>
            </div>
            <DashboardStats folgas={folgas} />

            <div className="space-y-3">
              <h3 className="text-base font-heading text-moonlight">Pendentes recentes</h3>
              {folgas.filter((f) => f.status === 'pendente').length === 0 ? (
                <div className="glass rounded-2xl border border-white/[0.06] p-6 text-center">
                  <p className="text-xs text-silver-mist">Nenhuma solicitação pendente no momento.</p>
                </div>
              ) : (
                <SolicitacoesGestao
                  folgas={folgas.filter((f) => f.status === 'pendente')}
                  onAprovar={handleAprovar}
                  onRecusar={handleRecusar}
                  onExcluir={handleExcluir}
                  loading={loading}
                />
              )}
            </div>
          </div>

          {/* Solicitacoes Section */}
          <div className={`space-y-6 ${activeSection === 'solicitacoes' ? 'block' : 'hidden'}`}>
            <div>
              <h2 className="text-lg font-heading text-moonlight">Todas as Solicitações</h2>
              <p className="text-xs text-silver-mist mt-1">Gerencie aprovações e recusas de folgas</p>
            </div>
            <SolicitacoesGestao
              folgas={folgas}
              onAprovar={handleAprovar}
              onRecusar={handleRecusar}
              onExcluir={handleExcluir}
              loading={loading}
            />
          </div>

          {/* Escala Section */}
          <div className={`space-y-6 ${activeSection === 'escala' ? 'block' : 'hidden'}`}>
            <div>
              <h2 className="text-lg font-heading text-moonlight">Escala Semanal</h2>
              <p className="text-xs text-silver-mist mt-1">Folgas aprovadas consolidadas por cartomante</p>
            </div>
            <TabelaEscala
              folgas={folgas}
              loading={loading}
              onRefresh={carregarFolgas}
            />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav (admin version) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 glass-elevated border-t border-white/[0.06] lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        role="navigation"
        aria-label="Navegação administrativa"
      >
        <div className="flex items-stretch">
          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all duration-200 relative ${
                  isActive ? 'text-amber-gold' : 'text-silver-mist'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} aria-hidden="true" />
                <span className={`text-[10px] font-semibold ${isActive ? 'text-amber-gold' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-amber-gold shadow-[0_0_8px_2px_rgba(232,168,50,0.35)]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default AdminPage;

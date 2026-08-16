import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { FormularioFolga } from '@/components/formulario/FormularioFolga';
import { TabelaEscala } from '@/components/tabela/TabelaEscala';
import { useFolgas } from '@/hooks/useFolgas';

export function CartomantePage() {
  const {
    folgas,
    loading,
    carregarFolgas,
    solicitarFolga,
  } = useFolgas();

  const [activeTab, setActiveTab] = useState('solicitar');

  useEffect(() => {
    carregarFolgas();
  }, [carregarFolgas]);

  const handleCreated = async (data) => {
    await solicitarFolga(data);
    await carregarFolgas();
    setActiveTab('escala');
  };

  return (
    <div className="min-h-screen bg-obsidian text-moonlight flex flex-col relative">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[400px] h-[400px] bg-amethyst/[0.06] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-16 w-[350px] h-[350px] bg-amber-gold/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-lg sm:max-w-2xl mx-auto w-full">
        <Header variant="cartomante" />

        {/* Page Content */}
        <main className="flex-1 px-4 pb-safe">
          {activeTab === 'solicitar' && (
            <FormularioFolga onFolgaCreated={handleCreated} />
          )}
          {activeTab === 'escala' && (
            <TabelaEscala
              folgas={folgas}
              loading={loading}
              onRefresh={carregarFolgas}
              variant="cartomante"
            />
          )}
        </main>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default CartomantePage;

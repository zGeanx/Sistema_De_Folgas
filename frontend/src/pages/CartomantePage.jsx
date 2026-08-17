import React from 'react';
import { Header } from '@/components/layout/Header';
import { FormularioFolga } from '@/components/formulario/FormularioFolga';
import { useFolgas } from '@/hooks/useFolgas';

export function CartomantePage() {
  const {
    solicitarFolga,
  } = useFolgas();

  const handleCreated = async (data) => {
    await solicitarFolga(data);
  };

  return (
    <div className="min-h-screen bg-obsidian text-moonlight flex flex-col relative overflow-x-hidden">
      {/* Ambient background glow — otimizado com radial-gradient sem blurs pesados para 120fps no iOS */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amethyst/20 via-transparent to-transparent" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-gold/15 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-lg sm:max-w-2xl mx-auto w-full">
        <Header variant="cartomante" />

        <main className="flex-1 px-4 pb-safe">
          <FormularioFolga onFolgaCreated={handleCreated} />
        </main>
      </div>
    </div>
  );
}

export default CartomantePage;

import React from 'react';
import { Calendar, PlusCircle } from 'lucide-react';

export function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'solicitar',
      label: 'Marcar Folga',
      icon: PlusCircle,
    },
    {
      id: 'escala',
      label: 'Minha Escala',
      icon: Calendar,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass-elevated border-t border-white/[0.06]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 transition-all duration-200 relative ${
                isActive
                  ? 'text-amber-gold'
                  : 'text-silver-mist active:text-slate-200'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} aria-hidden="true" />
                {isActive && (
                  <div className="absolute -inset-2 bg-amber-gold/10 rounded-full blur-md animate-glow-pulse" />
                )}
              </div>
              <span className={`text-[11px] font-semibold tracking-wide ${isActive ? 'text-amber-gold' : ''}`}>
                {tab.label}
              </span>

              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-amber-gold shadow-[0_0_8px_2px_rgba(232,168,50,0.35)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;

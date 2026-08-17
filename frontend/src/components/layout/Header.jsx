import React, { useState, useEffect } from 'react';
import { Moon, Calendar, Clock, LogOut } from 'lucide-react';

export function Header({ variant = 'cartomante', user, onLogout }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(time);

  const formattedTime = time.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (variant === 'admin') {
    return (
      <header className="px-4 sm:px-6 lg:px-8 py-4 border-b border-white/[0.06] glass">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading text-moonlight tracking-tight">
              Painel Administrativo
            </h1>
            <p className="text-xs text-silver-mist capitalize mt-0.5">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-silver-mist border border-white/[0.06]">
              <Clock className="w-3.5 h-3.5 text-amber-gold" aria-hidden="true" />
              <span className="font-mono text-moonlight tabular-nums">{formattedTime}</span>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="touch-compact h-9 px-3 rounded-xl border border-white/[0.08] text-xs text-silver-mist hover:text-moonlight hover:border-amber-gold/40 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Sair{user?.username ? ` (${user.username})` : ''}</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Cartomante variant — compact mobile header
  return (
    <header className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-gold/20 to-amethyst/20 border border-amber-gold/25 flex items-center justify-center">
            <Moon className="w-5 h-5 text-amber-gold animate-float" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-heading text-moonlight tracking-tight">
              Folgas
            </h1>
            <p className="text-[11px] text-silver-mist capitalize">{formattedDate}</p>
          </div>
        </div>

        <div className="glass rounded-xl px-3 py-2 flex items-center gap-1.5 text-xs border border-white/[0.06]">
          <Calendar className="w-3.5 h-3.5 text-amber-gold" aria-hidden="true" />
          <span className="font-mono text-moonlight text-[11px] tabular-nums">{formattedTime}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

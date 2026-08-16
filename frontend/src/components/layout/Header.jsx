import React, { useState, useEffect } from 'react';
import { Moon, Calendar, Clock } from 'lucide-react';

export function Header({ variant = 'cartomante' }) {
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
      <header className="px-4 sm:px-6 py-4 border-b border-white/[0.06] glass">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-moonlight">Painel Administrativo</h1>
            <p className="text-xs text-silver-mist capitalize">{formattedDate}</p>
          </div>
          <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs text-silver-mist border border-white/[0.06]">
            <Clock className="w-3.5 h-3.5 text-amber-gold" />
            <span className="font-mono text-moonlight">{formattedTime}</span>
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
            <Moon className="w-5 h-5 text-amber-gold animate-float" />
          </div>
          <div>
            <h1 className="text-base font-bold text-moonlight tracking-tight font-heading">
              Folgas
            </h1>
            <p className="text-[11px] text-silver-mist capitalize">{formattedDate}</p>
          </div>
        </div>

        <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs border border-white/[0.06]">
          <Calendar className="w-3.5 h-3.5 text-amber-gold" />
          <span className="font-mono text-moonlight text-[11px]">{formattedTime}</span>
        </div>
      </div>
    </header>
  );
}

export default Header;

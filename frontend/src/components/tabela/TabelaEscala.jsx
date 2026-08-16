import React, { useState } from 'react';
import { Moon, Sun, Sunset, Calendar, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DIAS_ARRAY, TURNOS_ARRAY, DIAS_SEMANA, TURNOS } from '@/utils/constants';
import { capitalize } from '@/utils/formatters';

const DIA_SHORT = {
  segunda: 'Seg',
  terca: 'Ter',
  quarta: 'Qua',
  quinta: 'Qui',
  sexta: 'Sex',
  sabado: 'Sáb',
  domingo: 'Dom',
};

const TURNO_ICONS = {
  manha: Sun,
  tarde: Sunset,
  noite: Moon,
};

const TURNO_COLORS = {
  manha: { text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  tarde: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  noite: { text: 'text-amethyst', bg: 'bg-amethyst/10', border: 'border-amethyst/30' },
};

export function TabelaEscala({ folgas = [], loading = false, onRefresh, variant = 'cartomante' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurnoFilter, setSelectedTurnoFilter] = useState('todos');

  // Filter only approved folgas for the schedule
  const folgasAprovadas = folgas.filter(
    (f) => f.status === 'aprovada' || !f.status
  );

  // Extract unique cartomantes
  const allCartomantes = [...new Set(folgas.map((f) => f.cartomante_nome))].filter(Boolean);

  // Filter by search
  const filteredCartomantes = allCartomantes.filter((nome) =>
    nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter turnos to show
  const visibleTurnos =
    selectedTurnoFilter === 'todos' ? TURNOS_ARRAY : [selectedTurnoFilter];

  // Map approved folgas
  const escalaMap = new Map();
  folgasAprovadas.forEach((folga) => {
    const key = `${folga.cartomante_nome}-${folga.dia_semana}-${folga.turno}`;
    escalaMap.set(key, folga);
  });

  // Mobile card view - group by cartomante
  const renderMobileCards = () => {
    if (filteredCartomantes.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="space-y-4">
        {filteredCartomantes.map((cartomante) => {
          const cartomanteFolgas = folgasAprovadas.filter(
            (f) => f.cartomante_nome === cartomante
          );

          if (cartomanteFolgas.length === 0) return null;

          return (
            <div key={cartomante} className="glass rounded-2xl border border-white/[0.06] overflow-hidden">
              {/* Cartomante header */}
              <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amethyst/15 border border-amethyst/25 flex items-center justify-center text-amethyst text-xs font-bold">
                  {cartomante.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-moonlight">{cartomante}</div>
                  <div className="text-[10px] text-silver-mist">{cartomanteFolgas.length} folga{cartomanteFolgas.length > 1 ? 's' : ''}</div>
                </div>
              </div>

              {/* Folgas list */}
              <div className="divide-y divide-white/[0.04]">
                {cartomanteFolgas
                  .filter((f) => selectedTurnoFilter === 'todos' || f.turno === selectedTurnoFilter)
                  .map((folga) => {
                    const TurnoIcon = TURNO_ICONS[folga.turno] || Sun;
                    const turnoColor = TURNO_COLORS[folga.turno] || TURNO_COLORS.manha;

                    return (
                      <div key={folga.id} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${turnoColor.bg} ${turnoColor.text}`}>
                            <TurnoIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-moonlight">
                              {DIAS_SEMANA[folga.dia_semana]}
                            </div>
                            <div className="text-[10px] text-silver-mist">
                              {capitalize(folga.turno)}
                            </div>
                          </div>
                        </div>
                        <Badge className={`text-[10px] ${turnoColor.bg} ${turnoColor.text} ${turnoColor.border} border font-medium`}>
                          Folga
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Desktop table view
  const renderDesktopTable = () => {
    if (filteredCartomantes.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="overflow-x-auto rounded-b-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-midnight/80 border-b border-white/[0.06] text-silver-mist uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3 px-4 min-w-[180px] border-r border-white/[0.04]">
                Cartomante / Turno
              </th>
              {DIAS_ARRAY.map((dia) => (
                <th
                  key={dia}
                  className="py-3 px-3 text-center min-w-[100px] border-r border-white/[0.04] last:border-r-0"
                >
                  <div className="text-moonlight font-bold">{DIA_SHORT[dia]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredCartomantes.map((cartomante, cIdx) =>
              visibleTurnos.map((turno, tIdx) => {
                const TurnoIcon = TURNO_ICONS[turno];
                const turnoColor = TURNO_COLORS[turno];
                const isFirstRowOfCartomante = tIdx === 0;

                return (
                  <tr
                    key={`${cartomante}-${turno}`}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      isFirstRowOfCartomante && cIdx > 0 ? 'border-t-2 border-white/[0.06]' : ''
                    }`}
                  >
                    <td className="py-2.5 px-4 border-r border-white/[0.04] bg-midnight/40">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-amethyst/10 border border-amethyst/20 flex items-center justify-center text-amethyst font-bold text-[10px]">
                          {cartomante.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-moonlight text-xs">{cartomante}</div>
                          <div className={`text-[10px] flex items-center gap-1 ${turnoColor.text}`}>
                            <TurnoIcon className="w-2.5 h-2.5" />
                            {capitalize(turno)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {DIAS_ARRAY.map((dia) => {
                      const key = `${cartomante}-${dia}-${turno}`;
                      const temFolga = escalaMap.has(key);

                      return (
                        <td
                          key={key}
                          className="py-2.5 px-2 text-center border-r border-white/[0.04] last:border-r-0"
                        >
                          {temFolga ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${turnoColor.bg} ${turnoColor.text} ${turnoColor.border} border`}>
                              Folga
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-silver-mist/40 text-[10px]">
                              <span className="w-1 h-1 rounded-full bg-silver-mist/30" />
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="p-12 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-twilight border border-white/[0.06] flex items-center justify-center mx-auto text-amber-gold">
        <Calendar className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-moonlight">Nenhuma escala registrada</p>
      <p className="text-xs text-silver-mist max-w-xs mx-auto">
        Ainda não há folgas aprovadas para exibir. Solicite uma folga para começar.
      </p>
    </div>
  );

  return (
    <div className="page-enter space-y-4">
      {/* Search & Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-silver-mist absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Buscar cartomante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-midnight border-white/[0.08] text-moonlight placeholder:text-silver-mist/50 text-xs pl-9 h-10 rounded-xl"
          />
        </div>

        {/* Turno filter + Refresh */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedTurnoFilter('todos')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              selectedTurnoFilter === 'todos'
                ? 'chip-selected'
                : 'chip-idle hover:text-slate-300'
            }`}
          >
            Todos
          </button>
          {TURNOS_ARRAY.map((t) => {
            const Icon = TURNO_ICONS[t];
            return (
              <button
                key={t}
                onClick={() => setSelectedTurnoFilter(t)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  selectedTurnoFilter === t
                    ? 'chip-selected'
                    : 'chip-idle hover:text-slate-300'
                }`}
              >
                <Icon className="w-3 h-3" />
                {capitalize(t)}
              </button>
            );
          })}

          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex-shrink-0 text-silver-mist hover:text-moonlight h-8 w-8 p-0 ml-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="p-12 text-center">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-amber-gold mb-2" />
          <p className="text-xs text-silver-mist">Carregando escala...</p>
        </div>
      ) : (
        <>
          {/* Mobile: cards, Desktop: table */}
          <div className="lg:hidden">
            {renderMobileCards()}
          </div>
          <div className="hidden lg:block glass rounded-2xl border border-white/[0.06] overflow-hidden">
            {renderDesktopTable()}
          </div>
        </>
      )}
    </div>
  );
}

export default TabelaEscala;

import React, { useState, useMemo } from 'react';
import { Moon, Sun, Sunset, Calendar, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DIAS_ARRAY, TURNOS_ARRAY, DIAS_SEMANA, TURNOS, DIA_SHORT } from '@/utils/constants';
import { capitalize } from '@/utils/formatters';

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

export function TabelaEscala({ folgas = [], loading = false, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTurnoFilter, setSelectedTurnoFilter] = useState('todos');

  // Filter only approved folgas for the schedule (memorizado)
  const folgasAprovadas = useMemo(() => {
    return folgas.filter((f) => f.status === 'aprovada' || !f.status);
  }, [folgas]);

  // Extract unique cartomantes (memorizado)
  const allCartomantes = useMemo(() => {
    return [...new Set(folgas.map((f) => f.cartomante_nome))].filter(Boolean);
  }, [folgas]);

  // Filter by search (memorizado)
  const filteredCartomantes = useMemo(() => {
    return allCartomantes.filter((nome) =>
      nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCartomantes, searchTerm]);

  // Filter turnos to show
  const visibleTurnos =
    selectedTurnoFilter === 'todos' ? TURNOS_ARRAY : [selectedTurnoFilter];

  // Map approved folgas (memorizado)
  const escalaMap = useMemo(() => {
    const map = new Map();
    folgasAprovadas.forEach((folga) => {
      const key = `${folga.cartomante_nome}-${folga.dia_semana}-${folga.turno}`;
      map.set(key, folga);
    });
    return map;
  }, [folgasAprovadas]);

  // Skeleton loading
  const renderSkeleton = () => (
    <div className="space-y-4">
      <div className="skeleton h-10 w-full" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-8 w-20" />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-24 w-full rounded-2xl" />
      ))}
    </div>
  );

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
                            <TurnoIcon className="w-3.5 h-3.5" aria-hidden="true" />
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
                        <Badge className={`text-[10px] ${turnoColor.bg} ${turnoColor.text} ${turnoColor.border} border font-medium touch-compact`}>
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

  // Desktop table view (1 linha por cartomante com indicação do turno escolhido)
  const renderDesktopTable = () => {
    if (filteredCartomantes.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="overflow-x-auto rounded-b-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-midnight/80 border-b border-white/[0.06] text-silver-mist uppercase tracking-wider font-semibold text-[11px]">
              <th className="py-3 px-4 min-w-[200px] border-r border-white/[0.04]" scope="col">
                Cartomante
              </th>
              {DIAS_ARRAY.map((dia) => (
                <th
                  key={dia}
                  className="py-3 px-3 text-center min-w-[110px] border-r border-white/[0.04] last:border-r-0"
                  scope="col"
                >
                  <div className="text-moonlight font-bold">{DIA_SHORT[dia]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filteredCartomantes.map((cartomante) => {
              const cartomanteFolgas = folgasAprovadas.filter(
                (f) => f.cartomante_nome === cartomante
              );

              return (
                <tr
                  key={cartomante}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4 border-r border-white/[0.04] bg-midnight/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amethyst/10 border border-amethyst/20 flex items-center justify-center text-amethyst font-bold text-xs">
                        {cartomante.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-moonlight text-xs">{cartomante}</div>
                        <div className="text-[10px] text-silver-mist">
                          {cartomanteFolgas.length} folga{cartomanteFolgas.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </td>

                  {DIAS_ARRAY.map((dia) => {
                    // Localiza folga aprovada para este cartomante neste dia
                    const folgaDoDia = cartomanteFolgas.find(
                      (f) =>
                        f.dia_semana === dia &&
                        (selectedTurnoFilter === 'todos' || f.turno === selectedTurnoFilter)
                    );

                    if (!folgaDoDia) {
                      return (
                        <td
                          key={dia}
                          className="py-3 px-2 text-center border-r border-white/[0.04] last:border-r-0"
                        >
                          <span className="inline-flex items-center gap-1 text-silver-mist/40 text-[11px]">
                            —
                          </span>
                        </td>
                      );
                    }

                    const TurnoIcon = TURNO_ICONS[folgaDoDia.turno] || Sun;
                    const turnoColor = TURNO_COLORS[folgaDoDia.turno] || TURNO_COLORS.manha;

                    return (
                      <td
                        key={dia}
                        className="py-3 px-2 text-center border-r border-white/[0.04] last:border-r-0"
                      >
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold ${turnoColor.bg} ${turnoColor.text} ${turnoColor.border} border shadow-sm`}
                        >
                          <TurnoIcon className="w-3 h-3" aria-hidden="true" />
                          {capitalize(folgaDoDia.turno)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="p-12 text-center space-y-3">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-gold/10 to-amethyst/10 border border-white/[0.06] flex items-center justify-center mx-auto">
        <Calendar className="w-6 h-6 text-amber-gold" aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-moonlight">Nenhuma escala registrada</p>
      <p className="text-xs text-silver-mist max-w-xs mx-auto leading-relaxed">
        {searchTerm
          ? `Nenhum resultado para "${searchTerm}". Tente buscar por outro nome.`
          : 'Ainda não há folgas aprovadas para exibir. Solicite uma folga para começar.'}
      </p>
    </div>
  );

  return (
    <div className="page-enter space-y-4">
      {/* Search & Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-silver-mist absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <Input
            placeholder="Buscar cartomante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar escala por nome da cartomante"
            className="bg-midnight border-white/[0.08] text-moonlight placeholder:text-silver-mist/50 text-xs pl-9 h-10 rounded-xl"
          />
        </div>

        {/* Turno filter + Refresh */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Filtrar por turno">
          <button
            onClick={() => setSelectedTurnoFilter('todos')}
            aria-pressed={selectedTurnoFilter === 'todos'}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all touch-compact ${
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
                aria-pressed={selectedTurnoFilter === t}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 touch-compact ${
                  selectedTurnoFilter === t
                    ? 'chip-selected'
                    : 'chip-idle hover:text-slate-300'
                }`}
              >
                <Icon className="w-3 h-3" aria-hidden="true" />
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
              aria-label="Atualizar escala"
              className="flex-shrink-0 text-silver-mist hover:text-moonlight h-9 w-9 p-0 ml-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        renderSkeleton()
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

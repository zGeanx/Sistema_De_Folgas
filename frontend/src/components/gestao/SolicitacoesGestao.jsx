import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trash2, Clock, Search, Filter, User, Moon, Sun, Sunset } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DIAS_SEMANA, TURNOS } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';

const TURNO_ICONS = {
  manha: Sun,
  tarde: Sunset,
  noite: Moon,
};

export function SolicitacoesGestao({
  folgas = [],
  onAprovar,
  onRecusar,
  onExcluir,
  loading = false,
}) {
  const [filterStatus, setFilterStatus] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFolgas = folgas.filter((item) => {
    const matchesStatus =
      filterStatus === 'todas' ? true : item.status === filterStatus;
    const matchesSearch = item.cartomante_nome
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'aprovada':
        return (
          <Badge className="bg-jade/10 text-jade border-jade/30 border text-[10px] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Aprovada
          </Badge>
        );
      case 'recusada':
        return (
          <Badge className="bg-coral/10 text-coral border-coral/30 border text-[10px] font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Recusada
          </Badge>
        );
      case 'pendente':
      default:
        return (
          <Badge className="bg-amber-gold/10 text-amber-gold border-amber-gold/30 border text-[10px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pendente
          </Badge>
        );
    }
  };

  const statusFilters = ['todas', 'pendente', 'aprovada', 'recusada'];

  return (
    <div className="page-enter space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-silver-mist absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Buscar por cartomante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-midnight border-white/[0.08] text-moonlight placeholder:text-silver-mist/50 text-xs pl-9 h-10 rounded-xl"
        />
      </div>

      {/* Status filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] text-silver-mist mr-0.5 flex items-center gap-1 flex-shrink-0">
          <Filter className="w-3 h-3" /> Status:
        </span>
        {statusFilters.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all ${
              filterStatus === st
                ? 'chip-selected'
                : 'chip-idle hover:text-slate-300'
            }`}
          >
            {st}
          </button>
        ))}

        <Badge variant="outline" className="text-silver-mist border-white/[0.08] bg-midnight text-[10px] ml-auto flex-shrink-0">
          {filteredFolgas.length} resultado{filteredFolgas.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Cards list (mobile-friendly) */}
      {filteredFolgas.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <p className="text-sm text-silver-mist">Nenhuma solicitação encontrada.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredFolgas.map((folga) => {
            const TurnoIcon = TURNO_ICONS[folga.turno] || Sun;

            return (
              <div
                key={folga.id}
                className="glass rounded-2xl border border-white/[0.06] p-4 space-y-3 transition-all hover:border-white/[0.1]"
              >
                {/* Top row: name + status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amethyst/15 border border-amethyst/25 flex items-center justify-center text-amethyst text-xs font-bold">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-moonlight">{folga.cartomante_nome}</div>
                      <div className="text-[10px] text-silver-mist">
                        {formatDate(folga.data_solicitacao) || 'Agora'}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(folga.status)}
                </div>

                {/* Details */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-twilight border border-white/[0.04] text-moonlight">
                    <span className="text-silver-mist">Dia:</span>
                    <span className="font-medium">{DIAS_SEMANA[folga.dia_semana] || folga.dia_semana}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-twilight border border-white/[0.04] text-moonlight">
                    <TurnoIcon className="w-3 h-3 text-amber-gold" />
                    <span className="font-medium capitalize">{TURNOS[folga.turno] || folga.turno}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {folga.status !== 'aprovada' && onAprovar && (
                    <Button
                      size="sm"
                      onClick={() => onAprovar(folga.id)}
                      className="bg-jade/15 hover:bg-jade/25 text-jade border border-jade/30 h-8 px-3 text-xs font-semibold flex-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Aprovar
                    </Button>
                  )}
                  {folga.status !== 'recusada' && onRecusar && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRecusar(folga.id)}
                      className="border-coral/30 bg-coral/10 text-coral hover:bg-coral/20 h-8 px-3 text-xs font-semibold flex-1"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      Recusar
                    </Button>
                  )}
                  {onExcluir && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onExcluir(folga.id)}
                      className="text-silver-mist hover:text-coral hover:bg-coral/10 h-8 w-8 p-0 flex-shrink-0"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SolicitacoesGestao;

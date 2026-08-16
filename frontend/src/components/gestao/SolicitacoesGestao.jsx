import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trash2, Clock, Search, Filter, User, Moon, Sun, Sunset, AlertTriangle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null, folga: null });

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
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Aprovada
          </Badge>
        );
      case 'recusada':
        return (
          <Badge className="bg-coral/10 text-coral border-coral/30 border text-[10px] font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" aria-hidden="true" /> Recusada
          </Badge>
        );
      case 'pendente':
      default:
        return (
          <Badge className="bg-amber-gold/10 text-amber-gold border-amber-gold/30 border text-[10px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" aria-hidden="true" /> Pendente
          </Badge>
        );
    }
  };

  const handleAction = (type, folga) => {
    if (type === 'aprovar') {
      // Aprovar is non-destructive, execute immediately
      onAprovar?.(folga.id);
      return;
    }
    // Recusar/Excluir need confirmation
    setConfirmDialog({ open: true, type, folga });
  };

  const handleConfirmAction = () => {
    const { type, folga } = confirmDialog;
    if (type === 'recusar') {
      onRecusar?.(folga.id);
    } else if (type === 'excluir') {
      onExcluir?.(folga.id);
    }
    setConfirmDialog({ open: false, type: null, folga: null });
  };

  const confirmConfig = {
    recusar: {
      title: 'Recusar solicitação',
      description: `A folga de "${confirmDialog.folga?.cartomante_nome}" será recusada. Essa ação pode ser revertida aprovando novamente.`,
      buttonLabel: 'Recusar',
      buttonClass: 'bg-coral/15 hover:bg-coral/25 text-coral border border-coral/30',
      icon: XCircle,
      iconColor: 'text-coral',
      iconBg: 'bg-coral/10 border-coral/25',
    },
    excluir: {
      title: 'Excluir solicitação',
      description: `A folga de "${confirmDialog.folga?.cartomante_nome}" será excluída permanentemente. Essa ação não pode ser desfeita.`,
      buttonLabel: 'Excluir',
      buttonClass: 'bg-coral hover:bg-red-600 text-white border-0',
      icon: Trash2,
      iconColor: 'text-coral',
      iconBg: 'bg-coral/10 border-coral/25',
    },
  };

  const statusFilters = ['todas', 'pendente', 'aprovada', 'recusada'];

  // Skeleton loading
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-10 w-full" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-8 w-20" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-32 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="page-enter space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-silver-mist absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        <Input
          placeholder="Buscar por cartomante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar solicitações por nome da cartomante"
          className="bg-midnight border-white/[0.08] text-moonlight placeholder:text-silver-mist/50 text-xs pl-9 h-10 rounded-xl"
        />
      </div>

      {/* Status filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Filtrar por status">
        <span className="text-[11px] text-silver-mist mr-0.5 flex items-center gap-1 flex-shrink-0">
          <Filter className="w-3 h-3" aria-hidden="true" /> Status:
        </span>
        {statusFilters.map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            aria-pressed={filterStatus === st}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all touch-compact ${
              filterStatus === st
                ? 'chip-selected'
                : 'chip-idle hover:text-slate-300'
            }`}
          >
            {st}
          </button>
        ))}

        <Badge variant="outline" className="text-silver-mist border-white/[0.08] bg-midnight text-[10px] ml-auto flex-shrink-0 touch-compact">
          {filteredFolgas.length} resultado{filteredFolgas.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Cards list */}
      {filteredFolgas.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-twilight border border-white/[0.06] flex items-center justify-center mx-auto text-silver-mist">
            <FileText className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-moonlight">Nenhuma solicitação encontrada</p>
          <p className="text-xs text-silver-mist max-w-xs mx-auto">
            {searchTerm
              ? `Nenhum resultado para "${searchTerm}". Tente outro termo.`
              : 'Ainda não há solicitações neste filtro.'}
          </p>
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
                      <User className="w-3.5 h-3.5" aria-hidden="true" />
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
                    <TurnoIcon className="w-3 h-3 text-amber-gold" aria-hidden="true" />
                    <span className="font-medium capitalize">{TURNOS[folga.turno] || folga.turno}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  {folga.status !== 'aprovada' && onAprovar && (
                    <Button
                      size="sm"
                      onClick={() => handleAction('aprovar', folga)}
                      className="bg-jade/15 hover:bg-jade/25 text-jade border border-jade/30 h-9 px-3 text-xs font-semibold flex-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                      Aprovar
                    </Button>
                  )}
                  {folga.status !== 'recusada' && onRecusar && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('recusar', folga)}
                      className="border-coral/30 bg-coral/10 text-coral hover:bg-coral/20 h-9 px-3 text-xs font-semibold flex-1"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                      Recusar
                    </Button>
                  )}
                  {onExcluir && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction('excluir', folga)}
                      aria-label={`Excluir solicitação de ${folga.cartomante_nome}`}
                      className="text-silver-mist hover:text-coral hover:bg-coral/10 h-9 w-9 p-0 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Dialog for destructive actions */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, type: null, folga: null })}
      >
        <DialogContent className="glass border-white/[0.1] text-moonlight max-w-sm mx-4 rounded-2xl">
          {confirmDialog.type && confirmConfig[confirmDialog.type] && (() => {
            const cfg = confirmConfig[confirmDialog.type];
            const Icon = cfg.icon;
            return (
              <>
                <DialogHeader>
                  <div className={`mx-auto w-11 h-11 rounded-full ${cfg.iconBg} border flex items-center justify-center ${cfg.iconColor} mb-2`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <DialogTitle className="text-center text-lg font-heading text-moonlight">
                    {cfg.title}
                  </DialogTitle>
                  <DialogDescription className="text-center text-silver-mist text-xs">
                    {cfg.description}
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConfirmDialog({ open: false, type: null, folga: null })}
                    className="border-white/[0.1] bg-twilight text-silver-mist hover:bg-midnight hover:text-moonlight flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmAction}
                    className={`font-bold flex-1 ${cfg.buttonClass}`}
                  >
                    {cfg.buttonLabel}
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SolicitacoesGestao;

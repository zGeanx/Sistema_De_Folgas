import React, { useState } from 'react';
import { Moon, Sun, Sunset, User, Send, Check, AlertCircle } from 'lucide-react';
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
import { DIAS_SEMANA, DIA_SHORT } from '@/utils/constants';

const TURNOS_CONFIG = {
  manha: {
    label: 'Manhã',
    horario: '08h — 14h',
    icon: Sun,
    activeClass: 'bg-amber-500/10 border-amber-500/50 text-amber-200',
    iconColor: 'text-amber-400',
  },
  tarde: {
    label: 'Tarde',
    horario: '14h — 20h',
    icon: Sunset,
    activeClass: 'bg-orange-500/10 border-orange-500/50 text-orange-200',
    iconColor: 'text-orange-400',
  },
  noite: {
    label: 'Noite',
    horario: '20h — 02h',
    icon: Moon,
    activeClass: 'bg-purple-500/10 border-purple-500/50 text-purple-200',
    iconColor: 'text-purple-400',
  },
};

export function FormularioFolga({ onFolgaCreated }) {
  const [nome, setNome] = useState('');
  const [diaSemana, setDiaSemana] = useState('segunda');
  const [turno, setTurno] = useState('manha');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nomeError, setNomeError] = useState('');
  const [nomeTouched, setNomeTouched] = useState(false);

  const validateNome = (value) => {
    if (!value.trim()) {
      return 'Informe seu nome para continuar';
    }
    if (value.trim().length < 2) {
      return 'O nome precisa ter ao menos 2 caracteres';
    }
    return '';
  };

  const handleNomeChange = (e) => {
    const value = e.target.value;
    setNome(value);
    if (nomeTouched) {
      setNomeError(validateNome(value));
    }
  };

  const handleNomeBlur = () => {
    setNomeTouched(true);
    setNomeError(validateNome(nome));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateNome(nome);
    setNomeTouched(true);
    setNomeError(error);
    if (error) return;
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (onFolgaCreated) {
        await onFolgaCreated({
          cartomante_nome: nome.trim(),
          dia_semana: diaSemana,
          turno: turno,
        });
      }
      setNome('');
      setNomeTouched(false);
      setNomeError('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao solicitar folga:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectedTurnoConfig = TURNOS_CONFIG[turno];
  const hasNomeError = nomeTouched && !!nomeError;

  return (
    <div className="page-enter space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Nome */}
        <div className="space-y-2">
          <label htmlFor="cartomante_nome" className="text-sm font-semibold text-moonlight flex items-center gap-2">
            <User className="w-4 h-4 text-amber-gold" aria-hidden="true" />
            Seu nome
          </label>
          <Input
            id="cartomante_nome"
            type="text"
            placeholder="Ex: Madame Safira, Mestre Orion..."
            value={nome}
            onChange={handleNomeChange}
            onBlur={handleNomeBlur}
            autoComplete="name"
            aria-describedby={hasNomeError ? 'nome-error' : undefined}
            aria-invalid={hasNomeError ? 'true' : undefined}
            className={`bg-midnight border-white/[0.08] text-moonlight placeholder:text-silver-mist/60 focus:border-amber-gold/50 focus:ring-amber-gold/20 h-12 text-base sm:text-sm rounded-xl px-4 ${
              hasNomeError ? 'input-error' : ''
            }`}
          />
          {hasNomeError && (
            <p id="nome-error" className="field-error" role="alert">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {nomeError}
            </p>
          )}
        </div>

        {/* Dia da Semana */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-moonlight">
            Dia da semana
          </legend>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Object.entries(DIAS_SEMANA).map(([key, label]) => {
              const isSelected = diaSemana === key;
              const isWeekend = key === 'sabado' || key === 'domingo';

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDiaSemana(key)}
                  aria-pressed={isSelected}
                  className={`px-1 sm:px-3 py-2.5 sm:py-3 rounded-xl text-xs font-semibold border transition-all duration-200 flex flex-col items-center gap-0.5 ${
                    isSelected
                      ? 'chip-selected'
                      : 'chip-idle hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  <span className="font-bold text-[12px] sm:text-[13px]">{DIA_SHORT[key]}</span>
                  <span className={`text-[8px] sm:text-[9px] leading-tight ${isSelected ? 'text-amber-300/80' : 'text-silver-mist/60'}`}>
                    {isWeekend ? 'Fim sem.' : 'Útil'}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Turno */}
        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-moonlight">
            Turno
          </legend>
          <div className="space-y-2">
            {Object.entries(TURNOS_CONFIG).map(([key, cfg]) => {
              const isSelected = turno === key;
              const Icon = cfg.icon;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTurno(key)}
                  aria-pressed={isSelected}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left ${
                    isSelected
                      ? cfg.activeClass
                      : 'bg-midnight/60 border-white/[0.06] text-slate-300 hover:border-white/[0.1]'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-twilight ${cfg.iconColor}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{cfg.label}</div>
                    <div className={`text-xs ${isSelected ? 'opacity-70' : 'text-silver-mist'}`}>{cfg.horario}</div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-gold/20 border border-amber-gold/40 flex items-center justify-center">
                      <Check className="w-3 h-3 text-amber-gold" aria-hidden="true" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Summary + Submit */}
        <div className="glass rounded-2xl p-4 border border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-silver-mist">Resumo</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-amethyst/10 border border-amethyst/30 text-amethyst font-medium">
              {DIAS_SEMANA[diaSemana]}
            </span>
            <span className="text-silver-mist" aria-hidden="true">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-gold/10 border border-amber-gold/30 text-amber-gold font-medium">
              {SelectedTurnoConfig?.label} ({SelectedTurnoConfig?.horario})
            </span>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-amber-gold to-amber-deep hover:from-amber-deep hover:to-amber-gold text-obsidian font-bold text-sm rounded-xl shadow-lg transition-all duration-300 disabled:opacity-40"
          >
            <Send className="w-4 h-4 mr-2" aria-hidden="true" />
            Solicitar Folga
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass border-amber-gold/20 text-moonlight w-[calc(100%-2rem)] sm:w-full max-w-sm rounded-2xl">
          <DialogHeader>
            <div className="mx-auto w-11 h-11 rounded-full bg-amber-gold/10 border border-amber-gold/25 flex items-center justify-center text-amber-gold mb-2">
              <Moon className="w-5 h-5" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center text-lg font-heading text-moonlight">
              Confirmar solicitação
            </DialogTitle>
            <DialogDescription className="text-center text-silver-mist text-xs">
              Revise os dados antes de enviar
            </DialogDescription>
          </DialogHeader>

          <div className="p-3.5 rounded-xl bg-obsidian/60 border border-white/[0.06] space-y-2 text-xs my-1">
            <div className="flex justify-between">
              <span className="text-silver-mist">Cartomante</span>
              <span className="font-semibold text-amber-gold">{nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver-mist">Dia</span>
              <span className="font-semibold text-moonlight">{DIAS_SEMANA[diaSemana]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver-mist">Turno</span>
              <span className="font-semibold text-amethyst">{TURNOS_CONFIG[turno]?.label}</span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
              className="border-white/[0.1] bg-twilight text-silver-mist hover:bg-midnight hover:text-moonlight flex-1"
            >
              Voltar
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="bg-amber-gold hover:bg-amber-deep text-obsidian font-bold flex-1"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FormularioFolga;

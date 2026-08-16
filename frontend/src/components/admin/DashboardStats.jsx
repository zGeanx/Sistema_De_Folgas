import React from 'react';
import { Sparkles, CheckCircle2, Clock, XCircle, Users } from 'lucide-react';

export function DashboardStats({ folgas = [] }) {
  const total = folgas.length;
  const pendentes = folgas.filter((f) => f.status === 'pendente').length;
  const aprovadas = folgas.filter((f) => f.status === 'aprovada').length;
  const recusadas = folgas.filter((f) => f.status === 'recusada').length;
  const cartomantes = [...new Set(folgas.map((f) => f.cartomante_nome))].filter(Boolean).length;

  const stats = [
    {
      label: 'Total',
      value: total,
      icon: Sparkles,
      color: 'text-amber-gold',
      bg: 'bg-amber-gold/10',
      borderColor: 'border-amber-gold/20',
    },
    {
      label: 'Pendentes',
      value: pendentes,
      icon: Clock,
      color: 'text-amber-300',
      bg: 'bg-amber-300/10',
      borderColor: 'border-amber-300/20',
    },
    {
      label: 'Aprovadas',
      value: aprovadas,
      icon: CheckCircle2,
      color: 'text-jade',
      bg: 'bg-jade/10',
      borderColor: 'border-jade/20',
    },
    {
      label: 'Recusadas',
      value: recusadas,
      icon: XCircle,
      color: 'text-coral',
      bg: 'bg-coral/10',
      borderColor: 'border-coral/20',
    },
    {
      label: 'Cartomantes',
      value: cartomantes,
      icon: Users,
      color: 'text-amethyst',
      bg: 'bg-amethyst/10',
      borderColor: 'border-amethyst/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`glass rounded-2xl p-4 border ${stat.borderColor} transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} border ${stat.borderColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-moonlight tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs text-silver-mist mt-0.5 font-medium">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardStats;

import React, { useState } from 'react';
import { LayoutDashboard, FileText, Calendar, ChevronLeft, ChevronRight, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'solicitacoes', label: 'Solicitações', icon: FileText },
  { id: 'escala', label: 'Escala Semanal', icon: Calendar },
];

export function AdminSidebar({ activeSection, onSectionChange }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen sticky top-0 glass border-r border-white/[0.06] transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
      role="navigation"
      aria-label="Menu administrativo"
    >
      {/* Logo Area */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-gold/20 to-amethyst/20 border border-amber-gold/30 flex items-center justify-center flex-shrink-0">
            <Moon className="w-4 h-4 text-amber-gold" aria-hidden="true" />
          </div>
          {!collapsed && (
            <div className="min-w-0 animate-fade-in">
              <div className="text-sm font-bold text-moonlight truncate font-heading">Folgas</div>
              <div className="text-[10px] text-silver-mist truncate">Painel Administrativo</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1" aria-label="Seções do painel">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-amber-gold/10 text-amber-gold border border-amber-gold/20 glow-gold'
                  : 'text-silver-mist hover:text-moonlight hover:bg-white/[0.04] border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-amber-gold' : ''}`} aria-hidden="true" />
              {!collapsed && (
                <span className="truncate animate-fade-in">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-white/[0.06]">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="w-full justify-center text-silver-mist hover:text-moonlight hover:bg-white/[0.04] h-9"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              <span className="text-xs">Recolher</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

export default AdminSidebar;

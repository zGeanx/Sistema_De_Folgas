import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, Moon, ShieldCheck, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLoginPage() {
  const { isAdmin, loginAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginAdmin({ username, password });
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail
        || requestError.message
        || 'Não foi possível validar as credenciais.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-obsidian text-moonlight grid place-items-center p-4 sm:p-6">
      <section className="w-full max-w-md page-enter">
        <div className="relative overflow-hidden glass-gold rounded-3xl p-6 sm:p-8">
          <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full border border-amethyst/25" aria-hidden="true" />
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full border border-amber-gold/30" aria-hidden="true" />

          <div className="relative space-y-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-amber-gold font-semibold">Área restrita</p>
                <h1 className="mt-2 text-2xl font-heading text-moonlight">Portal de Gestão</h1>
                <p className="mt-2 text-sm text-silver-mist">Entre com uma conta administrativa para gerenciar a escala.</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-amethyst/15 border border-amethyst/30 grid place-items-center shrink-0">
                <Moon className="h-5 w-5 text-amethyst" aria-hidden="true" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="block space-y-2" htmlFor="admin-username">
                <span className="text-sm font-semibold text-moonlight">Usuário</span>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-mist" aria-hidden="true" />
                  <Input
                    id="admin-username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    required
                    className="h-12 pl-10 bg-midnight border-white/[0.1] text-moonlight"
                  />
                </div>
              </label>

              <label className="block space-y-2" htmlFor="admin-password">
                <span className="text-sm font-semibold text-moonlight">Senha</span>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-mist" aria-hidden="true" />
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-12 pl-10 bg-midnight border-white/[0.1] text-moonlight"
                  />
                </div>
              </label>

              {error && <p className="field-error" role="alert">{error}</p>}

              <Button
                type="submit"
                disabled={isSubmitting || !username || !password}
                className="w-full h-12 bg-amber-gold hover:bg-amber-deep text-obsidian font-bold"
              >
                <ShieldCheck className="h-4 w-4 mr-2" aria-hidden="true" />
                {isSubmitting ? 'Validando acesso...' : 'Entrar no painel'}
              </Button>
            </form>

            <p className="text-xs text-silver-mist leading-relaxed border-t border-white/[0.08] pt-4">
              Apenas contas com permissão administrativa podem acessar esta área.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AdminLoginPage;

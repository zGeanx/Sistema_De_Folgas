import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authService } from '@/services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getSession());

  const loginAdmin = useCallback(async (credentials) => {
    const loginData = await authService.login(credentials);

    if (!loginData.user?.is_staff) {
      throw new Error('Esta conta não possui acesso administrativo.');
    }

    const nextSession = {
      user: loginData.user,
      tokens: loginData.tokens,
    };

    authService.saveSession(nextSession);
    setSession(nextSession);
    return nextSession.user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const value = useMemo(() => ({
    user: session?.user ?? null,
    isAdmin: Boolean(session?.user?.is_staff),
    loginAdmin,
    logout,
  }), [loginAdmin, logout, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}

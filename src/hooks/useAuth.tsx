import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// In production, this integrates with Supabase Auth
// For now, we use a simple localStorage-based mock that simulates the auth flow
const ADMIN_KEY = 'commerceforge_admin_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(ADMIN_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 800));
      // Simple validation - in production this is Supabase auth
      if (email === 'admin@commerceforge.dz' && password === 'admin123') {
        const adminUser: AuthUser = { id: 'admin-1', email, role: 'admin' };
        setUser(adminUser);
        localStorage.setItem(ADMIN_KEY, JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    } catch {
      return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(ADMIN_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

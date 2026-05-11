import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { StoreSettings, ThemeSettings, CartItem, Toast } from '@/types';
import { db } from '@/lib/db';

interface StoreContextType {
  settings: StoreSettings | null;
  theme: ThemeSettings | null;
  loading: boolean;
  cart: CartItem[];
  toasts: Toast[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variantId: string | null) => void;
  updateCartQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  refreshSettings: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
    catch { return []; }
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const loadSettings = useCallback(async () => {
    try {
      const [s, t] = await Promise.all([db.getStoreSettings(), db.getThemeSettings()]);
      setSettings(s);
      setTheme(t);
      // Apply theme to document
      if (t) {
        document.documentElement.style.setProperty('--store-primary', t.primary_color);
        document.documentElement.style.setProperty('--store-secondary', t.secondary_color);
        document.documentElement.style.setProperty('--store-accent', t.accent_color);
        document.documentElement.style.setProperty('--store-text', t.text_color);
        document.documentElement.style.setProperty('--store-bg', t.bg_color);
        document.documentElement.style.setProperty('--store-card-bg', t.card_bg_color);
        document.documentElement.style.setProperty('--store-radius', `${t.border_radius}px`);
        document.documentElement.style.setProperty('--store-section-spacing', `${t.section_spacing}px`);
      }
      // Apply RTL
      if (s) {
        document.documentElement.dir = s.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = s.language;
      }
    } catch (err) {
      console.error('Failed to load store settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === item.product_id && i.variant_id === item.variant_id);
      if (existing) {
        return prev.map(i =>
          i.product_id === item.product_id && i.variant_id === item.variant_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    addToastFn({ type: 'success', title: 'تمت الإضافة', message: 'تم إضافة المنتج إلى السلة' });
  }, []);

  const removeFromCart = useCallback((productId: string, variantId: string | null) => {
    setCart(prev => prev.filter(i => !(i.product_id === productId && i.variant_id === variantId)));
  }, []);

  const updateCartQuantity = useCallback((productId: string, variantId: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(prev =>
      prev.map(i =>
        i.product_id === productId && i.variant_id === variantId ? { ...i, quantity } : i
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const addToastFn = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [{ ...toast, id }, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      settings, theme, loading,
      cart, toasts, addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartTotal, cartCount, addToast: addToastFn, removeToast,
      refreshSettings: loadSettings,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

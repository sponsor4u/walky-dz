import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X, Search, Flame } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import CartDrawer from './CartDrawer';

export default function StoreHeader() {
  const { settings, cartCount } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenu(false);
  }, [location.pathname]);

  const isRTL = document.documentElement.dir === 'rtl';

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/products', label: 'المنتجات' },
    { to: '/track-order', label: 'تتبع الطلب' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="" className="h-8 w-auto" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8573d, #f59e0b)' }}>
                <Flame className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="font-bold text-base" style={{ color: scrolled ? '#0d0d0d' : '#0d0d0d' }}>
              {settings?.store_name || 'متجري'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: '#0d0d0d' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg transition-colors hover:bg-black/[0.04]"
            >
              <ShoppingCart className="w-5 h-5" style={{ color: '#0d0d0d' }} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenu(true)}
              className="p-2 rounded-lg transition-colors hover:bg-black/[0.04] md:hidden"
            >
              <Menu className="w-5 h-5" style={{ color: '#0d0d0d' }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenu && (
        <>
          <div className="fixed inset-0 z-[1100] modal-overlay md:hidden" onClick={() => setMobileMenu(false)} />
          <div
            className="fixed top-0 bottom-0 z-[1101] w-72 p-6 md:hidden"
            style={{
              [isRTL ? 'left' : 'right']: 0,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              animation: `slideInFrom${isRTL ? 'Left' : 'Right'} 0.3s ease`,
            }}
          >
            <button onClick={() => setMobileMenu(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-black/[0.04]">
              <X className="w-5 h-5" />
            </button>
            <div className="mt-12 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block py-3 px-4 rounded-lg text-base font-medium transition-colors hover:bg-black/[0.04]"
                  style={{ color: '#0d0d0d' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

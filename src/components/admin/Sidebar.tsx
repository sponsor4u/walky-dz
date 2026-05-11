import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  LayoutDashboard, Package, Tag, FileText, ShoppingCart,
  Users, Truck, Percent, Megaphone, Star, Palette,
  Target, Settings, Image, ChevronLeft, ChevronRight,
  Flame, Store
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navGroups = [
  {
    label: 'نظرة عامة',
    items: [
      { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    ],
  },
  {
    label: 'المتجر',
    items: [
      { to: '/dashboard/products', label: 'المنتجات', icon: Package },
      { to: '/dashboard/categories', label: 'التصنيفات', icon: Tag },
      { to: '/dashboard/landing-pages', label: 'صفحات الهبوط', icon: FileText },
      { to: '/dashboard/media', label: 'الوسائط', icon: Image },
    ],
  },
  {
    label: 'الطلبات',
    items: [
      { to: '/dashboard/orders', label: 'الطلبات', icon: ShoppingCart },
      { to: '/dashboard/customers', label: 'العملاء', icon: Users },
    ],
  },
  {
    label: 'التسويق',
    items: [
      { to: '/dashboard/coupons', label: 'الكوبونات', icon: Percent },
      { to: '/dashboard/pixels', label: 'البيكسلات', icon: Target },
      { to: '/dashboard/reviews', label: 'التقييمات', icon: Star },
    ],
  },
  {
    label: 'الإعدادات',
    items: [
      { to: '/dashboard/shipping', label: 'الشحن', icon: Truck },
      { to: '/dashboard/theme', label: 'المظهر', icon: Palette },
      { to: '/dashboard/settings', label: 'إعدادات المتجر', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 right-4 z-[1100] lg:hidden p-2 rounded-lg"
        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {mobileOpen ? <ChevronRight className="w-5 h-5 text-white" /> : <ChevronLeft className="w-5 h-5 text-white" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[1040] lg:hidden modal-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 right-0 z-[1050] transition-all duration-300 flex flex-col',
          collapsed ? 'w-[64px]' : 'w-[260px]',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
        style={{
          background: '#1a1a1a',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 h-16 px-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <Flame className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-base" style={{ color: '#f0f0f0' }}>
              CommerceForge
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navGroups.map(group => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: '#8b8b8b' }}>
                  {group.label}
                </div>
              )}
              {group.items.map(item => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 h-10 rounded-lg transition-all duration-200 relative',
                      collapsed ? 'justify-center px-0' : 'px-3',
                      active
                        ? 'text-white'
                        : 'hover:bg-white/[0.04]'
                    )}
                    style={{
                      borderRight: active ? '3px solid #3b82f6' : '3px solid transparent',
                      color: active ? '#f0f0f0' : '#8b8b8b',
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && (
                      <span className="text-sm truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 h-10 px-3 rounded-lg hover:bg-white/[0.04] transition-colors"
            style={{ color: '#8b8b8b' }}
          >
            <Store className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm">عرض المتجر</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full h-8 mt-1 rounded-lg hover:bg-white/[0.04] transition-colors"
            style={{ color: '#8b8b8b' }}
          >
            {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}

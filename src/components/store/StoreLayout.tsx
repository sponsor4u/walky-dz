import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';

export default function StoreLayout() {
  const { settings, loading, refreshSettings } = useStore();

  useEffect(() => {
    refreshSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--store-bg, #fdfaf6)' }}>
        <div className="h-16 skeleton-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          <div className="skeleton-pulse h-[300px] rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-pulse h-64 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  // Maintenance Mode
  if (settings?.maintenance_mode) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fdfaf6' }}>
        <div className="text-center p-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <span className="text-3xl text-white font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0d0d0d' }}>سنعود قريباً</h1>
          <p className="text-[#8b8b8b]">نعمل على تحسين تجربتكم. سيتم إعادة فتح المتجر قريباً.</p>
          {settings?.phone && <p className="mt-4 text-sm text-[#8b8b8b]">للاستفسار: {settings.phone}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--store-bg, #fdfaf6)', color: 'var(--store-text, #0d0d0d)' }}>
      <StoreHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <StoreFooter />
    </div>
  );
}

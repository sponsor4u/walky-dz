import { useState, useEffect } from 'react';
import { Save, Store, Phone, Mail, Globe, Lock, ToggleLeft, ToggleRight } from 'lucide-react';
import { db } from '@/lib/db';
import type { StoreSettings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.getStoreSettings().then(s => { setSettings(s); setLoading(false); });
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await db.updateStoreSettings(settings);
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    setSaving(false);
  }

  function update<K extends keyof StoreSettings>(field: K, value: StoreSettings[K]) {
    setSettings(prev => prev ? { ...prev, [field]: value } : null);
  }

  if (loading || !settings) return <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton-pulse h-12 rounded-lg" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">إعدادات المتجر</h1>
        <button onClick={handleSave} disabled={saving} className="btn-gradient-admin">
          <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />حفظ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-semibold text-[#f0f0f0] flex items-center gap-2"><Store className="w-5 h-5 text-[#3b82f6]" />معلومات المتجر</h3>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">اسم المتجر</label><input value={settings.store_name} onChange={e => update('store_name', e.target.value)} className="admin-input" /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">اللغة</label><select value={settings.language} onChange={e => update('language', e.target.value as 'ar' | 'fr')} className="admin-input"><option value="ar">العربية</option><option value="fr">Français</option></select></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">العملة</label><input value={settings.currency} disabled className="admin-input opacity-50" /></div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[#8b8b8b]">وضع الصيانة</span>
            <button onClick={() => update('maintenance_mode', !settings.maintenance_mode)} className="transition-colors">
              {settings.maintenance_mode ? <ToggleRight className="w-8 h-8 text-[#f59e0b]" /> : <ToggleLeft className="w-8 h-8 text-[#8b8b8b]" />}
            </button>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-semibold text-[#f0f0f0] flex items-center gap-2"><Phone className="w-5 h-5 text-[#22c55e]" />بيانات التواصل</h3>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">الهاتف</label><input value={settings.phone} onChange={e => update('phone', e.target.value)} className="admin-input" /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">البريد الإلكتروني</label><input value={settings.email} onChange={e => update('email', e.target.value)} className="admin-input" /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">واتساب</label><input value={settings.whatsapp} onChange={e => update('whatsapp', e.target.value)} className="admin-input" /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">انستغرام</label><input value={settings.instagram} onChange={e => update('instagram', e.target.value)} className="admin-input" /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">فيسبوك</label><input value={settings.facebook} onChange={e => update('facebook', e.target.value)} className="admin-input" /></div>
        </div>

        {/* SEO */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-semibold text-[#f0f0f0] flex items-center gap-2"><Globe className="w-5 h-5 text-[#8b5cf6]" />SEO</h3>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">عنوان الميتا</label><input value={settings.seo_title} onChange={e => update('seo_title', e.target.value)} className="admin-input" /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">وصف الميتا</label><textarea value={settings.seo_description} onChange={e => update('seo_description', e.target.value)} className="admin-input !h-20 py-2" /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">شعار المتجر (URL)</label><input value={settings.logo_url} onChange={e => update('logo_url', e.target.value)} className="admin-input" placeholder="https://..." /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">الأيقونة (URL)</label><input value={settings.favicon_url} onChange={e => update('favicon_url', e.target.value)} className="admin-input" placeholder="https://..." /></div>
        </div>

        {/* Order Settings */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-semibold text-[#f0f0f0] flex items-center gap-2"><Lock className="w-5 h-5 text-[#ef4444]" />إعدادات الطلبات</h3>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">حد الطلبات لكل هاتف (24 ساعة)</label><input type="number" value={settings.max_orders_per_phone} onChange={e => update('max_orders_per_phone', parseInt(e.target.value) || 3)} className="admin-input" /></div>
          <div><label className="block text-sm text-[#8b8b8b] mb-1">حد التوصيل المجاني (دج)</label><input type="number" value={settings.free_shipping_threshold} onChange={e => update('free_shipping_threshold', parseInt(e.target.value) || 0)} className="admin-input" /></div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[#8b8b8b]">تفعيل التقييمات</span>
            <button onClick={() => update('enable_reviews', !settings.enable_reviews)} className="transition-colors">
              {settings.enable_reviews ? <ToggleRight className="w-8 h-8 text-[#22c55e]" /> : <ToggleLeft className="w-8 h-8 text-[#8b8b8b]" />}
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[#8b8b8b]">تفعيل الكوبونات</span>
            <button onClick={() => update('enable_coupons', !settings.enable_coupons)} className="transition-colors">
              {settings.enable_coupons ? <ToggleRight className="w-8 h-8 text-[#22c55e]" /> : <ToggleLeft className="w-8 h-8 text-[#8b8b8b]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

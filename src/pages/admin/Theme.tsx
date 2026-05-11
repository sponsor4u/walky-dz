import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { db } from '@/lib/db';
import type { ThemeSettings } from '@/types';

export default function ThemePage() {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    db.getThemeSettings().then(t => { setTheme(t); setLoading(false); });
  }, []);

  async function handleSave() {
    if (!theme) return;
    setSaving(true);
    await db.updateThemeSettings(theme);
    // Apply theme
    document.documentElement.style.setProperty('--store-primary', theme.primary_color);
    document.documentElement.style.setProperty('--store-secondary', theme.secondary_color);
    document.documentElement.style.setProperty('--store-accent', theme.accent_color);
    document.documentElement.style.setProperty('--store-text', theme.text_color);
    document.documentElement.style.setProperty('--store-bg', theme.bg_color);
    document.documentElement.style.setProperty('--store-card-bg', theme.card_bg_color);
    document.documentElement.style.setProperty('--store-radius', `${theme.border_radius}px`);
    setSaving(false);
  }

  function updateField<K extends keyof ThemeSettings>(field: K, value: ThemeSettings[K]) {
    setTheme(prev => prev ? { ...prev, [field]: value } : null);
  }

  if (loading || !theme) return <div className="space-y-4">{[...Array(8)].map((_, i) => <div key={i} className="skeleton-pulse h-12 rounded-lg" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">محرر المظهر</h1>
        <button onClick={handleSave} disabled={saving} className="btn-gradient-admin">
          <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-semibold text-[#f0f0f0]">الألوان</h3>
          {[
            { label: 'اللون الأساسي', field: 'primary_color' as const },
            { label: 'اللون الثانوي', field: 'secondary_color' as const },
            { label: 'لون التمييز', field: 'accent_color' as const },
            { label: 'لون النص', field: 'text_color' as const },
            { label: 'لون الخلفية', field: 'bg_color' as const },
            { label: 'لون البطاقات', field: 'card_bg_color' as const },
          ].map(({ label, field }) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-sm text-[#8b8b8b]">{label}</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8b8b8b] font-mono">{theme[field]}</span>
                <input
                  type="color"
                  value={theme[field]}
                  onChange={e => updateField(field, e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Typography & Layout */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-semibold text-[#f0f0f0]">الطباعة والتخطيط</h3>
          <div>
            <label className="block text-sm text-[#8b8b8b] mb-1">نوع الخط</label>
            <select value={theme.font_family} onChange={e => updateField('font_family', e.target.value)} className="admin-input">
              <option>Geist</option>
              <option>Inter</option>
              <option>Cairo</option>
              <option>Tajawal</option>
              <option>Noto Sans Arabic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#8b8b8b] mb-1">حجم العناوين ({theme.heading_scale}x)</label>
            <input type="range" min="0.8" max="1.5" step="0.1" value={theme.heading_scale} onChange={e => updateField('heading_scale', parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-[#8b8b8b] mb-1">حجم النص ({theme.body_size}px)</label>
            <input type="range" min="12" max="18" step="1" value={theme.body_size} onChange={e => updateField('body_size', parseInt(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-[#8b8b8b] mb-1">استدارة الزوايا ({theme.border_radius}px)</label>
            <input type="range" min="0" max="24" step="1" value={theme.border_radius} onChange={e => updateField('border_radius', parseInt(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-sm text-[#8b8b8b] mb-1">تباعد الأقسام ({theme.section_spacing}px)</label>
            <input type="range" min="40" max="120" step="8" value={theme.section_spacing} onChange={e => updateField('section_spacing', parseInt(e.target.value))} className="w-full" />
          </div>
        </div>

        {/* Style Options */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-semibold text-[#f0f0f0]">خيارات العرض</h3>
          <div>
            <label className="block text-sm text-[#8b8b8b] mb-2">نمط البطاقات</label>
            <div className="flex gap-2">
              {(['flat', 'soft_shadow', 'glass'] as const).map(s => (
                <button key={s} onClick={() => updateField('card_style', s)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${theme.card_style === s ? 'bg-[#3b82f6] text-white' : 'bg-[#2a2a2a] text-[#8b8b8b] hover:bg-[#333]'}`}>
                  {s === 'flat' ? 'مسطح' : s === 'soft_shadow' ? 'ظل خفيف' : 'زجاج'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#8b8b8b] mb-2">نمط الأزرار</label>
            <div className="flex gap-2">
              {(['filled', 'outline', 'soft'] as const).map(s => (
                <button key={s} onClick={() => updateField('button_style', s)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${theme.button_style === s ? 'bg-[#3b82f6] text-white' : 'bg-[#2a2a2a] text-[#8b8b8b] hover:bg-[#333]'}`}>
                  {s === 'filled' ? 'معبأ' : s === 'outline' ? 'إطار' : 'خفيف'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#8b8b8b] mb-2">نمط الشريط العلوي</label>
            <div className="flex gap-2">
              {(['transparent', 'solid', 'glass'] as const).map(s => (
                <button key={s} onClick={() => updateField('navbar_style', s)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${theme.navbar_style === s ? 'bg-[#3b82f6] text-white' : 'bg-[#2a2a2a] text-[#8b8b8b] hover:bg-[#333]'}`}>
                  {s === 'transparent' ? 'شفاف' : s === 'solid' ? 'ثابت' : 'زجاج'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-xl p-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-lg font-semibold text-[#f0f0f0] mb-4">معاينة مباشرة</h3>
          <div className="rounded-lg overflow-hidden" style={{ background: theme.bg_color, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="p-4" style={{ background: theme.primary_color }}>
              <div className="text-white font-semibold">شريط علوي</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-xl font-bold" style={{ color: theme.text_color }}>عنوان رئيسي</div>
              <div className="text-sm" style={{ color: theme.text_color, opacity: 0.7 }}>هذا نص توضيحي للمعاينة</div>
              <div className="flex gap-3">
                <div className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: theme.primary_color }}>زر أساسي</div>
                <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: theme.secondary_color, color: 'white' }}>زر ثانوي</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map(i => (
                  <div key={i} className="p-4 rounded-lg" style={{ background: theme.card_bg_color, boxShadow: theme.card_style === 'soft_shadow' ? '0 4px 12px rgba(0,0,0,0.08)' : theme.card_style === 'glass' ? '0 8px 32px rgba(0,0,0,0.08)' : 'none' }}>
                    <div className="h-16 rounded mb-2" style={{ background: `${theme.primary_color}20` }} />
                    <div className="text-sm font-medium" style={{ color: theme.text_color }}>بطاقة {i}</div>
                    <div className="text-xs mt-1" style={{ color: theme.accent_color }}>2,990 دج</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

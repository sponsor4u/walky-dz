import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus, Eye, Trash2, Copy, Check } from 'lucide-react';
import { db } from '@/lib/db';
import type { LandingPage } from '@/types';

export default function LandingPages() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', product_id: '' });

  useEffect(() => { loadPages(); }, []);

  async function loadPages() {
    setLoading(true);
    const data = await db.getAllLandingPages();
    setPages(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await db.createLandingPage({
      ...formData,
      sections: [],
      is_active: true,
      theme_override: {},
      seo_title: formData.name,
      seo_description: '',
    });
    setShowForm(false);
    setFormData({ name: '', slug: '', product_id: '' });
    loadPages();
  }

  async function handleDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
      await db.deleteLandingPage(id);
      loadPages();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">صفحات الهبوط ({pages.length})</h1>
        <button onClick={() => setShowForm(true)} className="btn-gradient-admin"><Plus className="w-4 h-4" />إنشاء صفحة</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(6)].map((_, i) => <div key={i} className="skeleton-pulse h-[200px] rounded-xl" />)
          : pages.map(page => (
            <div key={page.id} className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="h-32 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea20, #764ba220)' }}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#f0f0f0]">{page.sections.filter(s => s.is_active).length}</div>
                  <div className="text-xs text-[#8b8b8b]">سيكشن نشط</div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-[#f0f0f0] mb-1">{page.name}</h4>
                <p className="text-xs text-[#8b8b8b] mb-3">/{page.slug}</p>
                <div className="flex gap-2">
                  <Link to={`/lp/${page.slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium bg-[#3b82f6]/15 text-[#3b82f6] hover:bg-[#3b82f6]/25 transition-colors">
                    <Eye className="w-3 h-3" />معاينة
                  </Link>
                  <button onClick={() => handleDelete(page.id)} className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center modal-overlay" onClick={() => setShowForm(false)}>
          <div className="rounded-xl p-6 max-w-md w-full mx-4" style={{ background: '#1f1f1f', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#f0f0f0] mb-4">إنشاء صفحة هبوط</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-[#8b8b8b] mb-1">الاسم</label><input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="admin-input" /></div>
              <div><label className="block text-sm text-[#8b8b8b] mb-1">الرابط (slug)</label><input required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="admin-input" placeholder="offer-name" /></div>
              <div className="flex gap-3">
                <button type="submit" className="btn-gradient-admin flex-1">إنشاء</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg font-medium" style={{ background: '#2a2a2a', color: '#f0f0f0' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

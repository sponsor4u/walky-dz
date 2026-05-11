import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { db } from '@/lib/db';
import type { Category } from '@/types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image_url: '', sort_order: 0 });

  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    setLoading(true);
    const data = await db.getAllCategories();
    setCategories(data);
    setLoading(false);
  }

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await db.updateCategory(editing.id, { ...formData });
    } else {
      await db.createCategory({ ...formData, parent_id: null, is_active: true, seo_title: formData.name, seo_description: '' });
    }
    setShowForm(false);
    setEditing(null);
    setFormData({ name: '', slug: '', description: '', image_url: '', sort_order: 0 });
    loadCategories();
  }

  async function handleDelete(id: string) {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      await db.deleteCategory(id);
      loadCategories();
    }
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description, image_url: cat.image_url, sort_order: cat.sort_order });
    setShowForm(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">التصنيفات ({categories.length})</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="admin-input pr-10 w-[200px]" />
          </div>
          <button onClick={() => { setEditing(null); setFormData({ name: '', slug: '', description: '', image_url: '', sort_order: 0 }); setShowForm(true); }} className="btn-gradient-admin">
            <Plus className="w-4 h-4" />إضافة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(6)].map((_, i) => <div key={i} className="skeleton-pulse h-[160px] rounded-xl" />)
          : filtered.map(cat => (
            <div key={cat.id} className="rounded-xl overflow-hidden group" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="h-24 overflow-hidden relative">
                {cat.image_url ? <img src={cat.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#8b8b8b]">بدون صورة</div>}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => openEdit(cat)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg bg-white/20 hover:bg-red-500/80 text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-[#f0f0f0]">{cat.name}</h4>
                <p className="text-xs text-[#8b8b8b] mt-1 line-clamp-2">{cat.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-[#8b8b8b]">slug: {cat.slug}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: cat.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: cat.is_active ? '#22c55e' : '#ef4444' }}>
                    {cat.is_active ? 'نشط' : 'معطل'}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center modal-overlay" onClick={() => setShowForm(false)}>
          <div className="rounded-xl p-6 max-w-md w-full mx-4" style={{ background: '#1f1f1f', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#f0f0f0] mb-4">{editing ? 'تعديل التصنيف' : 'إضافة تصنيف'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm text-[#8b8b8b] mb-1">الاسم</label><input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="admin-input" /></div>
              <div><label className="block text-sm text-[#8b8b8b] mb-1">الرابط (slug)</label><input required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="admin-input" /></div>
              <div><label className="block text-sm text-[#8b8b8b] mb-1">الوصف</label><textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="admin-input !h-20 py-2" /></div>
              <div><label className="block text-sm text-[#8b8b8b] mb-1">رابط الصورة</label><input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="admin-input" placeholder="https://..." /></div>
              <div><label className="block text-sm text-[#8b8b8b] mb-1">الترتيب</label><input type="number" value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })} className="admin-input" /></div>
              <div className="flex gap-3">
                <button type="submit" className="btn-gradient-admin flex-1">حفظ</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg font-medium" style={{ background: '#2a2a2a', color: '#f0f0f0' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

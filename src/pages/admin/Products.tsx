import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus, Pencil, Trash2, Search, Eye } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const data = await db.getAllProducts();
    setProducts(data);
    setLoading(false);
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    await db.deleteProduct(id);
    setDeleteId(null);
    loadProducts();
  }

  async function toggleActive(id: string, current: boolean) {
    await db.updateProduct(id, { is_active: !current });
    loadProducts();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">المنتجات</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="بحث..."
              className="admin-input pr-10 w-[200px]"
            />
          </div>
          <Link to="/dashboard/products/new" className="btn-gradient-admin">
            <Plus className="w-4 h-4" />
            إضافة منتج
          </Link>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الصورة</th>
                <th>الاسم</th>
                <th>الفئة</th>
                <th>السعر</th>
                <th>المخزون</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j}><div className="skeleton-pulse h-10 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#8b8b8b]">
                    لا توجد منتجات
                  </td>
                </tr>
              ) : (
                filtered.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ background: '#1f1f1f' }}>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#8b8b8b]">
                            <Eye className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-[#f0f0f0]">{product.name}</div>
                      <div className="text-xs text-[#8b8b8b]">{product.slug}</div>
                    </td>
                    <td className="text-[#8b8b8b]">{product.category?.name || '-'}</td>
                    <td className="font-semibold" style={{ color: '#ef4444' }}>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        onClick={() => toggleActive(product.id, product.is_active)}
                        className={cn(
                          'w-10 h-5 rounded-full transition-colors relative',
                          product.is_active ? 'bg-[#22c55e]' : 'bg-[#3f3f3f]'
                        )}
                      >
                        <div className={cn(
                          'w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all',
                          product.is_active ? 'left-[18px]' : 'left-[2px]'
                        )} />
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/products/${product.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-[#8b8b8b] hover:text-[#3b82f6]"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {}}
                          className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-[#8b8b8b] hover:text-[#3b82f6]"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-[#8b8b8b] hover:text-[#ef4444]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="rounded-xl p-6 max-w-sm w-full mx-4" style={{ background: '#1f1f1f', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#f0f0f0] mb-2">تأكيد الحذف</h3>
            <p className="text-[#8b8b8b] mb-4">هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2 rounded-lg font-medium text-white" style={{ background: '#ef4444' }}>
                حذف
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-lg font-medium" style={{ background: '#2a2a2a', color: '#f0f0f0' }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

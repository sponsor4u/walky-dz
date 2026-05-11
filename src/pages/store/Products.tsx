import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Search, SlidersHorizontal } from 'lucide-react';
import { db } from '@/lib/db';
import ProductCard from '@/components/store/ProductCard';
import type { Product, Category } from '@/types';

export default function Products() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || 'all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categorySlug) setSelectedCategory(categorySlug);
  }, [categorySlug]);

  async function loadData() {
    setLoading(true);
    const [p, c] = await Promise.all([db.getProducts(), db.getCategories()]);
    setProducts(p);
    setCategories(c);
    setLoading(false);
  }

  const filtered = products
    .filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || p.category?.slug === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'newest': default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="pt-24 pb-12 animate-[fadeIn_0.5s_ease]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0d0d0d' }}>المنتجات</h1>
          <p className="text-sm text-[#8b8b8b]">{filtered.length} منتج</p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-16 z-[50] py-3 mb-6 flex flex-wrap items-center gap-3 rounded-xl px-4" style={{ background: 'rgba(253,250,246,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث في المنتجات..." className="store-input pr-10 text-sm !h-10" />
          </div>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="store-input text-sm !h-10 !w-auto px-3">
            <option value="all">جميع الفئات</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="store-input text-sm !h-10 !w-auto px-3">
            <option value="newest">الأحدث</option>
            <option value="price-low">السعر: الأقل</option>
            <option value="price-high">السعر: الأعلى</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-pulse h-80 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <SlidersHorizontal className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">لا توجد منتجات مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

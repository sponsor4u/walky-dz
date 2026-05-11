import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import ProductCard from '@/components/store/ProductCard';
import type { Product, Category, HomepageSection } from '@/types';
import { Truck, HandCoins, Shield, Headphones, Star, ChevronLeft } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, c, s] = await Promise.all([
        db.getFeaturedProducts(),
        db.getCategories(),
        db.getHomepageSections(),
      ]);
      setProducts(p);
      setCategories(c);
      setSections(s);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="pt-16 space-y-8">
        <div className="skeleton-pulse h-[400px] rounded-none" />
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-pulse h-48 rounded-xl" />)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-pulse h-72 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.5s_ease]">
      {/* Hero Section */}
      <section
        className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center text-center px-4"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
        <div className="relative z-10 max-w-2xl mx-auto animate-[slideUp_0.6s_ease]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            أفضل المنتجات بأسعار مميزة
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8">
            توصيل سريع لجميع ولايات الجزائر - الدفع عند الاستلام
          </p>
          <Link to="/products" className="btn-primary-store inline-flex">
            تسوق الآن
            <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16" style={{ background: 'var(--store-bg, #fdfaf6)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#0d0d0d' }}>تصفح حسب الفئة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-square"
              >
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span className="text-white font-semibold">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16" style={{ background: 'var(--store-bg, #fdfaf6)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{ color: '#0d0d0d' }}>منتجات مميزة</h2>
            <Link to="/products" className="text-sm font-medium hover:underline" style={{ color: '#e8573d' }}>
              عرض الكل
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden h-[200px] md:h-[280px]">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent flex items-center justify-end p-8">
              <div className="text-right text-white">
                <h3 className="text-2xl font-bold mb-2">عروض حصرية</h3>
                <p className="mb-4">خصومات تصل إلى 50% على منتجات مختارة</p>
                <Link to="/products" className="btn-primary-store inline-flex text-sm px-6 py-3">
                  اكتشف العروض
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16" style={{ background: 'var(--store-bg, #fdfaf6)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#0d0d0d' }}>لماذا تختارنا؟</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <HandCoins className="w-10 h-10" />, title: 'الدفع عند الاستلام', desc: 'ادفع نقداً عند استلام طلبك' },
              { icon: <Truck className="w-10 h-10" />, title: 'توصيل سريع', desc: '1-3 أيام عمل لجميع الولايات' },
              { icon: <Shield className="w-10 h-10" />, title: 'جودة مضمونة', desc: 'منتجات أصلية 100%' },
              { icon: <Headphones className="w-10 h-10" />, title: 'دعم مخصص', desc: 'فريق جاهز لمساعدتك' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <div className="mb-4" style={{ color: '#e8573d' }}>{item.icon}</div>
                <h4 className="font-semibold mb-1" style={{ color: '#0d0d0d' }}>{item.title}</h4>
                <p className="text-sm text-[#8b8b8b]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16" style={{ background: '#f4f1ed' }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#0d0d0d' }}>آراء عملائنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'أحمد من الجزائر العاصمة', text: 'تجربة رائعة! المنتج وصل بسرعة وجودة ممتازة. أنصح الجميع بالشراء من هذا المتجر.', rating: 5 },
              { name: 'سارة من وهران', text: 'خدمة عملاء ممتازة والتوصيل كان سريع جداً. المنتج مطابق للوصف تماماً.', rating: 5 },
              { name: 'محمد من قسنطينة', text: 'أفضل متجر إلكتروني جربته في الجزائر. أسعار منافسة وجودة عالية.', rating: 4 },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl p-6 bg-white" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-[#525252] mb-4 leading-relaxed">"{t.text}"</p>
                <div className="font-medium text-sm" style={{ color: '#0d0d0d' }}>{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

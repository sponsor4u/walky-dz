import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ShoppingCart, Star, ChevronLeft, Check, HelpCircle, Clock, Phone } from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/lib/utils';
import type { LandingPage, Product } from '@/types';

export default function LandingPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { addToCart } = useStore();
  const [page, setPage] = useState<LandingPage | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (slug) loadPage();
  }, [slug]);

  async function loadPage() {
    setLoading(true);
    const lp = await db.getLandingPageBySlug(slug!);
    setPage(lp || null);
    if (lp?.product_id) {
      const products = await db.getProducts();
      setProduct(products.find(p => p.id === lp.product_id) || null);
    }
    setLoading(false);
  }

  function handleAddToCart() {
    if (!product) return;
    addToCart({
      product_id: product.id, variant_id: null,
      name: product.name, slug: product.slug,
      image: product.images?.[0] || '', price: product.price, quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return <div className="pt-20"><div className="skeleton-pulse h-screen" /></div>;
  if (!page) return <div className="pt-24 text-center py-20"><p>الصفحة غير موجودة</p></div>;

  const heroSection = page.sections.find(s => s.type === 'hero');
  const offerSection = page.sections.find(s => s.type === 'offer');
  const benefitsSection = page.sections.find(s => s.type === 'benefits');
  const reviewsSection = page.sections.find(s => s.type === 'reviews');
  const faqSection = page.sections.find(s => s.type === 'faq');
  const stickyCta = page.sections.find(s => s.type === 'sticky_cta');

  return (
    <div className="animate-[fadeIn_0.5s_ease]">
      {/* Hero */}
      {heroSection && (
        <section className="relative min-h-[500px] flex items-center justify-center text-center px-4 text-white"
          style={{ background: heroSection.settings.background_type === 'image' ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${heroSection.settings.background_value})` : 'linear-gradient(135deg, #667eea, #764ba2)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="max-w-2xl mx-auto pt-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{heroSection.settings.heading}</h1>
            <p className="text-lg md:text-xl text-white/80 mb-6">{heroSection.settings.subtitle}</p>
            <a href="#checkout" className="btn-primary-store inline-flex">{heroSection.settings.cta_text}<ChevronLeft className="w-5 h-5" /></a>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefitsSection && (
        <section className="py-16" style={{ background: 'var(--store-bg, #fdfaf6)' }}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#0d0d0d' }}>{benefitsSection.settings.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefitsSection.settings.items?.map((item: any, i: number) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(232,87,61,0.1)' }}>
                    <Check className="w-6 h-6" style={{ color: '#e8573d' }} />
                  </div>
                  <h4 className="font-semibold mb-1" style={{ color: '#0d0d0d' }}>{item.title}</h4>
                  <p className="text-sm text-[#8b8b8b]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offer */}
      {offerSection && product && (
        <section id="checkout" className="py-16" style={{ background: '#f4f1ed' }}>
          <div className="max-w-lg mx-auto px-4">
            <div className="rounded-2xl overflow-hidden bg-white" style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
              <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #e8573d, #f59e0b)' }}>
                <h2 className="text-2xl font-bold text-white mb-1">{offerSection.settings.title}</h2>
                <p className="text-white/80">{offerSection.settings.subtitle}</p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center gap-4 mb-6">
                  {offerSection.settings.original_price && (
                    <span className="text-xl text-[#8b8b8b] line-through">{formatPrice(offerSection.settings.original_price)}</span>
                  )}
                  <span className="text-3xl font-bold" style={{ color: '#ef4444' }}>{formatPrice(offerSection.settings.sale_price || product.price)}</span>
                </div>
                <button onClick={handleAddToCart} className="btn-primary-store w-full text-lg" style={{ height: 56 }}>
                  {added ? 'تمت الإضافة!' : (offerSection.settings.cta_text || 'اطلب الآن')}
                </button>
                <p className="text-center text-xs text-[#8b8b8b] mt-3 flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3" />الدفع عند الاستلام - توصيل سريع
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviewsSection && (
        <section className="py-16" style={{ background: 'var(--store-bg, #fdfaf6)' }}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#0d0d0d' }}>{reviewsSection.settings.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviewsSection.settings.reviews?.map((review: any, i: number) => (
                <div key={i} className="p-5 rounded-xl bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-gray-300'}`} />)}
                  </div>
                  <p className="text-sm text-[#525252] mb-2">"{review.text}"</p>
                  <p className="text-xs font-medium text-[#8b8b8b]">— {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqSection && (
        <section className="py-16" style={{ background: '#f4f1ed' }}>
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#0d0d0d' }}>{faqSection.settings.title}</h2>
            <div className="space-y-3">
              {faqSection.settings.items?.map((item: any, i: number) => (
                <div key={i} className="rounded-xl p-5 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#e8573d' }} />
                    <div>
                      <h4 className="font-medium text-sm mb-1" style={{ color: '#0d0d0d' }}>{item.q}</h4>
                      <p className="text-sm text-[#8b8b8b]">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky CTA */}
      {stickyCta && product && (
        <div className="sticky-cta">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="text-right">
              <p className="font-bold">{stickyCta.settings.text}</p>
              <p className="text-xs text-white/80">{stickyCta.settings.subtext}</p>
            </div>
            <button onClick={handleAddToCart} className="px-6 py-2.5 rounded-lg bg-white font-semibold text-sm shrink-0" style={{ color: '#e8573d' }}>
              {added ? 'تم!' : 'اطلب الآن'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ShoppingCart, Truck, Shield, Star, ChevronLeft, Check } from 'lucide-react';
import { db } from '@/lib/db';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (slug) loadProduct();
  }, [slug]);

  async function loadProduct() {
    setLoading(true);
    const p = await db.getProductBySlug(slug!);
    setProduct(p || null);
    setLoading(false);
    setSelectedImage(0);
    setSelectedVariant(null);
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!product) return;
    const variant = product.variants?.find(v => v.id === selectedVariant);
    addToCart({
      product_id: product.id,
      variant_id: selectedVariant,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || '',
      price: product.price + (variant?.price_adjustment || 0),
      quantity,
      variant_label: variant ? `${variant.type === 'color' ? variant.value : ''} ${variant.type === 'size' ? variant.value : ''}`.trim() : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton-pulse h-[400px] rounded-xl" />
          <div className="space-y-4">
            <div className="skeleton-pulse h-8 rounded w-3/4" />
            <div className="skeleton-pulse h-6 rounded w-1/4" />
            <div className="skeleton-pulse h-20 rounded" />
            <div className="skeleton-pulse h-12 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 text-center py-20">
        <p className="text-gray-500">المنتج غير موجود</p>
        <Link to="/products" className="text-[#e8573d] hover:underline mt-2 inline-block">العودة للمنتجات</Link>
      </div>
    );
  }

  const colorVariants = product.variants?.filter(v => v.type === 'color') || [];
  const sizeVariants = product.variants?.filter(v => v.type === 'size') || [];
  const hasDiscount = product.compare_price > product.price;
  const currentPrice = product.price + (product.variants?.find(v => v.id === selectedVariant)?.price_adjustment || 0);

  return (
    <div className="pt-24 pb-12 animate-[fadeIn_0.5s_ease]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8b8b8b] mb-6">
          <Link to="/" className="hover:text-[#e8573d] transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <Link to="/products" className="hover:text-[#e8573d] transition-colors">المنتجات</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-[#0d0d0d]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden mb-4" style={{ background: '#f4f1ed' }}>
              <img src={product.images?.[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${selectedImage === i ? 'border-[#e8573d]' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: '#0d0d0d' }}>{product.name}</h1>
            <p className="text-sm text-[#8b8b8b] mb-4">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-[#f59e0b] fill-[#f59e0b]' : 'text-gray-300'}`} />)}
              </div>
              <span className="text-sm text-[#8b8b8b]">(12 تقييم)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold" style={{ color: '#ef4444' }}>{formatPrice(currentPrice)}</span>
              {hasDiscount && (
                <span className="text-lg text-[#8b8b8b] line-through">{formatPrice(product.compare_price)}</span>
              )}
            </div>

            {/* Variants - Colors */}
            {colorVariants.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#0d0d0d' }}>اللون</label>
                <div className="flex gap-2">
                  {colorVariants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      title={v.value}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedVariant === v.id ? 'ring-2 ring-offset-2' : ''}`}
                      style={{
                        background: v.hex_code || '#ccc',
                        borderColor: selectedVariant === v.id ? '#e8573d' : 'transparent',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Variants - Sizes */}
            {sizeVariants.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: '#0d0d0d' }}>المقاس</label>
                <div className="flex gap-2">
                  {sizeVariants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${selectedVariant === v.id ? 'border-[#e8573d] text-[#e8573d] bg-[#e8573d]/5' : 'border-gray-200 text-[#525252] hover:border-gray-300'}`}
                    >
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#0d0d0d' }}>الكمية</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-medium">-</button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors text-lg font-medium">+</button>
                <span className="text-sm text-[#8b8b8b] mr-4">{product.stock} متوفر</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
                style={{ background: added ? '#22c55e' : '#e8573d' }}
              >
                {added ? <><Check className="w-5 h-5" />تم الإضافة</> : <><ShoppingCart className="w-5 h-5" />أضف إلى السلة</>}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
                <Truck className="w-5 h-5 mb-1 text-[#8b8b8b]" />
                <span className="text-[10px] text-[#8b8b8b]">توصيل سريع</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
                <Shield className="w-5 h-5 mb-1 text-[#8b8b8b]" />
                <span className="text-[10px] text-[#8b8b8b]">جودة مضمونة</span>
              </div>
              <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
                <Check className="w-5 h-5 mb-1 text-[#8b8b8b]" />
                <span className="text-[10px] text-[#8b8b8b]">دفع عند الاستلام</span>
              </div>
            </div>

            {/* Description */}
            {product.rich_text && (
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#0d0d0d' }}>الوصف</h3>
                <div className="prose prose-sm max-w-none text-[#525252] leading-relaxed" dangerouslySetInnerHTML={{ __html: product.rich_text }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

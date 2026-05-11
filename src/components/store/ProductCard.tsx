import { Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product_id: product.id,
      variant_id: null,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || '',
      price: product.price,
      quantity: 1,
    });
  };

  const hasDiscount = product.compare_price > product.price;

  return (
    <div className="product-card group flex flex-col h-full">
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images?.[0] || ''}
            alt={product.name}
            className="product-card-image w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
          />
          {product.is_featured && (
            <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: '#e8573d' }}>
              مميز
            </span>
          )}
          {hasDiscount && (
            <span className="absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-bold text-white" style={{ background: '#22c55e' }}>
              خصم {Math.round((1 - product.price / product.compare_price) * 100)}%
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold mb-2 line-clamp-2 hover:text-[#e8573d] transition-colors" style={{ color: '#0d0d0d' }}>
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-[#8b8b8b] mb-3 line-clamp-2 flex-1">{product.description}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold" style={{ color: '#ef4444' }}>
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[#8b8b8b] line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          onClick={handleAddToCart}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
          style={{ background: '#e8573d' }}
        >
          <ShoppingCart className="w-4 h-4" />
          أضف إلى السلة
        </button>
      </div>
    </div>
  );
}

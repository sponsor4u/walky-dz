import { Link } from 'react-router';
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, cartTotal, removeFromCart, updateCartQuantity } = useStore();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-[1200] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 z-[1201] w-full max-w-md transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          right: 0,
          background: '#ffffff',
          boxShadow: open ? '-8px 0 32px rgba(0,0,0,0.12)' : 'none',
        }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              سلة التسوق
            </h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500">السلة فارغة</p>
                <Link to="/products" onClick={onClose} className="mt-4 text-sm font-medium hover:underline" style={{ color: '#e8573d' }}>
                  تسوق الآن
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{item.name}</h4>
                      {item.variant_label && <p className="text-xs text-gray-500">{item.variant_label}</p>}
                      <p className="text-sm font-bold mt-1" style={{ color: '#ef4444' }}>{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateCartQuantity(item.product_id, item.variant_id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-gray-300">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product_id, item.variant_id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-gray-300">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeFromCart(item.product_id, item.variant_id)} className="mr-auto p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">المجموع</span>
                <span className="text-xl font-bold" style={{ color: '#ef4444' }}>{formatPrice(cartTotal)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={onClose}
                className="btn-primary-store w-full flex items-center justify-center gap-2"
              >
                إتمام الطلب
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

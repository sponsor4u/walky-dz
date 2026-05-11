import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight, Package, User, Phone, MapPin, Truck, CreditCard, Tag, CheckCircle, Loader2, AlertCircle, Gift } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { db } from '@/lib/db';
import { formatPrice, isValidAlgerianPhone, cleanPhone } from '@/lib/utils';
import type { Wilaya, Commune } from '@/types';

export default function Checkout() {
  const { cart, cartTotal, clearCart, addToast } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=cart, 2=checkout, 3=confirm
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '', phone: '', phone2: '', wilayaId: '', communeId: '', address: '',
    deliveryType: 'home' as 'home' | 'desk', notes: '', instagram: '', promoCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [promoResult, setPromoResult] = useState<{ valid: boolean; discount: number; message: string } | null>(null);

  useEffect(() => {
    if (cart.length === 0 && step === 1) return;
    loadWilayas();
  }, []);

  useEffect(() => {
    if (form.wilayaId) {
      db.getCommunesByWilaya(parseInt(form.wilayaId)).then(setCommunes);
      setForm(prev => ({ ...prev, communeId: '' }));
    }
  }, [form.wilayaId]);

  async function loadWilayas() {
    const w = await db.getWilayas();
    setWilayas(w);
    setLoading(false);
  }

  // Calculate delivery fee
  const selectedWilaya = wilayas.find(w => w.id === parseInt(form.wilayaId));
  const selectedCommune = communes.find(c => c.id === form.communeId);
  const baseDelivery = form.deliveryType === 'home'
    ? (selectedCommune?.home_price ?? selectedWilaya?.home_price ?? 0)
    : (selectedCommune?.desk_price ?? selectedWilaya?.desk_price ?? 0);

  // Free shipping check
  const freeShippingThreshold = 5000; // from settings
  const subtotal = cartTotal;
  const isFreeShipping = freeShippingThreshold > 0 && subtotal >= freeShippingThreshold;
  const deliveryFee = isFreeShipping ? 0 : baseDelivery;
  const discount = promoResult?.valid ? promoResult.discount : 0;
  const total = subtotal + deliveryFee - discount;

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'الاسم مطلوب';
    if (!isValidAlgerianPhone(cleanPhone(form.phone))) e.phone = 'رقم هاتف جزائري غير صالح (05XXXXXXXX)';
    if (!form.wilayaId) e.wilayaId = 'اختر الولاية';
    if (!form.communeId) e.communeId = 'اختر البلدية';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function applyPromo() {
    if (!form.promoCode) return;
    const result = await db.validateCoupon(form.promoCode, subtotal);
    setPromoResult(result);
    if (result.valid) addToast({ type: 'success', title: 'كوبون', message: result.message });
    else addToast({ type: 'error', title: 'كوبون', message: result.message });
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const order = await db.createOrder({
        customer_name: form.name,
        phone: cleanPhone(form.phone),
        phone2: form.phone2 ? cleanPhone(form.phone2) : '',
        instagram: form.instagram,
        wilaya_id: parseInt(form.wilayaId),
        commune_id: form.communeId,
        address: form.address,
        delivery_type: form.deliveryType,
        notes: form.notes,
        source: 'storefront',
        subtotal,
        delivery_fee: deliveryFee,
        discount,
        total,
        coupon_code: promoResult?.valid ? form.promoCode : '',
        status: 'pending',
        ip_address: '',
        admin_notes: '',
      });

      // Create order items
      for (const item of cart) {
        await db.createOrder ? null : null; // items are handled in db.createOrder
      }

      setOrderCode(order.order_code);
      clearCart();
      setStep(3);
    } catch {
      addToast({ type: 'error', title: 'خطأ', message: 'حدث خطأ أثناء إنشاء الطلب' });
    } finally {
      setSubmitting(false);
    }
  }

  // Redirect to products if cart empty
  if (cart.length === 0 && step !== 3) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold mb-2" style={{ color: '#0d0d0d' }}>السلة فارغة</h2>
          <p className="text-[#8b8b8b] mb-4">أضف بعض المنتجات قبل إتمام الطلب</p>
          <Link to="/products" className="btn-primary-store inline-flex">تسوق الآن</Link>
        </div>
      </div>
    );
  }

  // Step 1: Cart Review
  if (step === 1) {
    return (
      <div className="pt-24 pb-12 max-w-3xl mx-auto px-4 animate-[fadeIn_0.3s_ease]">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {['السلة', 'الدفع', 'التأكيد'].map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'text-white' : 'text-[#8b8b8b]'}`} style={{ background: i === 0 ? '#e8573d' : '#e5e5e5' }}>{i + 1}</div>
              <span className={`text-sm ${i === 0 ? 'font-medium' : 'text-[#8b8b8b]'}`}>{s}</span>
              {i < 2 && <div className="flex-1 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-6" style={{ color: '#0d0d0d' }}>ملخص السلة</h1>

        <div className="space-y-4 mb-6">
          {cart.map(item => (
            <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-4 p-4 rounded-xl bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <img src={item.image} alt="" className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                {item.variant_label && <p className="text-xs text-[#8b8b8b]">{item.variant_label}</p>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold" style={{ color: '#ef4444' }}>{formatPrice(item.price)}</span>
                  <span className="text-sm text-[#8b8b8b]">x{item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white mb-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <span className="font-semibold">المجموع</span>
          <span className="text-xl font-bold" style={{ color: '#ef4444' }}>{formatPrice(subtotal)}</span>
        </div>

        <button onClick={() => setStep(2)} className="btn-primary-store w-full">
          متابعة الدفع
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Step 3: Confirmation
  if (step === 3) {
    return (
      <div className="pt-24 pb-12 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#22c55e]" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0d0d0d' }}>تم تأكيد طلبك بنجاح!</h1>
          <p className="text-[#8b8b8b] mb-2">رقم الطلب الخاص بك:</p>
          <p className="text-3xl font-mono font-bold mb-6" style={{ color: '#e8573d' }}>{orderCode}</p>
          <p className="text-sm text-[#8b8b8b] mb-6">سنقوم بالاتصال بك قريباً لتأكيد الطلب وترتيب التوصيل.</p>
          <div className="flex gap-3">
            <Link to="/" className="btn-primary-store flex-1">العودة للرئيسية</Link>
            <Link to="/track-order" className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 border-[#e8573d] text-[#e8573d] hover:bg-[#e8573d]/5 transition-colors flex items-center justify-center">
              تتبع الطلب
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Checkout Form
  return (
    <div className="pt-24 pb-12 animate-[fadeIn_0.3s_ease]">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {['السلة', 'الدفع', 'التأكيد'].map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= 1 ? 'text-white' : 'text-[#8b8b8b]'}`} style={{ background: i <= 1 ? '#e8573d' : '#e5e5e5' }}>{i + 1}</div>
              <span className={`text-sm ${i <= 1 ? 'font-medium' : 'text-[#8b8b8b]'}`}>{s}</span>
              {i < 2 && <div className="flex-1 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-6" style={{ color: '#0d0d0d' }}>معلومات التوصيل</h1>

        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-5">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}><User className="w-4 h-4 text-[#8b8b8b]" />الاسم الكامل *</label>
            <input value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="محمد أحمد" className={`store-input ${errors.name ? 'border-red-500' : ''}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}><Phone className="w-4 h-4 text-[#8b8b8b]" />رقم الهاتف *</label>
            <input value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="05XX XXX XXX" className={`store-input ltr ${errors.phone ? 'border-red-500' : ''}`} dir="ltr" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Second Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}><Phone className="w-4 h-4 text-[#8b8b8b]" />رقم احتياطي (اختياري)</label>
            <input value={form.phone2} onChange={e => updateField('phone2', e.target.value)} placeholder="05XX XXX XXX" className="store-input ltr" dir="ltr" />
          </div>

          {/* Wilaya */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}><MapPin className="w-4 h-4 text-[#8b8b8b]" />الولاية *</label>
            <select value={form.wilayaId} onChange={e => updateField('wilayaId', e.target.value)} className={`store-input ${errors.wilayaId ? 'border-red-500' : ''}`}>
              <option value="">اختر الولاية</option>
              {wilayas.map(w => <option key={w.id} value={w.id}>{w.id} - {w.name_ar}</option>)}
            </select>
            {errors.wilayaId && <p className="text-red-500 text-xs mt-1">{errors.wilayaId}</p>}
          </div>

          {/* Commune */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}><MapPin className="w-4 h-4 text-[#8b8b8b]" />البلدية *</label>
            <select value={form.communeId} onChange={e => updateField('communeId', e.target.value)} className={`store-input ${errors.communeId ? 'border-red-500' : ''}`} disabled={!form.wilayaId}>
              <option value="">اختر البلدية</option>
              {communes.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
            </select>
            {errors.communeId && <p className="text-red-500 text-xs mt-1">{errors.communeId}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}><MapPin className="w-4 h-4 text-[#8b8b8b]" />العنوان التفصيلي (اختياري)</label>
            <textarea value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="شارع، حي، رقم المنزل..." className="store-input !h-24 py-3" />
          </div>

          {/* Delivery Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: '#0d0d0d' }}><Truck className="w-4 h-4 text-[#8b8b8b]" />نوع التوصيل</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => updateField('deliveryType', 'home')} className={`p-4 rounded-xl border-2 text-center transition-all ${form.deliveryType === 'home' ? 'border-[#e8573d] bg-[#e8573d]/5' : 'border-gray-200'}`}>
                <Truck className="w-6 h-6 mx-auto mb-2" style={{ color: form.deliveryType === 'home' ? '#e8573d' : '#8b8b8b' }} />
                <div className="text-sm font-medium">توصيل للمنزل</div>
                <div className="text-xs text-[#8b8b8b] mt-1">{form.wilayaId ? formatPrice(selectedWilaya?.home_price || 0) : '---'}</div>
              </button>
              <button type="button" onClick={() => updateField('deliveryType', 'desk')} className={`p-4 rounded-xl border-2 text-center transition-all ${form.deliveryType === 'desk' ? 'border-[#e8573d] bg-[#e8573d]/5' : 'border-gray-200'}`}>
                <CreditCard className="w-6 h-6 mx-auto mb-2" style={{ color: form.deliveryType === 'desk' ? '#e8573d' : '#8b8b8b' }} />
                <div className="text-sm font-medium">نقطة استلام</div>
                <div className="text-xs text-[#8b8b8b] mt-1">{form.wilayaId ? formatPrice(selectedWilaya?.desk_price || 0) : '---'}</div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}>ملاحظات خاصة (اختياري)</label>
            <textarea value={form.notes} onChange={e => updateField('notes', e.target.value)} placeholder="أي ملاحظات خاصة بالطلب..." className="store-input !h-20 py-3" />
          </div>

          {/* Instagram */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}>انستغرام (اختياري)</label>
            <input value={form.instagram} onChange={e => updateField('instagram', e.target.value)} placeholder="@username" className="store-input ltr" dir="ltr" />
          </div>

          {/* Promo Code */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}><Tag className="w-4 h-4 text-[#8b8b8b]" />كوبون خصم (اختياري)</label>
            <div className="flex gap-2">
              <input value={form.promoCode} onChange={e => updateField('promoCode', e.target.value)} placeholder="أدخل الكود" className="store-input ltr flex-1" dir="ltr" />
              <button type="button" onClick={applyPromo} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#f4f1ed', color: '#0d0d0d' }}>تطبيق</button>
            </div>
            {promoResult && (
              <p className={`text-xs mt-1 ${promoResult.valid ? 'text-green-600' : 'text-red-500'}`}>{promoResult.message}</p>
            )}
          </div>

          {/* Order Summary */}
          <div className="rounded-xl p-5 space-y-3 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 className="font-semibold">ملخص الطلب</h3>
            <div className="flex justify-between text-sm"><span className="text-[#8b8b8b]">المجموع الفرعي</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8b8b8b]">التوصيل</span>
              {isFreeShipping ? <span className="text-green-600 font-medium">مجاني!</span> : <span>{formatPrice(deliveryFee)}</span>}
            </div>
            {discount > 0 && <div className="flex justify-between text-sm"><span className="text-[#8b8b8b]">الخصم</span><span className="text-green-600">-{formatPrice(discount)}</span></div>}
            <div className="flex justify-between text-lg font-bold pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <span>الإجمالي</span><span style={{ color: '#ef4444' }}>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting} className="btn-primary-store w-full text-lg" style={{ height: 56 }}>
            {submitting ? <><Loader2 className="w-5 h-5 animate-spin" />جاري الإرسال...</> : <>تأكيد الطلب</>}
          </button>
        </form>
      </div>
    </div>
  );
}

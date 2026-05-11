import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ChevronLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';
import type { Order } from '@/types';

export default function TrackOrder() {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch() {
    if (!search.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);
    const o = await db.getOrderByCode(search.trim());
    if (o) setOrder(o);
    else setNotFound(true);
    setLoading(false);
  }

  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered'] as const;
  const statusIcons = { pending: Clock, confirmed: CheckCircle, shipped: Truck, delivered: CheckCircle };
  const currentStepIndex = order ? statusSteps.indexOf(order.status as typeof statusSteps[number]) : -1;

  return (
    <div className="pt-24 pb-12 animate-[fadeIn_0.5s_ease]">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <Package className="w-12 h-12 mx-auto mb-3" style={{ color: '#e8573d' }} />
          <h1 className="text-2xl font-bold" style={{ color: '#0d0d0d' }}>تتبع طلبك</h1>
          <p className="text-sm text-[#8b8b8b] mt-1">أدخل رقم الطلب أو رقم الهاتف</p>
        </div>

        <div className="flex gap-2 mb-8">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="مثال: ORD-10001"
            className="store-input flex-1 ltr"
            dir="ltr"
          />
          <button onClick={handleSearch} disabled={loading} className="btn-primary-store !px-5 !py-0">
            {loading ? <Clock className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>

        {notFound && (
          <div className="text-center p-8 rounded-xl bg-red-50">
            <AlertCircle className="w-10 h-10 mx-auto text-red-400 mb-2" />
            <p className="text-red-600">لم يتم العثور على طلب بهذا الرقم</p>
          </div>
        )}

        {order && (
          <div className="space-y-6 animate-[slideUp_0.4s_ease]">
            {/* Order Card */}
            <div className="rounded-xl p-6 bg-white" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[#8b8b8b]">رقم الطلب</p>
                  <p className="font-mono text-lg font-bold" style={{ color: '#e8573d' }}>{order.order_code}</p>
                </div>
                <span className="status-badge" style={{ background: getStatusColor(order.status).bg, color: getStatusColor(order.status).text }}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#8b8b8b]">التاريخ</span><span>{formatDate(order.created_at)}</span></div>
                <div className="flex justify-between"><span className="text-[#8b8b8b]">العميل</span><span>{order.customer_name}</span></div>
                <div className="flex justify-between"><span className="text-[#8b8b8b]">الهاتف</span><span dir="ltr">{order.phone}</span></div>
                <div className="flex justify-between"><span className="text-[#8b8b8b]">العنوان</span><span>{order.wilaya?.name_ar} - {order.commune?.name_ar}</span></div>
                <div className="flex justify-between"><span className="text-[#8b8b8b]">التوصيل</span><span>{order.delivery_type === 'home' ? 'للمنزل' : 'نقطة استلام'}</span></div>
                <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <span className="font-semibold">الإجمالي</span>
                  <span className="font-bold" style={{ color: '#ef4444' }}>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-xl p-6 bg-white" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <h3 className="font-semibold mb-4">حالة الطلب</h3>
              <div className="relative">
                {statusSteps.map((step, i) => {
                  const Icon = statusIcons[step];
                  const isActive = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'text-white' : 'text-gray-400'}`} style={{ background: isActive ? (isCurrent ? '#e8573d' : '#22c55e') : '#e5e5e5' }}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div className="w-0.5 h-full mt-1" style={{ background: i < currentStepIndex ? '#22c55e' : '#e5e5e5' }} />
                        )}
                      </div>
                      <div className="pt-2">
                        <p className={`text-sm font-medium ${isActive ? 'text-[#0d0d0d]' : 'text-[#8b8b8b]'}`}>{getStatusLabel(step)}</p>
                        {isCurrent && <p className="text-xs text-[#8b8b8b] mt-0.5">الحالة الحالية</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

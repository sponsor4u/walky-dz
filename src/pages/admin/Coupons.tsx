import { useEffect, useState } from 'react';
import { Percent, Calendar, ShoppingBag } from 'lucide-react';
import { db } from '@/lib/db';
import type { Coupon } from '@/types';

export default function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCoupons(); }, []);

  async function loadCoupons() {
    const data = await db.getCoupons();
    setCoupons(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#f0f0f0]">الكوبونات</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="skeleton-pulse h-[140px] rounded-xl" />)
          : coupons.map(coupon => (
            <div key={coupon.id} className="rounded-xl p-5" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <Percent className="w-5 h-5 text-[#f59e0b]" />
                </div>
                <div>
                  <h4 className="font-mono text-lg font-bold text-[#f0f0f0]">{coupon.code}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${coupon.is_active ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                    {coupon.is_active ? 'نشط' : 'معطل'}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[#8b8b8b]">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {coupon.type === 'percentage' ? `${coupon.value}% خصم` : `${coupon.value} دج خصم`}
                </div>
                <div className="flex items-center gap-2 text-[#8b8b8b]">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  حد أدنى: {coupon.min_order} دج
                </div>
                {coupon.expires_at && (
                  <div className="flex items-center gap-2 text-[#8b8b8b]">
                    <Calendar className="w-3.5 h-3.5" />
                    ينتهي: {coupon.expires_at}
                  </div>
                )}
                <div className="text-xs text-[#8b8b8b] mt-2">
                  {coupon.uses_count} / {coupon.max_uses || '∞'} استخدام
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden mt-1" style={{ background: '#2a2a2a' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${coupon.max_uses ? (coupon.uses_count / coupon.max_uses) * 100 : 0}%`, background: '#f59e0b' }} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

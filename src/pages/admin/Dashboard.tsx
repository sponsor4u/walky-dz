import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  ShoppingBag, Package, DollarSign, Users, Truck,
  Tag, Megaphone, TrendingUp, Clock, Star,
  Plus, Eye, Truck as TruckIcon, Tag as TagIcon,
  Settings, FileText, Store, Bolt, PackagePlus
} from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import StatCard from '@/components/admin/StatCard';
import type { Order } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0, totalProducts: 0, totalRevenue: 0, activeCustomers: 0,
    totalWilayas: 0, totalCategories: 0, activeAds: 0, conversionRate: 0,
    recentOrders: [] as Order[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.getDashboardStats().then(s => { setStats(s); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton-pulse h-[120px] rounded-[20px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton-pulse h-[140px] rounded-[20px]" />)}
        </div>
      </div>
    );
  }

  const quickActions = [
    { label: 'إضافة منتج', to: '/dashboard/products', icon: PackagePlus },
    { label: 'عرض الطلبات', to: '/dashboard/orders', icon: Eye },
    { label: 'إدارة الشحن', to: '/dashboard/shipping', icon: TruckIcon },
    { label: 'التصنيفات', to: '/dashboard/categories', icon: TagIcon },
    { label: 'صفحات الهبوط', to: '/dashboard/landing-pages', icon: FileText },
    { label: 'إعدادات المتجر', to: '/dashboard/settings', icon: Settings },
    { label: 'المظهر', to: '/dashboard/theme', icon: Settings },
    { label: 'عرض المتجر', to: '/', icon: Store },
  ];

  const navCards = [
    { label: 'المنتجات', to: '/dashboard/products', icon: Package, count: `${stats.totalProducts} منتج`, desc: 'إضافة، تعديل، وحذف المنتجات' },
    { label: 'التصنيفات', to: '/dashboard/categories', icon: Tag, count: `${stats.totalCategories} تصنيف`, desc: 'تنظيم وتصنيف المنتجات' },
    { label: 'الطلبات', to: '/dashboard/orders', icon: ShoppingBag, count: `${stats.totalOrders} طلب`, desc: 'متابعة وتحديث حالة الطلبات' },
    { label: 'الشحن', to: '/dashboard/shipping', icon: Truck, count: `${stats.totalWilayas} ولاية`, desc: 'تتبع الشحنات وإعدادات التوصيل' },
    { label: 'الكوبونات', to: '/dashboard/coupons', icon: Megaphone, count: `${stats.activeAds} نشط`, desc: 'إدارة العروض والتخفيضات' },
    { label: 'الإعدادات', to: '/dashboard/settings', icon: Settings, count: 'متقدم', desc: 'تخصيص إعدادات المتجر والمظهر' },
  ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease]">
      {/* Welcome Banner */}
      <div className="rounded-[20px] p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">مرحباً بك في لوحة التحكم!</h1>
          <p className="opacity-75 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            آخر تحديث: {formatDate(new Date())}
          </p>
        </div>
        <TrendingUp className="absolute left-8 top-1/2 -translate-y-1/2 text-[4rem] opacity-20" />
      </div>

      {/* Stats Grid Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الطلبات" value={stats.totalOrders} icon={<ShoppingBag className="w-6 h-6" />} trend={12} gradientClass="gradient-orders" />
        <StatCard title="المنتجات" value={stats.totalProducts} icon={<Package className="w-6 h-6" />} trend={8} gradientClass="gradient-products" />
        <StatCard title="الإيرادات" value={formatPrice(stats.totalRevenue)} icon={<DollarSign className="w-6 h-6" />} trend={15} gradientClass="gradient-revenue" />
        <StatCard title="العملاء" value={stats.activeCustomers} icon={<Users className="w-6 h-6" />} trend={20} gradientClass="gradient-customers" />
      </div>

      {/* Stats Grid Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="الولايات المتاحة" value={stats.totalWilayas} icon={<Truck className="w-6 h-6" />} gradientClass="gradient-shipping" />
        <StatCard title="التصنيفات" value={stats.totalCategories} icon={<Tag className="w-6 h-6" />} gradientClass="gradient-ads" />
        <StatCard title="صفحات هبوط نشطة" value={stats.activeAds} icon={<Megaphone className="w-6 h-6" />} trend={5} gradientClass="gradient-ads" />
        <StatCard title="معدل التحويل" value={`${stats.conversionRate}%`} icon={<TrendingUp className="w-6 h-6" />} gradientClass="gradient-revenue" />
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl p-6" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 className="text-lg font-semibold text-[#f0f0f0] mb-4 flex items-center gap-2">
          <Bolt className="w-5 h-5 text-[#f59e0b]" />
          الإجراءات السريعة
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                target={action.to.startsWith('http') || action.to === '/' ? '_blank' : undefined}
                className="btn-gradient-admin text-sm py-3"
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ background: 'rgba(59, 130, 246, 0.9)', color: 'white' }}>
            <Clock className="w-4 h-4" />
            <h4 className="font-medium">أحدث الطلبات</h4>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {stats.recentOrders.map(order => (
              <div key={order.id} className="px-5 py-3 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
                <div>
                  <h6 className="text-sm font-medium text-[#f0f0f0]">{order.customer_name}</h6>
                  <div className="text-xs text-[#8b8b8b] mt-0.5">{order.phone}</div>
                  <div className="text-xs text-[#8b8b8b]">
                    {order.items?.map(i => i.product_name).join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#3b82f6', color: 'white' }}>
                    {formatPrice(order.total)}
                  </span>
                  <div className="text-[11px] text-[#8b8b8b] mt-1">{formatDate(order.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-4 flex items-center gap-2" style={{ background: 'rgba(34, 197, 94, 0.9)', color: 'white' }}>
            <Star className="w-4 h-4" />
            <h4 className="font-medium">المنتجات الأكثر مبيعاً</h4>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {[
              { name: 'ساعة ذكية برو', price: 3990, status: 'متوفر' },
              { name: 'سماعات لاسلكية إكس', price: 2490, status: 'متوفر' },
              { name: 'حذاء رياضي إيليت', price: 4590, status: 'متوفر' },
              { name: 'حقيبة جلد كلاسيكية', price: 5290, status: 'متوفر' },
              { name: 'ماكينة قهوة أوتوماتيكية', price: 8990, status: 'متوفر' },
            ].map((product, i) => (
              <div key={i} className="px-5 py-3 flex justify-between items-center hover:bg-white/[0.02] transition-colors">
                <div>
                  <h6 className="text-sm font-medium text-[#f0f0f0]">{product.name}</h6>
                  <div className="text-xs text-[#8b8b8b] mt-0.5">{formatPrice(product.price)}</div>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navCards.map(card => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="group rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
              style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex flex-col items-center text-center">
                <Icon className="w-10 h-10 mb-3 group-hover:text-[#3b82f6] transition-colors" style={{ color: '#8b8b8b' }} />
                <h5 className="text-base font-semibold text-[#f0f0f0] mb-1">{card.label}</h5>
                <p className="text-sm text-[#8b8b8b] mb-3">{card.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                  {card.count}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

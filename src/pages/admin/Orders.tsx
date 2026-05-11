import { useEffect, useState } from 'react';
import { Eye, Search, ChevronDown, X, Package, Phone, MapPin, Truck, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { db } from '@/lib/db';
import { formatPrice, formatDate, getStatusLabel, getStatusColor } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';

const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];
const statusIcons = { pending: ClockIcon, confirmed: CheckCircle, shipped: Truck, delivered: CheckCircle, cancelled: XCircle, returned: RotateCcw };

function ClockIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    setLoading(true);
    const data = await db.getOrders();
    setOrders(data);
    setLoading(false);
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.customer_name.includes(search) || o.phone.includes(search) || o.order_code.includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function updateStatus(orderId: string, status: OrderStatus) {
    await db.updateOrderStatus(orderId, status);
    loadOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">الطلبات ({orders.length})</h1>
        <div className="flex gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="admin-input w-[140px]"
          >
            <option value="all">جميع الحالات</option>
            {statusOptions.map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
          </select>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b8b8b]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="admin-input pr-10 w-[200px]" />
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>العميل</th>
                <th>الهاتف</th>
                <th>الولاية</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>التاريخ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <tr key={i}>{[...Array(8)].map((_, j) => <td key={j}><div className="skeleton-pulse h-10 rounded" /></td>)}</tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-[#8b8b8b]">لا توجد طلبات</td></tr>
              ) : (
                filtered.map(order => {
                  const sc = getStatusColor(order.status);
                  return (
                    <tr key={order.id}>
                      <td><span className="font-mono text-sm text-[#f0f0f0]">{order.order_code}</span></td>
                      <td className="font-medium text-[#f0f0f0]">{order.customer_name}</td>
                      <td className="text-[#8b8b8b]">{order.phone}</td>
                      <td className="text-[#8b8b8b]">{order.wilaya?.name_ar || '-'}</td>
                      <td className="font-semibold" style={{ color: '#ef4444' }}>{formatPrice(order.total)}</td>
                      <td>
                        <span className="status-badge" style={{ background: sc.bg, color: sc.text }}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="text-[#8b8b8b] text-xs">{formatDate(order.created_at)}</td>
                      <td>
                        <button onClick={() => setSelectedOrder(order)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#8b8b8b] hover:text-[#3b82f6]">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Slide Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[2000] flex justify-end">
          <div className="absolute inset-0 modal-overlay" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-[500px] h-full overflow-y-auto animate-[slideInFromRight_0.3s_ease]" style={{ background: '#1a1a1a', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-5" style={{ background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-lg font-semibold text-[#f0f0f0]">{selectedOrder.order_code}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-[#8b8b8b]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Status Timeline */}
              <div>
                <h4 className="text-sm font-medium text-[#8b8b8b] mb-4">حالة الطلب</h4>
                <div className="flex items-center gap-1">
                  {statusOptions.slice(0, 4).map((s, i) => {
                    const isActive = statusOptions.indexOf(selectedOrder.status) >= i;
                    const sc = getStatusColor(s);
                    return (
                      <div key={s} className="flex-1 flex items-center gap-1">
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: isActive ? sc.bg : '#2a2a2a', color: isActive ? sc.text : '#555' }}>
                            {i + 1}
                          </div>
                          <span className="text-[10px] text-[#8b8b8b]">{getStatusLabel(s)}</span>
                        </div>
                        {i < 3 && <div className="h-0.5 flex-1 mb-5" style={{ background: isActive ? '#22c55e' : '#2a2a2a' }} />}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {statusOptions.map(s => (
                    <button key={s} onClick={() => updateStatus(selectedOrder.id, s)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      style={{ background: selectedOrder.status === s ? getStatusColor(s).bg : '#2a2a2a', color: selectedOrder.status === s ? getStatusColor(s).text : '#8b8b8b' }}>
                      {getStatusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="pt-4">
                <h4 className="text-sm font-medium text-[#8b8b8b] mb-3">معلومات العميل</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#f0f0f0]"><Phone className="w-4 h-4 text-[#8b8b8b]" />{selectedOrder.phone}</div>
                  {selectedOrder.phone2 && <div className="text-[#8b8b8b] mr-6">{selectedOrder.phone2}</div>}
                  <div className="flex items-center gap-2 text-[#f0f0f0]"><MapPin className="w-4 h-4 text-[#8b8b8b]" />{selectedOrder.wilaya?.name_ar} - {selectedOrder.commune?.name_ar}</div>
                  {selectedOrder.address && <div className="text-[#8b8b8b] mr-6">{selectedOrder.address}</div>}
                  {selectedOrder.instagram && <div className="text-[#8b8b8b]">@{selectedOrder.instagram}</div>}
                </div>
              </div>

              {/* Order Items */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="pt-4">
                <h4 className="text-sm font-medium text-[#8b8b8b] mb-3">المنتجات</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <div className="text-sm text-[#f0f0f0]">{item.product_name}</div>
                        <div className="text-xs text-[#8b8b8b]">{item.quantity} x {formatPrice(item.unit_price)}</div>
                      </div>
                      <div className="font-medium text-[#f0f0f0]">{formatPrice(item.total)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-[#8b8b8b]">المجموع</span><span className="text-[#f0f0f0]">{formatPrice(selectedOrder.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-[#8b8b8b]">التوصيل</span><span className="text-[#f0f0f0]">{formatPrice(selectedOrder.delivery_fee)}</span></div>
                {selectedOrder.discount > 0 && <div className="flex justify-between text-sm"><span className="text-[#8b8b8b]">الخصم</span><span className="text-[#22c55e]">-{formatPrice(selectedOrder.discount)}</span></div>}
                <div className="flex justify-between text-lg font-bold pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ color: '#ef4444' }}>الإجمالي</span><span style={{ color: '#ef4444' }}>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="pt-4">
                  <h4 className="text-sm font-medium text-[#8b8b8b] mb-2">ملاحظات العميل</h4>
                  <p className="text-sm text-[#f0f0f0]">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Delivery Type */}
              <div className="flex items-center gap-2 text-sm text-[#8b8b8b] pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Truck className="w-4 h-4" />
                نوع التوصيل: {selectedOrder.delivery_type === 'home' ? 'توصيل للمنزل' : 'نقطة استلام'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

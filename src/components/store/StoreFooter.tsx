import { Link } from 'react-router';
import { Flame, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '@/hooks/useStore';

export default function StoreFooter() {
  const { settings } = useStore();

  return (
    <footer style={{ background: '#f4f1ed' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Store Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8573d, #f59e0b)' }}>
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">{settings?.store_name || 'متجري'}</span>
            </div>
            <p className="text-sm text-[#8b8b8b] leading-relaxed">
              أفضل المنتجات بأسعار مميزة مع توصيل سريع لجميع ولايات الجزائر. الدفع عند الاستلام.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-[#8b8b8b] hover:text-[#e8573d] transition-colors">الرئيسية</Link>
              <Link to="/products" className="block text-sm text-[#8b8b8b] hover:text-[#e8573d] transition-colors">المنتجات</Link>
              <Link to="/track-order" className="block text-sm text-[#8b8b8b] hover:text-[#e8573d] transition-colors">تتبع الطلب</Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">خدمة العملاء</h4>
            <div className="space-y-2">
              <span className="block text-sm text-[#8b8b8b]">الشحن والتوصيل</span>
              <span className="block text-sm text-[#8b8b8b]">سياسة الإرجاع</span>
              <span className="block text-sm text-[#8b8b8b]">الأسئلة الشائعة</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-[#8b8b8b] hover:text-[#e8573d]">
                  <Phone className="w-4 h-4" />{settings.phone}
                </a>
              )}
              {settings?.whatsapp && (
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#8b8b8b] hover:text-[#e8573d]">
                  <Phone className="w-4 h-4" />واتساب
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-[#8b8b8b] hover:text-[#e8573d]">
                  <Mail className="w-4 h-4" />{settings.email}
                </a>
              )}
              {settings?.instagram && (
                <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#8b8b8b] hover:text-[#e8573d]">
                  <MapPin className="w-4 h-4" />@{settings.instagram}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <p className="text-xs text-[#8b8b8b]">جميع الحقوق محفوظة {new Date().getFullYear()}</p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#d1fae5', color: '#16a34a' }}>
              الدفع عند الاستلام
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

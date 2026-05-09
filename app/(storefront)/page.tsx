"use client";

import { trpc } from "@/client/providers/trpc-provider";
import { Button } from "@/client/components/ui/button";
import { Badge } from "@/client/components/ui/badge";
import { formatPrice } from "@/client/lib/utils";
import {
  Truck, Shield, RotateCcw, Headphones, Star,
  ChevronLeft, ShoppingBag, Clock
} from "lucide-react";
import Link from "next/link";

export default function StoreHomePage() {
  const { data: products } = trpc.product.list.useQuery({ limit: 8 });
  const { data: sections } = trpc.homepage.getSections.useQuery();
  const { data: categories } = trpc.category.list.useQuery();

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnpNMzYgMzZ2MmgtMnYtMmgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm">
            توصيل مجاني للطلبات فوق 5000 دج
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            أفضل المنتجات بأفضل الأسعار
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            توصيل سريع لجميع ولايات الجزائر — الدفع عند الاستلام
          </p>
          <Link href="#products">
            <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg">
              تسوق الآن
              <ChevronLeft className="w-5 h-5 mr-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-[#0F1629] border-b border-[#1E2D52]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: "توصيل سريع", desc: "لجميع الولايات" },
              { icon: Shield, title: "دفع آمن", desc: "الدفع عند الاستلام" },
              { icon: RotateCcw, title: "إرجاع سهل", desc: "خلال 14 يوم" },
              { icon: Headphones, title: "دعم 24/7", desc: "فريق متخصص" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-[#141D35] border border-[#1E2D52] flex items-center justify-center mb-3">
                  <badge.icon className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-white font-medium text-sm">{badge.title}</p>
                <p className="text-slate-400 text-xs mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-12 bg-[#0A0F1E]">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-bold text-white mb-6">التصنيفات</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/products?category=${cat.id}`} className="bg-[#141D35] border border-[#1E2D52] rounded-xl p-4 text-center hover:border-blue-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[#1A2744] flex items-center justify-center mx-auto mb-2">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-white text-sm font-medium">{cat.nameAr}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section id="products" className="py-12 bg-[#0F1629]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">منتجات مميزة</h2>
            <Link href="/products" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
              عرض الكل <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products?.items.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <div className="bg-[#141D35] border border-[#1E2D52] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all">
                  <div className="aspect-square bg-gradient-to-br from-[#1A2744] to-[#0F1629] flex items-center justify-center relative">
                    <ShoppingBag className="w-16 h-16 text-[#1E2D52]" />
                    {product.comparePrice && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                        خصم
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3">{product.shortDescription}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="text-slate-500 text-sm line-through">{formatPrice(product.comparePrice)}</span>
                      )}
                    </div>
                    {product.stockStatus === "in_stock" && (
                      <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> متوفر — يمكن الطلب الآن
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {(!products || products.items.length === 0) && (
            <div className="text-center py-12 text-slate-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>لا توجد منتجات متاحة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* How to Order */}
      <section className="py-12 bg-[#0A0F1E] border-t border-[#1E2D52]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-white mb-8">كيفية الطلب</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: 1, title: "اختر منتجك", desc: "تصفح منتجاتنا واختر ما يناسبك" },
              { step: 2, title: "املأ بياناتك", desc: "ادخل عنوانك ورقم هاتفك" },
              { step: 3, title: "استلم طلبك", desc: "ادفع عند الاستلام واستمتع" },
            ].map((s) => (
              <div key={s.step} className="bg-[#141D35] border border-[#1E2D52] rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F1629] border-t border-[#1E2D52] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white font-bold text-lg mb-2">Walky DZ</p>
          <p className="text-slate-400 text-sm mb-4">أفضل المنتجات بأفضل الأسعار — توصيل لجميع ولايات الجزائر</p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <span>الدفع عند الاستلام</span>
            <span>•</span>
            <span>توصيل سريع</span>
            <span>•</span>
            <span>ضمان الجودة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

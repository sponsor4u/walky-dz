import { trpc } from "@/providers/trpc";
import { useNavigate } from "react-router";
import { ShoppingBag, Truck, Shield, Headphones, Star, ChevronRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoreHome() {
  const navigate = useNavigate();
  const { data: productsData } = trpc.product.list.useQuery({ featured: true, active: true });
  const { data: allProducts } = trpc.product.list.useQuery({ active: true });
  const { data: settings } = trpc.settings.get.useQuery();

  const products = productsData?.items ?? [];
  const categories = allProducts?.items?.slice(0, 4) ?? [];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: `${settings?.fontFamily ?? "Cairo"}, system-ui, sans-serif` }} dir="rtl">
      {/* Announcement Bar */}
      <div className="bg-[#0A0F1E] text-white text-center py-2 text-xs px-4">
        <span className="font-medium">التوصيل لجميع ولايات الجزائر</span>
        <span className="mx-2">|</span>
        <span className="text-amber-400 font-bold">الدفع عند الاستلام</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              {settings?.storeName ?? "Walky DZ"}
            </span>
          </button>
          <a
            href={`https://wa.me/${settings?.whatsappNumber ?? "213000000000"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-green-600 text-sm font-medium"
          >
            <Phone size={16} />
            <span>واتساب</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            أفضل المنتجات بأفضل الأسعار
          </h1>
          <p className="text-lg md:text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            توصيل سريع لجميع ولايات الجزائر مع الدفع عند الاستلام
          </p>
          <button
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-10 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            تسوق الآن
          </button>
        </div>
        {/* Trust Badges */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: Truck, label: "توصيل سريع" },
            { icon: Shield, label: "دفع آمن" },
            { icon: Headphones, label: "خدمة عملاء" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <item.icon size={22} className="text-amber-400" />
              </div>
              <span className="text-sm font-medium text-blue-100">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">الفئات</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
              </button>
            ))}
            {categories.length === 0 && [1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3" />
                <div className="h-4 bg-gray-100 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">منتجات مميزة</h2>
          <p className="text-gray-500 text-center mb-8">اختر من مجموعتنا المميزة من المنتجات</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => navigate(`/product/${product.slug}`)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-right"
              >
                <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                  <ShoppingBag size={48} className="text-gray-300 group-hover:scale-110 transition-transform" />
                  {product.comparePrice && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      خصم
                    </span>
                  )}
                  {product.featured && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      مميز
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 mb-3 justify-end">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-xs text-gray-400 mr-1">(4.8)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-extrabold text-blue-600">{Number(product.price).toLocaleString()} دج</span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-400 line-through">{Number(product.comparePrice).toLocaleString()} دج</span>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-blue-500 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16 text-gray-400">لا توجد منتجات حالياً</div>
          )}
        </div>
      </section>

      {/* All Products */}
      {allProducts?.items && allProducts.items.length > products.length && (
        <section className="py-10 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">جميع المنتجات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allProducts.items.filter(p => !p.featured).map((product) => (
                <button
                  key={product.id}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all text-right"
                >
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0">
                    <ShoppingBag size={28} className="text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-blue-600 font-bold mt-1">{Number(product.price).toLocaleString()} دج</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">لماذا تختارنا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "توصيل سريع", desc: "نصلك أينما كنت في الجزائر" },
              { icon: Shield, title: "دفع آمن", desc: "الدفع عند الاستلام فقط" },
              { icon: Headphones, title: "دعم 24/7", desc: "فريق خدمة عملاء جاهز" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <item.icon size={28} className="text-amber-400" />
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-blue-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0F1E] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-lg">{settings?.storeName ?? "Walky DZ"}</span>
            </div>
            <p className="text-gray-400 text-sm">
              جميع الحقوق محفوظة &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

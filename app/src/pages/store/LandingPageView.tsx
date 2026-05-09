import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { ShoppingBag, ChevronLeft, Star, Truck, Shield, Clock } from "lucide-react";

export default function LandingPageView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: page } = trpc.landing.getBySlug.useQuery({ slug: slug! });
  const { data: product } = trpc.product.getById.useQuery(
    { id: page?.productId ?? 0 },
    { enabled: !!page?.productId }
  );

  if (!page) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        الصفحة غير موجودة
      </div>
    );
  }

  const sections = (page.sections as Array<{
    id: string;
    type: string;
    enabled: boolean;
    order: number;
    content: Record<string, unknown>;
  }> | null) ?? [];

  const enabledSections = sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {page.hasNavbar && (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="font-bold text-lg text-gray-900">Walky DZ</span>
            </button>
            <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600">
              <ChevronLeft size={18} />
              <span className="text-sm">رجوع</span>
            </button>
          </div>
        </header>
      )}

      <div className="max-w-3xl mx-auto">
        {enabledSections.map((section) => (
          <div key={section.id}>
            {section.type === "hero" && (
              <section className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-16 px-6 text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
                  {(section.content as Record<string, string>).headline ?? product?.name ?? "منتج رائع"}
                </h1>
                <p className="text-blue-200 text-lg mb-6 max-w-xl mx-auto">
                  {(section.content as Record<string, string>).subheadline ?? product?.shortDescription}
                </p>
                <button
                  onClick={() => navigate(`/product/${product?.slug}`)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-10 rounded-xl text-lg transition-all hover:scale-105"
                >
                  {(section.content as Record<string, string>).ctaText ?? "اطلب الآن"}
                </button>
              </section>
            )}

            {section.type === "benefits" && (
              <section className="py-12 px-6 bg-gray-50">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">لماذا هذا المنتج؟</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {((section.content as Record<string, Array<{icon: string; title: string; description: string}>>).items ?? [
                    { title: "جودة عالية", description: "مواد فاخرة تدوم طويلاً" },
                    { title: "توصيل سريع", description: "نصلك أينما كنت" },
                    { title: "ضمان", description: "ضمان استرجاع خلال 7 أيام" },
                  ]).map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <Shield size={24} className="text-blue-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {section.type === "reviews" && (
              <section className="py-12 px-6">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">آراء العملاء</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "أحمد", rating: 5, text: "منتج ممتاز جداً! أنصح به بشدة" },
                    { name: "فاطمة", rating: 5, text: "توصيل سريع وجودة عالية. شكراً" },
                    { name: "محمد", rating: 4, text: "سعر مناسب وجودة جيدة" },
                    { name: "سارة", rating: 5, text: "أفضل منتج اشتريته هذا العام" },
                  ].map((review, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-5">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-3 text-sm">{review.text}</p>
                      <p className="text-sm font-medium text-gray-900">{review.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {section.type === "checkout" && product && (
              <section className="py-12 px-6 bg-blue-50" id="checkout">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                    <h3 className="text-white font-bold text-lg">أكمل طلبك الآن</h3>
                    <p className="text-blue-200 text-sm">الدفع عند الاستلام</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ShoppingBag size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{product.name}</h4>
                        <p className="text-blue-600 font-extrabold text-xl">{Number(product.price).toLocaleString()} دج</p>
                        {product.comparePrice && (
                          <p className="text-gray-400 line-through text-sm">{Number(product.comparePrice).toLocaleString()} دج</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-lg transition-all hover:scale-[1.02]"
                    >
                      اطلب الآن — الدفع عند الاستلام
                    </button>
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Truck size={12} /> توصيل سريع</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> 24-48 ساعة</span>
                      <span className="flex items-center gap-1"><Shield size={12} /> دفع آمن</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {section.type === "trust_badges" && (
              <section className="py-10 px-6 bg-gray-50">
                <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6">
                  {[
                    { icon: Shield, label: "دفع آمن" },
                    { icon: Truck, label: "توصيل مجاني" },
                    { icon: Clock, label: "ضمان 7 أيام" },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                        <item.icon size={24} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {section.type === "long_image" && (section.content as Record<string, string>).imageUrl && (
              <section className="py-0">
                <img
                  src={(section.content as Record<string, string>).imageUrl}
                  alt=""
                  className="w-full"
                />
              </section>
            )}
          </div>
        ))}

        {(!sections || sections.length === 0) && product && (
          <div className="py-16 px-6 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-500 mb-6">{product.description}</p>
            <button
              onClick={() => navigate(`/product/${product.slug}`)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-10 rounded-xl text-lg transition-all"
            >
              اطلب الآن
            </button>
          </div>
        )}
      </div>

      {page.hasFooter && (
        <footer className="bg-[#0A0F1E] text-white py-8 px-4 text-center">
          <p className="text-gray-400 text-sm">جميع الحقوق محفوظة &copy; {new Date().getFullYear()} Walky DZ</p>
        </footer>
      )}
    </div>
  );
}

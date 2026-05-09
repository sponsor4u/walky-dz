"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/client/providers/trpc-provider";
import Link from "next/link";
import { formatPrice } from "@/client/lib/utils";
import { Loader2 } from "lucide-react";

// Landing page builder that renders sections dynamically
function HeroSection({ content }: { content: Record<string, unknown> }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{(content.headline as string) ?? "أفضل المنتجات"}</h1>
        <p className="text-lg text-blue-100 mb-6">{(content.subheadline as string) ?? "توصيل سريع لجميع الولايات"}</p>
        {(content.ctaText as string) && (
          <a href="#checkout" className="inline-block bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-colors">
            {(content.ctaText as string)}
          </a>
        )}
      </div>
    </section>
  );
}

function BenefitsSection({ content }: { content: Record<string, unknown> }) {
  const benefits = (content.benefits as Array<{ title: string; description: string; icon: string }>) ?? [
    { title: "جودة عالية", description: "منتجات أصلية 100%", icon: "star" },
    { title: "توصيل سريع", description: "توصيل لجميع الولايات", icon: "truck" },
    { title: "دفع عند الاستلام", description: "لا حاجة لبطاقة بنكية", icon: "shield" },
  ];
  return (
    <section className="py-12 bg-[#0A0F1E]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-bold text-white text-center mb-8">{(content.title as string) ?? "لماذا تختارنا"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <div key={i} className="bg-[#141D35] border border-[#1E2D52] rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">{b.icon === "truck" ? "🚚" : b.icon === "shield" ? "🛡️" : "⭐"}</span>
              </div>
              <h3 className="text-white font-medium mb-1">{b.title}</h3>
              <p className="text-slate-400 text-sm">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ productId }: { productId: number }) {
  const { data: reviews } = trpc.review.listByProduct.useQuery({ productId });
  if (!reviews || reviews.length === 0) return null;
  return (
    <section className="py-12 bg-[#0F1629]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl font-bold text-white text-center mb-8">آراء العملاء</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#141D35] border border-[#1E2D52] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#1A2744] flex items-center justify-center text-white font-bold text-sm">{r.customerName[0]}</div>
                <span className="text-white text-sm font-medium">{r.customerName}</span>
              </div>
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => <span key={i} className={`text-sm ${i < r.rating ? "text-amber-400" : "text-slate-600"}`}>★</span>)}
              </div>
              {r.comment && <p className="text-slate-400 text-sm">{r.comment}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as Array<{ q: string; a: string }>) ?? [
    { q: "كيف أطلب المنتج؟", a: "املأ النموذج أدناه وسنتصل بك لتأكيد الطلب" },
    { q: "كم مدة التوصيل؟", a: "عادة بين 2-5 أيام حسب الولاية" },
    { q: "هل الدفع عند الاستلام متاح؟", a: "نعم! الدفع عند الاستلام متاح في جميع الولايات" },
  ];
  return (
    <section className="py-12 bg-[#0A0F1E]">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-xl font-bold text-white text-center mb-8">{(content.title as string) ?? "الأسئلة الشائعة"}</h2>
        <div className="space-y-3">
          {items.map((item, i) => (
            <details key={i} className="bg-[#141D35] border border-[#1E2D52] rounded-xl overflow-hidden group">
              <summary className="p-4 cursor-pointer text-white font-medium select-none flex items-center justify-between hover:bg-[#1A2744] transition-colors">
                {item.q}
                <span className="text-blue-400 text-lg group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 text-slate-400">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CheckoutSection({ productId }: { productId: number }) {
  return (
    <section id="checkout" className="py-12 bg-[#0F1629]">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">اطلب الآن</h2>
        <p className="text-slate-400 mb-6">املأ بياناتك وسنتصل بك لتأكيد الطلب</p>
        <Link href={`/product/${productId}`} className="inline-block bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-colors text-lg">
          الذهاب للمنتج وإتمام الطلب
        </Link>
      </div>
    </section>
  );
}

function TrustBadgesSection() {
  return (
    <section className="py-8 bg-[#0A0F1E] border-t border-[#1E2D52]">
      <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 text-center">
        {[
          { icon: "🚚", text: "توصيل سريع" },
          { icon: "🛡️", text: "دفع آمن" },
          { icon: "✅", text: "جودة مضمونة" },
          { icon: "📞", text: "دعم 24/7" },
        ].map((badge, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
            <span>{badge.icon}</span>
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: page, isLoading } = trpc.landing.getBySlug.useQuery({ slug });

  useEffect(() => {
    if (page?.id) {
      trpc.landing.incrementViews.useMutation().mutate({ id: page.id });
    }
  }, [page?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center flex-col">
        <h1 className="text-xl text-white font-bold mb-2">الصفحة غير موجودة</h1>
        <Link href="/" className="text-blue-400 hover:text-blue-300">العودة للرئيسية</Link>
      </div>
    );
  }

  const sections = (page.sections as Array<{ id: string; type: string; enabled: boolean; order: number; content: Record<string, unknown> }>) ?? [];

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Landing Page Sections */}
      {sections
        .filter((s) => s.enabled)
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          switch (section.type) {
            case "hero":
              return <HeroSection key={section.id} content={section.content} />;
            case "benefits":
              return <BenefitsSection key={section.id} content={section.content} />;
            case "reviews":
              return <ReviewsSection key={section.id} productId={page.productId ?? 0} />;
            case "faq":
              return <FAQSection key={section.id} content={section.content} />;
            case "checkout":
              return <CheckoutSection key={section.id} productId={page.productId ?? 0} />;
            case "trust_badges":
              return <TrustBadgesSection key={section.id} />;
            default:
              return (
                <section key={section.id} className="py-12 bg-[#0F1629]">
                  <div className="max-w-4xl mx-auto px-4">
                    <p className="text-slate-500 text-center">قسم: {section.type}</p>
                  </div>
                </section>
              );
          }
        })}

      {/* Default sections if none configured */}
      {sections.length === 0 && page.productId && (
        <>
          <HeroSection content={{ headline: page.name, subheadline: "توصيل سريع لجميع الولايات — الدفع عند الاستلام", ctaText: "اطلب الآن" }} />
          <TrustBadgesSection />
          <ReviewsSection productId={page.productId} />
          <FAQSection content={{}} />
          <CheckoutSection productId={page.productId} />
        </>
      )}
    </div>
  );
}

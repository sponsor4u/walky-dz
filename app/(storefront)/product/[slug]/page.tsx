"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/client/providers/trpc-provider";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Badge } from "@/client/components/ui/badge";
import { formatPrice } from "@/client/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import {
  ShoppingBag, ChevronLeft, Star, Truck, Shield,
  Phone, MapPin, Clock, Loader2, CheckCircle2, AlertTriangle
} from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
      ))}
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: product, isLoading } = trpc.product.getBySlug.useQuery({ slug });
  const { data: reviews } = trpc.review.listByProduct.useQuery(
    { productId: product?.id ?? 0 },
    { enabled: !!product?.id }
  );
  const { data: wilayasList } = trpc.shipping.listWilayas.useQuery();
  const { data: communesList, refetch: refetchCommunes } = trpc.shipping.listCommunes.useQuery(
    { wilayaId: 0 },
    { enabled: false }
  );

  const createOrderMutation = trpc.order.create.useMutation({
    onSuccess: (data) => {
      toast.success(`تم إرسال الطلب بنجاح! رقم الطلب: ${data.orderNumber}`);
      setOrderSuccess({ success: true, orderNumber: data.orderNumber });
    },
    onError: (error) => {
      toast.error(error.message || "حدث خطأ أثناء إرسال الطلب");
    },
  });

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [orderSuccess, setOrderSuccess] = useState<{ success: boolean; orderNumber: string } | null>(null);

  useEffect(() => {
    if (product?.id) {
      trpc.product.incrementViews.useMutation().mutate({ id: product.id });
    }
  }, [product?.id]);

  useEffect(() => {
    if (wilaya) {
      refetchCommunes({ queryKey: ["shipping.listCommunes", { wilayaId: Number(wilaya) }] } as any);
    }
  }, [wilaya]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center flex-col">
        <ShoppingBag className="w-16 h-16 text-slate-600 mb-4" />
        <h1 className="text-xl text-white font-bold mb-2">المنتج غير موجود</h1>
        <Link href="/" className="text-blue-400 hover:text-blue-300">العودة للرئيسية</Link>
      </div>
    );
  }

  const variantOptions = product.variantOptions as { colors?: string[]; sizes?: string[] } | null;
  const colors = variantOptions?.colors ?? [];
  const sizes = variantOptions?.sizes ?? [];
  const hasVariants = colors.length > 0 || sizes.length > 0;

  const price = parseFloat(product.price.toString());
  const comparePrice = product.comparePrice ? parseFloat(product.comparePrice.toString()) : null;
  const total = price * quantity;

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !wilaya) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (hasVariants && colors.length > 0 && !selectedColor) {
      toast.error("يرجى اختيار اللون");
      return;
    }
    if (hasVariants && sizes.length > 0 && !selectedSize) {
      toast.error("يرجى اختيار المقاس");
      return;
    }

    const wilayaObj = wilayasList?.find(w => w.id === Number(wilaya));
    const communeObj = (communesList as any)?.find?.((c: any) => c.id === Number(commune));

    createOrderMutation.mutate({
      productId: product.id,
      customerName: formData.name,
      phone: formData.phone,
      wilayaId: Number(wilaya),
      wilayaName: wilayaObj?.nameAr ?? "",
      communeId: commune ? Number(commune) : undefined,
      communeName: communeObj?.nameAr ?? undefined,
      address: formData.address,
      deliveryType,
      variantColor: selectedColor || undefined,
      variantSize: selectedSize || undefined,
      quantity,
      subtotal: total.toString(),
      total: total.toString(),
    });
  };

  if (orderSuccess?.success) {
    return (
      <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
        <div className="bg-[#141D35] border border-[#1E2D52] rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">تم إرسال الطلب بنجاح!</h1>
          <p className="text-slate-400 mb-6">سنتصل بك قريباً لتأكيد طلبك</p>
          <div className="bg-[#1A2744] rounded-lg p-4 mb-6">
            <p className="text-slate-400 text-sm">رقم الطلب</p>
            <p className="text-white font-mono font-bold text-lg">{orderSuccess.orderNumber}</p>
          </div>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full">العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E]">
      {/* Breadcrumb */}
      <div className="bg-[#0F1629] border-b border-[#1E2D52]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-400 hover:text-blue-300">الرئيسية</Link>
          <ChevronLeft className="w-4 h-4 text-slate-500" />
          {product.category && <span className="text-slate-400">{product.category.nameAr}</span>}
          <ChevronLeft className="w-4 h-4 text-slate-500" />
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <div className="bg-[#141D35] border border-[#1E2D52] rounded-2xl aspect-square flex items-center justify-center relative">
              <ShoppingBag className="w-32 h-32 text-[#1E2D52]" />
              {comparePrice && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1">
                  وفر {Math.round(((comparePrice - price) / comparePrice) * 100)}%
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
              {product.shortDescription && <p className="text-slate-400">{product.shortDescription}</p>}
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-green-400">{formatPrice(price * quantity)}</span>
              {comparePrice && (
                <span className="text-xl text-slate-500 line-through">{formatPrice(comparePrice * quantity)}</span>
              )}
            </div>

            {/* Variants */}
            {hasVariants && (
              <div className="space-y-4">
                {colors.length > 0 && (
                  <div>
                    <p className="text-white font-medium mb-2">اللون:</p>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            selectedColor === color
                              ? "border-blue-500 bg-blue-500/20 text-blue-400"
                              : "border-[#1E2D52] bg-[#1A2744] text-slate-300 hover:border-blue-500/30"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {sizes.length > 0 && (
                  <div>
                    <p className="text-white font-medium mb-2">المقاس:</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-12 h-10 rounded-lg border text-sm font-medium transition-colors ${
                            selectedSize === size
                              ? "border-blue-500 bg-blue-500/20 text-blue-400"
                              : "border-[#1E2D52] bg-[#1A2744] text-slate-300 hover:border-blue-500/30"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-white font-medium mb-2">الكمية:</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg bg-[#1A2744] border border-[#1E2D52] text-white flex items-center justify-center hover:border-blue-500">-</button>
                <span className="text-white font-bold text-lg w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg bg-[#1A2744] border border-[#1E2D52] text-white flex items-center justify-center hover:border-blue-500">+</button>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              {[
                { icon: Truck, text: "توصيل سريع لجميع الولايات" },
                { icon: Shield, text: "الدفع عند الاستلام — لا حاجة لبطاقة" },
                { icon: Clock, text: "ضمان استبدال خلال 14 يوم" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <item.icon className="w-4 h-4 text-blue-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">وصف المنتج</h2>
            <div className="bg-[#141D35] border border-[#1E2D52] rounded-xl p-6">
              <p className="text-slate-300 leading-relaxed">{product.description}</p>
            </div>
          </div>
        )}

        {/* Checkout Form */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-4">أكمل طلبك</h2>
          <div className="bg-gradient-to-br from-[#141D35] to-[#0F1629] border-2 border-blue-500/30 rounded-2xl p-6 lg:p-8">
            {createOrderMutation.error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{createOrderMutation.error.message}</p>
              </div>
            )}

            <form onSubmit={handleOrder} className="space-y-5">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-1.5 block">الاسم الكامل *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="bg-[#0F1629]"
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-1.5 block flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> رقم الهاتف (05/06/07) *
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="05XX XX XX XX"
                    required
                    pattern="^(05|06|07)\d{8}$"
                    className="bg-[#0F1629] ltr-input text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Wilaya & Commune */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-1.5 block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> الولاية *
                  </label>
                  <select
                    value={wilaya}
                    onChange={(e) => { setWilaya(e.target.value); setCommune(""); }}
                    required
                    className="w-full h-9 rounded-md border border-[#1E2D52] bg-[#0F1629] px-3 text-sm text-white"
                  >
                    <option value="">اختر الولاية</option>
                    {wilayasList?.map((w) => (
                      <option key={w.id} value={w.id}>{w.code} — {w.nameAr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white text-sm font-medium mb-1.5 block">البلدية</label>
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full h-9 rounded-md border border-[#1E2D52] bg-[#0F1629] px-3 text-sm text-white"
                  >
                    <option value="">اختر البلدية</option>
                    {communesList?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.nameAr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">العنوان التفصيلي</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="أدخل عنوانك بالتفصيل"
                  className="w-full min-h-[60px] rounded-md border border-[#1E2D52] bg-[#0F1629] px-3 py-2 text-sm text-white placeholder:text-slate-500"
                />
              </div>

              {/* Delivery Type */}
              <div>
                <label className="text-white text-sm font-medium mb-1.5 block">نوع التوصيل</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("home")}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all ${
                      deliveryType === "home"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-[#1E2D52] bg-[#0F1629] hover:border-[#2A3D60]"
                    }`}
                  >
                    <Truck className={`w-5 h-5 ${deliveryType === "home" ? "text-blue-400" : "text-slate-500"}`} />
                    <div>
                      <p className={`font-medium ${deliveryType === "home" ? "text-white" : "text-slate-300"}`}>التوصيل للمنزل</p>
                      <p className="text-xs text-slate-400">التوصيل إلى باب المنزل</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("desk")}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all ${
                      deliveryType === "desk"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-[#1E2D52] bg-[#0F1629] hover:border-[#2A3D60]"
                    }`}
                  >
                    <MapPin className={`w-5 h-5 ${deliveryType === "desk" ? "text-blue-400" : "text-slate-500"}`} />
                    <div>
                      <p className={`font-medium ${deliveryType === "desk" ? "text-white" : "text-slate-300"}`}>نقطة استلام</p>
                      <p className="text-xs text-slate-400">الاستلام من مكتب الشحن</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-[#1A2744] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">المجموع:</span>
                  <span className="text-white font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-lg py-6 rounded-xl shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {createOrderMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 ml-2" />
                    اطلب الآن — الدفع عند الاستلام
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-slate-500">
                بالضغط على زر الطلب، أنت توافق على شروط الخدمة وسياسة الإرجاع
              </p>
            </form>
          </div>
        </div>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">آراء العملاء</h2>
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#141D35] border border-[#1E2D52] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1A2744] flex items-center justify-center text-white text-sm font-bold">
                        {review.customerName[0]}
                      </div>
                      <span className="text-white font-medium text-sm">{review.customerName}</span>
                      {review.isVerified && <Badge className="bg-green-500 text-white text-xs">تم التحقق</Badge>}
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.comment && <p className="text-slate-400 text-sm">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

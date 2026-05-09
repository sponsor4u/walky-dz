import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  ShoppingBag,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  Phone,
  User,
  MapPin,
  Home,
  Building2,
  FileText,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const { data: product, isLoading } = trpc.product.getBySlug.useQuery({ slug: slug! });
  const { data: wilayas } = trpc.shipping.listWilayas.useQuery();
  const { data: settings } = trpc.settings.get.useQuery();

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [communes, setCommunes] = useState<Array<{ id: number; nameAr: string }>>([]);
  const [selectedCommune, setSelectedCommune] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [shippingCost, setShippingCost] = useState("600");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const { data: communeData } = trpc.shipping.listCommunes.useQuery(
    { wilayaId: Number(selectedWilaya) },
    { enabled: !!selectedWilaya }
  );

  useMemo(() => {
    if (communeData) {
      setCommunes(communeData.map(c => ({ id: c.id, nameAr: c.nameAr })));
    }
  }, [communeData]);

  const createOrder = trpc.order.create.useMutation({
    onSuccess: (data) => {
      setSuccess(true);
      setOrderNumber(data.orderNumber);
      setSubmitting(false);
    },
    onError: (err) => {
      setErrors({ submit: err.message });
      setSubmitting(false);
    },
  });

  const handleWilayaChange = async (wilayaId: string) => {
    setSelectedWilaya(wilayaId);
    setSelectedCommune("");
    const selectedW = wilayas?.find(w => w.id.toString() === wilayaId);
    if (selectedW) {
      const price = deliveryType === "home" ? "600" : "400";
      setShippingCost(price);
    }
  };

  const handleDeliveryTypeChange = (type: "home" | "desk") => {
    setDeliveryType(type);
    const price = type === "home" ? "600" : "400";
    setShippingCost(price);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 2) newErrors.name = "الاسم مطلوب";
    if (!formData.phone.match(/^(05|06|07)\d{8}$/)) newErrors.phone = "رقم هاتف جزائري غير صحيح";
    if (!selectedWilaya) newErrors.wilaya = "اختر الولاية";
    if (!selectedCommune) newErrors.commune = "اختر البلدية";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !product) return;
    setSubmitting(true);

    const selectedW = wilayas?.find(w => w.id.toString() === selectedWilaya);
    const selectedC = communes.find(c => c.id.toString() === selectedCommune);
    const subtotal = (Number(product.price) * quantity).toString();
    const total = (Number(subtotal) + Number(shippingCost)).toString();

    createOrder.mutate({
      productId: product.id,
      customerName: formData.name,
      phone: formData.phone,
      wilayaId: Number(selectedWilaya),
      wilayaName: selectedW?.nameAr ?? "",
      communeId: Number(selectedCommune),
      communeName: selectedC?.nameAr ?? "",
      address: formData.address,
      deliveryType,
      variantColor: selectedColor || undefined,
      variantSize: selectedSize || undefined,
      quantity,
      subtotal,
      shippingCost,
      total,
      notes: formData.notes,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        المنتج غير موجود
      </div>
    );
  }

  const variantOptions = product.variantOptions as { colors?: string[]; sizes?: string[] } | null;
  const colors = variantOptions?.colors ?? [];
  const sizes = variantOptions?.sizes ?? [];
  const totalPrice = (Number(product.price) * quantity + Number(shippingCost)).toLocaleString();
  const subtotalPrice = (Number(product.price) * quantity).toLocaleString();

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تم تأكيد طلبك!</h1>
          <p className="text-gray-500 mb-6">سنتصل بك قريباً لتأكيد الطلب</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">رقم الطلب</p>
            <p className="text-xl font-mono font-bold text-gray-900">#{orderNumber}</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: `${settings?.fontFamily ?? "Cairo"}, system-ui, sans-serif` }} dir="rtl">
      {/* Announcement Bar */}
      <div className="bg-[#0A0F1E] text-white text-center py-2 text-xs px-4">
        <span className="text-amber-400 font-bold">الدفع عند الاستلام</span>
        <span className="mx-2">|</span>
        <span>توصيل سريع لجميع الولايات</span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-lg text-gray-900">{settings?.storeName ?? "Walky DZ"}</span>
          </button>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600">
            <ChevronLeft size={18} />
            <span className="text-sm">رجوع</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Product Info */}
          <div>
            {/* Product Image */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-80 md:h-96 flex items-center justify-center mb-6 relative overflow-hidden">
              <ShoppingBag size={80} className="text-gray-300" />
              {product.comparePrice && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm">
                  وفر {Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
                </span>
              )}
              <div className="absolute bottom-4 right-4 flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={cn("w-2 h-2 rounded-full", i === 1 ? "bg-blue-500" : "bg-gray-300")} />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(4.8) 120 تقييم</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold text-blue-600">{Number(product.price).toLocaleString()} دج</span>
                {product.comparePrice && (
                  <span className="text-lg text-gray-400 line-through">{Number(product.comparePrice).toLocaleString()} دج</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Variants */}
              {colors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اللون</label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all",
                          selectedColor === color
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">المقاس</label>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "w-12 h-12 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center",
                          selectedSize === size
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">الكمية</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl">
                {[
                  { icon: Shield, label: "طلب آمن" },
                  { icon: Truck, label: "توصيل سريع" },
                  { icon: RotateCcw, label: "ضمان الجودة" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                    <item.icon size={20} className="text-blue-600" />
                    <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Checkout Form */}
          <div>
            <div className="sticky top-20 bg-white rounded-2xl border-2 border-gray-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <ShoppingBag size={20} />
                  أكمل طلبك
                </h2>
                <p className="text-blue-200 text-sm mt-1">املأ البيانات وسنصلك خلال 24 ساعة</p>
              </div>

              {/* Order Summary */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{product.name} × {quantity}</span>
                  <span className="font-medium text-gray-900">{subtotalPrice} دج</span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-600">الشحن ({deliveryType === "home" ? "المنزل" : "المكتب"})</span>
                  <span className="font-medium text-gray-900">{Number(shippingCost).toLocaleString()} دج</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">الإجمالي</span>
                  <span className="text-2xl font-extrabold text-blue-600">{totalPrice} دج</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الاسم الكامل *</label>
                  <div className="relative">
                    <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                      className={cn(
                        "w-full border rounded-xl pr-10 pl-4 py-3 text-right focus:outline-none focus:ring-2 transition-all",
                        errors.name ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                      )}
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">رقم الهاتف *</label>
                  <div className="relative">
                    <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05xxxxxxxx أو 06xxxxxxxx أو 07xxxxxxxx"
                      className={cn(
                        "w-full border rounded-xl pr-10 pl-4 py-3 text-right focus:outline-none focus:ring-2 transition-all ltr",
                        errors.phone ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                      )}
                      dir="ltr"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Wilaya */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">الولاية *</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedWilaya}
                      onChange={e => handleWilayaChange(e.target.value)}
                      className={cn(
                        "w-full border rounded-xl pr-10 pl-4 py-3 text-right focus:outline-none focus:ring-2 transition-all appearance-none bg-white",
                        errors.wilaya ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200 focus:border-blue-500"
                      )}
                    >
                      <option value="">اختر الولاية</option>
                      {wilayas?.map(w => (
                        <option key={w.id} value={w.id}>{w.code} - {w.nameAr}</option>
                      ))}
                    </select>
                  </div>
                  {errors.wilaya && <p className="text-red-500 text-xs mt-1">{errors.wilaya}</p>}
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">البلدية *</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={selectedCommune}
                      onChange={e => setSelectedCommune(e.target.value)}
                      disabled={!selectedWilaya}
                      className={cn(
                        "w-full border rounded-xl pr-10 pl-4 py-3 text-right focus:outline-none focus:ring-2 transition-all appearance-none bg-white",
                        errors.commune ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-blue-200 focus:border-blue-500",
                        !selectedWilaya && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <option value="">{selectedWilaya ? "اختر البلدية" : "اختر الولاية أولاً"}</option>
                      {communes.map(c => (
                        <option key={c.id} value={c.id}>{c.nameAr}</option>
                      ))}
                    </select>
                  </div>
                  {errors.commune && <p className="text-red-500 text-xs mt-1">{errors.commune}</p>}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">العنوان التفصيلي</label>
                  <div className="relative">
                    <Home size={18} className="absolute right-3 top-3 text-gray-400" />
                    <textarea
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="الحي، الشارع، رقم المنزل..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Delivery Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع التوصيل</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleDeliveryTypeChange("home")}
                      className={cn(
                        "border-2 rounded-xl p-3 text-center transition-all",
                        deliveryType === "home"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Home size={20} className={cn("mx-auto mb-1", deliveryType === "home" ? "text-blue-600" : "text-gray-400")} />
                      <p className={cn("text-sm font-medium", deliveryType === "home" ? "text-blue-700" : "text-gray-600")}>المنزل</p>
                      <p className="text-xs text-gray-500">{Number(shippingCost).toLocaleString()} دج</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeliveryTypeChange("desk")}
                      className={cn(
                        "border-2 rounded-xl p-3 text-center transition-all",
                        deliveryType === "desk"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Building2 size={20} className={cn("mx-auto mb-1", deliveryType === "desk" ? "text-blue-600" : "text-gray-400")} />
                      <p className={cn("text-sm font-medium", deliveryType === "desk" ? "text-blue-700" : "text-gray-600")}>المكتب</p>
                      <p className="text-xs text-gray-500">{Math.round(Number(shippingCost) * 0.7).toLocaleString()} دج</p>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ملاحظات (اختياري)</label>
                  <div className="relative">
                    <FileText size={18} className="absolute right-3 top-3 text-gray-400" />
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="أي ملاحظات خاصة بالطلب..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{errors.submit}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-4 rounded-xl text-lg transition-all hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      تأكيد الطلب — الدفع عند الاستلام
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                  <Shield size={12} />
                  طلبك آمن ومشفر. لن نشارك بياناتك.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">الإجمالي</p>
            <p className="text-lg font-extrabold text-blue-600">{totalPrice} دج</p>
          </div>
          <a
            href="#checkout"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl text-sm transition-colors"
          >
            اطلب الآن
          </a>
        </div>
      </div>
    </div>
  );
}

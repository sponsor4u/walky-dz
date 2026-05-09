import { useParams, useNavigate } from "react-router";
import { CheckCircle, Package, Phone, Clock } from "lucide-react";

export default function ThankYouPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle size={48} className="text-green-600" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          تم تأكيد طلبك بنجاح!
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          شكراً لك على ثقتك. سنتصل بك خلال 24 ساعة لتأكيد الطلب وترتيب التوصيل.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-500 mb-1">رقم الطلب</p>
          <p className="text-2xl font-mono font-bold text-blue-600 mb-4">
            #{orderNumber}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Phone, label: "سنصلك قريباً" },
              { icon: Package, label: "تحضير الطلب" },
              { icon: Clock, label: "24-48 ساعة توصيل" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <item.icon size={18} className="text-blue-600" />
                </div>
                <span className="text-xs text-gray-600 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl text-lg transition-all hover:shadow-lg"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );
}

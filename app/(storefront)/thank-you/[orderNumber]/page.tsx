"use client";

import { useParams } from "next/navigation";
import { Button } from "@/client/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Package, Phone } from "lucide-react";

export default function ThankYouPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="bg-[#141D35] border border-[#1E2D52] rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">تم إرسال الطلب بنجاح!</h1>
        <p className="text-slate-400 mb-6">سنتصل بك خلال 24 ساعة لتأكيد طلبك</p>

        <div className="bg-[#1A2744] rounded-xl p-4 mb-6 space-y-3">
          <div>
            <p className="text-slate-400 text-sm">رقم الطلب</p>
            <p className="text-white font-mono font-bold text-lg">{orderNumber}</p>
          </div>
          <div className="border-t border-[#1E2D52] pt-3">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              للاستفسار: 05XX XX XX XX
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Package className="w-4 h-4 ml-2" />
              مواصلة التسوق
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          تم إرسال رسالة تأكيد إلى فريقنا. سنتصل بك قريباً.
        </p>
      </div>
    </div>
  );
}

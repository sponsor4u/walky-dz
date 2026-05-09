import Link from "next/link";
import { Button } from "@/client/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-slate-400 mb-8 text-lg">الصفحة غير موجودة</p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Home className="w-4 h-4 ml-2" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
}

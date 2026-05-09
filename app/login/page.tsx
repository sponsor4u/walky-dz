"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/client/providers/supabase-provider";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/client/components/ui/card";
import { Package, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignUp) {
        const { error } = await signUp(form.email, form.password);
        if (error) throw error;
        setError("Account created! Please check your email to confirm.");
      } else {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1E] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Walky DZ</h1>
          <p className="text-slate-400 mt-1">لوحة تحكم المتجر</p>
        </div>

        <Card className="bg-[#141D35] border-[#1E2D52]">
          <CardHeader>
            <CardTitle className="text-white">
              {isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {isSignUp ? "أدخل بياناتك لإنشاء حساب جديد" : "أدخل بريدك الإلكتروني وكلمة المرور"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                  className="bg-[#1A2744] border-[#1E2D52] text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="bg-[#1A2744] border-[#1E2D52] text-white placeholder:text-slate-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className={`text-sm ${error.includes("created") ? "text-green-400" : "text-red-400"}`}>
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
              </Button>

              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                className="w-full text-sm text-blue-400 hover:text-blue-300"
              >
                {isSignUp ? "لديك حساب؟ سجل الدخول" : "ليس لديك حساب؟ سجل الآن"}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

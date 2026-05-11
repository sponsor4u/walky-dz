import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Flame, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@commerceforge.dz');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'خطأ في تسجيل الدخول');
    }
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left Panel - Info */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#141414' }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">CommerceForge</h1>
          <p className="text-xl text-[#8b8b8b] mb-8">منصة التجارة الإلكترونية الأولى في الجزائر</p>
          <div className="space-y-4">
            {['إدارة المنتجات والطلبات', 'نظام شحن متكامل لـ 58 ولاية', 'بناء صفحات هبوط ديناميكية', 'تتبع البيكسلات وتحليلات'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)' }}>
                  <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-[#8b8b8b]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6" style={{ background: 'var(--store-bg, #fdfaf6)' }}>
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              <Flame className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#0d0d0d' }}>CommerceForge</h1>
          </div>

          <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0 16px 48px rgba(0,0,0,0.12)' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0d0d0d' }}>تسجيل الدخول</h2>
            <p className="text-sm text-[#8b8b8b] mb-6">أدخل بيانات حسابك للوصول للوحة التحكم</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="store-input ltr"
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#0d0d0d' }}>كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="store-input ltr pr-10"
                    dir="ltr"
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg text-sm text-red-600" style={{ background: 'rgba(239,68,68,0.08)' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-gradient-admin w-full justify-center py-3">
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>

            <p className="text-xs text-center text-[#8b8b8b] mt-4">
              البريد الافتراضي: admin@commerceforge.dz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

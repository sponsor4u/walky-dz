import { Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '@/hooks/useAuth';
import { StoreProvider, useStore } from '@/hooks/useStore';
import { useAuth } from '@/hooks/useAuth';

// Admin Layout
import AdminLayout from '@/components/admin/AdminLayout';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Categories from '@/pages/admin/Categories';
import Shipping from '@/pages/admin/Shipping';
import Customers from '@/pages/admin/Customers';
import LandingPages from '@/pages/admin/LandingPages';
import ThemePage from '@/pages/admin/Theme';
import SettingsPage from '@/pages/admin/Settings';
import Pixels from '@/pages/admin/Pixels';
import Coupons from '@/pages/admin/Coupons';
import Reviews from '@/pages/admin/Reviews';
import Media from '@/pages/admin/Media';

// Store Layout
import StoreLayout from '@/components/store/StoreLayout';

// Store Pages
import Home from '@/pages/store/Home';
import ProductsPage from '@/pages/store/Products';
import ProductDetail from '@/pages/store/ProductDetail';
import Checkout from '@/pages/store/Checkout';
import TrackOrder from '@/pages/store/TrackOrder';
import LandingPage from '@/pages/store/LandingPage';

// Auth
import Login from '@/pages/auth/Login';

// Toast Container
function ToastContainer() {
  const { toasts, removeToast } = useStore();
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-20 left-4 z-[9999] space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className="toast-enter flex items-start gap-3 px-4 py-3 rounded-lg min-w-[280px] max-w-[360px] cursor-pointer"
          style={{
            background: '#1a1a1a',
            borderRight: `3px solid ${toast.type === 'success' ? '#22c55e' : toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#3b82f6'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#f0f0f0]">{toast.title}</p>
            {toast.message && <p className="text-xs text-[#8b8b8b] mt-0.5">{toast.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Auth Guard for Admin
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Auth Guard for Login
function LoginGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <ToastContainer />
        <Routes>
          {/* Admin Routes */}
          <Route path="/login" element={<LoginGuard><Login /></LoginGuard>} />
          <Route path="/dashboard" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="categories" element={<Categories />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="customers" element={<Customers />} />
            <Route path="landing-pages" element={<LandingPages />} />
            <Route path="theme" element={<ThemePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="pixels" element={<Pixels />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="media" element={<Media />} />
          </Route>

          {/* Store Routes */}
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/lp/:slug" element={<LandingPage />} />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StoreProvider>
    </AuthProvider>
  );
}

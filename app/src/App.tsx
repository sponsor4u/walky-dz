import { Routes, Route } from "react-router";
import { ThemeProvider } from "./hooks/useTheme";

// Storefront pages
import StoreHome from "./pages/store/Home";
import ProductPage from "./pages/store/ProductPage";
import LandingPageView from "./pages/store/LandingPageView";
import ThankYouPage from "./pages/store/ThankYou";

// Admin pages
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminLandingPages from "./pages/admin/LandingPages";
import AdminShipping from "./pages/admin/Shipping";
import AdminSettings from "./pages/admin/Settings";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminFraud from "./pages/admin/Fraud";

// Auth
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Storefront (public) */}
        <Route path="/" element={<StoreHome />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/l/:slug" element={<LandingPageView />} />
        <Route path="/thank-you/:orderNumber" element={<ThankYouPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="landing" element={<AdminLandingPages />} />
          <Route path="shipping" element={<AdminShipping />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="fraud" element={<AdminFraud />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

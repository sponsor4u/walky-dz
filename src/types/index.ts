// Store Settings
export interface StoreSettings {
  id: string;
  store_name: string;
  slug: string;
  logo_url: string;
  favicon_url: string;
  currency: string;
  language: 'ar' | 'fr';
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  seo_title: string;
  seo_description: string;
  maintenance_mode: boolean;
  free_shipping_threshold: number;
  max_orders_per_phone: number;
  enable_reviews: boolean;
  enable_coupons: boolean;
  created_at: string;
  updated_at: string;
}

// Theme Settings
export interface ThemeSettings {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  bg_color: string;
  card_bg_color: string;
  font_family: string;
  heading_scale: number;
  body_size: number;
  border_radius: number;
  card_style: 'flat' | 'soft_shadow' | 'glass';
  button_style: 'filled' | 'outline' | 'soft';
  section_spacing: number;
  hero_scroll_effect: boolean;
  navbar_style: 'transparent' | 'solid' | 'glass';
  created_at: string;
  updated_at: string;
}

// Category
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
}

// Product
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  rich_text: string;
  price: number;
  compare_price: number;
  stock: number;
  sku: string;
  category_id: string;
  images: string[];
  landing_page_id: string | null;
  seo_title: string;
  seo_description: string;
  shipping_override: number | null;
  weight: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
}

// Product Variant
export interface ProductVariant {
  id: string;
  product_id: string;
  type: 'color' | 'size' | 'material';
  value: string;
  hex_code: string;
  price_adjustment: number;
  stock: number;
  image_url: string;
  created_at: string;
}

// Product Upsell
export interface ProductUpsell {
  id: string;
  product_id: string;
  upsell_product_id: string;
  discount_percent: number;
  sort_order: number;
  upsell_product?: Product;
}

// Homepage Section
export type SectionType = 'hero' | 'categories' | 'products' | 'banner' | 'testimonials' | 'trust' | 'text' | 'video' | 'countdown';

export interface HomepageSection {
  id: string;
  type: SectionType;
  sort_order: number;
  is_active: boolean;
  settings: Record<string, any>;
  created_at: string;
}

// Landing Page
export interface LandingPage {
  id: string;
  slug: string;
  name: string;
  product_id: string | null;
  sections: LandingSection[];
  is_active: boolean;
  theme_override: Record<string, any>;
  seo_title: string;
  seo_description: string;
  created_at: string;
}

export interface LandingSection {
  type: string;
  settings: Record<string, any>;
  is_active: boolean;
}

// Order
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface Order {
  id: string;
  order_code: string;
  customer_name: string;
  phone: string;
  phone2: string;
  instagram: string;
  wilaya_id: number;
  commune_id: string;
  address: string;
  delivery_type: 'home' | 'desk';
  notes: string;
  source: string;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  coupon_code: string;
  status: OrderStatus;
  ip_address: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  wilaya?: Wilaya;
  commune?: Commune;
  items?: OrderItem[];
}

// Order Item
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// Wilaya
export interface Wilaya {
  id: number;
  name_ar: string;
  name_fr: string;
  home_price: number;
  desk_price: number;
  is_active: boolean;
}

// Commune
export interface Commune {
  id: string;
  wilaya_id: number;
  name_ar: string;
  name_fr: string;
  home_price: number | null;
  desk_price: number | null;
  is_active: boolean;
}

// Coupon
export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order: number;
  max_uses: number | null;
  uses_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

// Pixel
export interface Pixel {
  id: string;
  type: 'facebook' | 'tiktok' | 'snapchat' | 'ga4';
  name: string;
  pixel_id: string;
  is_active: boolean;
  created_at: string;
}

// Customer
export interface Customer {
  id: string;
  name: string;
  phone: string;
  phone2: string;
  instagram: string;
  wilaya_id: number;
  commune_id: string;
  address: string;
  order_count: number;
  total_spent: number;
  blacklist: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
  wilaya?: Wilaya;
}

// Review
export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  text: string;
  photos: string[];
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

// Media
export interface Media {
  id: string;
  filename: string;
  url: string;
  thumbnail_url: string;
  type: 'image' | 'video';
  size: number;
  created_at: string;
}

// Cart
export interface CartItem {
  product_id: string;
  variant_id: string | null;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant_label?: string;
}

// Shipping Provider
export interface ShippingProvider {
  id: string;
  name: string;
  logo_url: string;
  website: string;
  is_active: boolean;
}

// Order Status History
export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string;
  created_at: string;
}

// Toast
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

// Testimonial
export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  avatar_url: string;
}

// Trust Item
export interface TrustItem {
  icon: string;
  title: string;
  description: string;
}

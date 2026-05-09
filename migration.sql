-- ==========================================
-- Walky DZ — Full Database Migration
-- Run this in Supabase SQL Editor
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE stock_status AS ENUM ('in_stock', 'out_of_stock', 'low_stock');
CREATE TYPE display_mode AS ENUM ('product_page', 'landing_page');
CREATE TYPE checkout_position AS ENUM ('top', 'middle', 'bottom', 'sticky', 'floating');
CREATE TYPE delivery_type AS ENUM ('home', 'desk');
CREATE TYPE order_status AS ENUM ('new', 'confirmed', 'shipping', 'delivered', 'returned', 'cancelled');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');
CREATE TYPE landing_section_type AS ENUM ('hero', 'benefits', 'reviews', 'countdown', 'video', 'bundles', 'faq', 'checkout', 'trust_badges', 'testimonials', 'long_image', 'features', 'before_after');

-- ==========================================
-- PROFILES (Extends Supabase Auth)
-- ==========================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(320),
  name VARCHAR(255),
  avatar TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_email TEXT;
BEGIN
  -- Check if this user should be admin
  SELECT value INTO admin_email FROM pg_catalog.pg_settings WHERE name = 'app.admin_email';
  
  INSERT INTO public.profiles (id, email, name, role, last_sign_in_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN admin_email IS NOT NULL AND NEW.email = admin_email THEN 'admin'::user_role
      ELSE 'user'::user_role
    END,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update last_sign_in_at
CREATE OR REPLACE FUNCTION public.handle_user_signin()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET last_sign_in_at = NOW(), email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_signedin
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_signin();

-- ==========================================
-- STORE SETTINGS
-- ==========================================

CREATE TABLE store_settings (
  id SERIAL PRIMARY KEY,
  store_name VARCHAR(255) NOT NULL DEFAULT 'Walky DZ',
  store_slug VARCHAR(255) DEFAULT 'walky-dz',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(50) DEFAULT '#2563EB',
  secondary_color VARCHAR(50) DEFAULT '#1D4ED8',
  accent_color VARCHAR(50) DEFAULT '#F97316',
  font_family VARCHAR(100) DEFAULT 'Cairo',
  whatsapp_number VARCHAR(20),
  phone_number VARCHAR(20),
  theme_config JSONB NOT NULL DEFAULT '{}',
  pixels_config JSONB NOT NULL DEFAULT '{}',
  sheets_url TEXT,
  sheets_config JSONB NOT NULL DEFAULT '{}',
  seo_defaults JSONB NOT NULL DEFAULT '{}',
  navbar_config JSONB NOT NULL DEFAULT '{}',
  footer_config JSONB NOT NULL DEFAULT '{}',
  homepage_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_store_settings_slug ON store_settings(store_slug);

-- ==========================================
-- CATEGORIES
-- ==========================================

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- ==========================================
-- PRODUCTS
-- ==========================================

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(12,2) NOT NULL,
  compare_price DECIMAL(12,2),
  cost_price DECIMAL(12,2),
  sku VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  stock_status stock_status DEFAULT 'in_stock',
  category_id INTEGER REFERENCES categories(id),
  images JSONB NOT NULL DEFAULT '[]',
  display_mode display_mode DEFAULT 'product_page',
  checkout_position checkout_position DEFAULT 'bottom',
  has_variants BOOLEAN DEFAULT FALSE,
  variant_options JSONB NOT NULL DEFAULT '{}',
  seo_title VARCHAR(255),
  seo_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(featured);

-- ==========================================
-- LANDING PAGES
-- ==========================================

CREATE TABLE landing_pages (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  sections JSONB NOT NULL DEFAULT '[]',
  checkout_position checkout_position DEFAULT 'bottom',
  has_navbar BOOLEAN DEFAULT FALSE,
  has_footer BOOLEAN DEFAULT FALSE,
  countdown_end TIMESTAMPTZ,
  meta_title VARCHAR(255),
  meta_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_landing_pages_slug ON landing_pages(slug);
CREATE INDEX idx_landing_pages_active ON landing_pages(is_active);

-- ==========================================
-- ORDERS
-- ==========================================

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  product_id INTEGER REFERENCES products(id),
  landing_page_id INTEGER REFERENCES landing_pages(id),
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  wilaya_id INTEGER NOT NULL,
  wilaya_name VARCHAR(100),
  commune_id INTEGER,
  commune_name VARCHAR(100),
  address TEXT,
  delivery_type delivery_type DEFAULT 'home',
  variant_color VARCHAR(50),
  variant_size VARCHAR(50),
  quantity INTEGER DEFAULT 1,
  subtotal DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  discount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  status order_status DEFAULT 'new',
  notes TEXT,
  risk_score INTEGER DEFAULT 0,
  ip_address VARCHAR(50),
  user_agent TEXT,
  source VARCHAR(100),
  google_sheets_synced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_phone ON orders(phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ==========================================
-- WILAYAS (58 Algerian States)
-- ==========================================

CREATE TABLE wilayas (
  id INTEGER PRIMARY KEY,
  code INTEGER NOT NULL UNIQUE,
  name_ar VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100),
  name_en VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_wilayas_code ON wilayas(code);

-- ==========================================
-- COMMUNES
-- ==========================================

CREATE TABLE communes (
  id SERIAL PRIMARY KEY,
  wilaya_id INTEGER NOT NULL REFERENCES wilayas(id),
  name_ar VARCHAR(100) NOT NULL,
  name_fr VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_communes_wilaya ON communes(wilaya_id);

-- ==========================================
-- SHIPPING ZONES
-- ==========================================

CREATE TABLE shipping_zones (
  id SERIAL PRIMARY KEY,
  wilaya_id INTEGER NOT NULL REFERENCES wilayas(id),
  home_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  desk_price DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT TRUE,
  free_shipping_min DECIMAL(12,2),
  provider_id INTEGER,
  estimated_days VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_zones_wilaya ON shipping_zones(wilaya_id);

-- ==========================================
-- SHIPPING PROVIDERS
-- ==========================================

CREATE TABLE shipping_providers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  api_key VARCHAR(255),
  api_endpoint TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- FRAUD BLACKLIST
-- ==========================================

CREATE TABLE fraud_blacklist (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20),
  ip_address VARCHAR(50),
  reason TEXT,
  is_auto BOOLEAN DEFAULT FALSE,
  blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blocked_until TIMESTAMPTZ
);

CREATE INDEX idx_fraud_phone ON fraud_blacklist(phone);
CREATE INDEX idx_fraud_ip ON fraud_blacklist(ip_address);

-- ==========================================
-- COUPONS
-- ==========================================

CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type coupon_type NOT NULL,
  value DECIMAL(12,2) NOT NULL,
  min_order_amount DECIMAL(12,2),
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- REVIEWS
-- ==========================================

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);

-- ==========================================
-- MEDIA FILES
-- ==========================================

CREATE TABLE media_files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  mime_type VARCHAR(100),
  size INTEGER,
  folder VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- ACTIVITY LOG
-- ==========================================

CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  details JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- BANNERS
-- ==========================================

CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link_url TEXT,
  position VARCHAR(50) DEFAULT 'hero',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- HOMEPAGE SECTIONS
-- ==========================================

CREATE TABLE homepage_sections (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  config JSONB NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- SEED: STORE SETTINGS
-- ==========================================

INSERT INTO store_settings (store_name, store_slug, primary_color, secondary_color, accent_color, font_family, theme_config, seo_defaults) VALUES
('Walky DZ', 'walky-dz', '#2563EB', '#1D4ED8', '#F97316', 'Cairo', '{"mode":"light","radius":"8px","density":"comfortable"}', '{"titleTemplate":"%s | Walky DZ","defaultTitle":"Walky DZ - Algeria COD Ecommerce","defaultDescription":"Best prices in Algeria. Cash on delivery.","twitterHandle":"@walkydz"}');

-- ==========================================
-- SEED: 58 ALGERIAN WILAYAS
-- ==========================================

INSERT INTO wilayas (id, code, name_ar, name_fr, name_en) VALUES
(1, 1, 'أدرار', 'Adrar', 'Adrar'),
(2, 2, 'الشلف', 'Chlef', 'Chlef'),
(3, 3, 'الأغواط', 'Laghouat', 'Laghouat'),
(4, 4, 'أم البواقي', 'Oum El Bouaghi', 'Oum El Bouaghi'),
(5, 5, 'باتنة', 'Batna', 'Batna'),
(6, 6, 'بجاية', 'Bejaia', 'Bejaia'),
(7, 7, 'بسكرة', 'Biskra', 'Biskra'),
(8, 8, 'بشار', 'Bechar', 'Bechar'),
(9, 9, 'البليدة', 'Blida', 'Blida'),
(10, 10, 'البويرة', 'Bouira', 'Bouira'),
(11, 11, 'تمنراست', 'Tamanrasset', 'Tamanrasset'),
(12, 12, 'تبسة', 'Tebessa', 'Tebessa'),
(13, 13, 'تلمسان', 'Tlemcen', 'Tlemcen'),
(14, 14, 'تيارت', 'Tiaret', 'Tiaret'),
(15, 15, 'تيزي وزو', 'Tizi Ouzou', 'Tizi Ouzou'),
(16, 16, 'الجزائر', 'Alger', 'Algiers'),
(17, 17, 'الجلفة', 'Djelfa', 'Djelfa'),
(18, 18, 'جيجل', 'Jijel', 'Jijel'),
(19, 19, 'سطيف', 'Setif', 'Setif'),
(20, 20, 'سعيدة', 'Saida', 'Saida'),
(21, 21, 'سكيكدة', 'Skikda', 'Skikda'),
(22, 22, 'سيدي بلعباس', 'Sidi Bel Abbes', 'Sidi Bel Abbes'),
(23, 23, 'عنابة', 'Annaba', 'Annaba'),
(24, 24, 'قالمة', 'Guelma', 'Guelma'),
(25, 25, 'قسنطينة', 'Constantine', 'Constantine'),
(26, 26, 'المدية', 'Medea', 'Medea'),
(27, 27, 'مستغانم', 'Mostaganem', 'Mostaganem'),
(28, 28, 'المسيلة', 'M\'Sila', 'M\'Sila'),
(29, 29, 'معسكر', 'Mascara', 'Mascara'),
(30, 30, 'ورقلة', 'Ouargla', 'Ouargla'),
(31, 31, 'وهران', 'Oran', 'Oran'),
(32, 32, 'البيض', 'El Bayadh', 'El Bayadh'),
(33, 33, 'إليزي', 'Illizi', 'Illizi'),
(34, 34, 'برج بوعريريج', 'Bordj Bou Arreridj', 'Bordj Bou Arreridj'),
(35, 35, 'بومرداس', 'Boumerdes', 'Boumerdes'),
(36, 36, 'الطارف', 'El Tarf', 'El Tarf'),
(37, 37, 'تندوف', 'Tindouf', 'Tindouf'),
(38, 38, 'تيسمسيلت', 'Tissemsilt', 'Tissemsilt'),
(39, 39, 'الوادي', 'El Oued', 'El Oued'),
(40, 40, 'خنشلة', 'Khenchela', 'Khenchela'),
(41, 41, 'سوق أهراس', 'Souk Ahras', 'Souk Ahras'),
(42, 42, 'تيبازة', 'Tipaza', 'Tipaza'),
(43, 43, 'ميلة', 'Mila', 'Mila'),
(44, 44, 'عين الدفلى', 'Ain Defla', 'Ain Defla'),
(45, 45, 'النعامة', 'Naama', 'Naama'),
(46, 46, 'عين تيموشنت', 'Ain Temouchent', 'Ain Temouchent'),
(47, 47, 'غرداية', 'Ghardaia', 'Ghardaia'),
(48, 48, 'غيليزان', 'Relizane', 'Relizane'),
(49, 49, 'تيميمون', 'Timimoun', 'Timimoun'),
(50, 50, 'برج باجي مختار', 'Bordj Badji Mokhtar', 'Bordj Badji Mokhtar'),
(51, 51, 'أولاد جلال', 'Ouled Djellal', 'Ouled Djellal'),
(52, 52, 'بني عباس', 'Béni Abbès', 'Béni Abbès'),
(53, 53, 'عين صالح', 'In Salah', 'In Salah'),
(54, 54, 'عين قزام', 'In Guezzam', 'In Guezzam'),
(55, 55, 'توقرت', 'Touggourt', 'Touggourt'),
(56, 56, 'جانت', 'Djanet', 'Djanet'),
(57, 57, 'المغير', 'El M\'Ghair', 'El M\'Ghair'),
(58, 58, 'المنيعة', 'El Menia', 'El Menia');

-- ==========================================
-- SEED: COMMUNES FOR MAJOR WILAYAS
-- ==========================================

INSERT INTO communes (wilaya_id, name_ar, name_fr) VALUES
-- Algiers (16)
(16, 'الجزائر الوسطى', 'Alger Centre'),
(16, 'باب الزوار', 'Bab El Oued'),
(16, 'الرويبة', 'Rouiba'),
(16, 'براقي', 'Baraki'),
(16, 'الدرارية', 'Draria'),
(16, 'سيدي امحمد', 'Sidi M\'Hamed'),
(16, 'المدنية', 'El Madania'),
(16, 'القبة', 'El Kouba'),
(16, 'حسين داي', 'Hussein Dey'),
(16, 'المرادية', 'El Mouradia'),
(16, 'الحراش', 'El Harrach'),
(16, 'بئر مراد رايس', 'Bir Mourad Rais'),
-- Oran (31)
(31, 'وهران', 'Oran'),
(31, 'عين الترك', 'Ain El Turk'),
(31, 'مسرغين', 'Mers El Kebir'),
(31, 'بطيو', 'Bettioua'),
(31, 'السانية', 'Es Senia'),
(31, 'قديل', 'Gdyel'),
(31, 'حاسي بونيف', 'Hassi Bounif'),
(31, 'بئر الجير', 'Bir El Djir'),
(31, 'البراية', 'El Braya'),
(31, 'الكرمة', 'El Kerma'),
-- Constantine (25)
(25, 'قسنطينة', 'Constantine'),
(25, 'خروبة', 'Khroub'),
(25, 'عين السمارة', 'Ain Smara'),
(25, 'بني حميدان', 'Beni Hamidane'),
(25, 'الزيتون', 'Zighoud Youcef'),
(25, 'أولاد رحمون', 'Ouled Rahmoune'),
(25, 'ديدوش مراد', 'Didouche Mourad'),
(25, 'عين عبيد', 'Ain Abid'),
(25, 'ابن زياد', 'Ibn Ziad'),
(25, 'أولاد فارس', 'Ouled Fares'),
-- Blida (9)
(9, 'البليدة', 'Blida'),
(9, 'بوعينان', 'Bouinan'),
(9, 'بوفاريك', 'Boufarik'),
(9, 'الشفة', 'Chiffa'),
(9, 'العفرون', 'El Affroun'),
(9, 'وادي جر', 'Oued El Alleug'),
(9, 'مفتاح', 'Meftah'),
(9, 'الشريعة', 'Chrea'),
(9, 'بن خليل', 'Benkhelil'),
-- Annaba (23)
(23, 'عنابة', 'Annaba'),
(23, 'برحال', 'Barhel'),
(23, 'الحجار', 'El Hadjar'),
(23, 'العلمة', 'El Bouni'),
(23, 'البوني', 'Sidi Amar'),
(23, 'سيدي عمار', 'Sidi Amar'),
(23, 'تريعات', 'Treat'),
(23, 'شطايبي', 'Chetaibi'),
(23, 'واد العنب', 'Oued El Aneb'),
(23, 'الشطية', 'Chetaibi');

-- ==========================================
-- SEED: CATEGORIES
-- ==========================================

INSERT INTO categories (name, slug, description, sort_order) VALUES
('إلكترونيات', 'electronics', 'منتجات إلكترونية وأجهزة', 1),
('أزياء', 'fashion', 'ملابس وأحذية وإكسسوارات', 2),
('منزل ومطبخ', 'home-kitchen', 'منتجات المنزل والمطبخ', 3),
('صحة وجمال', 'health-beauty', 'منتجات الصحة والتجميل', 4),
('رياضة', 'sports', 'معدات رياضية وملابس', 5),
('أدوات', 'tools', 'أدوات يدوية وكهربائية', 6);

-- ==========================================
-- SEED: SAMPLE PRODUCTS
-- ==========================================

INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, has_variants, variant_options, seo_title, seo_description, is_active, featured, category_id, images) VALUES
(
  'طلاء عازل للماء PROELASTIC',
  'proelastic-waterproof-coating',
  'طلاء عازل للماء عالي الجودة يحمي الأسطح من تسرب الماء. مناسب للأسطح الخرسانية والمعدنية. يدوم لسنوات طويلة.',
  'حماية فائقة ضد تسرب الماء',
  1800.00,
  2500.00,
  'PRO-001',
  100,
  false,
  '{}',
  'طلاء عازل للماء PROELASTIC - حماية فائقة',
  'اشترِ طلاء عازل للماء PROELASTIC بأفضل سعر. حماية فائقة للأسطح ضد تسرب الماء.',
  true,
  true,
  3,
  '[]'
),
(
  'حذاء رياضي أسود فاخر',
  'premium-black-sneakers',
  'حذاء رياضي أنيق بتصميم عصري. مريح للاستخدام اليومي، مناسب للرياضة والمشي. خامات عالية الجودة.',
  'راحة وأناقة في كل خطوة',
  4500.00,
  6000.00,
  'SHOE-001',
  50,
  true,
  '{"colors":["أسود","أبيض","رمادي"],"sizes":["40","41","42","43","44","45"]}',
  'حذاء رياضي أسود فاخر - أفضل سعر في الجزائر',
  'حذاء رياضي أسود فاخر بسعر مذهل. توصيل لجميع ولايات الجزائر. الدفع عند الاستلام.',
  true,
  true,
  2,
  '[]'
),
(
  'ساعة ذكية متعددة الوظائف',
  'smart-watch-multifunction',
  'ساعة ذكية بشاشة لمس ملونة. تتبع النشاط الرياضي، ضربات القلب، عداد الخطوات، إشعارات الهاتف. بطارية تدوم حتى 7 أيام.',
  'تتبع صحتك ونشاطك يومياً',
  3200.00,
  4500.00,
  'WATCH-001',
  30,
  true,
  '{"colors":["أسود","فضي","ذهبي"]}',
  'ساعة ذكية متعددة الوظائف - أفضل سعر',
  'ساعة ذكية بمميزات رائعة. تتبع النشاط والصحة. توصيل مجاني. الدفع عند الاستلام.',
  true,
  true,
  1,
  '[]'
),
(
  'سماعات لاسلكية بلوتوث',
  'wireless-bluetooth-earbuds',
  'سماعات لاسلكية بتقنية بلوتوث 5.3. صوت نقي بجودة عالية، عزل الضوضاء. مقاومة للعرق، مثالية للرياضة.',
  'صوت نقي بدون أسلاك',
  2800.00,
  3800.00,
  'EAR-001',
  75,
  true,
  '{"colors":["أسود","أبيض","أزرق"]}',
  'سماعات لاسلكية بلوتوث - صوت نقي',
  'سماعات لاسلكية بجودة صوت عالية. بلوتوث 5.3. توصيل لجميع الولايات.',
  true,
  false,
  1,
  '[]'
),
(
  'حقيبة ظهر أنيقة متعددة الاستخدام',
  'stylish-multipurpose-backpack',
  'حقيبة ظهر عملية وأنيقة بجيوب متعددة. مقاومة للماء، مثالية للعمل والدراسة والسفر.',
  'عملية وأنيقة لكل يوم',
  2200.00,
  3000.00,
  'BAG-001',
  40,
  true,
  '{"colors":["أسود","رمادي","كحلي"]}',
  'حقيبة ظهر أنيقة - أفضل سعر في الجزائر',
  'حقيبة ظهر متعددة الاستخدام. مقاومة للماء. توصيل لجميع الولايات.',
  true,
  false,
  2,
  '[]'
);

-- ==========================================
-- SEED: SHIPPING ZONES
-- ==========================================

INSERT INTO shipping_zones (wilaya_id, home_price, desk_price) VALUES
(1, 800, 600), (2, 700, 500), (3, 700, 500), (4, 700, 500), (5, 700, 500),
(6, 700, 500), (7, 700, 500), (8, 900, 700), (9, 600, 400), (10, 600, 400),
(11, 1200, 900), (12, 700, 500), (13, 700, 500), (14, 700, 500), (15, 600, 400),
(16, 500, 350), (17, 700, 500), (18, 700, 500), (19, 700, 500), (20, 800, 600),
(21, 700, 500), (22, 800, 600), (23, 700, 500), (24, 700, 500), (25, 700, 500),
(26, 600, 400), (27, 700, 500), (28, 700, 500), (29, 800, 600), (30, 900, 700),
(31, 700, 500), (32, 800, 600), (33, 1200, 900), (34, 700, 500), (35, 600, 400),
(36, 800, 600), (37, 1200, 900), (38, 700, 500), (39, 900, 700), (40, 700, 500),
(41, 700, 500), (42, 600, 400), (43, 700, 500), (44, 700, 500), (45, 900, 700),
(46, 800, 600), (47, 900, 700), (48, 800, 600), (49, 1000, 800), (50, 1200, 900),
(51, 800, 600), (52, 1000, 800), (53, 1200, 900), (54, 1200, 900), (55, 900, 700),
(56, 1200, 900), (57, 900, 700), (58, 1200, 900);

-- ==========================================
-- SEED: SHIPPING PROVIDERS
-- ==========================================

INSERT INTO shipping_providers (name, is_active) VALUES
('Yalidine', true),
('Maystro Delivery', true),
('Zr Express', true),
('Procolis', true),
('Ecotrack', true);

-- ==========================================
-- SEED: REVIEWS
-- ==========================================

INSERT INTO reviews (product_id, customer_name, rating, comment, is_verified) VALUES
(1, 'أحمد من الجزائر', 5, 'منتج رائع! استخدمته على سطح المنزل ونتيجة ممتازة.', true),
(1, 'فاطمة من وهران', 5, 'جودة عالية وسعر معقول. أنصح به بشدة.', true),
(1, 'محمد من قسنطينة', 4, 'وصل بسرعة والمنتج كما هو موصوف.', true),
(2, 'عبد الرحمن', 5, 'الحذاء مريح جداً والخامة ممتازة.', true),
(2, 'كريمة', 4, 'مقاس مظبوط وجودة جيدة.', true),
(3, 'نور الدين', 5, 'الساعة شغالة ممتاز وبطارية تدوم.', true),
(3, 'سارة', 4, 'تصميم أنيق ووظائف مفيدة.', true);

-- ==========================================
-- SEED: HOMEPAGE SECTIONS
-- ==========================================

INSERT INTO homepage_sections (type, title, config, sort_order, is_active) VALUES
('hero', 'الرئيسية', '{"headline":"أفضل المنتجات بأفضل الأسعار","subheadline":"توصيل سريع لجميع ولايات الجزائر - الدفع عند الاستلام","ctaText":"تسوق الآن","ctaLink":"/#products","bgGradient":"from-blue-600 to-purple-700"}', 1, true),
('categories', 'التصنيفات', '{"showIcons":true,"layout":"grid"}', 2, true),
('featured_products', 'منتجات مميزة', '{"layout":"grid","count":8}', 3, true),
('trust_badges', 'لماذا نحن', '{"badges":[{"icon":"truck","title":"توصيل سريع","desc":"لجميع الولايات"},{"icon":"shield","title":"دفع آمن","desc":"الدفع عند الاستلام"},{"icon":"rotate-ccw","title":"إرجاع سهل","desc":"خلال 14 يوم"},{"icon":"headset","title":"دعم 24/7","desc":"فريق متخصص"}]}', 4, true),
('how_to_order', 'كيفية الطلب', '{"steps":[{"step":1,"title":"اختر منتجك","desc":"تصفح منتجاتنا واختر ما يناسبك"},{"step":2,"title":"املأ بياناتك","desc":"ادخل عنوانك ورقم هاتفك","icon":"form"},{"step":3,"title":"استلم طلبك","desc":"ادفع عند الاستلام واستمتع"}]}', 5, true);

-- ==========================================
-- SEED: BANNERS
-- ==========================================

INSERT INTO banners (title, subtitle, position, sort_order, is_active) VALUES
('عروض حصرية', 'خصومات تصل إلى 50% على منتجات مختارة', 'hero', 1, true),
('توصيل مجاني', 'للطلبات فوق 5000 دج', 'announcement', 2, true);

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_blacklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES — PUBLIC READ
-- ==========================================

CREATE POLICY "Allow public read categories" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read products" ON products FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Allow public read landing_pages" ON landing_pages FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Allow public read wilayas" ON wilayas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read communes" ON communes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read shipping_zones" ON shipping_zones FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read banners" ON banners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read homepage_sections" ON homepage_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read store_settings" ON store_settings FOR SELECT TO anon, authenticated USING (true);

-- ==========================================
-- RLS POLICIES — ADMIN FULL ACCESS
-- ==========================================

CREATE POLICY "Allow admin full products" ON products FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full orders" ON orders FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full landing_pages" ON landing_pages FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full categories" ON categories FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full shipping_zones" ON shipping_zones FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full shipping_providers" ON shipping_providers FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full fraud_blacklist" ON fraud_blacklist FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full coupons" ON coupons FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full store_settings" ON store_settings FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full banners" ON banners FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full homepage_sections" ON homepage_sections FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full media_files" ON media_files FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin read activity_log" ON activity_log FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Allow admin full reviews" ON reviews FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ==========================================
-- RLS — PROFILE ACCESS
-- ==========================================

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Allow admin to read all profiles
CREATE POLICY "Admin can read all profiles" ON profiles FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ==========================================
-- RLS — ORDERS (Allow anonymous creation)
-- ==========================================

CREATE POLICY "Allow anonymous order creation" ON orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX idx_orders_wilaya ON orders(wilaya_id);
CREATE INDEX idx_orders_product ON orders(product_id);
CREATE INDEX idx_orders_landing ON orders(landing_page_id);
CREATE INDEX idx_products_stock ON products(stock_status);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_coupons_code ON coupons(code);

-- ==========================================
-- DONE
-- ==========================================

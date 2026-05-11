// CommerceForge - Mock Database Layer
// This simulates Supabase tables with the exact same structure.
// To switch to real Supabase: replace these functions with supabase.from() calls.

import type {
  StoreSettings, ThemeSettings, Category, Product, ProductVariant,
  HomepageSection, LandingPage, Order, OrderItem, Wilaya, Commune,
  Coupon, Pixel, Customer, Review, Media, ShippingProvider, OrderStatus
} from '@/types';

// ─── Seed Data ───────────────────────────────────────────────

const storeSettingsData: StoreSettings = {
  id: '1',
  store_name: 'متجري',
  slug: 'store',
  logo_url: '',
  favicon_url: '',
  currency: 'DZD',
  language: 'ar',
  phone: '0550-000-000',
  email: 'contact@store.dz',
  whatsapp: '0550000000',
  instagram: 'store.dz',
  facebook: 'https://facebook.com/store.dz',
  tiktok: '',
  seo_title: 'متجري - أفضل المنتجات بأسعار مميزة',
  seo_description: 'تسوق أفضل المنتجات مع توصيل سريع لجميع ولايات الجزائر. الدفع عند الاستلام.',
  maintenance_mode: false,
  free_shipping_threshold: 5000,
  max_orders_per_phone: 3,
  enable_reviews: true,
  enable_coupons: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const themeSettingsData: ThemeSettings = {
  id: '1',
  primary_color: '#e8573d',
  secondary_color: '#3b82f6',
  accent_color: '#f59e0b',
  text_color: '#0d0d0d',
  bg_color: '#fdfaf6',
  card_bg_color: '#ffffff',
  font_family: 'Geist',
  heading_scale: 1,
  body_size: 14,
  border_radius: 8,
  card_style: 'soft_shadow',
  button_style: 'filled',
  section_spacing: 64,
  hero_scroll_effect: false,
  navbar_style: 'transparent',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

let categoriesData: Category[] = [
  { id: 'c1', slug: 'electronics', name: 'إلكترونيات', description: 'أحدث الأجهزة الإلكترونية', image_url: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400&h=400&fit=crop', parent_id: null, sort_order: 1, is_active: true, seo_title: 'إلكترونيات', seo_description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 'c2', slug: 'fashion', name: 'أزياء', description: 'أحدث صيحات الموضة', image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop', parent_id: null, sort_order: 2, is_active: true, seo_title: 'أزياء', seo_description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 'c3', slug: 'home', name: 'منزل ومطبخ', description: 'منتجات منزلية', image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop', parent_id: null, sort_order: 3, is_active: true, seo_title: 'منزل ومطبخ', seo_description: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 'c4', slug: 'sports', name: 'رياضة ولياقة', description: 'معدات رياضية', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', parent_id: null, sort_order: 4, is_active: true, seo_title: 'رياضة ولياقة', seo_description: '', created_at: '2024-01-01T00:00:00Z' },
];

let productsData: Product[] = [
  {
    id: 'p1', slug: 'smart-watch-pro', name: 'ساعة ذكية برو', description: 'ساعة ذكية متطورة مع تتبع اللياقة وإشعارات الهاتف',
    rich_text: '<p>ساعة ذكية برو هي الخيار الأمثل لعشاق التكنولوجيا. تتميز بشاشة AMOLED عالية الدقة، تتبع دقيق للنشاط البدني، وعمر بطارية يصل إلى 7 أيام.</p><h3>المميزات</h3><ul><li>شاشة AMOLED 1.4 بوصة</li><li>مقاومة للماء IP68</li><li>تتبع النوم والخطوات</li><li>إشعارات الهاتف</li></ul>',
    price: 3990, compare_price: 5990, stock: 50, sku: 'SW-001', category_id: 'c1',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop'],
    landing_page_id: null, seo_title: 'ساعة ذكية برو', seo_description: 'أفضل ساعة ذكية في الجزائر', shipping_override: null, weight: 200, is_featured: true, is_active: true, created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'p2', slug: 'wireless-earbuds-x', name: 'سماعات لاسلكية إكس', description: 'سماعات بلوتوث مع إلغاء الضوضاء النشط',
    rich_text: '<p>استمتع بجودة صوت استثنائية مع سماعات إكس اللاسلكية. تقنية إلغاء الضوضاء النشط توفر لك تجربة استماع نقية.</p>',
    price: 2490, compare_price: 3990, stock: 30, sku: 'WE-002', category_id: 'c1',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop'],
    landing_page_id: null, seo_title: 'سماعات لاسلكية', seo_description: '', shipping_override: null, weight: 100, is_featured: true, is_active: true, created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'p3', slug: 'running-shoes-elite', name: 'حذاء رياضي إيليت', description: 'حذاء رياضي مريح بتصميم عصري',
    rich_text: '<p>حذاء رياضي إيليت مصمم للراحة والأداء. نعل مُبطن بتقنية Air cushioning يوفر دعماً مثالياً للقدم.</p>',
    price: 4590, compare_price: 6990, stock: 25, sku: 'RS-003', category_id: 'c4',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop'],
    landing_page_id: null, seo_title: 'حذاء رياضي', seo_description: '', shipping_override: null, weight: 800, is_featured: true, is_active: true, created_at: '2024-02-01T00:00:00Z', updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'p4', slug: 'leather-bag-classic', name: 'حقيبة جلد كلاسيكية', description: 'حقيبة يد فاخرة من الجلد الطبيعي',
    rich_text: '<p>حقيبة جلد كلاسيكية مصنوعة يدوياً من أجود أنواع الجلد. تصميم أنيق يناسب جميع المناسبات.</p>',
    price: 5290, compare_price: 7990, stock: 15, sku: 'LB-004', category_id: 'c2',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop'],
    landing_page_id: null, seo_title: 'حقيبة جلد', seo_description: '', shipping_override: null, weight: 600, is_featured: true, is_active: true, created_at: '2024-02-10T00:00:00Z', updated_at: '2024-02-10T00:00:00Z',
  },
  {
    id: 'p5', slug: 'coffee-maker-auto', name: 'ماكينة قهوة أوتوماتيكية', description: 'ماكينة قهوة متعددة الوظائف',
    rich_text: '<p>جهز قهوتك المفضلة بضغطة زر. تدعم الإسبريسو والكابتشينو واللاتيه.</p>',
    price: 8990, compare_price: 12990, stock: 10, sku: 'CM-005', category_id: 'c3',
    images: ['https://images.unsplash.com/photo-1517914309068-f45f82c7d0ee?w=600&h=600&fit=crop'],
    landing_page_id: null, seo_title: 'ماكينة قهوة', seo_description: '', shipping_override: null, weight: 2500, is_featured: false, is_active: true, created_at: '2024-02-15T00:00:00Z', updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'p6', slug: 'yoga-mat-premium', name: 'حصيرة يوغا بريميوم', description: 'حصيرة يوغا سميكة ومريحة',
    rich_text: '<p>حصيرة يوغا سميكة 8مم بسطح مانع للانزلاق. مثالية للتمارين المنزلية.</p>',
    price: 1890, compare_price: 2990, stock: 40, sku: 'YM-006', category_id: 'c4',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop'],
    landing_page_id: null, seo_title: 'حصيرة يوغا', seo_description: '', shipping_override: null, weight: 1200, is_featured: false, is_active: true, created_at: '2024-02-20T00:00:00Z', updated_at: '2024-02-20T00:00:00Z',
  },
];

let variantsData: ProductVariant[] = [
  { id: 'v1', product_id: 'p1', type: 'color', value: 'أسود', hex_code: '#1a1a1a', price_adjustment: 0, stock: 20, image_url: '', created_at: '2024-01-15T00:00:00Z' },
  { id: 'v2', product_id: 'p1', type: 'color', value: 'فضي', hex_code: '#c0c0c0', price_adjustment: 200, stock: 15, image_url: '', created_at: '2024-01-15T00:00:00Z' },
  { id: 'v3', product_id: 'p1', type: 'color', value: 'ذهبي', hex_code: '#d4af37', price_adjustment: 300, stock: 15, image_url: '', created_at: '2024-01-15T00:00:00Z' },
  { id: 'v4', product_id: 'p3', type: 'size', value: '40', hex_code: '', price_adjustment: 0, stock: 8, image_url: '', created_at: '2024-02-01T00:00:00Z' },
  { id: 'v5', product_id: 'p3', type: 'size', value: '41', hex_code: '', price_adjustment: 0, stock: 6, image_url: '', created_at: '2024-02-01T00:00:00Z' },
  { id: 'v6', product_id: 'p3', type: 'size', value: '42', hex_code: '', price_adjustment: 0, stock: 5, image_url: '', created_at: '2024-02-01T00:00:00Z' },
  { id: 'v7', product_id: 'p3', type: 'size', value: '43', hex_code: '', price_adjustment: 0, stock: 6, image_url: '', created_at: '2024-02-01T00:00:00Z' },
];

let homepageSectionsData: HomepageSection[] = [
  { id: 'hs1', type: 'hero', sort_order: 1, is_active: true, settings: { heading: 'أفضل المنتجات بأسعار مميزة', subtitle: 'توصيل سريع لجميع ولايات الجزائر - الدفع عند الاستلام', cta_text: 'تسوق الآن', cta_link: '/products', background_type: 'gradient', background_value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text_align: 'center' }, created_at: '2024-01-01T00:00:00Z' },
  { id: 'hs2', type: 'categories', sort_order: 2, is_active: true, settings: { title: 'تصفح حسب الفئة', subtitle: 'اختر من مجموعاتنا المتنوعة' }, created_at: '2024-01-01T00:00:00Z' },
  { id: 'hs3', type: 'products', sort_order: 3, is_active: true, settings: { title: 'منتجات مميزة', subtitle: 'اخترنا لك أفضل المنتجات', limit: 4 }, created_at: '2024-01-01T00:00:00Z' },
  { id: 'hs4', type: 'trust', sort_order: 4, is_active: true, settings: { title: 'لماذا تختارنا؟' }, created_at: '2024-01-01T00:00:00Z' },
  { id: 'hs5', type: 'banner', sort_order: 5, is_active: true, settings: { image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop', link: '/products', position: 'full' }, created_at: '2024-01-01T00:00:00Z' },
  { id: 'hs6', type: 'testimonials', sort_order: 6, is_active: true, settings: { title: 'آراء عملائنا', testimonials: [{ name: 'أحمد من الجزائر العاصمة', text: 'تجربة رائعة! المنتج وصل بسرعة وجودة ممتازة. أنصح الجميع بالشراء من هذا المتجر.', rating: 5, avatar_url: '' }, { name: 'سارة من وهران', text: 'خدمة عملاء ممتازة والتوصيل كان سريع جداً. المنتج مطابق للوصف تماماً.', rating: 5, avatar_url: '' }, { name: 'محمد من قسنطينة', text: 'أفضل متجر إلكتروني جربته في الجزائر. أسعار منافسة وجودة عالية.', rating: 4, avatar_url: '' }] }, created_at: '2024-01-01T00:00:00Z' },
];

let landingPagesData: LandingPage[] = [
  {
    id: 'lp1', slug: 'smart-watch-offer', name: 'عرض الساعة الذكية', product_id: 'p1',
    sections: [
      { type: 'hero', is_active: true, settings: { heading: 'ساعة ذكية برو - عرض حصري!', subtitle: 'خصم 33% لفترة محدودة. توصيل مجاني لجميع الولايات.', cta_text: 'اطلب الآن', cta_link: '#checkout', background_type: 'image', background_value: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop', text_align: 'center' } },
      { type: 'benefits', is_active: true, settings: { title: 'لماذا هذه الساعة؟', items: [{ title: 'تتبع اللياقة', desc: 'خطوات، سعرات، نوم' }, { title: 'عمر بطارية طويل', desc: 'حتى 7 أيام' }, { title: 'مقاومة للماء', desc: 'IP68' }] } },
      { type: 'offer', is_active: true, settings: { title: 'عرض خاص!', subtitle: 'اشت الآن بـ 3990 دج بدلاً من 5990 دج', cta_text: 'اطلب الآن - خصم 33%', original_price: 5990, sale_price: 3990 } },
      { type: 'reviews', is_active: true, settings: { title: 'تقييمات العملاء', reviews: [{ name: 'كريم', text: 'ساعة رائعة!', rating: 5 }, { name: 'ليلى', text: 'أنصح بها', rating: 5 }] } },
      { type: 'faq', is_active: true, settings: { title: 'أسئلة شائعة', items: [{ q: 'هل الساعة أصلية؟', a: 'نعم 100% أصلية مع ضمان سنة.' }, { q: 'كم مدة التوصيل؟', a: '1-3 أيام عمل حسب الولاية.' }] } },
      { type: 'sticky_cta', is_active: true, settings: { text: 'اطلب الآن بـ 3990 دج', subtext: 'الدفع عند الاستلام - توصيل سريع' } },
    ],
    is_active: true, theme_override: {}, seo_title: 'عرض الساعة الذكية', seo_description: 'خصم 33% على الساعة الذكية برو', created_at: '2024-03-01T00:00:00Z',
  },
];

// Wilayas - 58 Algerian wilayas
const wilayasData: Wilaya[] = [
  { id: 1, name_ar: 'أدرار', name_fr: 'Adrar', home_price: 800, desk_price: 600, is_active: true },
  { id: 2, name_ar: ' الشلف', name_fr: 'Chlef', home_price: 600, desk_price: 450, is_active: true },
  { id: 3, name_ar: 'الأغواط', name_fr: 'Laghouat', home_price: 700, desk_price: 500, is_active: true },
  { id: 4, name_ar: 'أم البواقي', name_fr: 'Oum El Bouaghi', home_price: 700, desk_price: 500, is_active: true },
  { id: 5, name_ar: 'باتنة', name_fr: 'Batna', home_price: 700, desk_price: 500, is_active: true },
  { id: 6, name_ar: ' بجاية', name_fr: 'Bejaia', home_price: 700, desk_price: 500, is_active: true },
  { id: 7, name_ar: 'بسكرة', name_fr: 'Biskra', home_price: 800, desk_price: 600, is_active: true },
  { id: 8, name_ar: 'بشار', name_fr: 'Bechar', home_price: 800, desk_price: 600, is_active: true },
  { id: 9, name_ar: 'البليدة', name_fr: 'Blida', home_price: 500, desk_price: 350, is_active: true },
  { id: 10, name_ar: 'البويرة', name_fr: 'Bouira', home_price: 600, desk_price: 450, is_active: true },
  { id: 11, name_ar: 'تمنراست', name_fr: 'Tamanrasset', home_price: 1000, desk_price: 800, is_active: true },
  { id: 12, name_ar: 'تبسة', name_fr: 'Tebessa', home_price: 800, desk_price: 600, is_active: true },
  { id: 13, name_ar: 'تلمسان', name_fr: 'Tlemcen', home_price: 600, desk_price: 450, is_active: true },
  { id: 14, name_ar: 'تيارت', name_fr: 'Tiaret', home_price: 600, desk_price: 450, is_active: true },
  { id: 15, name_ar: 'تيزي وزو', name_fr: 'Tizi Ouzou', home_price: 600, desk_price: 450, is_active: true },
  { id: 16, name_ar: 'الجزائر العاصمة', name_fr: 'Alger', home_price: 400, desk_price: 300, is_active: true },
  { id: 17, name_ar: 'الجلفة', name_fr: 'Djelfa', home_price: 700, desk_price: 500, is_active: true },
  { id: 18, name_ar: 'جيجل', name_fr: 'Jijel', home_price: 700, desk_price: 500, is_active: true },
  { id: 19, name_ar: 'سطيف', name_fr: 'Setif', home_price: 600, desk_price: 450, is_active: true },
  { id: 20, name_ar: 'سعيدة', name_fr: 'Saida', home_price: 700, desk_price: 500, is_active: true },
  { id: 21, name_ar: 'سكيكدة', name_fr: 'Skikda', home_price: 700, desk_price: 500, is_active: true },
  { id: 22, name_ar: 'سيدي بلعباس', name_fr: 'Sidi Bel Abbes', home_price: 700, desk_price: 500, is_active: true },
  { id: 23, name_ar: 'عنابة', name_fr: 'Annaba', home_price: 700, desk_price: 500, is_active: true },
  { id: 24, name_ar: 'قالمة', name_fr: 'Guelma', home_price: 700, desk_price: 500, is_active: true },
  { id: 25, name_ar: 'قسنطينة', name_fr: 'Constantine', home_price: 700, desk_price: 500, is_active: true },
  { id: 26, name_ar: 'المدية', name_fr: 'Medea', home_price: 600, desk_price: 450, is_active: true },
  { id: 27, name_ar: 'مستغانم', name_fr: 'Mostaganem', home_price: 600, desk_price: 450, is_active: true },
  { id: 28, name_ar: 'المسيلة', name_fr: 'M\'sila', home_price: 700, desk_price: 500, is_active: true },
  { id: 29, name_ar: 'معسكر', name_fr: 'Mascara', home_price: 700, desk_price: 500, is_active: true },
  { id: 30, name_ar: 'ورقلة', name_fr: 'Ouargla', home_price: 800, desk_price: 600, is_active: true },
  { id: 31, name_ar: 'وهران', name_fr: 'Oran', home_price: 600, desk_price: 450, is_active: true },
  { id: 32, name_ar: 'البيض', name_fr: 'El Bayadh', home_price: 800, desk_price: 600, is_active: true },
  { id: 33, name_ar: 'إليزي', name_fr: 'Illizi', home_price: 1000, desk_price: 800, is_active: true },
  { id: 34, name_ar: 'برج بوعريريج', name_fr: 'Bordj Bou Arreridj', home_price: 700, desk_price: 500, is_active: true },
  { id: 35, name_ar: 'بومرداس', name_fr: 'Boumerdes', home_price: 500, desk_price: 350, is_active: true },
  { id: 36, name_ar: 'الطارف', name_fr: 'El Tarf', home_price: 700, desk_price: 500, is_active: true },
  { id: 37, name_ar: 'تندوف', name_fr: 'Tindouf', home_price: 1000, desk_price: 800, is_active: true },
  { id: 38, name_ar: 'تيسمسيلت', name_fr: 'Tissemsilt', home_price: 700, desk_price: 500, is_active: true },
  { id: 39, name_ar: 'الوادي', name_fr: 'El Oued', home_price: 800, desk_price: 600, is_active: true },
  { id: 40, name_ar: 'خنشلة', name_fr: 'Khenchela', home_price: 800, desk_price: 600, is_active: true },
  { id: 41, name_ar: 'سوق أهراس', name_fr: 'Souk Ahras', home_price: 800, desk_price: 600, is_active: true },
  { id: 42, name_ar: 'تيبازة', name_fr: 'Tipaza', home_price: 500, desk_price: 350, is_active: true },
  { id: 43, name_ar: 'ميلة', name_fr: 'Mila', home_price: 700, desk_price: 500, is_active: true },
  { id: 44, name_ar: 'عين الدفلى', name_fr: 'Ain Defla', home_price: 600, desk_price: 450, is_active: true },
  { id: 45, name_ar: 'النعامة', name_fr: 'Naama', home_price: 800, desk_price: 600, is_active: true },
  { id: 46, name_ar: 'عين تيموشنت', name_fr: 'Ain Temouchent', home_price: 700, desk_price: 500, is_active: true },
  { id: 47, name_ar: 'غرداية', name_fr: 'Ghardaia', home_price: 800, desk_price: 600, is_active: true },
  { id: 48, name_ar: 'غيليزان', name_fr: 'Relizane', home_price: 700, desk_price: 500, is_active: true },
  { id: 49, name_ar: 'تيميمون', name_fr: 'Timimoun', home_price: 900, desk_price: 700, is_active: true },
  { id: 50, name_ar: 'برج باجي مختار', name_fr: 'Bordj Badji Mokhtar', home_price: 1000, desk_price: 800, is_active: true },
  { id: 51, name_ar: 'أولاد جلال', name_fr: 'Ouled Djellal', home_price: 800, desk_price: 600, is_active: true },
  { id: 52, name_ar: 'بني عباس', name_fr: 'Beni Abbes', home_price: 900, desk_price: 700, is_active: true },
  { id: 53, name_ar: 'عين صالح', name_fr: 'In Salah', home_price: 1000, desk_price: 800, is_active: true },
  { id: 54, name_ar: 'عين قزام', name_fr: 'In Guezzam', home_price: 1000, desk_price: 800, is_active: true },
  { id: 55, name_ar: 'تقرت', name_fr: 'Touggourt', home_price: 800, desk_price: 600, is_active: true },
  { id: 56, name_ar: 'جانت', name_fr: 'Djanet', home_price: 1000, desk_price: 800, is_active: true },
  { id: 57, name_ar: 'المغير', name_fr: 'El Meghaier', home_price: 800, desk_price: 600, is_active: true },
  { id: 58, name_ar: 'المنيعة', name_fr: 'El Meniaa', home_price: 900, desk_price: 700, is_active: true },
];

// Sample communes (subset for key wilayas)
const communesData: Commune[] = [
  // Algiers (16)
  { id: 'cm1', wilaya_id: 16, name_ar: 'الجزائر الوسطى', name_fr: 'Alger Centre', home_price: 400, desk_price: 300, is_active: true },
  { id: 'cm2', wilaya_id: 16, name_ar: 'سيدي امحمد', name_fr: 'Sidi M\'Hamed', home_price: 400, desk_price: 300, is_active: true },
  { id: 'cm3', wilaya_id: 16, name_ar: 'باب الزوار', name_fr: 'Bab Ezzouar', home_price: 400, desk_price: 300, is_active: true },
  { id: 'cm4', wilaya_id: 16, name_ar: 'الرويبة', name_fr: 'Rouiba', home_price: 500, desk_price: 350, is_active: true },
  { id: 'cm5', wilaya_id: 16, name_ar: 'براقي', name_fr: 'Baraki', home_price: 500, desk_price: 350, is_active: true },
  // Oran (31)
  { id: 'cm6', wilaya_id: 31, name_ar: 'وهران', name_fr: 'Oran', home_price: 600, desk_price: 450, is_active: true },
  { id: 'cm7', wilaya_id: 31, name_ar: 'Es Sénia', name_fr: 'Es Senia', home_price: 600, desk_price: 450, is_active: true },
  { id: 'cm8', wilaya_id: 31, name_ar: 'أرزيو', name_fr: 'Arzew', home_price: 600, desk_price: 450, is_active: true },
  // Blida (9)
  { id: 'cm9', wilaya_id: 9, name_ar: 'البليدة', name_fr: 'Blida', home_price: 500, desk_price: 350, is_active: true },
  { id: 'cm10', wilaya_id: 9, name_ar: 'بوعينان', name_fr: 'Bouinan', home_price: 600, desk_price: 450, is_active: true },
  // Constantine (25)
  { id: 'cm11', wilaya_id: 25, name_ar: 'قسنطينة', name_fr: 'Constantine', home_price: 700, desk_price: 500, is_active: true },
  { id: 'cm12', wilaya_id: 25, name_ar: 'خروبة', name_fr: 'Khouriba', home_price: 700, desk_price: 500, is_active: true },
  // Annaba (23)
  { id: 'cm13', wilaya_id: 23, name_ar: 'عنابة', name_fr: 'Annaba', home_price: 700, desk_price: 500, is_active: true },
  { id: 'cm14', wilaya_id: 23, name_ar: 'سيدي عمار', name_fr: 'Sidi Amar', home_price: 700, desk_price: 500, is_active: true },
];

let ordersData: Order[] = [
  { id: 'o1', order_code: 'ORD-10001', customer_name: 'أحمد بن علي', phone: '0550123456', phone2: '', instagram: '', wilaya_id: 16, commune_id: 'cm1', address: 'حي الأمير عبد القادر رقم 12', delivery_type: 'home', notes: '', source: 'storefront', subtotal: 3990, delivery_fee: 400, discount: 0, total: 4390, coupon_code: '', status: 'delivered', ip_address: '192.168.1.1', admin_notes: '', created_at: '2024-03-10T10:30:00Z', updated_at: '2024-03-15T14:00:00Z' },
  { id: 'o2', order_code: 'ORD-10002', customer_name: 'فاطمة زهراء', phone: '0660234567', phone2: '', instagram: 'fatima.dz', wilaya_id: 31, commune_id: 'cm6', address: 'حي السلام', delivery_type: 'home', notes: 'الاتصال قبل التوصيل', source: 'storefront', subtotal: 2490, delivery_fee: 600, discount: 0, total: 3090, coupon_code: '', status: 'shipped', ip_address: '192.168.1.2', admin_notes: '', created_at: '2024-03-11T09:15:00Z', updated_at: '2024-03-14T11:00:00Z' },
  { id: 'o3', order_code: 'ORD-10003', customer_name: 'كريم بوشامة', phone: '0770345678', phone2: '0551112222', instagram: '', wilaya_id: 9, commune_id: 'cm9', address: '', delivery_type: 'desk', notes: '', source: 'landing-smart-watch-offer', subtotal: 3990, delivery_fee: 350, discount: 0, total: 4340, coupon_code: '', status: 'confirmed', ip_address: '192.168.1.3', admin_notes: 'تم تأكيد الطلب', created_at: '2024-03-12T14:20:00Z', updated_at: '2024-03-13T08:00:00Z' },
  { id: 'o4', order_code: 'ORD-10004', customer_name: 'ليلى مرابط', phone: '0540456789', phone2: '', instagram: '', wilaya_id: 25, commune_id: 'cm11', address: 'شارع أحمد باي', delivery_type: 'home', notes: '', source: 'storefront', subtotal: 4590, delivery_fee: 700, discount: 0, total: 5290, coupon_code: '', status: 'pending', ip_address: '192.168.1.4', admin_notes: '', created_at: '2024-03-13T16:45:00Z', updated_at: '2024-03-13T16:45:00Z' },
  { id: 'o5', order_code: 'ORD-10005', customer_name: 'محمد سعيدي', phone: '0550567890', phone2: '', instagram: '', wilaya_id: 16, commune_id: 'cm3', address: '', delivery_type: 'desk', notes: '', source: 'storefront', subtotal: 8990, delivery_fee: 300, discount: 500, total: 8790, coupon_code: 'SAVE500', status: 'pending', ip_address: '192.168.1.5', admin_notes: '', created_at: '2024-03-14T11:30:00Z', updated_at: '2024-03-14T11:30:00Z' },
];

const orderItemsData: OrderItem[] = [
  { id: 'oi1', order_id: 'o1', product_id: 'p1', variant_id: 'v1', product_name: 'ساعة ذكية برو - أسود', quantity: 1, unit_price: 3990, total: 3990 },
  { id: 'oi2', order_id: 'o2', product_id: 'p2', variant_id: null, product_name: 'سماعات لاسلكية إكس', quantity: 1, unit_price: 2490, total: 2490 },
  { id: 'oi3', order_id: 'o3', product_id: 'p1', variant_id: 'v2', product_name: 'ساعة ذكية برو - فضي', quantity: 1, unit_price: 4190, total: 4190 },
  { id: 'oi4', order_id: 'o4', product_id: 'p3', variant_id: 'v5', product_name: 'حذاء رياضي إيليت - 41', quantity: 1, unit_price: 4590, total: 4590 },
  { id: 'oi5', order_id: 'o5', product_id: 'p5', variant_id: null, product_name: 'ماكينة قهوة أوتوماتيكية', quantity: 1, unit_price: 8990, total: 8990 },
];

let customersData: Customer[] = [
  { id: 'cu1', name: 'أحمد بن علي', phone: '0550123456', phone2: '', instagram: '', wilaya_id: 16, commune_id: 'cm1', address: 'حي الأمير عبد القادر رقم 12', order_count: 1, total_spent: 4390, blacklist: false, notes: '', created_at: '2024-03-10T10:30:00Z', updated_at: '2024-03-15T14:00:00Z' },
  { id: 'cu2', name: 'فاطمة زهراء', phone: '0660234567', phone2: '', instagram: 'fatima.dz', wilaya_id: 31, commune_id: 'cm6', address: 'حي السلام', order_count: 1, total_spent: 3090, blacklist: false, notes: '', created_at: '2024-03-11T09:15:00Z', updated_at: '2024-03-14T11:00:00Z' },
  { id: 'cu3', name: 'كريم بوشامة', phone: '0770345678', phone2: '0551112222', instagram: '', wilaya_id: 9, commune_id: 'cm9', address: '', order_count: 1, total_spent: 4340, blacklist: false, notes: '', created_at: '2024-03-12T14:20:00Z', updated_at: '2024-03-13T08:00:00Z' },
  { id: 'cu4', name: 'ليلى مرابط', phone: '0540456789', phone2: '', instagram: '', wilaya_id: 25, commune_id: 'cm11', address: 'شارع أحمد باي', order_count: 1, total_spent: 5290, blacklist: false, notes: '', created_at: '2024-03-13T16:45:00Z', updated_at: '2024-03-13T16:45:00Z' },
  { id: 'cu5', name: 'محمد سعيدي', phone: '0550567890', phone2: '', instagram: '', wilaya_id: 16, commune_id: 'cm3', address: '', order_count: 1, total_spent: 8790, blacklist: false, notes: '', created_at: '2024-03-14T11:30:00Z', updated_at: '2024-03-14T11:30:00Z' },
];

let couponsData: Coupon[] = [
  { id: 'cp1', code: 'SAVE500', type: 'fixed', value: 500, min_order: 2000, max_uses: 100, uses_count: 1, expires_at: '2024-12-31', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cp2', code: 'WELCOME10', type: 'percentage', value: 10, min_order: 1000, max_uses: null, uses_count: 0, expires_at: null, is_active: true, created_at: '2024-01-01T00:00:00Z' },
];

let pixelsData: Pixel[] = [
  { id: 'px1', type: 'facebook', name: 'Facebook Main', pixel_id: '1234567890', is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'px2', type: 'tiktok', name: 'TikTok Ads', pixel_id: 'D547TIRC77U3FL78SLSG', is_active: true, created_at: '2024-01-01T00:00:00Z' },
];

let reviewsData: Review[] = [
  { id: 'r1', product_id: 'p1', customer_name: 'أحمد', rating: 5, text: 'ساعة رائعة جداً! عمر البطارية ممتاز والتصميم أنيق.', photos: [], is_verified: true, is_approved: true, created_at: '2024-03-01T00:00:00Z' },
  { id: 'r2', product_id: 'p1', customer_name: 'سارة', rating: 4, text: 'جودة جيدة، لكن التوصيل تأخر يومين.', photos: [], is_verified: true, is_approved: true, created_at: '2024-03-05T00:00:00Z' },
  { id: 'r3', product_id: 'p2', customer_name: 'محمد', rating: 5, text: 'صوت نقي جداً وإلغاء الضوضاء ممتاز.', photos: [], is_verified: false, is_approved: true, created_at: '2024-03-08T00:00:00Z' },
];

let mediaData: Media[] = [
  { id: 'm1', filename: 'hero-bg.jpg', url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop', thumbnail_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&h=200&fit=crop', type: 'image', size: 1024000, created_at: '2024-01-01T00:00:00Z' },
];

// ─── Database API (Simulates Supabase) ─────────────────────

let orderIdCounter = 10006;
function generateOrderCode() {
  return `ORD-${orderIdCounter++}`;
}

export const db = {
  // Store Settings
  getStoreSettings(): Promise<StoreSettings> {
    return Promise.resolve({ ...storeSettingsData });
  },
  updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    Object.assign(storeSettingsData, settings, { updated_at: new Date().toISOString() });
    return Promise.resolve({ ...storeSettingsData });
  },

  // Theme Settings
  getThemeSettings(): Promise<ThemeSettings> {
    return Promise.resolve({ ...themeSettingsData });
  },
  updateThemeSettings(theme: Partial<ThemeSettings>): Promise<ThemeSettings> {
    Object.assign(themeSettingsData, theme, { updated_at: new Date().toISOString() });
    return Promise.resolve({ ...themeSettingsData });
  },

  // Categories
  getCategories(): Promise<Category[]> {
    return Promise.resolve([...categoriesData].filter(c => c.is_active).sort((a, b) => a.sort_order - b.sort_order));
  },
  getAllCategories(): Promise<Category[]> {
    return Promise.resolve([...categoriesData].sort((a, b) => a.sort_order - b.sort_order));
  },
  getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Promise.resolve(categoriesData.find(c => c.slug === slug && c.is_active));
  },
  createCategory(cat: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const newCat: Category = { ...cat, id: `c${Date.now()}`, created_at: new Date().toISOString() };
    categoriesData.push(newCat);
    return Promise.resolve(newCat);
  },
  updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
    const idx = categoriesData.findIndex(c => c.id === id);
    if (idx >= 0) { categoriesData[idx] = { ...categoriesData[idx], ...cat }; }
    return Promise.resolve({ ...categoriesData[idx] });
  },
  deleteCategory(id: string): Promise<void> {
    categoriesData = categoriesData.filter(c => c.id !== id);
    return Promise.resolve();
  },

  // Products
  getProducts(): Promise<Product[]> {
    return Promise.resolve([...productsData].filter(p => p.is_active).map(p => ({
      ...p, category: categoriesData.find(c => c.id === p.category_id)
    })));
  },
  getAllProducts(): Promise<Product[]> {
    return Promise.resolve([...productsData].map(p => ({
      ...p, category: categoriesData.find(c => c.id === p.category_id)
    })));
  },
  getProductBySlug(slug: string): Promise<Product | undefined> {
    const p = productsData.find(p => p.slug === slug && p.is_active);
    if (!p) return Promise.resolve(undefined);
    return Promise.resolve({
      ...p,
      category: categoriesData.find(c => c.id === p.category_id),
      variants: variantsData.filter(v => v.product_id === p.id),
    });
  },
  getFeaturedProducts(): Promise<Product[]> {
    return Promise.resolve([...productsData].filter(p => p.is_featured && p.is_active).map(p => ({
      ...p, category: categoriesData.find(c => c.id === p.category_id)
    })));
  },
  getProductsByCategory(categoryId: string): Promise<Product[]> {
    return Promise.resolve([...productsData].filter(p => p.category_id === categoryId && p.is_active).map(p => ({
      ...p, category: categoriesData.find(c => c.id === p.category_id)
    })));
  },
  createProduct(prod: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const newProd: Product = { ...prod, id: `p${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    productsData.push(newProd);
    return Promise.resolve(newProd);
  },
  updateProduct(id: string, prod: Partial<Product>): Promise<Product> {
    const idx = productsData.findIndex(p => p.id === id);
    if (idx >= 0) { productsData[idx] = { ...productsData[idx], ...prod, updated_at: new Date().toISOString() }; }
    return Promise.resolve({ ...productsData[idx] });
  },
  deleteProduct(id: string): Promise<void> {
    productsData = productsData.filter(p => p.id !== id);
    return Promise.resolve();
  },

  // Variants
  getProductVariants(productId: string): Promise<ProductVariant[]> {
    return Promise.resolve([...variantsData].filter(v => v.product_id === productId));
  },

  // Homepage Sections
  getHomepageSections(): Promise<HomepageSection[]> {
    return Promise.resolve([...homepageSectionsData].filter(s => s.is_active).sort((a, b) => a.sort_order - b.sort_order));
  },
  getAllHomepageSections(): Promise<HomepageSection[]> {
    return Promise.resolve([...homepageSectionsData].sort((a, b) => a.sort_order - b.sort_order));
  },
  updateSection(id: string, section: Partial<HomepageSection>): Promise<HomepageSection> {
    const idx = homepageSectionsData.findIndex(s => s.id === id);
    if (idx >= 0) { homepageSectionsData[idx] = { ...homepageSectionsData[idx], ...section }; }
    return Promise.resolve({ ...homepageSectionsData[idx] });
  },

  // Landing Pages
  getLandingPages(): Promise<LandingPage[]> {
    return Promise.resolve([...landingPagesData].filter(lp => lp.is_active));
  },
  getAllLandingPages(): Promise<LandingPage[]> {
    return Promise.resolve([...landingPagesData]);
  },
  getLandingPageBySlug(slug: string): Promise<LandingPage | undefined> {
    return Promise.resolve(landingPagesData.find(lp => lp.slug === slug && lp.is_active));
  },
  createLandingPage(lp: Omit<LandingPage, 'id' | 'created_at'>): Promise<LandingPage> {
    const newLp: LandingPage = { ...lp, id: `lp${Date.now()}`, created_at: new Date().toISOString() };
    landingPagesData.push(newLp);
    return Promise.resolve(newLp);
  },
  updateLandingPage(id: string, lp: Partial<LandingPage>): Promise<LandingPage> {
    const idx = landingPagesData.findIndex(l => l.id === id);
    if (idx >= 0) { landingPagesData[idx] = { ...landingPagesData[idx], ...lp }; }
    return Promise.resolve({ ...landingPagesData[idx] });
  },
  deleteLandingPage(id: string): Promise<void> {
    landingPagesData = landingPagesData.filter(lp => lp.id !== id);
    return Promise.resolve();
  },

  // Orders
  getOrders(): Promise<Order[]> {
    return Promise.resolve([...ordersData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(o => ({
      ...o,
      wilaya: wilayasData.find(w => w.id === o.wilaya_id),
      commune: communesData.find(c => c.id === o.commune_id),
      items: orderItemsData.filter(i => i.order_id === o.id),
    })));
  },
  getOrderByCode(code: string): Promise<Order | undefined> {
    const o = ordersData.find(o => o.order_code === code);
    if (!o) return Promise.resolve(undefined);
    return Promise.resolve({
      ...o,
      wilaya: wilayasData.find(w => w.id === o.wilaya_id),
      commune: communesData.find(c => c.id === o.commune_id),
      items: orderItemsData.filter(i => i.order_id === o.id),
    });
  },
  createOrder(order: Omit<Order, 'id' | 'order_code' | 'created_at' | 'updated_at'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: `o${Date.now()}`,
      order_code: generateOrderCode(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    ordersData.push(newOrder);
    // Create customer or update
    const existingCustomer = customersData.find(c => c.phone === order.phone);
    if (existingCustomer) {
      existingCustomer.order_count++;
      existingCustomer.total_spent += order.total;
    } else {
      customersData.push({
        id: `cu${Date.now()}`,
        name: order.customer_name,
        phone: order.phone,
        phone2: order.phone2,
        instagram: order.instagram,
        wilaya_id: order.wilaya_id,
        commune_id: order.commune_id,
        address: order.address,
        order_count: 1,
        total_spent: order.total,
        blacklist: false,
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    return Promise.resolve(newOrder);
  },
  updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    const idx = ordersData.findIndex(o => o.id === id);
    if (idx >= 0) {
      ordersData[idx] = { ...ordersData[idx], status, updated_at: new Date().toISOString() };
      if (notes) ordersData[idx].admin_notes = notes;
    }
    return Promise.resolve({ ...ordersData[idx] });
  },
  deleteOrder(id: string): Promise<void> {
    ordersData = ordersData.filter(o => o.id !== id);
    return Promise.resolve();
  },

  // Wilayas
  getWilayas(): Promise<Wilaya[]> {
    return Promise.resolve([...wilayasData].filter(w => w.is_active));
  },
  getAllWilayas(): Promise<Wilaya[]> {
    return Promise.resolve([...wilayasData]);
  },
  updateWilaya(id: number, data: Partial<Wilaya>): Promise<Wilaya> {
    const idx = wilayasData.findIndex(w => w.id === id);
    if (idx >= 0) { wilayasData[idx] = { ...wilayasData[idx], ...data }; }
    return Promise.resolve({ ...wilayasData[idx] });
  },

  // Communes
  getCommunesByWilaya(wilayaId: number): Promise<Commune[]> {
    return Promise.resolve([...communesData].filter(c => c.wilaya_id === wilayaId && c.is_active));
  },
  getAllCommunes(): Promise<Commune[]> {
    return Promise.resolve([...communesData]);
  },
  updateCommune(id: string, data: Partial<Commune>): Promise<Commune> {
    const idx = communesData.findIndex(c => c.id === id);
    if (idx >= 0) { communesData[idx] = { ...communesData[idx], ...data }; }
    return Promise.resolve({ ...communesData[idx] });
  },

  // Coupons
  getCoupons(): Promise<Coupon[]> {
    return Promise.resolve([...couponsData]);
  },
  validateCoupon(code: string, orderTotal: number): Promise<{ valid: boolean; discount: number; message: string }> {
    const coupon = couponsData.find(c => c.code === code && c.is_active);
    if (!coupon) return Promise.resolve({ valid: false, discount: 0, message: 'كوبون غير صالح' });
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return Promise.resolve({ valid: false, discount: 0, message: 'انتهت صلاحية الكوبون' });
    if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) return Promise.resolve({ valid: false, discount: 0, message: 'تم استنفاد الكوبون' });
    if (orderTotal < coupon.min_order) return Promise.resolve({ valid: false, discount: 0, message: `الحد الأدنى للطلب ${coupon.min_order} دج` });
    const discount = coupon.type === 'percentage' ? Math.floor(orderTotal * coupon.value / 100) : coupon.value;
    return Promise.resolve({ valid: true, discount, message: 'تم تطبيق الكوبون!' });
  },

  // Pixels
  getPixels(): Promise<Pixel[]> {
    return Promise.resolve([...pixelsData]);
  },

  // Customers
  getCustomers(): Promise<Customer[]> {
    return Promise.resolve([...customersData].map(c => ({
      ...c, wilaya: wilayasData.find(w => w.id === c.wilaya_id)
    })));
  },
  updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    const idx = customersData.findIndex(c => c.id === id);
    if (idx >= 0) { customersData[idx] = { ...customersData[idx], ...data }; }
    return Promise.resolve({ ...customersData[idx] });
  },

  // Reviews
  getReviews(): Promise<Review[]> {
    return Promise.resolve([...reviewsData]);
  },
  getApprovedReviews(productId?: string): Promise<Review[]> {
    let reviews = reviewsData.filter(r => r.is_approved);
    if (productId) reviews = reviews.filter(r => r.product_id === productId);
    return Promise.resolve([...reviews]);
  },
  updateReview(id: string, data: Partial<Review>): Promise<Review> {
    const idx = reviewsData.findIndex(r => r.id === id);
    if (idx >= 0) { reviewsData[idx] = { ...reviewsData[idx], ...data }; }
    return Promise.resolve({ ...reviewsData[idx] });
  },

  // Media
  getMedia(): Promise<Media[]> {
    return Promise.resolve([...mediaData]);
  },
  addMedia(media: Omit<Media, 'id' | 'created_at'>): Promise<Media> {
    const newMedia: Media = { ...media, id: `m${Date.now()}`, created_at: new Date().toISOString() };
    mediaData.push(newMedia);
    return Promise.resolve(newMedia);
  },

  // Stats
  getDashboardStats(): Promise<{
    totalOrders: number; totalProducts: number; totalRevenue: number;
    activeCustomers: number; totalWilayas: number; totalCategories: number;
    activeAds: number; conversionRate: number; recentOrders: Order[];
  }> {
    const totalOrders = ordersData.length;
    const totalProducts = productsData.filter(p => p.is_active).length;
    const totalRevenue = ordersData.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
    const activeCustomers = customersData.length;
    const totalWilayas = wilayasData.filter(w => w.is_active).length;
    const totalCategories = categoriesData.filter(c => c.is_active).length;
    const activeAds = landingPagesData.filter(lp => lp.is_active).length;
    const conversionRate = totalOrders > 0 ? Math.round((ordersData.filter(o => o.status === 'delivered').length / totalOrders) * 100) : 0;
    const recentOrders = [...ordersData]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(o => ({
        ...o,
        wilaya: wilayasData.find(w => w.id === o.wilaya_id),
        items: orderItemsData.filter(i => i.order_id === o.id),
      }));
    return Promise.resolve({ totalOrders, totalProducts, totalRevenue, activeCustomers, totalWilayas, totalCategories, activeAds, conversionRate, recentOrders });
  },
};

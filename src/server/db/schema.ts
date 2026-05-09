import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  bigint,
  jsonb,
  boolean,
  decimal,
  index,
  uniqueIndex,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const stockStatusEnum = pgEnum("stock_status", ["in_stock", "out_of_stock", "low_stock"]);
export const displayModeEnum = pgEnum("display_mode", ["product_page", "landing_page"]);
export const checkoutPositionEnum = pgEnum("checkout_position", ["top", "middle", "bottom", "sticky", "floating"]);
export const deliveryTypeEnum = pgEnum("delivery_type", ["home", "desk"]);
export const orderStatusEnum = pgEnum("order_status", ["new", "confirmed", "shipping", "delivered", "returned", "cancelled"]);
export const couponTypeEnum = pgEnum("coupon_type", ["percentage", "fixed_amount", "free_shipping"]);
export const landingSectionTypeEnum = pgEnum("landing_section_type", [
  "hero", "benefits", "reviews", "countdown", "video", "bundles",
  "faq", "checkout", "trust_badges", "testimonials", "long_image",
  "features", "before_after",
]);

// ─── Profiles (Supabase Auth Extension) ────────────────────────────
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 320 }),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("last_sign_in_at").defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;

// ─── Store Settings ────────────────────────────────────────────────
export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: varchar("store_name", { length: 255 }).notNull().default("Walky DZ"),
  storeSlug: varchar("store_slug", { length: 255 }).default("walky-dz"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: varchar("primary_color", { length: 50 }).default("#2563EB"),
  secondaryColor: varchar("secondary_color", { length: 50 }).default("#1D4ED8"),
  accentColor: varchar("accent_color", { length: 50 }).default("#F97316"),
  fontFamily: varchar("font_family", { length: 100 }).default("Cairo"),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  phoneNumber: varchar("phone_number", { length: 20 }),
  themeConfig: jsonb("theme_config").$type<Record<string, unknown>>().default({}),
  pixelsConfig: jsonb("pixels_config").$type<Record<string, unknown>>().default({}),
  sheetsUrl: text("sheets_url"),
  sheetsConfig: jsonb("sheets_config").$type<Record<string, unknown>>().default({}),
  seoDefaults: jsonb("seo_defaults").$type<Record<string, unknown>>().default({}),
  navbarConfig: jsonb("navbar_config").$type<Record<string, unknown>>().default({}),
  footerConfig: jsonb("footer_config").$type<Record<string, unknown>>().default({}),
  homepageConfig: jsonb("homepage_config").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type StoreSettings = typeof storeSettings.$inferSelect;

// ─── Categories ────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("category_slug_idx").on(table.slug),
]);

export type Category = typeof categories.$inferSelect;

// ─── Products ──────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  comparePrice: decimal("compare_price", { precision: 12, scale: 2 }),
  costPrice: decimal("cost_price", { precision: 12, scale: 2 }),
  sku: varchar("sku", { length: 100 }),
  stockQuantity: integer("stock_quantity").default(0),
  stockStatus: stockStatusEnum("stock_status").default("in_stock"),
  categoryId: integer("category_id").references(() => categories.id),
  images: jsonb("images").$type<string[]>().default([]),
  displayMode: displayModeEnum("display_mode").default("product_page"),
  checkoutPosition: checkoutPositionEnum("checkout_position").default("bottom"),
  hasVariants: boolean("has_variants").default(false),
  variantOptions: jsonb("variant_options").$type<{ colors?: string[]; sizes?: string[] }>().default({}),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  isActive: boolean("is_active").default(true),
  featured: boolean("featured").default(false),
  viewCount: integer("view_count").default(0),
  orderCount: integer("order_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("product_slug_idx").on(table.slug),
  index("product_category_idx").on(table.categoryId),
  index("product_active_idx").on(table.isActive),
  index("product_featured_idx").on(table.featured),
]);

export type Product = typeof products.$inferSelect;

// ─── Landing Pages ─────────────────────────────────────────────────
export const landingPages = pgTable("landing_pages", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sections: jsonb("sections").$type<LandingSection[]>().default([]),
  checkoutPosition: checkoutPositionEnum("checkout_position").default("bottom"),
  hasNavbar: boolean("has_navbar").default(false),
  hasFooter: boolean("has_footer").default(false),
  countdownEnd: timestamp("countdown_end"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  isActive: boolean("is_active").default(true),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("landing_slug_idx").on(table.slug),
  index("landing_active_idx").on(table.isActive),
]);

export type LandingPage = typeof landingPages.$inferSelect;

export type LandingSection = {
  id: string;
  type: "hero" | "benefits" | "reviews" | "countdown" | "video" | "bundles" | "faq" | "checkout" | "trust_badges" | "testimonials" | "long_image" | "features" | "before_after";
  enabled: boolean;
  order: number;
  content: Record<string, unknown>;
};

// ─── Orders ────────────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  productId: integer("product_id").references(() => products.id),
  landingPageId: integer("landing_page_id").references(() => landingPages.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  wilayaId: integer("wilaya_id").notNull(),
  wilayaName: varchar("wilaya_name", { length: 100 }),
  communeId: integer("commune_id"),
  communeName: varchar("commune_name", { length: 100 }),
  address: text("address"),
  deliveryType: deliveryTypeEnum("delivery_type").default("home"),
  variantColor: varchar("variant_color", { length: 50 }),
  variantSize: varchar("variant_size", { length: 50 }),
  quantity: integer("quantity").default(1),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 12, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("new"),
  notes: text("notes"),
  riskScore: integer("risk_score").default(0),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  source: varchar("source", { length: 100 }),
  googleSheetsSynced: boolean("google_sheets_synced").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("order_phone_idx").on(table.phone),
  index("order_status_idx").on(table.status),
  index("order_created_idx").on(table.createdAt),
  index("order_number_idx").on(table.orderNumber),
]);

export type Order = typeof orders.$inferSelect;

// ─── Wilayas (Algerian States) ─────────────────────────────────────
export const wilayas = pgTable("wilayas", {
  id: integer("id").primaryKey(),
  code: integer("code").notNull().unique(),
  nameAr: varchar("name_ar", { length: 100 }).notNull(),
  nameFr: varchar("name_fr", { length: 100 }),
  nameEn: varchar("name_en", { length: 100 }),
  isActive: boolean("is_active").default(true),
});

export type Wilaya = typeof wilayas.$inferSelect;

// ─── Communes ──────────────────────────────────────────────────────
export const communes = pgTable("communes", {
  id: serial("id").primaryKey(),
  wilayaId: integer("wilaya_id").notNull().references(() => wilayas.id),
  nameAr: varchar("name_ar", { length: 100 }).notNull(),
  nameFr: varchar("name_fr", { length: 100 }),
  isActive: boolean("is_active").default(true),
}, (table) => [
  index("commune_wilaya_idx").on(table.wilayaId),
]);

export type Commune = typeof communes.$inferSelect;

// ─── Shipping Zones ────────────────────────────────────────────────
export const shippingZones = pgTable("shipping_zones", {
  id: serial("id").primaryKey(),
  wilayaId: integer("wilaya_id").notNull().references(() => wilayas.id),
  homePrice: decimal("home_price", { precision: 12, scale: 2 }).notNull().default("0"),
  deskPrice: decimal("desk_price", { precision: 12, scale: 2 }).notNull().default("0"),
  isEnabled: boolean("is_enabled").default(true),
  freeShippingMin: decimal("free_shipping_min", { precision: 12, scale: 2 }),
  providerId: integer("provider_id").references(() => shippingProviders.id),
  estimatedDays: varchar("estimated_days", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("zone_wilaya_idx").on(table.wilayaId),
]);

export type ShippingZone = typeof shippingZones.$inferSelect;

// ─── Shipping Providers ────────────────────────────────────────────
export const shippingProviders = pgTable("shipping_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  apiKey: varchar("api_key", { length: 255 }),
  apiEndpoint: text("api_endpoint"),
  isActive: boolean("is_active").default(true),
  config: jsonb("config").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ShippingProvider = typeof shippingProviders.$inferSelect;

// ─── Fraud Blacklist ───────────────────────────────────────────────
export const fraudBlacklist = pgTable("fraud_blacklist", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }),
  ipAddress: varchar("ip_address", { length: 50 }),
  reason: text("reason"),
  isAuto: boolean("is_auto").default(false),
  blockedAt: timestamp("blocked_at").defaultNow().notNull(),
  blockedUntil: timestamp("blocked_until"),
}, (table) => [
  index("blacklist_phone_idx").on(table.phone),
  index("blacklist_ip_idx").on(table.ipAddress),
]);

export type FraudBlacklistEntry = typeof fraudBlacklist.$inferSelect;

// ─── Coupons ───────────────────────────────────────────────────────
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: couponTypeEnum("type").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 12, scale: 2 }),
  maxUses: integer("max_uses"),
  usesCount: integer("uses_count").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;

// ─── Reviews ───────────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("review_product_idx").on(table.productId),
]);

export type Review = typeof reviews.$inferSelect;

// ─── Media / Files ─────────────────────────────────────────────────
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  folder: varchar("folder", { length: 100 }).default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MediaFile = typeof mediaFiles.$inferSelect;

// ─── Activity Log ──────────────────────────────────────────────────
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: integer("entity_id"),
  details: jsonb("details").$type<Record<string, unknown>>().default({}),
  userId: uuid("user_id").references(() => profiles.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLogEntry = typeof activityLog.$inferSelect;

// ─── Homepage Banners ──────────────────────────────────────────────
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  position: varchar("position", { length: 50 }).default("hero"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Banner = typeof banners.$inferSelect;

// ─── Homepage Sections ─────────────────────────────────────────────
export const homepageSections = pgTable("homepage_sections", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }),
  config: jsonb("config").$type<Record<string, unknown>>().default({}),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type HomepageSection = typeof homepageSections.$inferSelect;

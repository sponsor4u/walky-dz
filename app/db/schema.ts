import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  bigint,
  json,
  boolean,
  decimal,
  index,
} from "drizzle-orm/mysql-core";

// ─── Users (Auth) ────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Store Settings ──────────────────────────────────────────────
export const storeSettings = mysqlTable("store_settings", {
  id: serial("id").primaryKey(),
  storeName: varchar("store_name", { length: 255 }).notNull().default("Walky DZ"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: varchar("primary_color", { length: 50 }).default("#2563EB"),
  secondaryColor: varchar("secondary_color", { length: 50 }).default("#1D4ED8"),
  accentColor: varchar("accent_color", { length: 50 }).default("#F97316"),
  fontFamily: varchar("font_family", { length: 100 }).default("Cairo"),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  themeConfig: json("theme_config").$type<Record<string, unknown>>(),
  pixelsConfig: json("pixels_config").$type<Record<string, unknown>>(),
  sheetsUrl: text("sheets_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type StoreSettings = typeof storeSettings.$inferSelect;

// ─── Categories ──────────────────────────────────────────────────
export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: int("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Category = typeof categories.$inferSelect;

// ─── Products ────────────────────────────────────────────────────
export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  comparePrice: decimal("compare_price", { precision: 12, scale: 2 }),
  costPrice: decimal("cost_price", { precision: 12, scale: 2 }),
  sku: varchar("sku", { length: 100 }),
  stockQuantity: int("stock_quantity").default(0),
  stockStatus: mysqlEnum("stock_status", ["in_stock", "out_of_stock", "low_stock"]).default("in_stock"),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }).references(() => categories.id),
  images: json("images").$type<string[] | null>(),
  displayMode: mysqlEnum("display_mode", ["product_page", "landing_page"]).default("product_page"),
  checkoutPosition: mysqlEnum("checkout_position", ["top", "middle", "bottom", "sticky", "floating"]).default("bottom"),
  hasVariants: boolean("has_variants").default(false),
  variantOptions: json("variant_options").$type<{ colors?: string[]; sizes?: string[] } | null>(),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  isActive: boolean("is_active").default(true),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;

// ─── Landing Pages ───────────────────────────────────────────────
export const landingPages = mysqlTable("landing_pages", {
  id: serial("id").primaryKey(),
  productId: bigint("product_id", { mode: "number", unsigned: true }).references(() => products.id),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sections: json("sections").$type<LandingSection[]>(),
  checkoutPosition: mysqlEnum("checkout_position", ["top", "middle", "bottom", "sticky", "floating"]).default("bottom"),
  hasNavbar: boolean("has_navbar").default(true),
  hasFooter: boolean("has_footer").default(true),
  countdownEnd: timestamp("countdown_end"),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type LandingPage = typeof landingPages.$inferSelect;

export type LandingSection = {
  id: string;
  type: "hero" | "benefits" | "reviews" | "countdown" | "video" | "bundles" | "faq" | "checkout" | "trust_badges" | "testimonials" | "long_image" | "features" | "before_after";
  enabled: boolean;
  order: number;
  content: Record<string, unknown>;
};

// ─── Orders ──────────────────────────────────────────────────────
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  productId: bigint("product_id", { mode: "number", unsigned: true }).references(() => products.id),
  landingPageId: bigint("landing_page_id", { mode: "number", unsigned: true }).references(() => landingPages.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  wilayaId: int("wilaya_id").notNull(),
  wilayaName: varchar("wilaya_name", { length: 100 }),
  communeId: int("commune_id"),
  communeName: varchar("commune_name", { length: 100 }),
  address: text("address"),
  deliveryType: mysqlEnum("delivery_type", ["home", "desk"]).default("home"),
  variantColor: varchar("variant_color", { length: 50 }),
  variantSize: varchar("variant_size", { length: 50 }),
  quantity: int("quantity").default(1),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 12, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["new", "confirmed", "shipping", "delivered", "returned", "cancelled"]).default("new"),
  notes: text("notes"),
  riskScore: int("risk_score").default(0),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("phone_idx").on(table.phone),
  index("status_idx").on(table.status),
  index("created_at_idx").on(table.createdAt),
]);

export type Order = typeof orders.$inferSelect;

// ─── Wilayas (Algerian States) ───────────────────────────────────
export const wilayas = mysqlTable("wilayas", {
  id: int("id").primaryKey(),
  code: int("code").notNull().unique(),
  nameAr: varchar("name_ar", { length: 100 }).notNull(),
  nameFr: varchar("name_fr", { length: 100 }),
  nameEn: varchar("name_en", { length: 100 }),
  isActive: boolean("is_active").default(true),
}, (table) => [
  index("wilaya_code_idx").on(table.code),
]);

export type Wilaya = typeof wilayas.$inferSelect;

// ─── Communes ────────────────────────────────────────────────────
export const communes = mysqlTable("communes", {
  id: serial("id").primaryKey(),
  wilayaId: int("wilaya_id").notNull().references(() => wilayas.id),
  nameAr: varchar("name_ar", { length: 100 }).notNull(),
  nameFr: varchar("name_fr", { length: 100 }),
  isActive: boolean("is_active").default(true),
}, (table) => [
  index("commune_wilaya_idx").on(table.wilayaId),
]);

export type Commune = typeof communes.$inferSelect;

// ─── Shipping Zones ──────────────────────────────────────────────
export const shippingZones = mysqlTable("shipping_zones", {
  id: serial("id").primaryKey(),
  wilayaId: int("wilaya_id").notNull().references(() => wilayas.id),
  homePrice: decimal("home_price", { precision: 12, scale: 2 }).notNull().default("0"),
  deskPrice: decimal("desk_price", { precision: 12, scale: 2 }).notNull().default("0"),
  isEnabled: boolean("is_enabled").default(true),
  freeShippingMin: decimal("free_shipping_min", { precision: 12, scale: 2 }),
  providerId: bigint("provider_id", { mode: "number", unsigned: true }),
  estimatedDays: varchar("estimated_days", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ShippingZone = typeof shippingZones.$inferSelect;

// ─── Shipping Providers ──────────────────────────────────────────
export const shippingProviders = mysqlTable("shipping_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  apiKey: varchar("api_key", { length: 255 }),
  apiEndpoint: text("api_endpoint"),
  isActive: boolean("is_active").default(true),
  config: json("config").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ShippingProvider = typeof shippingProviders.$inferSelect;

// ─── Fraud Blacklist ─────────────────────────────────────────────
export const fraudBlacklist = mysqlTable("fraud_blacklist", {
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

// ─── Coupons ─────────────────────────────────────────────────────
export const coupons = mysqlTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: mysqlEnum("type", ["percentage", "fixed_amount", "free_shipping"]).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  minOrderAmount: decimal("min_order_amount", { precision: 12, scale: 2 }),
  maxUses: int("max_uses"),
  usesCount: int("uses_count").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Coupon = typeof coupons.$inferSelect;

// ─── Reviews ─────────────────────────────────────────────────────
export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  productId: bigint("product_id", { mode: "number", unsigned: true }).references(() => products.id),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;

// ─── Media / Files ───────────────────────────────────────────────
export const mediaFiles = mysqlTable("media_files", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: int("size"),
  folder: varchar("folder", { length: 100 }).default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MediaFile = typeof mediaFiles.$inferSelect;

// ─── Activity Log ────────────────────────────────────────────────
export const activityLog = mysqlTable("activity_log", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: bigint("entity_id", { mode: "number", unsigned: true }),
  details: json("details").$type<Record<string, unknown>>(),
  userId: bigint("user_id", { mode: "number", unsigned: true }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLogEntry = typeof activityLog.$inferSelect;

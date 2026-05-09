import { relations } from "drizzle-orm";
import {
  profiles, storeSettings, categories, products, landingPages,
  orders, wilayas, communes, shippingZones, shippingProviders,
  fraudBlacklist, coupons, reviews, mediaFiles, activityLog,
  banners, homepageSections,
} from "./schema";

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  orders: many(orders),
  reviews: many(reviews),
  landingPages: many(landingPages),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const landingPagesRelations = relations(landingPages, ({ one }) => ({
  product: one(products, { fields: [landingPages.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  product: one(products, { fields: [orders.productId], references: [products.id] }),
  landingPage: one(landingPages, { fields: [orders.landingPageId], references: [landingPages.id] }),
}));

export const communesRelations = relations(communes, ({ one }) => ({
  wilaya: one(wilayas, { fields: [communes.wilayaId], references: [wilayas.id] }),
}));

export const shippingZonesRelations = relations(shippingZones, ({ one }) => ({
  wilaya: one(wilayas, { fields: [shippingZones.wilayaId], references: [wilayas.id] }),
  provider: one(shippingProviders, { fields: [shippingZones.providerId], references: [shippingProviders.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));

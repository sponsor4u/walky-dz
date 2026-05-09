import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { landingPages } from "@db/schema";
import type { LandingSection } from "@db/schema";

export const landingRouter = createRouter({
  // Public
  list: publicQuery
    .input(z.object({
      active: z.boolean().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = input?.active !== false ? eq(landingPages.isActive, true) : undefined;
      return db.select().from(landingPages)
        .where(conditions)
        .orderBy(desc(landingPages.createdAt));
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(landingPages)
        .where(eq(landingPages.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),

  // Admin
  create: adminQuery
    .input(z.object({
      productId: z.number(),
      name: z.string().min(1),
      slug: z.string().min(1),
      sections: z.array(z.object({
        id: z.string(),
        type: z.enum(["hero", "benefits", "reviews", "countdown", "video", "bundles", "faq", "checkout", "trust_badges", "testimonials", "long_image", "features", "before_after"]),
        enabled: z.boolean(),
        order: z.number(),
        content: z.record(z.unknown()),
      })).default([]),
      checkoutPosition: z.enum(["top", "middle", "bottom", "sticky", "floating"]).default("bottom"),
      hasNavbar: z.boolean().default(true),
      hasFooter: z.boolean().default(true),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(landingPages).values({
        ...input,
        sections: input.sections as unknown as LandingSection[],
        isActive: true,
      });
      return result;
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      productId: z.number().optional(),
      name: z.string().optional(),
      slug: z.string().optional(),
      sections: z.array(z.object({
        id: z.string(),
        type: z.enum(["hero", "benefits", "reviews", "countdown", "video", "bundles", "faq", "checkout", "trust_badges", "testimonials", "long_image", "features", "before_after"]),
        enabled: z.boolean(),
        order: z.number(),
        content: z.record(z.unknown()),
      })).optional(),
      checkoutPosition: z.enum(["top", "middle", "bottom", "sticky", "floating"]).optional(),
      hasNavbar: z.boolean().optional(),
      hasFooter: z.boolean().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      isActive: z.boolean().optional(),
      countdownEnd: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(landingPages).set({
        ...data,
        updatedAt: new Date(),
      }).where(eq(landingPages.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(landingPages).where(eq(landingPages.id, input.id));
      return { success: true };
    }),
});

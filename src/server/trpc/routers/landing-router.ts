import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { landingPages } from "@/server/db/schema";
import type { LandingSection } from "@/server/db/schema";

export const landingRouter = router({
  // ─── Public ────────────────────────────────────────────
  list: publicProcedure
    .input(z.object({ active: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      return db.query.landingPages.findMany({
        where: input?.active !== false ? eq(landingPages.isActive, true) : undefined,
        with: { product: true },
        orderBy: [desc(landingPages.createdAt)],
      });
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.query.landingPages.findFirst({
        where: eq(landingPages.slug, input.slug),
        with: { product: true },
      }) ?? null;
    }),

  incrementViews: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const page = await db.query.landingPages.findFirst({
        where: eq(landingPages.id, input.id),
      });
      if (page) {
        await db.update(landingPages)
          .set({ viewCount: (page.viewCount ?? 0) + 1 })
          .where(eq(landingPages.id, input.id));
      }
      return { success: true };
    }),

  // ─── Admin ─────────────────────────────────────────────
  create: adminProcedure
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
      hasNavbar: z.boolean().default(false),
      hasFooter: z.boolean().default(false),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      countdownEnd: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await db.insert(landingPages).values({
        ...input,
        sections: input.sections as LandingSection[],
        isActive: true,
      }).returning();
      return result[0];
    }),

  update: adminProcedure
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
      await db.update(landingPages).set({
        ...data,
        updatedAt: new Date(),
      }).where(eq(landingPages.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(landingPages).where(eq(landingPages.id, input.id));
      return { success: true };
    }),
});

import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { banners, homepageSections } from "@/server/db/schema";

export const homepageRouter = router({
  // ─── Public ────────────────────────────────────────────
  getBanners: publicProcedure.query(async () => {
    return db.query.banners.findMany({
      where: eq(banners.isActive, true),
      orderBy: [banners.sortOrder],
    });
  }),

  getSections: publicProcedure.query(async () => {
    return db.query.homepageSections.findMany({
      where: eq(homepageSections.isActive, true),
      orderBy: [homepageSections.sortOrder],
    });
  }),

  // ─── Admin ─────────────────────────────────────────────
  listBanners: adminProcedure.query(async () => {
    return db.query.banners.findMany({
      orderBy: [banners.sortOrder],
    });
  }),

  createBanner: adminProcedure
    .input(z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      imageUrl: z.string().optional(),
      linkUrl: z.string().optional(),
      position: z.string().default("hero"),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const result = await db.insert(banners).values({
        ...input,
        isActive: true,
      }).returning();
      return result[0];
    }),

  updateBanner: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      imageUrl: z.string().optional(),
      linkUrl: z.string().optional(),
      position: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(banners).set(data).where(eq(banners.id, id));
      return { success: true };
    }),

  deleteBanner: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(banners).where(eq(banners.id, input.id));
      return { success: true };
    }),

  listSections: adminProcedure.query(async () => {
    return db.query.homepageSections.findMany({
      orderBy: [homepageSections.sortOrder],
    });
  }),

  createSection: adminProcedure
    .input(z.object({
      type: z.string(),
      title: z.string().optional(),
      config: z.record(z.unknown()).optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const result = await db.insert(homepageSections).values({
        ...input,
        config: input.config ?? {},
        isActive: true,
      }).returning();
      return result[0];
    }),

  updateSection: adminProcedure
    .input(z.object({
      id: z.number(),
      type: z.string().optional(),
      title: z.string().optional(),
      config: z.record(z.unknown()).optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(homepageSections).set(data).where(eq(homepageSections.id, id));
      return { success: true };
    }),

  deleteSection: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(homepageSections).where(eq(homepageSections.id, input.id));
      return { success: true };
    }),
});

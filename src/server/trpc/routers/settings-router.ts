import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { storeSettings } from "@/server/db/schema";

export const settingsRouter = router({
  get: publicProcedure.query(async () => {
    const result = await db.query.storeSettings.findFirst();
    return (
      result ?? {
        storeName: "Walky DZ",
        primaryColor: "#2563EB",
        secondaryColor: "#1D4ED8",
        accentColor: "#F97316",
        fontFamily: "Cairo",
        logoUrl: null,
        faviconUrl: null,
        whatsappNumber: null,
        themeConfig: {},
        pixelsConfig: {},
        sheetsUrl: null,
        navbarConfig: {},
        footerConfig: {},
        homepageConfig: {},
      }
    );
  }),

  update: adminProcedure
    .input(
      z.object({
        storeName: z.string().optional(),
        storeSlug: z.string().optional(),
        logoUrl: z.string().optional(),
        faviconUrl: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        accentColor: z.string().optional(),
        fontFamily: z.string().optional(),
        whatsappNumber: z.string().optional(),
        phoneNumber: z.string().optional(),
        themeConfig: z.record(z.unknown()).optional(),
        pixelsConfig: z.record(z.unknown()).optional(),
        sheetsUrl: z.string().optional(),
        sheetsConfig: z.record(z.unknown()).optional(),
        seoDefaults: z.record(z.unknown()).optional(),
        navbarConfig: z.record(z.unknown()).optional(),
        footerConfig: z.record(z.unknown()).optional(),
        homepageConfig: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await db.query.storeSettings.findFirst();

      if (existing) {
        await db
          .update(storeSettings)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(storeSettings.id, existing.id));
      } else {
        await db.insert(storeSettings).values({
          storeName: input.storeName ?? "Walky DZ",
          ...input,
        });
      }

      return { success: true };
    }),
});

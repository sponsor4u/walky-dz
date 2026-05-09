import { z } from "zod";
import { eq } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { storeSettings } from "@db/schema";

export const settingsRouter = createRouter({
  // Public - get store settings
  get: publicQuery.query(async () => {
    const db = getDb();
    const result = await db.select().from(storeSettings).limit(1);
    return result[0] ?? {
      storeName: "Walky DZ",
      primaryColor: "#2563EB",
      secondaryColor: "#1D4ED8",
      accentColor: "#F97316",
      fontFamily: "Cairo",
      logoUrl: null,
      faviconUrl: null,
      whatsappNumber: null,
      themeConfig: null,
      pixelsConfig: null,
      sheetsUrl: null,
    };
  }),

  // Admin - update settings
  update: adminQuery
    .input(z.object({
      storeName: z.string().optional(),
      logoUrl: z.string().optional(),
      faviconUrl: z.string().optional(),
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      accentColor: z.string().optional(),
      fontFamily: z.string().optional(),
      whatsappNumber: z.string().optional(),
      themeConfig: z.record(z.unknown()).optional(),
      pixelsConfig: z.record(z.unknown()).optional(),
      sheetsUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(storeSettings).limit(1);
      
      if (existing[0]) {
        await db.update(storeSettings)
          .set({ ...input, updatedAt: new Date() })
          .where(eq(storeSettings.id, existing[0].id));
      } else {
        await db.insert(storeSettings).values({
          storeName: input.storeName ?? "Walky DZ",
          ...input,
        });
      }
      
      return { success: true };
    }),
});

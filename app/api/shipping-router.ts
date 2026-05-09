import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { shippingZones, shippingProviders, wilayas, communes } from "@db/schema";

export const shippingRouter = createRouter({
  // Public
  listWilayas: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(wilayas).where(eq(wilayas.isActive, true));
  }),

  listCommunes: publicQuery
    .input(z.object({ wilayaId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(communes)
        .where(and(eq(communes.wilayaId, input.wilayaId), eq(communes.isActive, true)));
    }),

  getZone: publicQuery
    .input(z.object({ wilayaId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(shippingZones)
        .where(eq(shippingZones.wilayaId, input.wilayaId))
        .limit(1);
      return result[0] ?? null;
    }),

  calculate: publicQuery
    .input(z.object({
      wilayaId: z.number(),
      quantity: z.number().default(1),
      subtotal: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = getDb();
      const zone = await db.select().from(shippingZones)
        .where(eq(shippingZones.wilayaId, input.wilayaId))
        .limit(1);

      if (!zone[0]) {
        return { homePrice: "600", deskPrice: "400", freeShipping: false };
      }

      const subtotalNum = parseFloat(input.subtotal ?? "0");
      const freeMin = zone[0].freeShippingMin ? parseFloat(zone[0].freeShippingMin.toString()) : 0;
      const freeShipping = freeMin > 0 && subtotalNum >= freeMin;

      return {
        homePrice: zone[0].homePrice?.toString() ?? "600",
        deskPrice: zone[0].deskPrice?.toString() ?? "400",
        freeShipping,
      };
    }),

  // Admin
  listZones: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(shippingZones);
  }),

  updateZone: adminQuery
    .input(z.object({
      id: z.number(),
      homePrice: z.string().optional(),
      deskPrice: z.string().optional(),
      isEnabled: z.boolean().optional(),
      freeShippingMin: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(shippingZones).set(data).where(eq(shippingZones.id, id));
      return { success: true };
    }),

  listProviders: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(shippingProviders);
  }),

  upsertProvider: adminQuery
    .input(z.object({
      id: z.number().optional(),
      name: z.string(),
      apiKey: z.string().optional(),
      apiEndpoint: z.string().optional(),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.id) {
        const { id, ...data } = input;
        await db.update(shippingProviders).set(data).where(eq(shippingProviders.id, id));
      } else {
        await db.insert(shippingProviders).values(input);
      }
      return { success: true };
    }),

  deleteProvider: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(shippingProviders).where(eq(shippingProviders.id, input.id));
      return { success: true };
    }),
});

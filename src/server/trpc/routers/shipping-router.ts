import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { shippingZones, shippingProviders, wilayas, communes } from "@/server/db/schema";

export const shippingRouter = router({
  // ─── Public ────────────────────────────────────────────
  listWilayas: publicProcedure.query(async () => {
    return db.query.wilayas.findMany({
      where: eq(wilayas.isActive, true),
      orderBy: wilayas.code,
    });
  }),

  listCommunes: publicProcedure
    .input(z.object({ wilayaId: z.number() }))
    .query(async ({ input }) => {
      return db.query.communes.findMany({
        where: and(eq(communes.wilayaId, input.wilayaId), eq(communes.isActive, true)),
        orderBy: communes.nameAr,
      });
    }),

  getZone: publicProcedure
    .input(z.object({ wilayaId: z.number() }))
    .query(async ({ input }) => {
      const result = await db.query.shippingZones.findFirst({
        where: eq(shippingZones.wilayaId, input.wilayaId),
      });
      return result ?? null;
    }),

  calculate: publicProcedure
    .input(
      z.object({
        wilayaId: z.number(),
        quantity: z.number().default(1),
        subtotal: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const zone = await db.query.shippingZones.findFirst({
        where: eq(shippingZones.wilayaId, input.wilayaId),
      });

      if (!zone) {
        return { homePrice: "600", deskPrice: "400", freeShipping: false };
      }

      const subtotalNum = parseFloat(input.subtotal ?? "0");
      const freeMin = zone.freeShippingMin ? parseFloat(zone.freeShippingMin.toString()) : 0;
      const freeShipping = freeMin > 0 && subtotalNum >= freeMin;

      return {
        homePrice: zone.homePrice?.toString() ?? "600",
        deskPrice: zone.deskPrice?.toString() ?? "400",
        freeShipping,
      };
    }),

  // ─── Admin ─────────────────────────────────────────────
  listZones: adminProcedure.query(async () => {
    return db.query.shippingZones.findMany({
      with: { wilaya: true },
    });
  }),

  updateZone: adminProcedure
    .input(
      z.object({
        id: z.number(),
        homePrice: z.string().optional(),
        deskPrice: z.string().optional(),
        isEnabled: z.boolean().optional(),
        freeShippingMin: z.string().nullable().optional(),
        estimatedDays: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(shippingZones).set(data).where(eq(shippingZones.id, id));
      return { success: true };
    }),

  listProviders: adminProcedure.query(async () => {
    return db.select().from(shippingProviders);
  }),

  upsertProvider: adminProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        apiKey: z.string().optional(),
        apiEndpoint: z.string().optional(),
        isActive: z.boolean().default(true),
        config: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.id) {
        const { id, ...data } = input;
        await db.update(shippingProviders).set(data).where(eq(shippingProviders.id, id));
      } else {
        await db.insert(shippingProviders).values(input);
      }
      return { success: true };
    }),

  deleteProvider: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(shippingProviders).where(eq(shippingProviders.id, input.id));
      return { success: true };
    }),
});

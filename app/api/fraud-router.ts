import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { fraudBlacklist } from "@db/schema";

export const fraudRouter = createRouter({
  list: adminQuery
    .input(z.object({
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(fraudBlacklist)
        .orderBy(desc(fraudBlacklist.blockedAt))
        .limit(input?.limit ?? 50)
        .offset(input?.offset ?? 0);
    }),

  add: adminQuery
    .input(z.object({
      phone: z.string().optional(),
      ipAddress: z.string().optional(),
      reason: z.string(),
      blockedUntil: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.insert(fraudBlacklist).values({
        phone: input.phone ?? null,
        ipAddress: input.ipAddress ?? null,
        reason: input.reason,
        isAuto: false,
        blockedUntil: input.blockedUntil ? new Date(input.blockedUntil) : null,
      });
      return { success: true };
    }),

  remove: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(fraudBlacklist).where(eq(fraudBlacklist.id, input.id));
      return { success: true };
    }),
});

import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { router, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { fraudBlacklist } from "@/server/db/schema";

export const fraudRouter = router({
  list: adminProcedure
    .input(z.object({
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      return db.query.fraudBlacklist.findMany({
        orderBy: [desc(fraudBlacklist.blockedAt)],
        limit: input?.limit ?? 50,
        offset: input?.offset ?? 0,
      });
    }),

  add: adminProcedure
    .input(z.object({
      phone: z.string().optional(),
      ipAddress: z.string().optional(),
      reason: z.string(),
      blockedUntil: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await db.insert(fraudBlacklist).values({
        phone: input.phone ?? null,
        ipAddress: input.ipAddress ?? null,
        reason: input.reason,
        isAuto: false,
        blockedUntil: input.blockedUntil ? new Date(input.blockedUntil) : null,
      });
      return { success: true };
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(fraudBlacklist).where(eq(fraudBlacklist.id, input.id));
      return { success: true };
    }),

  stats: adminProcedure.query(async () => {
    const [totalBlocked, autoBlocked, manualBlocked, activeBlocks] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(fraudBlacklist),
      db.select({ count: sql<number>`count(*)` }).from(fraudBlacklist).where(eq(fraudBlacklist.isAuto, true)),
      db.select({ count: sql<number>`count(*)` }).from(fraudBlacklist).where(eq(fraudBlacklist.isAuto, false)),
      db.select({ count: sql<number>`count(*)` }).from(fraudBlacklist).where(
        sql`${fraudBlacklist.blockedUntil} IS NULL OR ${fraudBlacklist.blockedUntil} > NOW()`
      ),
    ]);

    return {
      totalBlocked: totalBlocked[0]?.count ?? 0,
      autoBlocked: autoBlocked[0]?.count ?? 0,
      manualBlocked: manualBlocked[0]?.count ?? 0,
      activeBlocks: activeBlocks[0]?.count ?? 0,
    };
  }),
});

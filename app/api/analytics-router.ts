import { z } from "zod";
import { sql, gte, and } from "drizzle-orm";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, products } from "@db/schema";

export const analyticsRouter = createRouter({
  dashboard: adminQuery
    .input(z.object({
      days: z.number().default(30),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const days = input?.days ?? 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [
        totalOrders,
        totalRevenue,
        recentOrders,
        statusBreakdown,
        topWilayas,
        recentProducts,
      ] = await Promise.all([
        // Total orders
        db.select({ count: sql<number>`count(*)` })
          .from(orders)
          .where(gte(orders.createdAt, startDate)),

        // Total revenue
        db.select({ total: sql<string>`COALESCE(SUM(${orders.total}), 0)` })
          .from(orders)
          .where(gte(orders.createdAt, startDate)),

        // Recent orders
        db.select().from(orders)
          .orderBy(sql`${orders.createdAt} DESC`)
          .limit(10),

        // Status breakdown
        db.select({
          status: orders.status,
          count: sql<number>`count(*)`,
        })
          .from(orders)
          .where(gte(orders.createdAt, startDate))
          .groupBy(orders.status),

        // Top wilayas
        db.select({
          wilayaName: orders.wilayaName,
          count: sql<number>`count(*)`,
        })
          .from(orders)
          .where(gte(orders.createdAt, startDate))
          .groupBy(orders.wilayaName)
          .orderBy(sql`count(*) DESC`)
          .limit(10),

        // Recent products
        db.select().from(products)
          .orderBy(sql`${products.createdAt} DESC`)
          .limit(10),
      ]);

      return {
        totalOrders: totalOrders[0]?.count ?? 0,
        totalRevenue: totalRevenue[0]?.total ?? "0",
        recentOrders,
        statusBreakdown,
        topWilayas,
        recentProducts,
      };
    }),

  revenueByDay: adminQuery
    .input(z.object({ days: z.number().default(7) }))
    .query(async ({ input }) => {
      const db = getDb();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const results = await db.select({
        date: sql<string>`DATE(${orders.createdAt})`,
        revenue: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
        orders: sql<number>`count(*)`,
      })
        .from(orders)
        .where(gte(orders.createdAt, startDate))
        .groupBy(sql`DATE(${orders.createdAt})`)
        .orderBy(sql`DATE(${orders.createdAt})`);

      return results;
    }),
});

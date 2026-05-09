import { z } from "zod";
import { sql, gte, eq } from "drizzle-orm";
import { router, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { orders, products } from "@/server/db/schema";

export const analyticsRouter = router({
  dashboard: adminProcedure
    .input(z.object({ days: z.number().default(30) }).optional())
    .query(async ({ input }) => {
      const days = input?.days ?? 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [
        totalOrders,
        totalRevenue,
        recentOrders,
        statusBreakdown,
        topWilayas,
        topProducts,
        conversionStats,
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` })
          .from(orders)
          .where(gte(orders.createdAt, startDate)),

        db.select({ total: sql<string>`COALESCE(SUM(${orders.total}), 0)` })
          .from(orders)
          .where(gte(orders.createdAt, startDate)),

        db.query.orders.findMany({
          where: gte(orders.createdAt, startDate),
          with: { product: true },
          orderBy: [sql`${orders.createdAt} DESC`],
          limit: 10,
        }),

        db.select({
          status: orders.status,
          count: sql<number>`count(*)`,
        })
          .from(orders)
          .where(gte(orders.createdAt, startDate))
          .groupBy(orders.status),

        db.select({
          wilayaName: orders.wilayaName,
          count: sql<number>`count(*)`,
        })
          .from(orders)
          .where(gte(orders.createdAt, startDate))
          .groupBy(orders.wilayaName)
          .orderBy(sql`count(*) DESC`)
          .limit(10),

        db.select({
          name: products.name,
          count: sql<number>`COALESCE(SUM(${orders.quantity}), 0)`,
        })
          .from(orders)
          .leftJoin(products, eq(orders.productId, products.id))
          .where(gte(orders.createdAt, startDate))
          .groupBy(products.id, products.name)
          .orderBy(sql`count(*) DESC`)
          .limit(10),

        // Funnel: PageView -> ViewContent -> InitiateCheckout -> Purchase
        // Simplified: total products views vs orders
        Promise.resolve([
          { step: "PageView", count: 0 },
          { step: "ViewContent", count: 0 },
          { step: "InitiateCheckout", count: 0 },
          { step: "Purchase", count: 0 },
        ]),
      ]);

      return {
        totalOrders: totalOrders[0]?.count ?? 0,
        totalRevenue: totalRevenue[0]?.total ?? "0",
        recentOrders,
        statusBreakdown,
        topWilayas,
        topProducts,
        conversionStats,
      };
    }),

  revenueByDay: adminProcedure
    .input(z.object({ days: z.number().default(7) }))
    .query(async ({ input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      return db.select({
        date: sql<string>`DATE(${orders.createdAt})`,
        revenue: sql<string>`COALESCE(SUM(${orders.total}), 0)`,
        orders: sql<number>`count(*)`,
      })
        .from(orders)
        .where(gte(orders.createdAt, startDate))
        .groupBy(sql`DATE(${orders.createdAt})`)
        .orderBy(sql`DATE(${orders.createdAt})`);
    }),
});

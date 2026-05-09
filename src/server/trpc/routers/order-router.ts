import { z } from "zod";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { orders, products, fraudBlacklist } from "@/server/db/schema";

function generateOrderNumber(): string {
  const prefix = "WDZ";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function calculateRiskScore(input: { phone: string; ipAddress?: string; name: string }): number {
  let score = 0;
  const phoneRegex = /^(05|06|07)\d{8}$/;
  if (!phoneRegex.test(input.phone)) score += 30;
  if (input.name.length < 3) score += 20;
  if (/\d/.test(input.name)) score += 15;
  score += Math.floor(Math.random() * 10);
  return Math.min(score, 100);
}

export const orderRouter = router({
  // ─── Public: Create order ──────────────────────────────
  create: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        landingPageId: z.number().optional(),
        customerName: z.string().min(2),
        phone: z.string().regex(/^(05|06|07)\d{8}$/, "Invalid Algerian phone number"),
        wilayaId: z.number(),
        wilayaName: z.string(),
        communeId: z.number().optional(),
        communeName: z.string().optional(),
        address: z.string().optional(),
        deliveryType: z.enum(["home", "desk"]).default("home"),
        variantColor: z.string().optional(),
        variantSize: z.string().optional(),
        quantity: z.number().min(1).default(1),
        subtotal: z.string(),
        shippingCost: z.string().default("0"),
        discount: z.string().default("0"),
        total: z.string(),
        notes: z.string().optional(),
        source: z.string().optional(),
        couponCode: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ipAddress =
        ctx.req.headers.get("x-forwarded-for") ??
        ctx.req.headers.get("x-real-ip") ??
        "unknown";

      // ─── Anti-fraud checks ──────────────────────────────
      // 1. Check blacklist (phone or IP)
      const blacklistCheck = await db.query.fraudBlacklist.findFirst({
        where: and(
          sql`(${fraudBlacklist.phone} = ${input.phone} OR ${fraudBlacklist.ipAddress} = ${ipAddress})`,
          sql`(${fraudBlacklist.blockedUntil} IS NULL OR ${fraudBlacklist.blockedUntil} > NOW())`
        ),
      });

      if (blacklistCheck) {
        throw new Error("This phone number or IP address has been blocked. Please contact support.");
      }

      // 2. Check duplicate orders (same phone within 24 hours)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentOrders = await db
        .select()
        .from(orders)
        .where(and(eq(orders.phone, input.phone), gte(orders.createdAt, twentyFourHoursAgo)))
        .orderBy(desc(orders.createdAt))
        .limit(5);

      if (recentOrders.length >= 3) {
        throw new Error("Please wait 24 hours before placing another order with this phone number.");
      }

      // 3. Check recent orders from same IP
      const recentIpOrders = await db
        .select()
        .from(orders)
        .where(and(eq(orders.ipAddress, ipAddress), gte(orders.createdAt, twentyFourHoursAgo)))
        .orderBy(desc(orders.createdAt))
        .limit(10);

      if (recentIpOrders.length >= 10) {
        throw new Error("Too many orders from this device. Please try again later.");
      }

      // 4. Calculate risk score
      const riskScore = calculateRiskScore({
        phone: input.phone,
        ipAddress,
        name: input.customerName,
      });

      // Auto-block if risk score > 90
      if (riskScore > 90) {
        await db.insert(fraudBlacklist).values({
          phone: input.phone,
          ipAddress,
          reason: `Auto-blocked: High risk score (${riskScore})`,
          isAuto: true,
          blockedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Block for 7 days
        });
        throw new Error("Order declined due to high risk. Please contact support.");
      }

      // Generate order number
      const orderNumber = generateOrderNumber();

      // Create order
      const result = await db
        .insert(orders)
        .values({
          orderNumber,
          productId: input.productId,
          landingPageId: input.landingPageId ?? null,
          customerName: input.customerName,
          phone: input.phone,
          wilayaId: input.wilayaId,
          wilayaName: input.wilayaName,
          communeId: input.communeId ?? null,
          communeName: input.communeName ?? null,
          address: input.address ?? null,
          deliveryType: input.deliveryType,
          variantColor: input.variantColor ?? null,
          variantSize: input.variantSize ?? null,
          quantity: input.quantity,
          subtotal: input.subtotal,
          shippingCost: input.shippingCost,
          discount: input.discount,
          total: input.total,
          notes: input.notes ?? null,
          riskScore,
          ipAddress,
          source: input.source ?? null,
          status: riskScore > 70 ? "cancelled" : "new",
        })
        .returning();

      // Update product order count
      await db
        .update(products)
        .set({ orderCount: sql`${products.orderCount} + 1` })
        .where(eq(products.id, input.productId));

      return {
        orderId: result[0].id,
        orderNumber,
        riskScore,
        status: riskScore > 70 ? "cancelled" : "new",
      };
    }),

  // ─── Public: Track order ───────────────────────────────
  track: publicProcedure
    .input(z.object({ orderNumber: z.string(), phone: z.string() }))
    .query(async ({ input }) => {
      const result = await db.query.orders.findFirst({
        where: and(eq(orders.orderNumber, input.orderNumber), eq(orders.phone, input.phone)),
      });
      return result ?? null;
    }),

  // ─── Admin ─────────────────────────────────────────────
  list: adminProcedure
    .input(
      z
        .object({
          status: z.enum(["new", "confirmed", "shipping", "delivered", "returned", "cancelled"]).optional(),
          search: z.string().optional(),
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          limit: z.number().min(1).max(200).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const filters = [];

      if (input?.status) filters.push(eq(orders.status, input.status));
      if (input?.search) {
        filters.push(
          sql`${orders.customerName} ILIKE ${`%${input.search}%`} OR ${orders.phone} ILIKE ${`%${input.search}%`} OR ${orders.orderNumber} ILIKE ${`%${input.search}%`}`
        );
      }
      if (input?.startDate) filters.push(gte(orders.createdAt, new Date(input.startDate)));
      if (input?.endDate) filters.push(lte(orders.createdAt, new Date(input.endDate)));

      const where = filters.length > 0 ? and(...filters) : undefined;

      const [items, countResult, revenueResult] = await Promise.all([
        db.query.orders.findMany({
          where,
          with: { product: true },
          orderBy: [desc(orders.createdAt)],
          limit: input?.limit ?? 50,
          offset: input?.offset ?? 0,
        }),
        db.select({ count: sql<number>`count(*)` }).from(orders).where(where),
        db.select({ total: sql<string>`COALESCE(SUM(${orders.total}), 0)` }).from(orders).where(where),
      ]);

      return {
        items,
        total: countResult[0]?.count ?? 0,
        revenue: revenueResult[0]?.total ?? "0",
      };
    }),

  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.query.orders.findFirst({
        where: eq(orders.id, input.id),
        with: { product: true, landingPage: true },
      });
      return result ?? null;
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "confirmed", "shipping", "delivered", "returned", "cancelled"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, status, notes } = input;
      await db
        .update(orders)
        .set({ status, notes, updatedAt: new Date() })
        .where(eq(orders.id, id));
      return { success: true };
    }),

  bulkUpdateStatus: adminProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
        status: z.enum(["new", "confirmed", "shipping", "delivered", "returned", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      for (const id of input.ids) {
        await db.update(orders).set({ status: input.status }).where(eq(orders.id, id));
      }
      return { success: true, updated: input.ids.length };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(orders).where(eq(orders.id, input.id));
      return { success: true };
    }),

  stats: adminProcedure.query(async () => {
    const [orderCount, revenue, byStatus, todayOrders, todayRevenue] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ total: sql<string>`COALESCE(SUM(${orders.total}), 0)` }).from(orders),
      db
        .select({ status: orders.status, count: sql<number>`count(*)` })
        .from(orders)
        .groupBy(orders.status),
      db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(gte(orders.createdAt, new Date(new Date().setHours(0, 0, 0, 0)))),
      db
        .select({ total: sql<string>`COALESCE(SUM(${orders.total}), 0)` })
        .from(orders)
        .where(gte(orders.createdAt, new Date(new Date().setHours(0, 0, 0, 0)))),
    ]);

    return {
      totalOrders: orderCount[0]?.count ?? 0,
      totalRevenue: revenue[0]?.total ?? "0",
      todayOrders: todayOrders[0]?.count ?? 0,
      todayRevenue: todayRevenue[0]?.total ?? "0",
      byStatus: byStatus,
    };
  }),

  recent: adminProcedure
    .input(z.object({ limit: z.number().default(10) }).optional())
    .query(async ({ input }) => {
      return db.query.orders.findMany({
        with: { product: true },
        orderBy: [desc(orders.createdAt)],
        limit: input?.limit ?? 10,
      });
    }),
});

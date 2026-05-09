import { z } from "zod";
import { eq, desc, sql, and, gte, lte, like } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, products, fraudBlacklist } from "@db/schema";

function generateOrderNumber(): string {
  const prefix = "WDZ";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function calculateRiskScore(input: {
  phone: string;
  ipAddress?: string;
  name: string;
}): number {
  let score = 0;
  
  // Phone validation
  const phoneRegex = /^(05|06|07)\d{8}$/;
  if (!phoneRegex.test(input.phone)) score += 30;
  
  // Name too short
  if (input.name.length < 3) score += 20;
  
  // Name has numbers
  if (/\d/.test(input.name)) score += 15;
  
  // Random component
  score += Math.floor(Math.random() * 10);
  
  return Math.min(score, 100);
}

export const orderRouter = createRouter({
  // Public - create order
  create: publicQuery
    .input(z.object({
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
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      
      // Anti-fraud checks
      const ipAddress = ctx.req.headers.get("x-forwarded-for") ?? 
        ctx.req.headers.get("x-real-ip") ?? "unknown";
      
      // Check blacklist
      const [blacklisted] = await db.select().from(fraudBlacklist)
        .where(
          input.phone 
            ? eq(fraudBlacklist.phone, input.phone)
            : eq(fraudBlacklist.ipAddress, ipAddress)
        )
        .limit(1);
      
      if (blacklisted) {
        throw new Error("This phone number has been blocked");
      }
      
      // Check recent duplicate orders
      const recentOrders = await db.select().from(orders)
        .where(eq(orders.phone, input.phone))
        .orderBy(desc(orders.createdAt))
        .limit(5);
      
      if (recentOrders.length >= 3) {
        const lastOrder = recentOrders[0];
        if (lastOrder) {
          const hoursSince = (Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60);
          if (hoursSince < 24) {
            throw new Error("Please wait 24 hours before placing another order with this phone number");
          }
        }
      }
      
      // Calculate risk score
      const riskScore = calculateRiskScore({
        phone: input.phone,
        ipAddress,
        name: input.customerName,
      });
      
      const orderNumber = generateOrderNumber();
      
      const result = await db.insert(orders).values({
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
        status: riskScore > 90 ? "cancelled" : "new",
      });
      
      return { 
        orderId: Number(result[0].insertId), 
        orderNumber,
        riskScore,
        status: riskScore > 90 ? "cancelled" : "new",
      };
    }),

  // Admin queries
  list: adminQuery
    .input(z.object({
      status: z.enum(["new", "confirmed", "shipping", "delivered", "returned", "cancelled"]).optional(),
      search: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];
      
      if (input?.status) {
        filters.push(eq(orders.status, input.status));
      }
      if (input?.search) {
        filters.push(
          sql`${orders.customerName} LIKE ${`%${input.search}%`} OR ${orders.phone} LIKE ${`%${input.search}%`} OR ${orders.orderNumber} LIKE ${`%${input.search}%`}`
        );
      }
      if (input?.startDate) {
        filters.push(gte(orders.createdAt, new Date(input.startDate)));
      }
      if (input?.endDate) {
        filters.push(lte(orders.createdAt, new Date(input.endDate)));
      }

      const where = filters.length > 0 ? and(...filters) : undefined;

      const [items, countResult, revenueResult] = await Promise.all([
        db.select().from(orders).where(where)
          .orderBy(desc(orders.createdAt))
          .limit(input?.limit ?? 50)
          .offset(input?.offset ?? 0),
        db.select({ count: sql<number>`count(*)` }).from(orders).where(where),
        db.select({ total: sql<string>`COALESCE(SUM(${orders.total}), 0)` }).from(orders).where(where),
      ]);

      return {
        items,
        total: countResult[0]?.count ?? 0,
        revenue: revenueResult[0]?.total ?? "0",
      };
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  updateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["new", "confirmed", "shipping", "delivered", "returned", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(orders).where(eq(orders.id, input.id));
      return { success: true };
    }),

  // Stats
  stats: adminQuery.query(async () => {
    const db = getDb();
    const [orderCount, revenue, byStatus] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ total: sql<string>`COALESCE(SUM(${orders.total}), 0)` }).from(orders),
      db.select({
        status: orders.status,
        count: sql<number>`count(*)`,
      }).from(orders).groupBy(orders.status),
    ]);

    return {
      totalOrders: orderCount[0]?.count ?? 0,
      totalRevenue: revenue[0]?.total ?? "0",
      byStatus,
    };
  }),

  recent: adminQuery
    .input(z.object({ limit: z.number().default(10) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(input?.limit ?? 10);
    }),
});

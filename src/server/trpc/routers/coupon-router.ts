import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { coupons } from "@/server/db/schema";

export const couponRouter = router({
  list: adminProcedure.query(async () => {
    return db.query.coupons.findMany({
      orderBy: [desc(coupons.createdAt)],
    });
  }),

  validate: publicProcedure
    .input(z.object({
      code: z.string(),
      subtotal: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const coupon = await db.query.coupons.findFirst({
        where: eq(coupons.code, input.code),
      });

      if (!coupon || !coupon.isActive) return { valid: false, message: "Invalid coupon code" };
      if (coupon.endDate && new Date(coupon.endDate) < new Date()) return { valid: false, message: "Coupon expired" };
      if (coupon.startDate && new Date(coupon.startDate) > new Date()) return { valid: false, message: "Coupon not yet active" };
      if (coupon.maxUses && coupon.usesCount && coupon.usesCount >= coupon.maxUses) return { valid: false, message: "Coupon usage limit reached" };

      const subtotal = parseFloat(input.subtotal ?? "0");
      if (coupon.minOrderAmount && subtotal < parseFloat(coupon.minOrderAmount)) {
        return { valid: false, message: `Minimum order amount: ${coupon.minOrderAmount}` };
      }

      return {
        valid: true,
        type: coupon.type,
        value: coupon.value,
        code: coupon.code,
      };
    }),

  create: adminProcedure
    .input(z.object({
      code: z.string().min(1),
      type: z.enum(["percentage", "fixed_amount", "free_shipping"]),
      value: z.string(),
      minOrderAmount: z.string().optional(),
      maxUses: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await db.insert(coupons).values({
        ...input,
        isActive: true,
      }).returning();
      return result[0];
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      code: z.string().optional(),
      type: z.enum(["percentage", "fixed_amount", "free_shipping"]).optional(),
      value: z.string().optional(),
      minOrderAmount: z.string().optional(),
      maxUses: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(coupons).set(data).where(eq(coupons.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(coupons).where(eq(coupons.id, input.id));
      return { success: true };
    }),
});

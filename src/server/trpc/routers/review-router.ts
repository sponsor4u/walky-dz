import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { reviews } from "@/server/db/schema";

export const reviewRouter = router({
  listByProduct: publicProcedure
    .input(z.object({ productId: z.number() }))
    .query(async ({ input }) => {
      return db.query.reviews.findMany({
        where: eq(reviews.productId, input.productId),
        orderBy: [desc(reviews.createdAt)],
      });
    }),

  create: publicProcedure
    .input(z.object({
      productId: z.number(),
      customerName: z.string().min(1),
      rating: z.number().min(1).max(5),
      comment: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await db.insert(reviews).values({
        ...input,
        isVerified: false,
      }).returning();
      return result[0];
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(reviews).where(eq(reviews.id, input.id));
      return { success: true };
    }),
});

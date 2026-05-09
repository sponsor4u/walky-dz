import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { categories } from "@/server/db/schema";

export const categoryRouter = router({
  list: publicProcedure.query(async () => {
    return db.query.categories.findMany({
      where: eq(categories.isActive, true),
      orderBy: [categories.sortOrder, categories.nameAr],
    });
  }),

  listAll: adminProcedure.query(async () => {
    return db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
    });
  }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const result = await db.insert(categories).values({
        ...input,
        isActive: true,
      }).returning();
      return result[0];
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
      return result[0];
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});

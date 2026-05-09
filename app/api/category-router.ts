import { z } from "zod";
import { eq, desc, sql, like } from "drizzle-orm";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories, products } from "@db/schema";

export const categoryRouter = createRouter({
  list: publicQuery
    .input(z.object({
      active: z.boolean().optional(),
      search: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      
      if (input?.active) {
        conditions.push(eq(categories.isActive, true));
      }
      if (input?.search) {
        conditions.push(like(categories.name, `%${input.search}%`));
      }

      const where = conditions.length > 0 ? conditions[0] : undefined;
      
      return db.select().from(categories)
        .where(where)
        .orderBy(desc(categories.createdAt));
    }),

  create: adminQuery
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(categories).values({
        ...input,
        isActive: true,
      });
      return result;
    }),

  update: adminQuery
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
      const db = getDb();
      await db.update(categories).set(data).where(eq(categories.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      // Check if category has products
      const productCount = await db.select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.categoryId, input.id));
      
      if (productCount[0]?.count > 0) {
        throw new Error("Cannot delete category with products");
      }
      
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});

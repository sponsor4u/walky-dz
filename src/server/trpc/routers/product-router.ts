import { z } from "zod";
import { eq, desc, sql, and, like } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { products, categories, reviews } from "@/server/db/schema";

export const productRouter = router({
  // ─── Public ────────────────────────────────────────────
  list: publicProcedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
        active: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const filters = [];

      if (input?.active !== false) filters.push(eq(products.isActive, true));
      if (input?.categoryId) filters.push(eq(products.categoryId, input.categoryId));
      if (input?.featured) filters.push(eq(products.featured, true));
      if (input?.search) filters.push(like(products.name, `%${input.search}%`));

      const where = filters.length > 0 ? and(...filters) : undefined;

      const [items, countResult] = await Promise.all([
        db.query.products.findMany({
          where,
          with: { category: true },
          orderBy: [desc(products.createdAt)],
          limit: input?.limit ?? 50,
          offset: input?.offset ?? 0,
        }),
        db.select({ count: sql<number>`count(*)` }).from(products).where(where),
      ]);

      return { items, total: countResult[0]?.count ?? 0 };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const result = await db.query.products.findFirst({
        where: eq(products.slug, input.slug),
        with: { category: true },
      });
      return result ?? null;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const result = await db.query.products.findFirst({
        where: eq(products.id, input.id),
        with: { category: true },
      });
      return result ?? null;
    }),

  incrementViews: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.update(products)
        .set({ viewCount: sql`${products.viewCount} + 1` })
        .where(eq(products.id, input.id));
      return { success: true };
    }),

  // ─── Admin ─────────────────────────────────────────────
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        price: z.string().min(1),
        comparePrice: z.string().optional(),
        costPrice: z.string().optional(),
        sku: z.string().optional(),
        stockQuantity: z.number().default(0),
        stockStatus: z.enum(["in_stock", "out_of_stock", "low_stock"]).default("in_stock"),
        categoryId: z.number().optional(),
        images: z.array(z.string()).optional(),
        displayMode: z.enum(["product_page", "landing_page"]).default("product_page"),
        checkoutPosition: z.enum(["top", "middle", "bottom", "sticky", "floating"]).default("bottom"),
        hasVariants: z.boolean().default(false),
        variantOptions: z.object({
          colors: z.array(z.string()).optional(),
          sizes: z.array(z.string()).optional(),
        }).optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(products).values({
        ...input,
        images: input.images ?? [],
        variantOptions: input.variantOptions ?? {},
        isActive: true,
      }).returning();
      return result[0];
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        shortDescription: z.string().optional(),
        price: z.string().optional(),
        comparePrice: z.string().optional(),
        costPrice: z.string().optional(),
        sku: z.string().optional(),
        stockQuantity: z.number().optional(),
        stockStatus: z.enum(["in_stock", "out_of_stock", "low_stock"]).optional(),
        categoryId: z.number().optional(),
        images: z.array(z.string()).optional(),
        displayMode: z.enum(["product_page", "landing_page"]).optional(),
        checkoutPosition: z.enum(["top", "middle", "bottom", "sticky", "floating"]).optional(),
        hasVariants: z.boolean().optional(),
        variantOptions: z.object({
          colors: z.array(z.string()).optional(),
          sizes: z.array(z.string()).optional(),
        }).optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        isActive: z.boolean().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const result = await db.update(products).set(data).where(eq(products.id, id)).returning();
      return result[0];
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});

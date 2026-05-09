import { z } from "zod";
import { desc } from "drizzle-orm";
import { router, publicProcedure, adminProcedure } from "../middleware";
import { db } from "@/server/db/connection";
import { mediaFiles } from "@/server/db/schema";

export const mediaRouter = router({
  list: adminProcedure
    .input(z.object({ folder: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return db.query.mediaFiles.findMany({
        orderBy: [desc(mediaFiles.createdAt)],
        limit: 100,
      });
    }),

  create: adminProcedure
    .input(z.object({
      filename: z.string(),
      url: z.string(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
      folder: z.string().default("general"),
    }))
    .mutation(async ({ input }) => {
      const result = await db.insert(mediaFiles).values(input).returning();
      return result[0];
    }),
});

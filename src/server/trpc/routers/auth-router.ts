import { z } from "zod";
import { router, publicProcedure, authedProcedure, adminProcedure } from "../middleware";
import { supabaseAdmin } from "@/server/lib/supabase";

export const authRouter = router({
  me: authedProcedure.query(async ({ ctx }) => {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", ctx.user.id)
      .single();

    return {
      id: ctx.user.id,
      email: ctx.user.email,
      name: ctx.user.name || ctx.user.email?.split("@")[0] || "User",
      avatar: ctx.user.avatar,
      role: profile?.role || "user",
      ...profile,
    };
  }),

  listUsers: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.enum(["user", "admin"]).optional(),
        limit: z.number().default(50),
        offset: z.number().default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      let query = supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(input?.offset ?? 0, (input?.offset ?? 0) + (input?.limit ?? 50) - 1);

      if (input?.role) {
        query = query.eq("role", input.role);
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);

      return { items: data ?? [], total: count ?? 0 };
    }),

  updateRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ role: input.role })
        .eq("id", input.userId);

      if (error) throw new Error(error.message);
      return { success: true };
    }),
});

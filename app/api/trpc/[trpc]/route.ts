import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { appRouter } from "@/server/trpc/router";
import { createSupabaseServerClient } from "@/server/lib/supabase";

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      // Resolve user from Supabase auth session
      let user = null;
      try {
        const supabase = await createSupabaseServerClient();
        const { data: { user: authUser }, error } = await supabase.auth.getUser();

        if (authUser && !error) {
          // Check admin role from profiles
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", authUser.id)
            .single();

          user = {
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
            avatar: authUser.user_metadata?.avatar_url || null,
            role: profile?.role || "user",
          };
        }
      } catch {
        // Auth is optional for public routes
      }

      return { user, req: req as any, res: undefined as any };
    },
    onError: ({ error, path }) => {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`[tRPC Error] ${path}:`, error);
      }
    },
  });
}

export { handler as GET, handler as POST };

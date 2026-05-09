import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getCurrentUser } from "@/server/lib/supabase";

export async function createContext(opts: CreateNextContextOptions) {
  const start = Date.now();

  // Get user from auth session
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    // Auth is optional for public routes
  }

  const duration = Date.now() - start;
  if (duration > 100) {
    console.warn(`[tRPC] Auth context took ${duration}ms`);
  }

  return {
    user,
    req: opts.req,
    res: opts.res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

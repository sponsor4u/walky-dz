"use client";

import { useSupabase } from "@/client/providers/supabase-provider";
import { useMemo } from "react";

export function useAuth() {
  const { user, session, isLoading, signIn, signUp, signOut } = useSupabase();

  const isAdmin = useMemo(() => {
    return user?.app_metadata?.role === "admin" || user?.user_metadata?.role === "admin";
  }, [user]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
}

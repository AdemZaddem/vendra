"use client";

import { createClient } from "@/utils/supabase/client";

export const loginWithPassword = async (email: string, password: string) => {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
};

export const loginWithGoogle = async () => {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

export const loginWithFacebook = async()=>{
    const supabase = createClient()
    return supabase.auth.signInWithOAuth({
        provider:"facebook",
        options:{
            redirectTo:`${window.location.origin}/auth/callback`
        }
    })
}
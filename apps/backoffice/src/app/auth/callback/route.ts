import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  const { data:{user}, error } = await supabase.auth.exchangeCodeForSession(code);
  if(error || !user) {
    console.error("Error exchanging code for session:", error?.message);
    return NextResponse.redirect(`${origin}/login`);
  }

  // Redirect to the home page after successful login
  return NextResponse.redirect(`${origin}/dashboard`);
};

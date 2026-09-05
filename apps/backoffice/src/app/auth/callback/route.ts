import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  const {
    data: { user, session },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !user || !session) {
    console.error("Error exchanging code for session:", error?.message);
    return NextResponse.redirect(`${origin}/login`);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });
  if (!response.ok) {
    console.error("Error fetching user data:", response.statusText);
    return NextResponse.redirect(`${origin}/login`);
  }

  const { memberships } = await response.json();

  if (memberships.length === 0) {
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  if (memberships.length === 1) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.redirect(`${origin}/choose-workspace`);
};

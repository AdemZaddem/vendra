import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { origin } = new URL(request.url);
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { memberships } = await response.json();

  if (memberships.length === 0) return NextResponse.redirect(`${origin}/onboarding`);
  if (memberships.length === 1) return NextResponse.redirect(`${origin}/dashboard/${memberships[0].organization.slug}`);

  return NextResponse.redirect(`${origin}/choose-workspace`);
};

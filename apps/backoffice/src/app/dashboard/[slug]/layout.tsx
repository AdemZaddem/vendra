import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  const { memberships } = await res.json();

  const currentMembership = memberships.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (m:any) => m.organizationSlug === slug
  );

  if (!currentMembership) {
    redirect("/choose-workspace");
  }

  return (
    <div>
      <aside>
        {/* org switcher dropdown goes here, using `memberships` */}
      </aside>
      <main>{children}</main>
    </div>
  );
};
export default DashboardLayout;
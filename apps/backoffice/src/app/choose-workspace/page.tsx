"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import LogoutButton from "@/components/LogoutButton";

interface Membership {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: string;
}

const Page = () => {
  const router = useRouter();
  const [memberships, setMemberships] = useState<Membership[]>([]);

  useEffect(() => {
    const fetchMemberships = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const { memberships } = await res.json();
      setMemberships(memberships);
    };

    fetchMemberships();
  }, [router]);

  return (
    <div>
      <p>Choose a workspace</p>
      <ul>
        {memberships.map((m) => (
          <li key={m.organizationId}>
            <button onClick={() => router.push(`/dashboard/${m.organizationSlug}`)}>
              {m.organizationName} ({m.role})
            </button>
          </li>
        ))}
      </ul>
      <LogoutButton />
    </div>
  );
};
export default Page;

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { StepProps } from "../types";
import { createClient } from "@/utils/supabase/client";

const StepReview = ({ data, onBack }: StepProps) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.message ?? "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    const organization = await res.json();
    router.push(`/dashboard/${organization.slug}`);
  };

  return (
    <div>
      <p>Review your store</p>

      <div>
        <strong>Store name:</strong> {data.name}
      </div>
      <div>
        <strong>URL:</strong> vendra.tn/{data.slug}
      </div>
      <div>
        <strong>Category:</strong> {data.category}
      </div>

      {data.logoUrl && (
        <div>
          <strong>Logo:</strong>
          <Image src={data.logoUrl} alt="Logo" width={80} height={80} />
        </div>
      )}
      {data.tagline && (
        <div>
          <strong>Tagline:</strong> {data.tagline}
        </div>
      )}
      {data.brandColor && (
        <div>
          <strong>Brand color:</strong>{" "}
          <span
            style={{
              display: "inline-block",
              width: 20,
              height: 20,
              backgroundColor: data.brandColor,
              verticalAlign: "middle",
            }}
          />
        </div>
      )}

      <div>
        <strong>Theme:</strong> {data.themeId}
      </div>

      {data.contactPhone && (
        <div>
          <strong>Phone:</strong> {data.contactPhone}
        </div>
      )}
      {data.contactEmail && (
        <div>
          <strong>Email:</strong> {data.contactEmail}
        </div>
      )}

      <div>
        <strong>Delivers to:</strong> {data.governorates?.length ?? 0} governorate(s)
      </div>

      {error && <p>{error}</p>}

      <button onClick={onBack} disabled={submitting}>Back</button>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Creating your store..." : "Create my store"}
      </button>
    </div>
  );
};
export default StepReview;
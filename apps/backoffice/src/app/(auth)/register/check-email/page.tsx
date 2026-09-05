"use client";

import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  return (
    <div>
      <p>
        We sent a confirmation link to <strong>{email}</strong>
      </p>
      <p>Click the link in that email to activate your account.</p>
    </div>
  );
};
export default Page;

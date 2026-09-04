"use client";
import { createClient } from "@/utils/supabase/client";

const Page = () => {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error during Google login:", error.message);
    } else {
      console.log("Google login successful:", data);
    }
  };

  const handleFacebookLogin = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error during Facebook login:", error.message);
    } else {
      console.log("Facebook login successful:", data);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error during logout:", error.message);
    } else {
      console.log("Logout successful");
    }
  };
  return (
    <div>
      <p>This Back Office page</p>
      <button onClick={handleGoogleLogin}>Login with google</button>
      <button onClick={handleFacebookLogin}>Login with facebook</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
export default Page;

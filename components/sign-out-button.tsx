"use client";

import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { setPersistedCookie } from "@/utils/persisted-cookie";
import { clearAccountLocalState } from "@/functions/clear-account-storage";

export function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      // Everything this account left on the browser. Without it this button
      // ended the session but handed the whole cache to the next sign-in.
      clearAccountLocalState();
      setPersistedCookie("token", "", 365);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error.message);
        throw error;
      }

      // Redirect to login page or home page
      window.location.href = "/login"; // Or use Next.js router
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <Button variant="ghost" onClick={() => handleSignOut()}>
      Sign Out
    </Button>
  );
}

"use client";

import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      document.cookie = `token=; path=/`;
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

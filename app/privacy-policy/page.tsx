"use client";
import Navigation from "@/components/navigator/navigation";
import PrivacyPolicy from "@/components/privacy-policy/PrivacyPolicy";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
export default function PrivacyPolicyPage() {
  useEffect(() => {
      trackCustomEvent("ViewPrivacyPolicy");
    }, []);
  return (
    <Navigation>
      <PrivacyPolicy />
    </Navigation>
  );
}

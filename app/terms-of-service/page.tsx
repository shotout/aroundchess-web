"use client";
import Navigation from "@/components/navigator/navigation";
import TermsOfService from "@/components/terms-of-service/TermsOfService";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
export default function TermsOfServicePage() {
  useEffect(() => {
      trackCustomEvent("ViewTermsOfService");
    }, []);
  return (
    <Navigation>
      <TermsOfService />
    </Navigation>
  );
}

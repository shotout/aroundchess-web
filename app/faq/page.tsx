"use client";
import ChessFAQ from "@/components/faq/ChessFaq";
import Navigation from "@/components/navigator/navigation";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
export default function FAQ() {
  useEffect(() => {
      trackCustomEvent("ViewFAQ");
    }, []);
  return (
    <Navigation>
      <ChessFAQ />
    </Navigation>
  );
}

"use client";
import { useContactUs } from "@/app/store/contactUs";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
export default function ContactUsPage() {
  useEffect(() => {
    handleContactUs();
  }, []);
  useEffect(() => {
    trackCustomEvent("ViewContactUs");
  }, []);
  const handleContactUs = () => {
    window.location.href = `${window.location.origin}?contact=true`;
  };
  return null;
}

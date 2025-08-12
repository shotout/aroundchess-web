"use client";
import { useContactUs } from "@/app/store/contactUs";
import { useEffect } from "react";
export default function ContactUsPage() {
  useEffect(() => {
    handleContactUs();
  }, []);
  const handleContactUs = () => {
    window.location.href = `${window.location.origin}?contact=true`;
  };
  return null;
}

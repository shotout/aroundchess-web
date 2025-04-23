"use client";
import ChessFAQ from "@/components/faq/ChessFaq";
import Navigation from "@/components/navigator/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function AboutUs() {
  return (
    <Navigation>
      <ChessFAQ />
    </Navigation>
  );
}

"use client";
import About from "@/components/about-us/About";
import Navigation from "@/components/navigator/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
export default function AboutUs() {
  return (
    <Navigation>
      <About />
    </Navigation>
  );
}

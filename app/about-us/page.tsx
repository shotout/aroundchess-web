"use client";
import Navigation from "@/components/navigator/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import About from "./About";
export default function AboutUs() {
  return (
    <Navigation>
      <About />
    </Navigation>
  );
}

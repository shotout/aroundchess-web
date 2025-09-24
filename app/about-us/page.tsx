"use client";

import About from "@/components/about-us/About";
import Navigation from "@/components/navigator/navigation";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
export default function AboutUs() {
  useEffect(() => {
    trackCustomEvent("ViewAboutUs");
  }, []);
  return (
    <Navigation>
      <About />
    </Navigation>
  );
}

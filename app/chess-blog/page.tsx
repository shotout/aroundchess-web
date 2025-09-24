"use client";
import Article from "@/components/chess-news/Article";
import Navigation from "@/components/navigator/navigation";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";
export default function ChessNews() {
  useEffect(() => {
    trackCustomEvent("ViewChessBlog");
  }, []);
  return (
    <Navigation>
      <Article />
    </Navigation>
  );
}

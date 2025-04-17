import React from "react";
import { Grid, Zap, ChevronLeft } from "lucide-react";

export { Grid, Zap, ChevronLeft };

interface IconProps {
  className?: string;
  size?: number;
}

export function CustomGridIcon({ className = "", size = 24 }: IconProps) {
  return <Grid className={className} size={size} />;
}

export function CustomZapIcon({ className = "", size = 24 }: IconProps) {
  return <Zap className={className} size={size} />;
}

export function CustomChevronLeftIcon({
  className = "",
  size = 24,
}: IconProps) {
  return <ChevronLeft className={className} size={size} />;
}

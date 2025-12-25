"use client";

import { useEffect, useState } from "react";

export default function DebugWidthBar() {
  const [windowWidth, setWindowWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        color: "#00ff00",
        padding: "6px 12px",
        fontSize: "11px",
        fontFamily: "monospace",
        zIndex: 999999999,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "12px",
        borderTop: "1px solid rgba(0, 255, 0, 0.3)",
      }}
    >
      <span style={{ fontWeight: "bold" }}>📱 Width: {windowWidth}px</span>
      <span style={{ color: "#666" }}>|</span>
      <span>
        minW: {windowWidth < 768 ? Math.min(300, windowWidth - 32) : 500}px
      </span>
      <span style={{ color: "#666" }}>|</span>
      <span>
        maxW: {windowWidth < 768 ? windowWidth - 32 : 480}px
      </span>
      <span style={{ color: "#666" }}>|</span>
      <span style={{ color: windowWidth < 768 ? "#ff0" : "#0f0" }}>
        {windowWidth < 768 ? "MOBILE" : "DESKTOP"}
      </span>
    </div>
  );
}

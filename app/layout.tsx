import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import React from "react";

export const metadata: Metadata = {
  title: "AroundChess",
  description: "Advanced chess training and analysis powered by AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <script src="/stockfish.js" defer></script>
      </head>
      <body>
        {/* <React.StrictMode> */}
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        {/* </React.StrictMode> */}
      </body>
    </html>
  );
}

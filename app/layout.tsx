import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

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
        <script src="/stockfish.js" defer></script>
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          {children}
          <Analytics />
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}

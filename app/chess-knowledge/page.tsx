"use client";

import Image from "next/image";
import { SiteHeaderNew } from "@/components/site-header-new";
import { SiteFooterNew } from "@/components/site-footer-new";
import ChessKnowledgeOnboarding from "@/components/v2/chess-knowledge-onboarding";

export default function ChessKnowledgePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeaderNew />
      <main className="relative flex flex-col items-center justify-center flex-1 py-6 px-4 sm:px-6 md:px-8">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/auth-background.png"
            fill
            priority
            quality={90}
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition:
                "var(--bg-position-x, center) var(--bg-position-y, top)",
            }}
            alt="Background"
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>

        <div className="w-full md:max-w-2xl z-10 glassmorphismLogin px-4 pt-4 pb-4 sm:p-6 md:p-8 flex flex-col">
          <ChessKnowledgeOnboarding />
        </div>
      </main>
      <SiteFooterNew />
    </div>
  );
}

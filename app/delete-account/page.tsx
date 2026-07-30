"use client";

import { SiteFooterNew } from "@/components/site-footer-new";
import { SiteHeaderNew } from "@/components/site-header-new";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { trackCustomEvent } from "../utils/facebookPixel";

/**
 * Shown after /auth/delete-account succeeds. Desktop puts a white card on the
 * auth artwork; mobile is a plain white screen per the mockup.
 */
export default function DeleteAccountDonePage() {
  const route = useRouter();
  useEffect(() => {
    trackCustomEvent("ViewDeleteAccount");
  }, []);
  const handleLogin = () => {
    route.push("/login");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white sm:bg-transparent">
        <SiteHeaderNew />

        <main
          className="relative flex items-start sm:items-center justify-center p-4 sm:p-6 md:p-8
                     min-h-[calc(100vh-72px)] lg:min-h-[calc(100vh-97px)]
                     overflow-y-auto"
        >
          {/* Artwork is desktop-only — the mobile mockup is a plain white page. */}
          <div className="absolute inset-0 -z-10 hidden sm:block">
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
              alt=""
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/5"></div>
          </div>

          {/* Solid white card on the artwork: glassmorphismLogin's 20%-white fill
              disappeared against the light-blue background, leaving the message
              floating over the chessboard. Mobile is already a white page, so the
              card styling only kicks in from sm up. */}
          <div
            className="w-full md:max-w-2xl z-10
                       sm:bg-white sm:rounded-2xl sm:shadow-xl
                       px-2 pt-10 pb-6 sm:p-6 md:p-8
                       flex flex-col my-0 sm:my-4 max-h-full overflow-y-auto"
          >
            <div className="flex items-center justify-center">
              <div className="flex justify-center mb-4">
                <Image
                  src={"/images/v2/profile/delete-successfull-icon.png"}
                  alt=""
                  width={480}
                  height={480}
                  className="max-w-[128px] sm:max-w-48"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="text-center space-y-3 flex flex-col">
              <h1 className="font-bold text-[19px] sm:text-lg">
                Your account has been deleted.
              </h1>
              <p className="text-[15px] text-black/80 mt-1 leading-[145%]">
                We&apos;re sorry to see you go!
                <br />
                We hope to see you again soon, you can register a new account at
                any time.
              </p>
              <button
                onClick={handleLogin}
                className="btn-primary w-full py-3 sm:py-2 rounded-full text-[16px] font-semibold text-white"
              >
                Back to Login
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer is desktop-only, matching the mobile mockup. */}
      <div className="w-full hidden sm:block">
        <SiteFooterNew />
      </div>
    </>
  );
}

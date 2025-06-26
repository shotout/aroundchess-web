"use client";

import { SiteFooterNew } from "@/components/site-footer-new";
import { SiteHeaderNew } from "@/components/site-header-new";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const route = useRouter();
  const handleLogin = () => {
    route.push("/login");
  };
  return (
    <>
      <div className="h-screen flex flex-col">
        <SiteHeaderNew />

        <main
          className="relative flex items-center justify-center p-4 sm:p-6 md:p-8 
                     h-[calc(100vh-72px)] lg:h-[calc(100vh-97px)]
                     min-h-[500px] overflow-y-auto"
        >
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
              alt="Authentication background"
            />
            <div className="absolute inset-0 bg-black/5"></div>
          </div>

          <div
            className={`
              w-full
              md:max-w-2xl
              z-10 
              glassmorphismLogin
              p-4 sm:p-6 md:p-8
              flex flex-col
              my-4
              max-h-full
              overflow-y-auto
            `}
          >
            <div className="flex items-center justify-center ">
              <div className="flex justify-center mb-4">
                <Image
                  src={"/images/delete-success.png"}
                  alt=""
                  width={1000}
                  height={1000}
                  className="max-w-48"
                />
              </div>
            </div>

            <div className="text-center space-y-3 flex flex-col">
              <h1 className="font-bold text-lg">
                Your account has been deleted.
              </h1>
              <p className="text-black/80 mt-1">
                We're sorry to see you go! We hope to see you again soon, you
                can register a new account at any time.
              </p>
              <button
                onClick={handleLogin}
                className="btn-primary w-full py-2 rounded-full"
              >
                <h1>Back to Homepage</h1>
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="w-full">
        <SiteFooterNew />
      </div>
    </>
  );
}

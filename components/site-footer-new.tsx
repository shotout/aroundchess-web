import CookieConsent from "@/app/cookies-consent/cookies-consent-message";
import { useContactUs } from "@/app/store/contactUs";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooterNew({ className }: SiteFooterProps) {
  const { setOpen, open } = useContactUs();
  const handleContactUs = () => {
    setOpen(true);
  };

  return (
    <footer className={cn("bg-[#E6F7FE] py-4", className)}>
      <CookieConsent />
      <div className="flex flex-col px-4 lg:px-[80px] lg:py-2 lg:pt-8">
        <div className="relative hidden sm:flex flex-row items-center bg-[#D9E8F4] border border-[#25CEDA] min-h-[205px] w-full rounded-[16px] mb-[64px] ">
          <Image
            src="/images/footer/background.png"
            alt="background"
            className="w-full h-full absolute inset-0 rounded-[16px] object-cover z-0"
            quality={100}
            width={1000}
            height={1000}
          />
          <div className="absolute inset-0 w-full flex flex-row items-center justify-center self-center gap-4 z-5 px-[32px]">
            <Image
              src="/images/footer/icon-footer.png"
              alt="background"
              className="w-[70px] h-[78px] sm:w-[128px] sm:h-[142px] lg:w-[186px] lg:h-[206px] object-contain z-49"
              quality={100}
              width={1000}
              height={1000}
            />
            <div className="flex flex-col gap-4">
              <span className="font-semibold text-[9px] sm:text-[16px] lg:text-[23px]">
                We work hard to improve AroundChess every day.
              </span>
              <span className="font-normal text-[5.3px] sm:text-[10px] lg:text-[14px]">
                If you have feedback, comments or might even have found a bug,
                send us a message or contact us on Discord.
              </span>
              <div className="flex flex-row items-center justify-center gap-4">
                <button className="btn-secondary rounded-full h-[48px] sm:min-w-[240px] lg:min-w-[300px] flex flex-row items-center justify-center gap-2">
                  <FaDiscord
                    className="w-[10px] h-[7.5px] sm:w-[18px] sm:h-[13.65px] lg:w-[26px] lg:h-[20px]"
                    color={"#000"}
                  />
                  <span className="text-[8px] sm:text-[11px] lg:text-[16px]">
                    Contact us on Discord
                  </span>
                </button>
                <button
                  onClick={handleContactUs}
                  className="btn-primary rounded-full h-[48px] sm:min-w-[240px] lg:min-w-[300px] flex flex-row items-center justify-center gap-2"
                >
                  <Send
                    className="w-[10px] h-[7.5px] sm:w-[18px] sm:h-[13.65px] lg:w-[26px] lg:h-[20px]"
                    color={"#fff"}
                    fill="#fff"
                  />
                  <span className="text-[8px] sm:text-[11px] lg:text-[16px]">
                    Send us a message
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-9 lg:grid-cols-2 sm:mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-2 sm:mb-8">
              <Image
                src="/icons/logo.png"
                alt="logo"
                className="w-[199px] h-[64px]"
                quality={100}
                width={600}
                height={600}
              />
            </Link>
            <p className="mt-1 font-normal text-lg sm:mt-2:text-lg text-[#364152]">
              Advanced chess training and analysis powered by AI
            </p>
          </div>
          <div className="md:grid md:gap-9 md:grid-cols-3">
            <div>
              <h3 className="mb-8 text-lg font-semibold">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    Learning
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    Practice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    Game Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playground"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    Playground
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-8 mt-8 md:mt-0 text-lg font-semibold">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-8 mt-8 md:mt-0 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-gray-900 dark:hover:text-white text-[#364152]"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-[#364152]">
              © 2025 aroundchess. All rights reserved.
            </p>
            <div className="flex space-x-2">
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">TikTok</span>
                <Image
                  src="/icons/tiktok.png"
                  alt="tiktok"
                  className="w-7 h-7"
                  width={600}
                  height={600}
                />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Facebook</span>
                <Image
                  src="/icons/facebook.png"
                  alt="facebook"
                  className="w-7 h-7"
                  width={600}
                  height={600}
                />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">YouTube</span>
                <Image
                  src="/icons/youtube.png"
                  alt="youtube"
                  className="w-7 h-7"
                  width={600}
                  height={600}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

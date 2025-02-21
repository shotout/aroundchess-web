import Link from "next/link";
import {
  LayoutDashboard,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CookieConsent from "@/app/cookies-consent/cookies-consent-message";
import Image from "next/image";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooterNew({ className }: SiteFooterProps) {
  return (
    <footer className={cn("bg-[#EFF5FF] py-4", className)}>
      <CookieConsent />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <Image
                src="/icons/logo.png"
                alt="logo"
                className="w-44 h-8"
                quality={100}
                width={600}
                height={600}
              />
            </Link>
            <p className="mt-2 text-sm text-[#364152]">
              Advanced chess training and analysis powered by AI
            </p>
          </div>
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
            <h3 className="mb-8 text-lg font-semibold">Company</h3>
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
            <h3 className="mb-8 text-lg font-semibold">Legal</h3>
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

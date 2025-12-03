import Link from "next/link"
import { LayoutDashboard, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'
import { cn } from "@/lib/utils"
import CookieConsent from "@/app/cookies-consent/cookies-consent-message";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("bg-background py-4", className)}>
      <CookieConsent/>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <LayoutDashboard className="h-6 w-6" />
              <span className="font-bold">aroundchess</span>
            </Link>
            <p className="mt-2 text-[14px] --sm">
              Advanced chess training and analysis powered by AI
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Features</h3>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-gray-900 dark:hover:text-white">Learning</Link></li>
              <li><Link href="/login" className="hover:text-gray-900 dark:hover:text-white">Practice</Link></li>
              <li><Link href="/login" className="hover:text-gray-900 dark:hover:text-white">Game Analysis</Link></li>
              <li><Link href="/playground" className="hover:text-gray-900 dark:hover:text-white">Playground</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-gray-900 dark:hover:text-white">About</Link></li>
              <li><Link href="/pricing" className="hover:text-gray-900 dark:hover:text-white">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-[14px] --sm">© 2024 aroundchess. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

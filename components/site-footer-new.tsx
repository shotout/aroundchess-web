import CookieConsent from "@/app/cookies-consent/cookies-consent-message";
import { useContactUs } from "@/app/store/contactUs";
import { usePricingOffer } from "@/app/store/pricingOffer";
import { useProfileStore } from "@/app/store/profile";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { ConfirmLogin } from "./modal/ConfirmLogin";
import { ContactUs } from "./modal/ContactUs";
import { SuccessSubscription } from "./modal/SuccessSubscription";
import { CancelSubscription } from "./modal/CancelSubscription";
import { StatusPurchaseTokens } from "./modal/StatusPurchaseTokens";
import { PricingOffer } from "./modal/PricingOffer";
import { ShareGame } from "./modal/ShareGame";
import { SuccessSent } from "./modal/SuccessSent";
import { ModalSetting } from "@/app/cookies-consent/ModalSetting";
import { LimitPuzzle } from "./modal/LimitPuzzle";
import DialogSpecialDiscount from "./modal/DialogSpecialDiscount";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooterNew({ className }: SiteFooterProps) {
  const { setOpen, open } = useContactUs();
  const { setOpen: setOpenPricing } = usePricingOffer();
  const handleContactUs = () => {
    setOpen(true);
  };
  const handleDiscord = () => {
    const url = `https://discord.gg/PZWcXsxGM7`;
    window.open(url, "_blank");
  };
  const handleFacebook = () => {
    const url = `https://www.facebook.com/aroundchess`;
    window.open(url, "_blank");
  };
  const handleInstagram = () => {
    const url = `https://www.instagram.com/aroundchess/`;
    window.open(url, "_blank");
  };
  const handleTwitter = () => {
    const url = `https://x.com/Around_Chess`;
    window.open(url, "_blank");
  };
  return (
    <footer className={cn("bg-[#E6F7FE] py-4", className)}>
      {/* modal */}

      <div className="flex flex-col px-4 md:px-6 lg:px-12 lg:py-2 lg:pt-8">
        <div className="relative flex flex-row items-center bg-[#D9E8F4] border border-[#25CEDA] min-h-[366px] sm:min-h-[205px] w-full rounded-[16px] mb-[64px] ">
          <Image
            src="/images/footer/background.png"
            alt="background"
            className="w-full h-full absolute inset-0 rounded-[16px] object-cover z-0"
            quality={100}
            width={1000}
            height={1000}
          />
          <div className="absolute inset-0 w-full flex flex-col sm:flex-row sm:items-center justify-center self-center gap-4 z-5 px-[32px]">
            <Image
              src="/images/footer/icon-footer.png"
              alt="background"
              className="w-[70px] h-[78px] sm:w-[128px] sm:h-[142px] lg:w-[186px] lg:h-[206px] object-contain z-49"
              quality={100}
              width={1000}
              height={1000}
            />
            <div className="flex flex-col gap-4">
              <span className="font-semibold text-[16px] lg:text-[23px]">
                We work hard to improve AroundChess every day.
              </span>
              <span className="font-normal text-[14px] -- sm:text-[10px] lg:text-[14px]">
                If you have feedback, comments or might even have found a bug,
                send us a message or contact us on Discord.
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4">
                <button
                  onClick={handleDiscord}
                  className="btn-secondary rounded-full h-[48px] sm:min-w-[240px] lg:min-w-[300px] flex flex-row items-center justify-center gap-2"
                >
                  <FaDiscord className="w-[26px] h-[20px]" color={"#000"} />
                  <span className="text-[11px] lg:text-[16px]">
                    Contact us on Discord
                  </span>
                </button>
                <button
                  onClick={handleContactUs}
                  className="btn-primary rounded-full h-[48px] sm:min-w-[240px] lg:min-w-[300px] flex flex-row items-center justify-center gap-2"
                >
                  <Send
                    className="w-[26px] h-[20px]"
                    color={"#fff"}
                    fill="#fff"
                  />
                  <span className="text-[11px] lg:text-[16px]">
                    Send us a message
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-9 lg:grid-cols-3 sm:mb-8">
          <div>
            <div className="flex flex-row justify-between items-center">
              <Link
                href="/"
                className="flex items-center space-x-2 mb-2 sm:mb-8"
              >
                <Image
                  src="/icons/logo.png"
                  alt="logo"
                  className="w-[125px] h-[40px]"
                  quality={100}
                  width={600}
                  height={600}
                />
              </Link>
              <Image
                src={"/images/switzerland.png"}
                alt="made-in-switzerland"
                quality={100}
                width={600}
                height={600}
                className="block sm:hidden w-[150px] h-[96px] sm:w-[286px] sm:h-[96px] object-contain"
              />
            </div>
            <p className="mt-2 font-normal text-[16px] sm:mt-2:text-[16px] text-[#364152]">
              Advanced chess training and analysis powered by AI
            </p>
          </div>
          <div className="md:grid md:gap-9 md:grid-cols-3">
            <div>
              <h3 className="mb-8 text-lg font-semibold">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/play-practice"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Play & Practice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-game-history"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Analyze Games
                  </Link>
                </li>
                <li>
                  <Link
                    href="/training"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Training
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/opening-theory"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Learning
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playground/play-vs-ai"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Practice
                  </Link>
                </li>
                <li>
                  <Link
                    href="/analysis"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Game Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playground/puzzle"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Playground
                  </Link>
                </li> */}
              </ul>
            </div>
            <div>
              <h3 className="mb-8 mt-8 md:mt-0 text-lg font-semibold">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about-us"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setOpenPricing(true)}
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setOpen(true)}
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-8 mt-8 md:mt-0 text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/eu-compliance"
                    className="hover:text-gray-900 hover:underline text-[#364152]"
                  >
                    EU Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="hidden sm:flex justify-end">
            <Image
              src={"/images/switzerland.png"}
              alt="made-in-switzerland"
              quality={100}
              width={600}
              height={600}
              className="w-[140px] h-[96px] sm:w-[286px] sm:h-[96px] object-contain"
            />
          </div> */}
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-[14px] --sm text-[#364152]">
              © 2025 aroundchess. All rights reserved.
            </p>
            <div className="flex space-x-2">
              <div
                onClick={handleDiscord}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Discord</span>
                <Image
                  src="/images/footer/discord.png"
                  alt="discord"
                  className="w-7 h-7 cursor-pointer"
                  width={600}
                  height={600}
                />
              </div>
              <div
                onClick={handleFacebook}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Facebook</span>
                <Image
                  src="/images/footer/facebook.png"
                  alt="facebook"
                  className="w-7 h-7 cursor-pointer"
                  width={600}
                  height={600}
                />
              </div>
              <div
                onClick={handleInstagram}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Instagram</span>
                <Image
                  src="/images/footer/instagram.png"
                  alt="instagram"
                  className="w-7 h-7 cursor-pointer"
                  width={600}
                  height={600}
                />
              </div>
              <div
                onClick={handleTwitter}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <span className="sr-only">Twitter</span>
                <Image
                  src="/images/footer/twitter.png"
                  alt="twitter"
                  className="w-7 h-7 cursor-pointer"
                  width={600}
                  height={600}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <LimitPuzzle />
      <CookieConsent />
      <ConfirmLogin />
      <ContactUs />
      <SuccessSubscription />
      <CancelSubscription />
      <StatusPurchaseTokens />
      <PricingOffer />
      <ShareGame />
      <SuccessSent />
      <ModalSetting />
      <DialogSpecialDiscount />
    </footer>
  );
}

"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useModalSetting } from "../store/cookiesSetting";

export default function CookieConsent() {
  const { open, setOpen, setting, setSetting } = useModalSetting();
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookiesConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesConsent", "true");
    localStorage.setItem("cookiesSetting", JSON.stringify(setting));
    setShowBanner(false);
    setSetting({
      essential: true,
      marketing: true,
      functional: true,
      analytics: true,
    });
    window.location.reload()
  };
  const handleOpenPrivacy = () => {
    window.location.href = "/privacy-policy";
  };
  const openSetting = () => {
    setOpen(true);
  };
  if (!showBanner) return null;

  return (
    <div className="fixed flex flex-col gap-2 md:flex md:flex-row w-full bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg z-[2000]">
      <div className="w-full md:max-w-[70%]">
        <p className="text-sm">
          We use cookies and similar technologies to enable services and
          functionality on our site and to understand your interaction with our
          service. By clicking on accept, you agree to our use of such
          technologies for marketing and analytics.
          <a className="cursor-pointer underline" onClick={handleOpenPrivacy}>
            {" "}
            See Privacy Policy
          </a>
        </p>
      </div>
      <div className="w-full md:w-[30%] flex flex-row justify-end items-center gap-2">
        <button
          onClick={openSetting}
          className="border border-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Cookie Settings
        </button>
        <button
          onClick={acceptCookies}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

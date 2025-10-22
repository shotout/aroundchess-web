"use client";

import { useModalSetting } from "@/app/store/cookiesSetting";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export function ModalSetting() {
  const { open, setOpen, setSetting } = useModalSetting();
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const [settings, setSettings] = useState({
    essential: true, // Always enabled
    marketing: true,
    functional: true,
    analytics: true,
  });

  const toggleSetting = (key: string) => {
    if (key === "essential") return; // Essential cookies can't be disabled
    setSettings((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveChanges = () => {
    localStorage.setItem("cookiesConsent", "true");
    console.log("Cookie settings saved:", settings);
    setSetting(settings);
    setOpen(false);
    window.location.reload()
    // Here you would typically save to localStorage or send to your backend
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-lg max-w-sm sm:max-w-[640px] sm:max-h-[95%] lg:p-[32px] bg-white max-h-[95%] overflow-y-hidden z-[2100]">
        <DialogHeader className="flex items-center">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Advanced Cookie Settings
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Essential Cookies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Essential Cookies</h3>
              <div className="relative">
                <div className="w-12 h-6 bg-gray-300 rounded-full opacity-50">
                  <div className="w-5 h-5 bg-white rounded-full shadow-md transform translate-x-6 translate-y-0.5" />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              These cookies enable core functionality such as security,
              verification of identity and network management. These cookies
              can't be disabled.
            </p>
          </div>

          {/* Marketing Cookies */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                Enable Marketing Cookies
              </h3>
              <button
                onClick={() => toggleSetting("marketing")}
                className="relative"
              >
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.marketing ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform translate-y-0.5 ${
                      settings.marketing ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            </div>
            <p className="text-sm text-gray-600">
              These cookies are used to track advertising effectiveness to
              provide a more relevant service and deliver better ads to suit
              your interests.
            </p>
          </div>

          {/* Functional Cookies */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                Enable Functional Cookies
              </h3>
              <button
                onClick={() => toggleSetting("functional")}
                className="relative"
              >
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.functional ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform translate-y-0.5 ${
                      settings.functional ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            </div>
            <p className="text-sm text-gray-600">
              These cookies collect data to remember choices users make to
              improve and give a more personalised experience.
            </p>
          </div>

          {/* Analytics Cookies */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                Enable Analytics Cookies
              </h3>
              <button
                onClick={() => toggleSetting("analytics")}
                className="relative"
              >
                <div
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.analytics ? "bg-black" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform translate-y-0.5 ${
                      settings.analytics ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </div>
              </button>
            </div>
            <p className="text-sm text-gray-600">
              These cookies help us to understand how visitors interact with our
              website, discover errors and provide a better overall analytics.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleSaveChanges}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

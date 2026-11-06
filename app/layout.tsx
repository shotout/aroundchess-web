"use client";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { MarchOfferBanner } from "../components/MarchOfferBanner";
import { AppSettingProvider } from "../components/v2/app-setting-provider";
import { TutorialProvider } from "../components/TutorialProvider";
import { DayStreakModalHost } from "../components/v2/day-streak-modal-host";
import { ChesscomPromoModalHost } from "../components/v2/chesscom-promo-modal-host";
import { OfflineBannerHost } from "../components/v2/offline-banner-host";
import { OfflineGateHost } from "../components/v2/offline-gate-host";
import { PendingGameSavesHost } from "../components/v2/pending-game-saves-host";
import { OfflineSimulationHost } from "../components/v2/offline-simulation-host";
import { ServiceWorkerHost } from "../components/v2/service-worker-host";
import { AccountScopeHost } from "../components/v2/account-scope-host";
import { NpsFeedbackHost } from "../components/v2/nps-feedback-host";
import CancelOfferModalHost from "../components/v2/cancel-offer-modal";
import { OfflineNavigationHost } from "../components/v2/offline-navigation-host";
import { SessionKeepAlive } from "../components/v2/session-keepalive";
// Imported for its side effect, and imported here so the fetch wrapper is in
// place before any page code can fire a request.
import "../functions/install-auth-fetch";
import React, { Suspense, useEffect } from "react";
import Script from "next/script";
import { useModalSetting } from "./store/cookiesSetting";
import { loadTrackers } from "./utils/facebookPixel";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setting } = useModalSetting();
  // GA4 and the Pixel are loaded from the tracking helper, which also skips
  // every non-production host. This covers a visitor who consents mid-visit.
  useEffect(() => {
    loadTrackers();
  }, [setting.analytics, setting.marketing]);
  return (
    <Suspense>
      <html lang="en">
        <head>
          <title>AroundChess</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
          <meta name="color-scheme" content="light" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
          <script src="/stockfish.js" defer></script>
        </head>
        <body>
          <AppSettingProvider />
          <SessionKeepAlive />
          <MarchOfferBanner />
          {setting.marketing && (
            <Script
              id="google-adsense"
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6181542146270228"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}

          {/* <React.StrictMode> */}
          <AuthProvider>
            <AccountScopeHost />
            <TutorialProvider>
              {children}
              <DayStreakModalHost />
              <ChesscomPromoModalHost />
              <OfflineBannerHost />
              <OfflineGateHost />
              <OfflineNavigationHost />
              <PendingGameSavesHost />
              <ServiceWorkerHost />
              <OfflineSimulationHost />
              <NpsFeedbackHost />
              <CancelOfferModalHost />
              <Toaster />
            </TutorialProvider>
          </AuthProvider>
          {/* </React.StrictMode> */}
        </body>
      </html>
    </Suspense>
  );
}

"use client";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { MarchOfferBanner } from "../components/MarchOfferBanner";
import { TutorialProvider } from "../components/TutorialProvider";
import { DayStreakModalHost } from "../components/v2/day-streak-modal-host";
import React, { Suspense } from "react";
import Script from "next/script";
import { useModalSetting } from "./store/cookiesSetting";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setting } = useModalSetting();
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
          {setting.marketing && (
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src="https://www.facebook.com/tr?id=1143400640994363&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>
          )}
        </head>
        <body>
          <MarchOfferBanner />
          {setting.marketing && (
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1143400640994363');
            fbq('track', 'PageView');
          `}
            </Script>
          )}
          {setting.analytics && (
            <>
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-C2DL4G5MEB"
              />
              <Script id="google-analytics-init" strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-C2DL4G5MEB');
              `}
              </Script>
            </>
          )}
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
            <TutorialProvider>
              {children}
              <DayStreakModalHost />
              <Toaster />
            </TutorialProvider>
          </AuthProvider>
          {/* </React.StrictMode> */}
        </body>
      </html>
    </Suspense>
  );
}

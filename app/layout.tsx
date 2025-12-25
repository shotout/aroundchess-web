"use client";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { TutorialProvider } from "../components/TutorialProvider";
import DebugWidthBar from "../components/DebugWidthBar";
import React, { Suspense, useEffect, useState } from "react";
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
          <script src="/stockfish.js" defer></script>
          {setting.marketing && (
            <noscript>
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

          {/* <React.StrictMode> */}
          <AuthProvider>
            <TutorialProvider>
              {children}
              <Toaster />
              <DebugWidthBar />
            </TutorialProvider>
          </AuthProvider>
          {/* </React.StrictMode> */}
        </body>
      </html>
    </Suspense>
  );
}

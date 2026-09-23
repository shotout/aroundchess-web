"use client";

/** The `platform` the NPS endpoints record against an answer.
 *
 *  Everything this app sends is a browser — there is no native client — so the
 *  half worth reporting is which kind of browser it was. A score left on a
 *  phone and a score left on a desktop are answers about two fairly different
 *  experiences of the same product, and the survey is worth little if the two
 *  arrive indistinguishable. */
export type NpsPlatform = "Browser - Desktop" | "Browser - Mobile";

/** Device, not window size. A desktop browser dragged narrow is still a
 *  desktop browser, and reporting it as mobile would quietly inflate the
 *  mobile side of every NPS split. */
export function npsPlatform(): NpsPlatform {
  if (typeof navigator === "undefined") return "Browser - Desktop";

  // Chromium's own answer where it exists, which beats reading the UA string.
  const mobileHint = (navigator as { userAgentData?: { mobile?: boolean } })
    .userAgentData?.mobile;
  if (typeof mobileHint === "boolean") {
    return mobileHint ? "Browser - Mobile" : "Browser - Desktop";
  }

  const ua = navigator.userAgent ?? "";
  if (/Android|iPhone|iPad|iPod|Windows Phone/i.test(ua)) {
    return "Browser - Mobile";
  }
  // iPadOS 13+ reports a Macintosh UA; the touch points are what give it away.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) {
    return "Browser - Mobile";
  }

  return "Browser - Desktop";
}

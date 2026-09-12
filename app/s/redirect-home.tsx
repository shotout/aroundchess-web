"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Sends whoever opens a share link on to the site itself.
 *
 * Client-side on purpose. A share URL exists to carry the preview card in its
 * <head>, and generateMetadata still runs on the server to produce those tags.
 * A server-side redirect() would answer crawlers with a 307 to "/" — they never
 * execute JS, so they would follow it and every unfurl (WhatsApp, X, Facebook)
 * would lose its image and caption. Doing it here means crawlers read the tags
 * and only real browsers move on.
 *
 * replace(), not push(), so Back returns to whatever the visitor came from
 * rather than bouncing off the share URL again.
 */
export function RedirectHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}

export default RedirectHome;

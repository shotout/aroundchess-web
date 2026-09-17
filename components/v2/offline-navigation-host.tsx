"use client";

import { useEffect } from "react";

/**
 * Hands route changes back to the browser while the device is offline, so the
 * player gets the browser's own "no connection" page — the dinosaur in Chrome
 * — instead of a half-rendered screen.
 *
 * Why this is needed at all: Next prefetches the routes a `<Link>` points at,
 * so clicking one offline succeeds as a client-side transition. The new page
 * mounts, every request it makes fails one by one, and the result is a shell
 * full of empty panels and broken images that looks like the site is broken
 * rather than like the connection is down. Forcing a real document navigation
 * lets it fail the way the browser already knows how to explain.
 *
 * Nothing is lost by leaving the page. A game finished offline is queued in
 * localStorage before any of this can happen, and PendingGameSavesHost sends
 * it from wherever the player is once the connection returns; a game still in
 * progress has its own snapshot, written on every move. Both survive the tab
 * being closed entirely, which is a good deal more than this does.
 */
/**
 * Routes that genuinely work without a connection, and so must keep their
 * client-side transition.
 *
 * The board runs the engine locally, queues its saves and resumes from its own
 * snapshot — an offline player can start a game, finish it and start another.
 * Handing those navigations to the browser would end that with an error page,
 * which is the opposite of what the offline work is for. Everything else needs
 * the network to show anything at all, and is better off failing honestly.
 */
const OFFLINE_CAPABLE_ROUTES = [
  "/play",
  "/playground/play-vs-ai",
  "/playground/two-player",
  "/playground/computer",
];

function worksOffline(pathname: string): boolean {
  return OFFLINE_CAPABLE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function OfflineNavigationHost() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Only a real offline reading. `navigator.onLine` being true is no
      // promise the connection works — a captive portal says true — but false
      // is definite, and this must never fire on a guess: a hard navigation
      // that succeeds throws away the running app for nothing.
      if (navigator.onLine !== false) return;

      // Someone else has already dealt with this click.
      if (event.defaultPrevented) return;
      // Anything but a plain left click belongs to the browser: new tab, new
      // window, save-as, middle-click paste.
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      // Downloads and anything aimed at another tab already bypass the router.
      if (anchor.hasAttribute("download")) return;
      const anchorTarget = anchor.getAttribute("target");
      if (anchorTarget && anchorTarget !== "_self") return;

      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      // mailto:, tel:, javascript: — not navigations we have any say over.
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      // Another origin fails on its own, with the same page at the end of it.
      if (url.origin !== window.location.origin) return;

      // A jump within this page, and a link to where we already are, are not
      // route changes. Neither would have hit the network online either.
      const samePage =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;
      if (samePage) return;

      // Leaving the play flow alone in both directions: into it, because that
      // is how an offline player starts their next game, and out of it, so the
      // board can still hand them back to the lobby when one ends.
      if (worksOffline(url.pathname) || worksOffline(window.location.pathname)) {
        return;
      }

      // Taken over completely: the click must not also reach an onClick that
      // would start a client-side transition alongside this one.
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(url.href);
    };

    // Capture, so this runs before React's own handlers rather than after the
    // router has already begun.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

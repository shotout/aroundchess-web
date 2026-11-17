"use client";

import { useCallback, useEffect } from "react";
import { useVsAiFullscreenStore } from "@/app/store/vsAiFullscreen";

type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};
type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

const nativeElement = () => {
  const doc = document as FsDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
};

// Swallows both sync throws and rejected promises from the Fullscreen API.
const safely = (fn?: () => Promise<void> | void) => {
  try {
    const result = fn?.();
    if (result && typeof (result as Promise<void>).catch === "function") {
      (result as Promise<void>).catch(() => {});
    }
  } catch {}
};

// Resolves once the browser has switched (or not) so layout is measured on the final viewport.
const waitForFullscreenChange = (timeoutMs: number) =>
  new Promise<void>((resolve) => {
    const done = () => {
      clearTimeout(timer);
      document.removeEventListener("fullscreenchange", done);
      document.removeEventListener("webkitfullscreenchange", done);
      requestAnimationFrame(() => resolve());
    };
    const timer = setTimeout(done, timeoutMs);
    document.addEventListener("fullscreenchange", done);
    document.addEventListener("webkitfullscreenchange", done);
  });

export function useVsAiFullscreen() {
  const isFullscreen = useVsAiFullscreenStore((s) => s.isFullscreen);
  const setFullscreen = useVsAiFullscreenStore((s) => s.setFullscreen);

  // Must run inside the click handler so the browser accepts the request.
  const requestNative = useCallback((): Promise<void> => {
    if (typeof document === "undefined" || nativeElement()) return Promise.resolve();
    const el = document.documentElement as FsElement;
    const request = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (!request) return Promise.resolve();
    const settled = waitForFullscreenChange(450);
    safely(() => request.call(el));
    return settled;
  }, []);

  const enter = useCallback(() => {
    requestNative();
    setFullscreen(true);
  }, [requestNative, setFullscreen]);

  // Immediate exit (used on unmount).
  const exitNow = useCallback(() => {
    setFullscreen(false);
    if (typeof document === "undefined" || !nativeElement()) return;
    const doc = document as FsDocument;
    const leave = doc.exitFullscreen ?? doc.webkitExitFullscreen;
    safely(leave ? () => leave.call(doc) : undefined);
  }, [setFullscreen]);

  // Leave native fullscreen first, then animate out once the page is back at its normal size.
  const exit = useCallback(() => {
    if (typeof document === "undefined" || !nativeElement()) {
      setFullscreen(false);
      return;
    }
    const doc = document as FsDocument;
    const leave = doc.exitFullscreen ?? doc.webkitExitFullscreen;
    waitForFullscreenChange(450).then(() => setFullscreen(false));
    safely(leave ? () => leave.call(doc) : undefined);
  }, [setFullscreen]);

  const toggle = useCallback(() => {
    if (useVsAiFullscreenStore.getState().isFullscreen) exit();
    else enter();
  }, [enter, exit]);

  return { isFullscreen, enter, exit, exitNow, toggle, requestNative, setFullscreen };
}

// Mount once on the game page: syncs Esc/browser exits, locks scroll, cleans up on leave.
export function useVsAiFullscreenLifecycle() {
  const { isFullscreen, exit, exitNow } = useVsAiFullscreen();
  const setFullscreen = useVsAiFullscreenStore((s) => s.setFullscreen);

  useEffect(() => {
    let wasNative = !!nativeElement();
    const onChange = () => {
      const active = !!nativeElement();
      if (wasNative && !active) setFullscreen(false);
      wasNative = active;
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, [setFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const targets = [document.body, ...Array.from(document.querySelectorAll("main"))] as HTMLElement[];
    const previous = targets.map((el) => el.style.overflow);
    targets.forEach((el) => (el.style.overflow = "hidden"));
    return () => targets.forEach((el, i) => (el.style.overflow = previous[i]));
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    // Esc for the overlay-only fallback (native fullscreen handles its own Esc).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !nativeElement()) exit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen, exit]);

  useEffect(() => () => exitNow(), [exitNow]);
}

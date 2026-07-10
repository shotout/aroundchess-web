"use client";

import { useEffect, useState } from "react";

// Module-level cache of Lottie animation JSON keyed by URL. Resolved data is
// kept for the lifetime of the page so a modal that opens after a preload
// renders its animation synchronously, with no fetch on the critical path.
const loaded = new Map<string, object>();
const inflight = new Map<string, Promise<object | null>>();

export function preloadLottie(url: string): Promise<object | null> {
  const cached = loaded.get(url);
  if (cached) return Promise.resolve(cached);
  const pending = inflight.get(url);
  if (pending) return pending;
  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return res.json();
    })
    .then((data: object) => {
      loaded.set(url, data);
      inflight.delete(url);
      return data;
    })
    .catch(() => {
      // Forget the failed attempt so the next caller retries instead of
      // being stuck on a rejected promise forever.
      inflight.delete(url);
      return null;
    });
  inflight.set(url, promise);
  return promise;
}

// Returns the animation data for `url`, fetching it (or reusing an earlier
// preloadLottie call) as needed. Pass null to skip loading entirely.
export function useLottieData(url: string | null): object | null {
  const [data, setData] = useState<object | null>(() =>
    url ? loaded.get(url) ?? null : null
  );

  useEffect(() => {
    if (!url) return;
    const cached = loaded.get(url);
    if (cached) {
      setData(cached);
      return;
    }
    let cancelled = false;
    preloadLottie(url).then((result) => {
      if (!cancelled && result) setData(result);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return data;
}

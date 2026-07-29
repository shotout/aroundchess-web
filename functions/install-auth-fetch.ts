"use client";

import { useProfileStore } from "@/app/store/profile";
import { refreshSession, shouldRefreshBeforeRequest } from "./refresh-token";

/**
 * Installs a `window.fetch` wrapper that keeps hand-rolled authenticated calls
 * from failing on an expired access token.
 *
 * Dozens of call sites capture `sessionId` when their component renders and
 * pass it straight to `fetch`, so after an hour that header carries a dead
 * token and the request comes back 401 ("Session expired or inactive, please
 * login again") even though the refresh token is still valid. Patching them one
 * by one leaves the next new call site broken again, so the swap happens here.
 *
 * Deliberately narrow — a request is only touched when it
 *   • goes to our own API base URL, and
 *   • already carries an `Authorization: Bearer …` header.
 * Public endpoints, third-party requests and Next.js's own fetches pass
 * straight through, and the token exchange itself (no Authorization header) is
 * never intercepted, so there is no recursion.
 *
 * It never ends the session: a request that still fails is handed back to the
 * caller untouched, and only the API clients decide what that means.
 */

const API_BASES = [process.env.BASE_URL, process.env.NEXT_PUBLIC_BASE_URL]
  .filter((base): base is string => typeof base === "string" && base.length > 0)
  .map((base) => base.replace(/\/+$/, ""));

const INSTALLED_FLAG = "__aroundchessAuthFetchInstalled";

function resolveUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input?.url ?? "";
}

function isApiRequest(url: string): boolean {
  return API_BASES.some((base) => url.startsWith(base));
}

function readBearerToken(
  input: RequestInfo | URL,
  init?: RequestInit
): string | null {
  // init wins over the Request's own headers, matching what fetch() itself does.
  const fromInit = init?.headers ? new Headers(init.headers) : null;
  const fromRequest =
    typeof input !== "string" && !(input instanceof URL) ? input.headers : null;
  const value =
    fromInit?.get("Authorization") ?? fromRequest?.get("Authorization") ?? null;

  return value?.startsWith("Bearer ") ? value.slice(7).trim() : null;
}

export function installAuthFetchInterceptor() {
  if (typeof window === "undefined" || !API_BASES.length) return;

  const globals = window as unknown as Record<string, unknown>;
  if (globals[INSTALLED_FLAG]) return;
  globals[INSTALLED_FLAG] = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = resolveUrl(input);
    const sentToken = isApiRequest(url) ? readBearerToken(input, init) : null;

    if (!sentToken) return originalFetch(input, init);

    const send = (token: string) => {
      if (typeof input === "string" || input instanceof URL) {
        const headers = new Headers(init?.headers);
        headers.set("Authorization", `Bearer ${token}`);
        return originalFetch(input, { ...init, headers });
      }

      // Clone per attempt so a replay still has a readable body.
      const headers = new Headers(init?.headers ?? input.headers);
      headers.set("Authorization", `Bearer ${token}`);
      return originalFetch(new Request(input.clone(), { ...init, headers }));
    };

    if (shouldRefreshBeforeRequest()) {
      await refreshSession();
    }

    // The store's token beats the captured one — it may have been rotated since
    // the caller read it.
    const response = await send(useProfileStore.getState().sessionId || sentToken);
    if (response.status !== 401) return response;

    const refreshed = await refreshSession();
    if (refreshed.status !== "refreshed") return response;

    return send(refreshed.token);
  };
}

installAuthFetchInterceptor();

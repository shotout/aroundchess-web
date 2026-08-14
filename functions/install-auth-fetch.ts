"use client";

import { useProfileStore } from "@/app/store/profile";
import { refreshSession, shouldRefreshBeforeRequest } from "./refresh-token";

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

      const headers = new Headers(init?.headers ?? input.headers);
      headers.set("Authorization", `Bearer ${token}`);
      return originalFetch(new Request(input.clone(), { ...init, headers }));
    };

    if (shouldRefreshBeforeRequest()) {
      await refreshSession();
    }

    const response = await send(useProfileStore.getState().sessionId || sentToken);
    if (response.status !== 401) return response;

    const refreshed = await refreshSession();
    if (refreshed.status !== "refreshed") return response;

    return send(refreshed.token);
  };
}

installAuthFetchInterceptor();

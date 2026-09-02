"use client";

import { useProfileStore } from "@/app/store/profile";
import { refreshSession, shouldRefreshBeforeRequest } from "./refresh-token";

/**
 * `fetch` for authenticated calls made outside useApiClient(): attaches the
 * access token the store holds *now*, renews it when it is nearly stale, and
 * replays once on a 401.
 *
 * Call sites that capture `sessionId` in a component and pass it down send a
 * token that can be an hour old by request time, which is how expired-token
 * 401s ("Session expired or inactive, please login again") kept surfacing even
 * though the refresh token was still valid.
 *
 * It never ends the session — the caller decides what a still-failing request
 * means, so a plain endpoint error can't be mistaken for a dead login.
 */
export async function authedFetch(
  url: string,
  init: RequestInit = {}
): Promise<Response> {
  if (shouldRefreshBeforeRequest()) {
    await refreshSession();
  }

  const send = (token: string) => {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...init, headers });
  };

  const response = await send(useProfileStore.getState().sessionId);
  if (response.status !== 401) return response;

  const refreshed = await refreshSession();
  if (refreshed.status !== "refreshed") return response;

  return send(refreshed.token);
}

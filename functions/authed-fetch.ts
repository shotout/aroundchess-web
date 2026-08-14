"use client";

import { useProfileStore } from "@/app/store/profile";
import { refreshSession, shouldRefreshBeforeRequest } from "./refresh-token";

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

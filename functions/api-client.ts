// apiClient.ts
"use client";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: RequestMethod;
  path: string;
  body?: any;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
}

async function apiRequest<T = any>({
  method,
  path,
  body,
  params,
  headers = {},
}: RequestOptions): Promise<T> {
  let url = path;
  let token = localStorage.getItem("token")  ;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params as any).toString();
    url += `?${query}`;
  }
  console.log("url", url);
  console.log("method", method);
  console.log("token", token);
  console.log("body", body);

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    body: method !== "GET" ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error(errorData.message || "API request failed");
    throw new Error(errorData.message || "API request failed");
  }
  const successData = await response.json();
  toast.success(successData.message || "Request successful");

  return response.json();
}

export async function getHistoryGames() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/games/my-game-history?type=other`,
  });
}

export async function getHistoryOptions() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/games/get-data/newbiepisan`,
  });
}

export async function getAnalyticGamePerformance() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/analytic-games/my-game-performance-history`,
  });
}

export async function getAnalyticGameAnalytic() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/analytic-games/my-game-analytic-history`,
  });
}

export async function getAnalyticGameSummary() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/analytic-games/summary`,
  });
}

export async function getPGNFromUsername() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/chessdotcom/games/newbiepisan`,
  });
}

export async function getAnalyticGame() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/analytic-games/newbiepisan`,
  });
}

export async function setUsername(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/profile/set-username`,
    body,
  });
}

export async function profile() {
  return apiRequest({ method: "GET", path: `${process.env.BASE_URL}/profile` });
}

export async function analyze(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/analyze`,
    body,
  });
}

export async function startGame(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/start`,
    body,
  });
}

export async function resignGame(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/resign`,
    body,
  });
}

export async function offerDraw(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/offer-draw`,
    body,
  });
}

export async function acceptDraw(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/accept-draw`,
    body,
  });
}

export async function rejectDraw(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/reject-draw`,
    body,
  });
}

export async function makeMove(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/move`,
    body,
  });
}

export async function getMyGames() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/games/my-games`,
  });
}

export async function getGameById(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/get-game`,
    body,
  });
}

export async function getGamePGN(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/get-pgn`,
    body,
  });
}

export async function rematch(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/rematch`,
    body,
  });
}

export async function uploadPGN(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/games/upload-pgn`,
    body,
  });
}

export async function getPuzzle() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/playground/puzzles`,
  });
}

export async function getVSAILogs() {
  return apiRequest({
    method: "GET",
    path: `${process.env.BASE_URL}/playground/vs-ai-logs`,
  });
}

export async function postVSAILogs(body: any) {
  return apiRequest({
    method: "POST",
    path: `${process.env.BASE_URL}/playground/vs-ai-logs`,
    body,
  });
}

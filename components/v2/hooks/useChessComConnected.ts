"use client";

import { useProfileStore } from "@/app/store/profile";

export function useChessComConnected(): boolean {
  const { profile } = useProfileStore();
  return (
    (profile?.isChessComConnected ?? profile?.is_chesscom_connected) === true
  );
}

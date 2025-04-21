"use client";

import React from "react";

interface GameAlertProps {
  showAlert: boolean;
  alertMessage: string;
  alertClass: string;
}

export default function GameAlert({
  showAlert,
  alertMessage,
  alertClass,
}: GameAlertProps) {
  if (!showAlert) return null;

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-10 p-4 text-center text-white font-bold ${alertClass}`}
    >
      {alertMessage}
    </div>
  );
}

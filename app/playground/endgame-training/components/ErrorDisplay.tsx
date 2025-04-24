import React from "react";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex justify-center items-center h-64 flex-col">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}

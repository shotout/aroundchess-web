"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";
import { logError } from "@/functions/error-logger";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
    // A render crash took the whole page down. Next hands it to this boundary
    // instead of window "error", so the global listener never sees it.
    logError(
      "JS_FATAL",
      error,
      { extra: { isFatal: true, boundary: "global-error", digest: error?.digest ?? null } },
      "fatal"
    );
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}

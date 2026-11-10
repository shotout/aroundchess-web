"use client";

import { installErrorLogger } from "./error-logger";

/**
 * Imported for its side effect by app/layout.tsx, directly AFTER
 * install-auth-fetch: the API tracker has to wrap the auth wrapper (so it sees
 * each call's final response), and the logger's own requests go out on the
 * fetch from before both. See functions/error-logger.ts.
 */
installErrorLogger();

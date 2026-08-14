import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://5bd5b7a94bde6b75f889e1aa7152976a@o4511431772602368.ingest.de.sentry.io/4511431867170896",

  tracesSampleRate: 1,

  sendDefaultPii: true,
});

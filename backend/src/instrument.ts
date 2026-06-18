import "dotenv/config";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

const dsn = process.env.SENTRY_DSN;

// node profiling integration is for performance debugging in Sentry.

Sentry.init({
  dsn: dsn,
  environment: process.env.NODE_ENV ?? "development",
  integrations: [nodeProfilingIntegration()],
  enableLogs: true,
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
  sendDefaultPii: true,
  // NOTE: 'dataCollection' is not a valid NodeOptions property and will cause a TypeScript error.
  // To control data collection in the Node SDK, configure relevant options or environment variables.
  // See: https://docs.sentry.io/platforms/node/configuration/options/
});
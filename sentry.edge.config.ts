import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://e2b987e95815d0a5667b72ea31fecf48@sentry.loguru.workers.dev/9372',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})

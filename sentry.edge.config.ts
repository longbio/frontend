import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: 'https://1234567890@o1234567890.ingest.sentry.io/1234567890',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
})

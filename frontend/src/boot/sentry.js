/* eslint-disable */
import { boot } from 'quasar/wrappers';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';

export default boot(({ app, router }) => {
  Sentry.init({
    app,
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', /^\//],
      }),
    ],
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
});

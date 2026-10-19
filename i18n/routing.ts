import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ro', 'en'],
  defaultLocale: 'ro',
  localePrefix: 'as-needed',
  // Keep Romanian for every visitor unless they open /en themselves.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

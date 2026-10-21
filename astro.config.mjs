// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE_URL } from './src/lib/site.const';

const NOINDEX_PATHS = ['/mentions-legales', '/posts'];

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: {
    // Cloudflare Pages sert /page depuis page.html sans redirection ; le format "directory"
    // imposait un 308 vers /page/ sur chaque page interne.
    format: 'file',
    // CSS court (une trentaine de Ko) : inliné, il ne bloque plus le premier rendu sur mobile.
    inlineStylesheets: 'always',
  },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', { path: 'mu', codes: ['fr-MU'] }],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => new URL(page).pathname.endsWith(path)),
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr', mu: 'fr-MU' },
      },
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});

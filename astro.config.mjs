import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://bussetagency.com',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/calendario') })],
  vite: {
    plugins: [tailwindcss()],
  },
});

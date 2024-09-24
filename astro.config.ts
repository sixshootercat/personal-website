import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";
import react from "@astrojs/react";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
  // used to generate images
  site:
    process.env.VERCEL_ENV === "production"
      ? "https://brutal.elian.codes/"
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/`
        : "https://localhost:3000/",
  trailingSlash: "ignore",
  integrations: [
    sitemap(),
    UnoCSS({
      injectReset: true,
    }),
    react(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      // Enable if you want to track page views
      enabled: true,
    },
  }),
});

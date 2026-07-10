// https://nuxt.com/docs/api/configuration/nuxt-config
import path from "node:path";
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    demoMode: process.env.DEMO_MODE === "true",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30d",
    sessionExpiresMinutes: Number(process.env.SESSION_EXPIRES_MINUTES || 30),
    public: {
      appName: process.env.APP_NAME,
      appClient: process.env.APP_CLIENT,
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY,
    },
  },

  css: [
    "@tabler/core/dist/css/tabler.min.css",
    // '@tabler/core/dist/css/tabler-icons.min.css',
    // "~/assets/css/main.css",
    "~/assets/css/backend.css",
  ],

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
      script: [
        {
          src: "https://www.google.com/recaptcha/api.js",
          async: true,
          defer: true,
        },
      ],
    },
  },

  plugins: [
    "~/plugins/jquery.client.js",
    "~/plugins/tabler.client.js",
    "~/plugins/apexcharts.client.js",
  ],

  vite: {
    optimizeDeps: {
      include: ["apexcharts"],
    },
  },
});

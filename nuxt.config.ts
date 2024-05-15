// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "dayjs-nuxt",
  ],
  ui: {
    global: true,
    icons: ["mdi"],
  },
  imports: {
    autoImport: true,
  },
  dayjs: {
    locales: ["fr"],
    defaultLocale: "fr",
    defaultTimezone: "Europe/Paris",
    plugins: ["relativeTime", "utc", "timezone"],
  },
  app: {
    head: {
      meta: [
        {
          charset: "utf-8",
        },
      ],
    },
  },
});

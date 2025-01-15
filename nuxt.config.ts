// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@/assets/styles/main.css'],
  compatibilityDate: '2024-12-06',
  // NitroのWebSocket対応
  nitro: {
    experimental: {
      websocket: true,
    },
  },

})
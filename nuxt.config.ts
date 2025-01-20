// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@/assets/styles/main.css'],
  compatibilityDate: '2024-12-06',
  modules: ['@pinia/nuxt'],
  // NitroのWebSocket対応
  nitro: {
    experimental: {
      websocket: true,
    },
  },
  runtimeConfig: {
    public: {
      DefaultIPAdress: '10.0.1.56:3000',
      DefaultUserID: 'user123',
    },
  },

})
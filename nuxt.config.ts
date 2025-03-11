// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/ConsoleUI':{ssr:false},
  },
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
      DefaultIPAdress: '10.0.1.71:3000',
      DefaultUserID: 'user123',
    },
  }

  

})
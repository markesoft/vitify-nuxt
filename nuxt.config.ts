import Modify from '@kingyue/rollup-plugin-modify'
import * as mdicons from '@mdi/js'

const mdi: Record<string, string> = {}
Object.keys(mdicons).forEach((key) => {
  const value = (mdicons as Record<string, string>)[key]
  mdi[
    key.replace(
      /[A-Z]+(?![a-z])|[A-Z0-9]/g,
      ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
    )
  ] = value
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['vue-echarts'],
  },
  // you can turn on SSR but Vuetify has a layout bug
  // https://github.com/vuetifyjs/vuetify/issues/15202
  ssr: false,
  modules: ['@pinia/nuxt', '@vueuse/nuxt', 'vuetify-nuxt-module'],
  css: ['~/assets/styles/index.css'],
  experimental: { typedPages: true },
  typescript: { shim: false, strict: true },
  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        viewportSize: true,
        prefersColorScheme: true,
        prefersColorSchemeOptions: {},
        reloadOnFirstRequest: true,
      },
    },
  },
  vite: {
    plugins: [
      Modify({
        exclude: ['node_modules/**'],
        find: /\b(?<![/\w])(mdi-[\w-]+)\b(?!\.)/,
        replace: (match: string) => {
          if (mdi[match]) {
            return mdi[match]
          } else {
            // eslint-disable-next-line no-console
            console.warn('[plugin-modify] No matched svg icon for ' + match)
            return match
          }
        },
        sourcemap: false,
      }),
    ],
  },
})

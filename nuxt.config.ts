// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  router: { 
    options: { strict: true } 
  },
  devtools: { enabled: true },
  modules: ['nuxt-plotly', '@invictus.codes/nuxt-vuetify'],
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      // @TODO: list all vuetify options
      theme: {
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#ff0000'
            }
          },
        },
      },
    },
    moduleOptions: {
      /* nuxt-vuetify module options */
      // treeshaking: true | false,
      // useIconCDN: true | false,

      /* vite-plugin-vuetify options */
      // styles: true | 'none' | 'expose' | 'sass' | { configFile: string },
      // autoImport: true | false,
      // useVuetifyLabs: true | false,
    }
  },
  vite: {
    optimizeDeps: {
      include: ["plotly.js-dist-min"],
    },
  },
  app: {  
    baseURL: process.env.APP_TYPE == 'staging' ? '/webdev3/hexABC/' : '/hexABC/',
    head: {
      titleTemplate: '%s - hexABC',
      meta: [ 
        { name: 'description', content: 'hexABC project is the latest effort (2021) of the Ascona B-DNA (ABC) consortium. The study is focused on the systematic characterization of the physical properties of all 2080 unique hexanucleotides, from a collection of 950, 10μs-long MD simulations.' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Open+Sans' },
        { rel: 'icon', type: 'image/x-icon', href: `${process.env.APP_TYPE === 'staging' ? '/webdev3/hexABC/' : '/hexABC/'}favicon.ico` },
      ]
    },
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/css/main.css'
  ],
  components: [
    { path: '~/components/common', extensions: ['vue'] },
    { path: '~/components/search', extensions: ['vue'] },
    { path: '~/components/projects/curves', extensions: ['vue'] }
  ],
  plugins: [
    // define here all plugins in nested folders
    '~/plugins/plots/hbonds',
  ],
  runtimeConfig: {
    public: {
      url: process.env.APP_TYPE == 'development' ? `http://${process.env.APP_DEVELOPMENT_HOST}/` : process.env.APP_TYPE == 'staging' ? `https://${process.env.APP_STAGING_HOST}/` : `https://${process.env.APP_PRODUCTION_HOST}/`,
      externalApi: process.env.MAIN_API_URL,
      apiBase: '/api',
      apiHost: process.env.APP_TYPE == 'development' ? process.env.APP_DEVELOPMENT_HOST : process.env.APP_TYPE == 'staging' ? process.env.APP_STAGING_HOST : process.env.APP_PRODUCTION_HOST,
      apiEndPoints: [
        '/api', '/api/projects', '/^\/api\/projects\/?([a-zA-Z0-9]+)?(\\?[\\w=&]+)?$/', '/api/projects/analyses/hbonds'
      ]
    }
  },
})
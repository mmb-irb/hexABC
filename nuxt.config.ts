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
    { path: '~/components/projects/analyses', extensions: ['vue'] },
    { path: '~/components/projects/curves', extensions: ['vue'] },
    { path: '~/components/projects/hbonds', extensions: ['vue'] },
    { path: '~/components/projects/overview', extensions: ['vue'] },
    { path: '~/components/projects/rmsd', extensions: ['vue'] },
    { path: '~/components/projects/rgyr', extensions: ['vue'] },
    { path: '~/components/projects/fluctuation', extensions: ['vue'] },
    { path: '~/components/projects/distance', extensions: ['vue'] },
    { path: '~/components/projects/sequences', extensions: ['vue'] },
    { path: '~/components/projects/sasa', extensions: ['vue'] },
    { path: '~/components/projects/pca', extensions: ['vue'] },
    { path: '~/components/results', extensions: ['vue'] }
  ],
  plugins: [
    // define here all plugins in nested folders
    '~/plugins/plots/hbonds',
    '~/plugins/plots/curves',
    '~/plugins/plots/rmsd',
    '~/plugins/plots/rgyr',
    '~/plugins/plots/distres', 
    '~/plugins/plots/fluctuation',
    '~/plugins/plots/sasa',
    '~/plugins/plots/pca',
    '~/plugins/results/shift'
  ],
  runtimeConfig: {
    public: {
      url: process.env.APP_TYPE == 'development' ? `http://${process.env.APP_DEVELOPMENT_HOST}/` : process.env.APP_TYPE == 'staging' ? `https://${process.env.APP_STAGING_HOST}/` : `https://${process.env.APP_PRODUCTION_HOST}/`,
      externalApi: process.env.MAIN_API_URL,
      protocol: process.env.APP_TYPE == 'development' ? 'http' : 'https',
      apiHost: process.env.APP_TYPE == 'development' ? process.env.APP_DEVELOPMENT_HOST : process.env.APP_TYPE == 'staging' ? process.env.APP_STAGING_HOST : process.env.APP_PRODUCTION_HOST,
      apiBase: '/api',
      apiEndPoints: [
        '/api', 
        '/^\/api\/projects(\\/)?(\\?[\\w=&]+)?$/', 
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)$/', 
        '/^\/api\/projects\/sequence?(\\?[\\w=&]+)?$/', 
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/(topology|structure)$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/trajectory\\?format=(xtc|mdcrd|trr)&frames=(\\d+((:|%3A)\\d+((:|%3A)\\d+)?)?)$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/filenotes\/[a-z0-9_.]+$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/(hbonds)(\\?.*)?$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/dist-res\/(means|stdvs)$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/(fluctuation|rgyr)$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/(sasa)(\\?res=([0-9]+(,|%2C))*[0-9]+)?$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/(pca)(\\?pc=([0-9]+(,|%2C)[0-9]+))?$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/rmsd\/(firstframe|average|pairwise)$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/rmsd\/(residues)(\\?res=([0-9]+,)*[0-9]+)?$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/time\/(alpha|beta|gamma|delta|chi|epsilon|theta|inclination|tip|xdisp|ydisp|shear|stretch|stagger|buckle|propeller|opening|rise|roll|shift|slide|tilt|twist|majorgd|majorgw|minorgd|minorgw)(\\?bp=\\d+\_[A-Z]+)?$/',
        '/^\/api\/projects\/(seq\\d{3}(\.\\d{1,2})?)\/analyses\/average\/(bibiipopulation|canonicalag|puckering|inclination|tip|xdisp|ydisp|shear|stretch|stagger|buckle|propeller|opening|rise|roll|shift|slide|tilt|twist|majorgd|majorgw|minorgd|minorgw)$/',
        '/api/results/shift', 
      ]
    }
  },
})
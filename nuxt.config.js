import webpack from 'webpack';
import theme from './themeConfig';

export default {
  components: ['~/components/cms/page/', '~/components/cms/layout/'],
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  },
  head: {
    title: 'Vue Storefront',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href:
          'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        as: 'style'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        media: 'print',
        onload: 'this.media=\'all\'',
        once: true
      }
    ]
  },
  loading: { color: '#fff' },
  plugins: [
    { src: '~/plugins/image-helpers.ts' },
    { src: '~/plugins/notifications', mode: 'client' },
    { src: '~/plugins/amplience-preview.js'}
  ],
  serverMiddleware: [
    {
      path: 'sap-image-proxy',
      handler: '~/serverMiddleware/sap-image-proxy.ts'
    },
    {
      path: "/healthz",
      handler(req, res, next) {
        res.end("ok");
      }
    }
  ],
  buildModules: [
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxtjs/pwa',
    [
      '@vue-storefront/nuxt',
      {
        useRawSource: {
          dev: [
            '@vsf-enterprise/sapcc',
            '@vue-storefront/core',
            '@vsf-enterprise/amplience'
          ],
          prod: [
            '@vsf-enterprise/sapcc',
            '@vue-storefront/core',
            '@vsf-enterprise/amplience'
          ]
        }
      }
    ],
    ['@vsf-enterprise/sapcc/nuxt', {
      loadStorePlugin: true
    }],
    ['@pinia/nuxt', { disableVuex: true }]
  ],
  modules: [
    [
      '@vue-storefront/http-cache/nuxt',
      {
        matchRoute: {
          '/': 'max-age=1800, s-maxage=86400',
          '/en': 'max-age=1800, s-maxage=86400',
          '/ja': 'max-age=1800, s-maxage=86400',
          '*/p/*': 'max-age=300, s-maxage=3600',
          '*/c/*': 'max-age=300, s-maxage=3600',
          '*/my-account': 'none',
          '*/checkout/*': 'none'
        }
      }
    ],
    '@vsf-enterprise/amplience/nuxt',
    '@nuxtjs/i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    '@nuxt/image'
  ],
  i18n: {
    locales: [
      { code: 'en', label: 'English', file: 'en.js', iso: 'en' },
      { code: 'ja', label: '日本語', file: 'ja.js', iso: 'ja' }
    ],
    lazy: true,
    langDir: 'lang/',
    country: 'us',
    defaultLocale: 'en',
    strategy: 'prefix',
    vueI18n: {
      dateTimeFormats: {
        en: {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          },
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric'
          }
        },
        ja: {
          short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          },
          long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: 'numeric',
            minute: 'numeric'
          }
        }
      }
    },
    autoRedirectByLocale: false,
    detectBrowserLanguage: false,
    autoChangeCookie: {
      currency: false
    }
  },
  pwa: {
    meta: {
      // eslint-disable-next-line camelcase
      theme_color: '#5ECE7B',
      name: 'Vue Storefront with SAP'
    }
  },
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: process.env.NUXT_IMAGE_PROVIDER_BASE_URL,
      uploadDir: process.env.NUXT_IMAGE_PROVIDER_UPLOAD_DIR
    }
  },
  styleResources: {
    scss: [
      require.resolve('@storefront-ui/shared/styles/_helpers.scss', {
        paths: [process.cwd()]
      }),
      require.resolve('./assets/styles.scss')
    ]
  },
  publicRuntimeConfig: {
    theme,
    middlewareUrl: process.env.API_BASE_URL || 'http://localhost:8181',
    ssrMiddlewareUrl: process.env.API_SSR_BASE_URL || 'http://localhost:8181',
    mediaHost: process.env.SAPCC_MEDIA_HOST
  },
  build: {
    extractCSS: true,
    transpile: ['vee-validate/dist/rules'],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  },
  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'home',
          path: '/',
          component: resolve(__dirname, 'pages/Home.vue')
        },
        {
          name: 'product',
          path: '/p/:id/:slug/',
          component: resolve(__dirname, 'pages/Product.vue')
        },
        {
          name: 'category',
          path: '/c/:slug_1/:slug_2?/:slug_3?/:slug_4?/:slug_5?',
          component: resolve(__dirname, 'pages/Category.vue')
        },
        {
          name: 'my-account',
          path: '/my-account',
          component: resolve(__dirname, 'pages/MyAccount.vue'),
          children: [
            {
              path: 'my-profile',
              name: 'my-profile',
              meta: { section: 'personal-details', label: 'My Profile', ordinal: 1 },
              component: resolve(__dirname, 'pages/MyAccount/MyProfile.vue')
            },
            {
              path: 'my-addresses',
              name: 'my-addresses',
              meta: { section: 'personal-details', label: 'My Addresses', ordinal: 2 },
              component: resolve(__dirname, 'pages/MyAccount/MyAddresses.vue')
            },
            {
              path: 'my-consents',
              name: 'my-consents',
              meta: { section: 'personal-details', label: 'My Consents', ordinal: 4 },
              component: resolve(__dirname, 'pages/MyAccount/MyConsents.vue')
            },
            {
              path: 'order-history',
              name: 'order-history',
              meta: { section: 'order-details', label: 'Order History', ordinal: 1 },
              component: resolve(__dirname, 'pages/MyAccount/OrderHistory.vue')
            }
          ]
        },
        {
          name: 'checkout',
          path: '/checkout',
          component: resolve(__dirname, 'pages/Checkout.vue'),
          children: [
            {
              path: 'email',
              name: 'email',
              component: resolve(__dirname, 'pages/Checkout/Email.vue')
            },
            {
              path: 'shipping',
              name: 'shipping',
              component: resolve(__dirname, 'pages/Checkout/Shipping.vue')
            },
            {
              path: 'payment',
              name: 'payment',
              component: resolve(__dirname, 'pages/Checkout/Payment.vue')
            },
            {
              path: 'thank-you',
              name: 'thank-you',
              component: resolve(__dirname, 'pages/Checkout/ThankYou.vue')
            }
          ]
        }
      );
    }
  },
  extend(config, ctx) {
    if (ctx && ctx.isClient) {
      config.optimization = {
        ...config.optimization,
        mergeDuplicateChunks: true,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          automaticNameDelimiter: '.',
          maxSize: 128_000,
          maxInitialRequests: Number.POSITIVE_INFINITY,
          minSize: 0,
          maxAsyncRequests: 10,
          cacheGroups: {
            vendor: {
              test: /[/\\]node_modules[/\\]/,
              name: (module) =>
                `${module.context
                  .match(/[/\\]node_modules[/\\](.*?)([/\\]|$)/)[1]
                  .replace(/[.@_]/gm, '')}`
            }
          }
        }
      };
    }
  }
};

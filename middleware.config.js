require('dotenv').config();
const { resolve } = require('path');
const { config } = require('dotenv');
const multistore = require('./multistore.config');
const { multistoreExtension } = require('@vue-storefront/multistore');

config({ path: resolve(__dirname, '.env') });

module.exports = {
  integrations: {
    sapcc: {
      location: '@vsf-enterprise/sapcc-api/server',
      extensions: (extensions) => [...extensions, multistoreExtension],
      configuration: {
        OAuth: {
          uri: process.env.SAPCC_OAUTH_URI,
          clientId: process.env.SAPCC_OAUTH_CLIENT_ID,
          clientSecret: process.env.SAPCC_OAUTH_CLIENT_SECRET,
          tokenEndpoint: process.env.SAPCC_OAUTH_TOKEN_ENDPOINT,
          tokenRevokeEndpoint: process.env.SAPCC_OAUTH_TOKEN_REVOKE_ENDPOINT,
          cookieOptions: {
            'vsf-sap-token': { secure: process.env.NODE_ENV !== 'development' }
          }
        },
        api: {
          uri: process.env.SAPCC_API_URI,
          baseSiteId: 'apparel-uk',
          catalogId: 'apparelProductCatalog',
          catalogVersion: 'Online',
          defaultLanguage: 'en',
          defaultCurrency: 'GBP'
        },
        multistore
      }
    }
  }
};

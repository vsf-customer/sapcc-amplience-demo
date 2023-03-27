const NodeCache = require('node-cache');

module.exports = {
  fetchConfiguration(/* { domain } */) {
    return {
      'localhost:3000': {
        baseSiteId: 'apparel-uk',
        catalogId: 'apparelProductCatalog',
        catalogVersion: 'Online',
        defaultLanguage: 'en',
        defaultCurrency: 'GBP'
      },
      'store1.demo-sapcc.vuestorefront.io': {
        baseSiteId: 'apparel-uk',
        catalogId: 'apparelProductCatalog',
        catalogVersion: 'Online',
        defaultLanguage: 'en',
        defaultCurrency: 'GBP',
      },
      'store2.demo-sapcc.vuestorefront.io': {
        baseSiteId: 'electronics',
        catalogId: 'electronicsProductCatalog',
        catalogVersion: 'Online',
        defaultLanguage: 'en',
        defaultCurrency: 'USD',
      },
    };
  },
  mergeConfigurations({ baseConfig, storeConfig }) {
    return {
      ...baseConfig,
      api: {
        ...baseConfig.api,
        ...storeConfig
      }
    };
  },
  cacheManagerFactory() {
    const client = new NodeCache({
      stdTTL: 10
    });

    return {
      get(key) {
        return client.get(key);
      },
      set(key, value) {
        return client.set(key, value);
      }
    };
  }
};

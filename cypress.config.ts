import { defineConfig } from 'cypress';
import { tagify } from 'cypress-tags';

export default defineConfig({
  fixturesFolder: '__tests__/e2e/fixtures',
  viewportHeight: 1080,
  viewportWidth: 1920,
  defaultCommandTimeout: 20000,
  screenshotOnRunFailure: true,
  screenshotsFolder: '__tests__/e2e/report/assets/screenshots',
  video: false,
  reporter: './node_modules/mochawesome',
  reporterOptions: {
    reportDir: '__tests__/e2e/report',
    reportFilename: 'report',
    overwrite: false,
    html: false
  },
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('file:preprocessor', tagify(config));
    },
    baseUrl: 'http://localhost:3000',
    specPattern: '__tests__/e2e/test/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: '__tests__/e2e/support/index.js'
  }
});

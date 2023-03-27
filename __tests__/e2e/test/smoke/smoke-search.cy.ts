import HomePage from '../../support/pageObjects/homePage';

// arrange
const homePage = new HomePage();
const products = require('../../fixtures/test-data/search-products.json');

beforeEach(() => {
  cy.visit('/');
  homePage.header.searchBar.click();
  homePage.searchModal.assertSearchModalWithoutResults();
});

describe('Smoke: Search tests', () => {
  products.forEach((product) => {
    it(`IN-1502, IN-1505: user should be able to search for a ${product.type} product by name and see the results`, () => {

      // act - search for a product by name
      homePage.searchModal.searchProduct(product.name);

      // assert - search results should be visible
      homePage.searchModal.assertSearchResults(product);
    });

    it(`IN-1496, IN-1497: user should be able to search for a ${product.type} product by SKU and see the results`, () => {

      // act - search for a product by SKU
      homePage.searchModal.searchProduct(product.sku);

      // assert - search results should be visible
      homePage.searchModal.assertSearchResults(product);
    });
  });
});

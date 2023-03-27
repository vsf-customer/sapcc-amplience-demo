import ProductDetailPage from '../../support/pageObjects/productDetailPage';

// Arrange
const productDetailPage = new ProductDetailPage();
const products = require('../../fixtures/test-data/products.json');

describe('Smoke: Product detail page tests', () => {
  products.forEach((product) => {
    it(`IN-1489, IN-1485, IN-1484, IN-1483, IN-1480: product informations should be displayed for ${product.type} product`, () => {

      // act - visit product detail page
      cy.visit(`/en/p/${product.sku}/details`);

      // assert - product name, price, description, gallery, add to cart button, quantity selector, product variations
      productDetailPage.assertProductDetailPageElements(product);
    });

    it(`IN-1417: user should be able to add ${product.type} product to cart`, () => {

      // act - visit product detail page and add product to cart
      cy.visit(`/en/p/${product.sku}/details`);
      productDetailPage.addToCartButton.click();

      // assert - product should be added to cart
      productDetailPage.notifications.assertNotification('Product has been added to cart!');
      productDetailPage.header.cartIconBadge
        .should('be.visible')
        .contains('1');
    });
  });
});

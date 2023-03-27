import HomePage from '../../support/pageObjects/homePage';
import ProductListPage from '../../support/pageObjects/productListPage';
import ProductDetailPage from '../../support/pageObjects/productDetailPage';
import ShippingPage from '../../support/pageObjects/checkout/shippingPage';
import PaymentPage from '../../support/pageObjects/checkout/paymentPage';

// Arrange
const homePage = new HomePage();
const productListPage = new ProductListPage();
const productDetailPage = new ProductDetailPage();
const shippingPage = new ShippingPage();
const paymentPage = new PaymentPage();
const shippingPrice = 5.99;

before(() => {
  cy.fixture('test-data/place-order').then((fixture) => {
    cy.fixtures = {
      data: fixture
    };
  });
});

describe('Smoke: Ordering products', () => {
  context('IN-736 CHECKOUT: Purchase as a logged in user', () => {
    it('logged in user should go through buying process and make an order', () => {
      const orderData = cy.fixtures.data;

      // act
      cy.visit('/');
      homePage.header.openLoginModal();
      homePage.loginModal.loginUser(orderData.logged.customer);

      // assert
      homePage.loginModal.loginForm.should('not.exist');

      // act
      homePage.header.chooseCategory(orderData.logged.product);

      // assert
      productListPage.assertProductListElements();

      // act
      productListPage.chooseProduct(orderData.logged.product);
      productDetailPage.addToCartButton.click();

      // assert
      productDetailPage.notificationToast.should('be.visible');
      productDetailPage.header.cartIconBadge
        .should('be.visible')
        .contains('1');

      // act
      productDetailPage.header.openCart();

      // assert
      productDetailPage.cart.assertCartElements(orderData.logged.product);

      // act
      productDetailPage.cart.goToCheckout(orderData.logged.customer.isRegistered);

      // assert
      shippingPage.assertShippingPageElements();
      shippingPage.assertCartPreviewElements(orderData.logged.product);

      // act
      shippingPage.chooseDeliveryMode(orderData.logged.customer.isRegistered);
      shippingPage.goToPayment();

      // assert
      orderData.logged.product.price += shippingPrice;
      shippingPage.assertCartPreviewElements(orderData.logged.product);

      // act
      paymentPage.cartPreview.should('be.visible');
      cy.wait(2000);
      paymentPage.makeAnOrderButton.click();

      // assert
      cy.getByTestId('thank-you-banner').should('be.visible');
    });
  });
});

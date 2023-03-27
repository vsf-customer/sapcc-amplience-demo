import HomePage from '../../support/pageObjects/homePage';
import ProductListPage from '../../support/pageObjects/productListPage';
import ProductDetailPage from '../../support/pageObjects/productDetailPage';
import ProvideEmailPage from '../../support/pageObjects/checkout/provideEmailPage';
import ShippingPage from '../../support/pageObjects/checkout/shippingPage';
import PaymentPage from '../../support/pageObjects/checkout/paymentPage';

// Arrange
const homePage = new HomePage();
const productListPage = new ProductListPage();
const productDetailPage = new ProductDetailPage();
const provideEmailPage = new ProvideEmailPage();
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
  context('IN-735 CHECKOUT: Purchase as a guest', () => {
    it('guest user should go through buying process and make an order', () => {
      const orderData = cy.fixtures.data;
      orderData.guest.customer.email = `user${Date.now()}@vuestorefront.com`;

      // act
      cy.visit('/');
      homePage.header.chooseCategory(orderData.guest.product);

      // assert
      productListPage.assertProductListElements();

      // act
      productListPage.chooseProduct(orderData.guest.product);
      productDetailPage.addToCartButton.click();

      // assert
      productDetailPage.notificationToast.should('be.visible');
      productDetailPage.header.cartIconBadge
        .should('be.visible')
        .contains('1');

      // act
      productDetailPage.header.openCart();

      // assert
      productDetailPage.cart.assertCartElements(orderData.guest.product);

      // act
      productDetailPage.cart.goToCheckout(orderData.guest.customer.isRegistered);

      // assert
      provideEmailPage.assertCartPreviewElements(orderData.guest.product);
      provideEmailPage.assertProvideEmailPage();

      // act
      provideEmailPage.fillEmailForm(orderData.guest.customer);
      provideEmailPage.goToShipping();

      // assert
      shippingPage.assertShippingPageElements();
      shippingPage.assertCartPreviewElements(orderData.guest.product);

      // act
      shippingPage.fillShippingForm(orderData.guest.customer);
      shippingPage.chooseDeliveryMode(orderData.guest.customer.isRegistered);
      shippingPage.goToPayment();

      // assert
      orderData.guest.product.price += shippingPrice;
      shippingPage.assertCartPreviewElements(orderData.guest.product);

      // act
      paymentPage.fillPaymentDetailsForm(orderData.guest.customer.card);
      paymentPage.makeAnOrderButton.click();

      // assert
      cy.getByTestId('thank-you-banner').should('be.visible');
    });
  });
});

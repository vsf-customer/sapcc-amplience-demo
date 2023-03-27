import { Customer } from '~/__tests__/e2e/types/types';
import CartPreview from './cartPreviewPage';

export default class ShippingPage extends CartPreview {
  get shippingHeader() {
    return cy.getByTestId('shipping-header');
  }

  get getTitle() {
    // due to the design of AddressForm.vue there is no way to add data-testid selector for this element
    return cy.get('#Title');
  }

  get getCountry() {
    // due to the design of AddressForm.vue there is no way to add data-testid selector for this element
    return cy.get('#Country');
  }

  get selectDeliveryModeButton() {
    // due to the design of AddressForm.vue there is no way to add data-testid selector for this element
    return cy.get('button').contains('Select delivery mode');
  }

  get shippingMethodHeader() {
    return cy.getByTestId('shipping-method-header');
  }

  get shippingMethods() {
    return cy.getByTestId('shipping-method-label');
  }

  get continueToPaymentButton() {
    // due to the design of AddressForm.vue there is no way to add data-testid selector for this element
    return cy.get('button').contains('Continue to payment');
  }

  fillShippingForm(data: Customer) {
    this.getTitle.select(data.title);
    cy.getByTestId('firstName').type(data.firstName);
    cy.getByTestId('lastName').type(data.lastName);
    cy.getByTestId('line1').type(data.address.shipping.streetName);
    cy.getByTestId('line2').type(data.address.shipping.apartment);
    cy.getByTestId('town').type(data.address.shipping.city);
    this.getCountry.select(data.address.shipping.country);
    cy.getByTestId('postalCode').type(data.address.shipping.zipcode);
    cy.getByTestId('phone').type(data.address.shipping.phone);
  }

  assertShippingPageElements() {
    this.shippingHeader.should('be.visible');
  }

  chooseDeliveryMode(loggedUser: boolean) {
    if (!loggedUser) {
      this.selectDeliveryModeButton.click();
    }
    this.shippingMethods.first().should('be.visible');
    this.shippingMethods.first().click();
  }

  goToPayment() {
    this.continueToPaymentButton.click().then(() => {
      cy.url().should('contain', 'checkout/payment');
      this.shippingMethodHeader.should('not.exist');
    });
  }
}

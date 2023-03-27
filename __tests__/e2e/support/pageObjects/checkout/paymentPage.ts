import { Card } from '~/__tests__/e2e/types/types';
import CartPreview from './cartPreviewPage';

export default class PaymentPage extends CartPreview {
  get cardTypes() {
    return cy.getByTestId('card-type');
  }

  get months() {
    return cy.getByTestId('card-expiration-month');
  }

  get years() {
    return cy.getByTestId('card-expiration-year');
  }

  get makeAnOrderButton() {
    return cy.getByTestId('make-an-order-button');
  }

  get paymentDetailsWrapper() {
    return cy.getByTestId('payment-details-wrapper');
  }

  fillPaymentDetailsForm(data: Card): void {
    this.cardTypes.eq(1).select(data.type);
    cy.getByTestId('card-holder-name').type(data.holder);
    cy.getByTestId('card-number').type(data.number);
    this.months.eq(1).select(data.expirationMonth);
    this.years.eq(1).select(data.expirationYear);
    cy.getByTestId('card-cvv').type(data.cvv);
  }
}

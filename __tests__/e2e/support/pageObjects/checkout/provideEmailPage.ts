import { Customer } from '~/__tests__/e2e/types/types';
import CartPreview from './cartPreviewPage';

export default class ProvideEmailPage extends CartPreview {
  get provideEmailHeader() {
    return cy.getByTestId('provide-email-heading');
  }

  get continueToShippingButton() {
    return cy.getByTestId('continue-to-shipping-button');
  }

  fillEmailForm(data: Customer) {
    cy.getByTestId('email-field').type(data.email);
    cy.getByTestId('confirm-email-field').type(data.email);
  }

  assertProvideEmailPage() {
    this.provideEmailHeader.should('be.visible');
    this.continueToShippingButton.should('be.visible');
  }

  goToShipping() {
    this.continueToShippingButton.click().then(() => {
      this.provideEmailHeader.should('not.exist');
      cy.url().should('contain', 'checkout/shipping');
    });
  }
}

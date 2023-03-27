import { Customer } from '../../../types/types';

export class RegisterModal {
  get registerForm() {
    return cy.getByTestId('register-form');
  }

  get titleSelect() {
    return cy.getByTestId('register-title');
  }

  get emailInput() {
    return cy.getByTestId('register-email-input');
  }

  get firstNameInput() {
    return cy.getByTestId('register-firstName-input');
  }

  get lastNameInput() {
    return cy.getByTestId('register-lastName-input');
  }

  get passwordInput() {
    return cy.getByTestId('register-password-input');
  }

  get confirmPasswordInput() {
    return cy.getByTestId('register-confirm-password-input');
  }

  get createAccountCheckbox() {
    return cy.getByTestId('create-account-checkbox');
  }

  get consentCheckbox() {
    return cy.getByTestId('consent-checkbox');
  }

  get createAnAccountButton() {
    // attribute data-testid doesn't work for this element
    return cy.get('button:contains("Create an account")');
  }

  registerUser(data: Customer) {
    this.registerForm.should('be.visible');
    this.titleSelect.eq(1).select(data.title);
    this.emailInput.clear().type(data.email);
    this.firstNameInput.clear().type(data.firstName);
    this.lastNameInput.clear().type(data.lastName);
    this.passwordInput.clear().type(data.password);
    this.confirmPasswordInput.clear().type(data.password);
    this.createAccountCheckbox.click();
    this.consentCheckbox.click();
    this.createAnAccountButton.click();
  }
}

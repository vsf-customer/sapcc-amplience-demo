import { Customer } from '~/__tests__/e2e/types/types';

export class LoginModal {
  get loginForm() {
    return cy.getByTestId('login-form');
  }

  get closeLoginModalButton() {
    return cy.getByTestId('close-button');
  }

  get emailInput() {
    // this data-tesid is already exisiting in the DOM
    return cy.getByTestId('email');
  }

  get passwordInput() {
    // this data-tesid is already exisiting in the DOM
    return cy.getByTestId('password');
  }

  get loginButton() {
    return cy.getByTestId('login-button');
  }

  get registerTodayButton() {
    return cy.getByTestId('register-today-button');
  }

  loginUser(data: Customer) {
    this.loginForm.should('be.visible');
    this.emailInput.type(data.email);
    this.passwordInput.type(data.password);
    this.loginButton.click();
  }

  goToRegisterForm() {
    this.loginForm.should('be.visible');
    this.registerTodayButton.click();
    this.loginForm.should('not.exist');
  }
}

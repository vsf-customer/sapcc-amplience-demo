import Page from './page';

export default class MyAccountPage extends Page {
  get path(): string {
    return '/my-account/my-profile';
  }

  get myAccountNavigation() {
    return cy.getByTestId('my-account-navigation');
  }

  get myProfileForm() {
    return cy.getByTestId('my-profile-form');
  }

  get titleUpdateSelect() {
    return cy.getByTestId('register-title');
  }

  get emailUpdateInput() {
    return cy.getByTestId('my-profile-email');
  }

  get firstNameUpdateInput() {
    return cy.getByTestId('register-firstName');
  }

  get lastNameUpdateInput() {
    return cy.getByTestId('register-lastName');
  }

  get updateMyProfileButton() {
    return cy.getByTestId('update-my-profile-button');
  }

  get logoutButton() {
    return cy.getByTestId('Log out');
  }

  get passwordChangeTab() {
    return cy.contains('Password change');
  }

  get currentPasswordInput() {
    return cy.get('input[name="oldPassword"]');
  }

  get newPasswordInput() {
    return cy.get('input[name="newPassword"]');
  }

  get confirmPasswordInput() {
    return cy.get('input[name="confirmPassword"]');
  }

  get myConsentsLink() {
    return cy.getByTestId('My Consents');
  }

  get myConsentCheckbox() {
    return cy.getByTestId('MARKETING_NEWSLETTER');
  }

  assertMyProfileElements(userData) {
    // assert the fields visibility
    this.myAccountNavigation.should('be.visible');
    this.myProfileForm.should('be.visible');
    this.titleUpdateSelect.should('be.visible');
    this.emailUpdateInput.should('be.visible');
    this.firstNameUpdateInput.should('be.visible');
    this.lastNameUpdateInput.should('be.visible');
    this.updateMyProfileButton.should('be.visible');

    // assert the fields content
    this.titleUpdateSelect.find(':selected').should('contain.text', userData.title);
    this.firstNameUpdateInput.should('have.value', userData.firstName);
    this.lastNameUpdateInput.should('have.value', userData.lastName);
  }

  updateMyProfileElements(userData) {
    this.titleUpdateSelect.find('select').select(userData.title);
    this.firstNameUpdateInput.clear().type(userData.firstName);
    this.lastNameUpdateInput.clear().type(userData.lastName);
    this.updateMyProfileButton.click();
    this.notifications.assertNotification('Your personal data has been updated!');
  }

  updatePassword(oldPassword: string, newPassword: string) {
    this.currentPasswordInput.type(oldPassword);
    this.newPasswordInput.type(newPassword);
    this.confirmPasswordInput.type(newPassword);
    cy.get('button').contains('Change Password').click();
    this.notifications.assertNotification('Your password has been updated!');
  }

  updateMarketingConsent(shouldBeChecked: boolean) {
    const checkbox = this.myConsentCheckbox;
    if (shouldBeChecked) {
      checkbox.find('input').check({force: true});
    } else {
      checkbox.find('input').uncheck({force: true});
    }
  }
}

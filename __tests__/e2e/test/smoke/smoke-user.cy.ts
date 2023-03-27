import HomePage from '../../../e2e/support/pageObjects/homePage';
import MyAccountPage from '../../../e2e/support/pageObjects/myAccountPage';

// Arrange
const homePage = new HomePage();
const myAccountPage = new MyAccountPage();

beforeEach(() => {
  cy.fixture('test-data/users').then((fixture) => {
    cy.fixtures = {
      data: fixture
    };
  });
  cy.visit('/');
});

describe('Smoke: User tests', () => {
  context('Authorization', () => {
    it('IN-763, IN-764: user should be logged in after using valid credentials and then logout successfully', () => {
      const data = cy.fixtures.data;

      // act
      homePage.header.openLoginModal();
      homePage.loginModal.loginUser(data.login);

      // assert
      homePage.loginModal.loginForm.should('not.exist');

      // act
      homePage.header.accountIcon.click();

      // assert
      cy.url().should('contain', 'my-account/my-profile');
      myAccountPage.assertMyProfileElements(cy.fixtures.data.sample);

      // act
      myAccountPage.logoutButton.click();

      // assert
      cy.getByTestId('notification-toast').should('be.visible');
      cy.url().should('contain', 'logout=true');
      homePage.header.openLoginModal();
    });

    it('IN-944: user should create a new account and be logged in successfully after that', () => {
      const data = cy.fixtures.data;
      data.sample.email = `user${Date.now()}@vuestorefront.com`;

      // act
      homePage.header.openLoginModal();
      homePage.loginModal.goToRegisterForm();
      homePage.registerModal.registerUser(data.sample);

      // assert
      homePage.registerModal.registerForm.should('not.exist');

      // act
      homePage.header.accountIcon.click();

      // assert
      cy.url().should('contain', 'my-account/my-profile');
      myAccountPage.assertMyProfileElements(cy.fixtures.data.sample);
    });

  });
  context('Profile data', () => {
    it('IN-2734: user should be able to update the personal data', () => {
      const registerData = cy.fixtures.data.sample;
      const updateData = cy.fixtures.data.update;
      registerData.email = `user${Date.now()}@vuestorefront.com`;

      // act - register new account
      homePage.header.openLoginModal();
      homePage.loginModal.goToRegisterForm();
      homePage.registerModal.registerUser(registerData);

      // assert - if the form is not visible
      homePage.registerModal.registerForm.should('not.exist');

      // act - open "My account view"
      homePage.header.accountIcon.click();

      // assert - if the correct page is displayed
      cy.url().should('contain', 'my-account/my-profile');

      // act - update profile data
      myAccountPage.updateMyProfileElements(updateData);

    });

    it('IN-2735: user should be able to update the password', () => {
      const userData = cy.fixtures.data;
      const newPassword = `NewPass!${Date.now()}`;

      userData.sample.email = `user${Date.now()}@vuestorefront.com`;
      userData.login.email = userData.sample.email;

      // act - register new account
      homePage.header.openLoginModal();
      homePage.loginModal.goToRegisterForm();
      homePage.registerModal.registerUser(userData.sample);

      // assert - if the form is not visible
      homePage.registerModal.registerForm.should('not.exist');

      // act - open "My account view"
      homePage.header.accountIcon.click();

      // assert - if the correct page is displayed
      cy.url().should('contain', 'my-account/my-profile');

      // act - switch tab to update password
      myAccountPage.passwordChangeTab.click();

      // assert - if the correct page is displayed
      cy.contains('Change Password').should('be.visible');

      // act - change password and logout user
      myAccountPage.updatePassword(userData.login.password, newPassword);
      myAccountPage.logoutButton.click();

      // update user's data with new pass
      userData.login.password = newPassword;

      // act
      homePage.header.openLoginModal();
      homePage.loginModal.loginUser(userData.login);

      // assert
      homePage.registerModal.registerForm.should('not.exist');

      // act - open "My account view"
      homePage.header.accountIcon.click();

      // assert - if the correct page is displayed
      cy.url().should('contain', 'my-account/my-profile');
    });

    it('IN-2736: user should be able to manage marketing consent', () => {
      const data = cy.fixtures.data;

      // act
      homePage.header.openLoginModal();
      homePage.loginModal.loginUser(data.login);

      // assert
      homePage.loginModal.loginForm.should('not.exist');

      // act
      homePage.header.accountIcon.click();

      // assert - if the correct page is displayed
      cy.url().should('contain', 'my-account/my-profile');

      // act
      myAccountPage.myConsentsLink.click();

      // assert
      cy.url().should('contain', 'my-account/my-consents');

      // act - disable marketing consent
      myAccountPage.updateMarketingConsent(false);

      // assert - verify if the consent is not set
      cy.reload();
      myAccountPage.myConsentCheckbox.should('not.have.class', 'is-active');

      // act - enable marketing consent
      myAccountPage.updateMarketingConsent(true);

      // assert - verify if the consent is set
      myAccountPage.myConsentCheckbox.should('have.class', 'is-active');
    });
  });
});

import { Product } from '~/__tests__/e2e/types/types';

export class Cart {
  get itemList() {
    return cy.getByTestId('sidebar-item-list');
  }

  get goToCheckoutButton() {
    return cy.getByTestId('go-to-checkout-button');
  }

  get totalItems() {
    return cy.getByTestId('total-items');
  }

  assertCartElements(data: Product) {
    this.itemList.should('be.visible');
    cy.getByTestId('product-title')
      .should('be.visible')
      .contains(data.name);

    // I can't use data-testid here
    cy.get('[class="sf-price__regular"]')
      .should('be.visible')
      .contains(data.currency + data.price);
    cy.getByTestId('product-image').should('be.visible');
  }

  goToCheckout(registeredUser: boolean) {
    this.goToCheckoutButton.click().then(() => {
      cy.url().should('contain', `${(registeredUser ? 'checkout/shipping' : 'checkout/email')}`);
      this.itemList.should('not.exist');
    });
  }
}

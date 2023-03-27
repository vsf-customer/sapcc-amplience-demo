import { Product } from '~/__tests__/e2e/types/types';

export default class CartPreview {
  get cartPreview() {
    return cy.getByTestId('cart-preview');
  }

  get totalItemsValue() {
    return cy.getByTestId('total-items-value');
  }

  get totalPriceValue() {
    return cy.getByTestId('total-price-value');
  }

  get promoCodeInput() {
    return cy.getByTestId('promoCode');
  }

  assertCartPreviewElements(data: Product) {
    this.cartPreview.should('be.visible');
    this.totalItemsValue
      .should('be.visible')
      .contains('1');
    this.totalPriceValue
      .should('be.visible')
      .contains(data.currency + data.price);
    this.promoCodeInput.should('be.visible');
  }
}

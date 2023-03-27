import { Product } from '../../types/types';
import Page from './page';

export default class ProductDetailPage extends Page {
  get path(): string {
    return '/p';
  }

  get addToCartButton() {
    return cy.getByTestId('add-to-cart-button');
  }

  get productTitle() {
    return cy.get('[class="product__header"]');
  }

  get productDescription() {
    return cy.getByTestId('product-description');
  }

  get productGallery() {
    return cy.getByTestId('product-gallery');
  }

  get productVariants() {
    return cy.getByTestId('product-variants');
  }

  get quantitySelector() {
    return cy.get('[data-testid^="quantitySelector"]');
  }

  get additonalInfoTabs() {
    return cy.getByTestId('additional-info-tabs');
  }

  get productPriceValue() {
    return cy.get('[class="product__price-and-rating"]');
  }

  get notificationToast() {
    return cy.getByTestId('notification-toast');
  }

  assertProductDetailPageElements(data: Product) {
    const variantVisibility = data.type === 'customized' ? 'be.visible' : 'not.be.visible';

    this.header.assertHeaderElements();
    this.productTitle
      .should('exist')
      .should('be.visible')
      .contains(data.name);
    this.productDescription
      .should('be.visible')
      .contains(data.description);
    this.productGallery.should('be.visible');
    this.productVariants.should(variantVisibility);
    this.productPriceValue
      .should('be.visible')
      .contains(data.currency + data.price);
    this.quantitySelector.should('be.visible');
    this.addToCartButton.should('be.visible');
    this.additonalInfoTabs.should('be.visible');
  }
}

import { Product } from '~/__tests__/e2e/types/types';

export class Header {
  get headerNavigation() {
    return cy.getByTestId('header-navigation');
  }

  get headerIcons() {
    return cy.getByTestId('icons').children();
  }

  get accountIcon() {
    return this.headerIcons.eq(0);
  }

  get wishlistIcon() {
    return this.headerIcons.eq(1);
  }

  get cartIcon() {
    return this.headerIcons.eq(2);
  }

  get headerCategories() {
    return cy.getByTestId('category');
  }

  get searchBar() {
    return cy.getByTestId('search-bar');
  }

  get cartIconBadge() {
    return cy.getByTestId('cart-badge');
  }

  chooseCategory(data: Product) {
    this.headerCategories.eq(data.category.number).should('be.visible').click().then(() => {
      cy.url().should('contain', `c/${data.category.name}`);
    });
  }

  openLoginModal() {
    // method doesn't work in headless mode without this timeout
    const DOMchangeTimeout = 500;
    this.headerNavigation.should('be.visible');
    const click = $el => cy.wrap($el).click().wait(DOMchangeTimeout);
    return this.accountIcon.pipe(click).should(() => {
      expect(Cypress.$('.sf-modal__content')).to.exist;
    });
  }

  openCart() {
    const click = $el => $el.click();
    return this.cartIcon.pipe(click).should(() => {
      expect(Cypress.$('[data-testid="sidebar-cart"]')).to.exist;
    });
  }

  assertHeaderElements() {
    this.headerNavigation.should('be.visible');
    this.searchBar.should('be.visible');
    this.accountIcon.should('be.visible');
    this.wishlistIcon.should('be.visible');
    this.cartIcon.should('be.visible');
  }
}

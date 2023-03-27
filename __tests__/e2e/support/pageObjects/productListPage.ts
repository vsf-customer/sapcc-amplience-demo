import { Product } from '../../types/types';
import Page from './page';

export default class ProductListPage extends Page {
  get path(): string {
    return '/c';
  }

  get products() {
    return cy.getByTestId('category-product-card');
  }

  get categoryList() {
    return cy.getByTestId('category-list');
  }

  get categoryHeader() {
    return cy.getByTestId('category-header');
  }

  get productsGrid() {
    return cy.getByTestId('products-grid');
  }

  get productsList() {
    return cy.getByTestId('products-list');
  }

  get filtersButton() {
    return cy.getByTestId('filters-button');
  }

  get gridViewIcon() {
    return cy.getByTestId('grid-view-icon');
  }

  get listViewIcon() {
    return cy.getByTestId('list-view-icon');
  }

  get productsFoundAmount() {
    return cy.getByTestId('results-amount');
  }

  get showOnPageSelect() {
    return cy.getByTestId('items-per-page-select').find('select');
  }

  get sortBySelect() {
    return cy.getByTestId('sorting-select').find('select');
  }

  get collectionsAccordion() {
    return cy.getByTestId('accordion-item-Collections').parent();
  }

  get categoriesAccordion() {
    return cy.getByTestId('accordion-item-Categories').parent();
  }

  get brandsAccordion() {
    return cy.getByTestId('accordion-item-Brands').parent();
  }

  get salesAccordion() {
    return cy.getByTestId('accordion-item-Sales').parent();
  }

  chooseProduct(data: Product) {
    this.products.eq(data.number).click().then(() => {
      cy.url().should('contain', `p/${data.sku}/details`);
    });
  }

  assertProductListElements() {
    this.header.assertHeaderElements();
    this.categoryList.should('be.visible');
    this.categoryHeader.should('be.visible');
    this.productsGrid.should('be.visible');
  }
}

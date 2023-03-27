import { Product } from '~/__tests__/e2e/types/types';

export class SearchModal {
  get searchModal() {
    return cy.getByTestId('search-modal');
  }

  get searchNoResultsImage() {
    return cy.getByTestId('search-no-results-image');
  }

  get searchNoResultsFirstParagraph() {
    return cy.getByTestId('search-no-result-first-paragraph');
  }

  get searchNoResultsSecondParagraph() {
    return cy.getByTestId('search-no-result-second-paragraph');
  }

  get searchBar() {
    return cy.getByTestId('search-bar');
  }

  get searchResultsSuggestions() {
    return cy.getByTestId('search-results-suggestions');
  }

  get searchResultsList() {
    return cy.getByTestId('search-products-list');
  }

  get searchResultsProductImage() {
    return cy.getByTestId('image-wrapper');
  }

  get searchResultsProductName() {
    return cy.getByTestId('product-link');
  }

  get searchResultsProductPrice() {
    // I can't use data-testid here
    return cy.get('[class="sf-price__regular"]');
  }

  assertSearchModalWithoutResults() {
    this.searchNoResultsImage.should('be.visible');
    this.searchNoResultsFirstParagraph
      .should('be.visible')
      .contains('You haven’t searched for items yet.');
    this.searchNoResultsSecondParagraph
      .should('be.visible')
      .contains('Let’s start now – we’ll help you.');
  }

  searchProduct(searchQuery: string) {
    this.searchBar.clear().type(searchQuery);
  }

  assertSearchResults(productData: Product) {
    this.searchResultsSuggestions.should('be.visible');
    this.searchResultsList.should('be.visible');
    this.searchResultsProductImage.should('be.visible');
    this.searchResultsProductName
      .should('be.visible')
      .contains(productData.name);
    this.searchResultsProductPrice
      .should('be.visible')
      .contains(productData.currency + productData.price);
  }
}

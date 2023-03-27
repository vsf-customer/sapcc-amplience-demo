import HomePage from '../../support/pageObjects/homePage';
import ProductListPage from '../../support/pageObjects/productListPage';

const homePage = new HomePage();
const productListPage = new ProductListPage();

let category;
beforeEach(() => {
  cy.fixture('test-data/categories').then((fixture) => {
    category = fixture;
  });

  cy.fixture('test-data/place-order').then((fixture) => {
    // act - visit home page
    cy.visit('/');

    // act - chose category
    homePage.header.chooseCategory(fixture.guest.product);

    // assert - default view should be set as grid view
    productListPage.productsGrid.should('be.visible');
  });
});

describe('Smoke: Product List', () => {
  context('Displaying products and categories', () => {
    it('IN-2742: user should be able to see the products as list and gird', () => {
      // act - switch view to list
      productListPage.listViewIcon.click();

      // assert - list view should be displayed
      productListPage.productsList.should('be.visible');
    });

    it('IN-2762: user should be able to change the number of displayed items per page', () => {
      // assert - verify the default value of products per page
      productListPage.showOnPageSelect.find(':selected').contains(20);
      productListPage.products.should('have.length', 20);

      // act - change page size to 10
      productListPage.showOnPageSelect.select('10');

      // assert - verify if the 10 elements is presented
      productListPage.showOnPageSelect.find(':selected').contains(10);
      productListPage.products.should('have.length', 10);

      // act - change page size to 50
      productListPage.showOnPageSelect.select('50');

      // assert - verify if the 50 elements is presented
      productListPage.showOnPageSelect.find(':selected').contains(50);
      productListPage.products.should('have.length', 50);
    });

    it('IN-2745: user should be able to change see the amount of the products listed', () => {
      // act - open predefined category
      cy.contains(category.categoryName).click();

      // assert - verify the amount of displayed products with counter
      productListPage.products.should('have.length', category.amount);
    });

    it('IN-2746: user should be able to change see the list of the categories available', () => {
      // assert - verify if default view is collections view
      productListPage.collectionsAccordion.should('be.visible');

      // assert - verify it's content size
      productListPage.collectionsAccordion.find('li').should('have.length.at.least', 1);

      // act - switch to categories view
      productListPage.categoriesAccordion.should('be.visible').click();

      // assert - verify it's content size
      productListPage.categoriesAccordion.find('li').should('have.length.at.least', 1);

      // act - switch to brands view
      productListPage.brandsAccordion.should('be.visible').click();

      // assert - verify it's content size
      productListPage.brandsAccordion.find('li').should('have.length.at.least', 1);

      // act - switch to sales view
      productListPage.salesAccordion.should('be.visible').click();

      // assert - verify it's content size'
      productListPage.salesAccordion.find('li').should('have.length.at.least', 1);
    });
  });

  context('Sorting products', () => {
    it('IN-2744: user should be able to sort products by price (desc and asc)', () => {
      // act - intercept sort request and select sorting
      cy.intercept('POST', '**/searchProduct').as('searchProductAsc');
      productListPage.sortBySelect.select('Price (lowest first)');
      cy.wait('@searchProductAsc');

      // assert - verify the sorting results - ascending
      cy.get('.sf-price__regular')
        .then(($prices) =>
          // map displayed prices
          Cypress._.map($prices, (el) => el.innerText)
        )

        // check if the prices are mapped correctly
        .should('be.an', 'array')

        // sanitize the values
        .then((list) => list.map((str) => str.replace(/[^0-9.]/g, '')))

        // map prices to float values
        .then((list) => list.map(parseFloat))
        .then((list) => {
          // sort list ascending
          const sorted = Cypress._.sortBy(list);

          // assert - verify if the prices are shown in ascending order
          expect(sorted).to.deep.equal(list);
        });

      // act - intercept sort request and select sorting
      cy.intercept('POST', '**/searchProduct').as('searchProductDesc');
      productListPage.sortBySelect.select('Price (highest first)');
      cy.wait('@searchProductDesc');

      // assert - verify the sorting results - descending
      cy.get('.sf-price__regular')
        .then(($prices) =>
          // map displayed prices
          Cypress._.map($prices, (el) => el.innerText)
        )

        // check if the prices are mapped correctly
        .should('be.an', 'array')

        // sanitize the values// map prices to float values
        .then((list) => list.map((str) => str.replace(/[^0-9.]/g, '')))

        // sanitize the values// map prices to float values
        .then((list) => list.map(parseFloat))
        .then((list) => {

          // sort list descending
          const sorted = Cypress._.slice(list);

          // assert - verify if the prices are shown in ascending order
          expect(sorted).to.deep.equal(list);
        });
    });
  });

  context('Product details and actions', () => {
    it('IN-2747: user should see the product information, IN-2748: Navigate to product page', () => {
      // assert each element has image, name and price
      productListPage.products.each((product) => {
        cy.wrap(product).as('product');

        // assert - verify if the elemets are visible
        cy.get('@product').find('[data-testid="image-wrapper"]').should('be.visible');
        cy.get('@product').find('[data-testid="product-link"]').should('be.visible');
        cy.get('@product').find('.sf-price__regular').should('be.visible');
      });

      // verify the first product
      productListPage.products.first().then((product) => {
        let name;
        let price;
        cy.wrap(product).as('product');

        // store the first product name
        cy.get('@product').find('[data-testid="product-link"]').then((productLink) => {
          name = productLink.text().trim().replace(/\\n/g, ' ');
        }).then(() => {
          // store the first product price
          cy.get('@product').find('.sf-price__regular').then((productPrice) => {
            price = productPrice.text().trim().replace(/\\n/g, ' ');
          }).then(() => {
            // act - open first product details page
            cy.get('@product').click();

            // assert - verify if the product name is displayed
            cy.getByTestId('product-header').then((headerValue) => {
              const headerText = headerValue.text().trim().replace(/\\n/g, ' ');
              expect(headerText).to.equal(name);
            });

            // assert - verify if the product price is displayed
            cy.get('.sf-price__regular').then((priceValue) => {
              const priceText = priceValue.text().trim().replace(/\\n/g, '');
              expect(priceText).to.equal(price);
            });
          });
        });
      });
    });

    it('IN-2749: user should be able to add product to basket', () => {
      // act - add first product to basket
      productListPage.products.first()
        .trigger('mouseover')
        .find('[data-testid="product-add-icon"]')
        .click();

      // assert - verify the notification is displayed
      cy.contains('Product has been added to cart!').should('be.visible');

      // act - open the cart
      homePage.header.cartIconBadge.click();

      // assert - verify if the cart is displayed and contains one item
      homePage.cart.totalItems.find('.sf-property__value').should('contain.text', '1');
      homePage.cart.itemList.should('be.visible');
    });
  });
});

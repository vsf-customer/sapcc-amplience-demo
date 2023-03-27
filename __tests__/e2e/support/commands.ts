/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable {
    getByTestId(id: string): Chainable<JQuery<HTMLElement>>;

    assertPath(path: string)
  }
}

Cypress.Commands.add('getByTestId', (testid: string) =>
  cy.get(`[data-testid="${testid}"]`)
);

Cypress.Commands.add('assertPath', (path: string) =>
  cy.url().should('contain', path)
);

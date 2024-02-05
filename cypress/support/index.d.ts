/// <reference types="cypress" />

// tslint:disable-next-line:no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Wait for element without failing test
     * @example
     * cy.waitUntil()
     */
    waitUntil(fn, options): Chainable<any>;

    /**
     * Get one or more DOM elements by selector, xpath or alias
     * @example
     * cy.cget('xpath or others')
     */
    cget(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<any>;

    /**
     * Visit to different url from current visit
     */
    forceVisit(url: string): Chainable<any>;

    crequest(options): Chainable<any>;

    cqueue(): Chainable<any>;

    printLog(message): void;
  }
}

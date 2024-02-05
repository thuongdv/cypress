/// <reference types="cypress" />

import Chainable = Cypress.Chainable;
import * as util from "util";
import StringHelper from "../helpers/string-helper";
import { ILocator } from "../helpers/ILocator";

export default abstract class BaseElement {
  protected locator: ILocator;

  public constructor(locator: ILocator | string) {
    if (typeof locator === "string") {
      this.locator = {
        selector: locator,
        gSelector: null,
        type: null,
        reload: null,
      };
    } else {
      this.locator = locator;
    }
  }

  public click(): void {
    this.scrollIntoView().click({ force: true });
  }

  public doubleClickWOScroll(): void {
    this.chain().dblclick({ force: true });
  }

  public waitForVisible(timeoutInMilliseconds: number): void {
    cy.waitUntil(
      () =>
        cy.cget(this.locator.selector).then(($ele) => {
          if ($ele === undefined) {
            return false;
          } else {
            return $ele.length > 0;
          }
        }),
      {
        timeout: timeoutInMilliseconds,
        description: `Wait for ${this.locator.selector} visible`,
      },
    );
  }

  public waitForInvisible(timeoutInMilliseconds: number): void {
    cy.waitUntil(
      () =>
        cy.cget(this.locator.selector).then(($ele) => {
          return $ele === undefined || $ele.length === 0;
        }),
      {
        timeout: timeoutInMilliseconds,
        description: `Wait for ${this.locator.selector} invisible`,
      },
    );
  }

  public getLocator(): ILocator {
    return this.locator;
  }

  public chain(): Chainable {
    return cy.cget(this.locator.selector);
  }

  public setDynamicValue(...values: any[]): this {
    this.locator.selector = util.format(this.locator.selector, ...values);
    return this;
  }

  public length(): Cypress.Chainable<any> {
    if (StringHelper.isXpath(this.locator.selector)) {
      return cy.window().then((win) => {
        const selector = this.locator.selector.replace(/"/g, "'");
        const nodesSnapshot = win.eval(
          `document.evaluate("${selector}", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)`,
        );
        return nodesSnapshot.snapshotLength;
      });
    }

    return cy.get("body").then((body) => {
      return body.find(this.locator.selector).length;
    });
  }

  public scrollIntoView(): Cypress.Chainable<any> {
    const viewportHeight = Cypress.config("viewportHeight");
    const top = viewportHeight / 2 - 50;
    // Scroll element under the top fix area
    return cy.cget(this.locator.selector).scrollIntoView({ offset: { top: -top, left: 0 } });
  }
}

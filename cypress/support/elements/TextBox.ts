/* tslint:disable:quotemark */
/// <reference types="cypress" />

import BaseElement from "./BaseElement";
import Chainable = Cypress.Chainable;

export default class TextBox extends BaseElement {
  public enter(text: string): Chainable {
    return this.scrollIntoView().clear({ force: true }).type(text, { force: true });
  }

  public enterWithDelay(text: string, delayInMs: number): Chainable {
    return this.scrollIntoView().clear({ force: true }).type(text, { force: true, delay: delayInMs });
  }
}

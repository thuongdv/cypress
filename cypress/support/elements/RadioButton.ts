/* tslint:disable:quotemark */
/// <reference types="cypress" />

import BaseElement from "./BaseElement";

export default class RadioButton extends BaseElement {
  public check(): void {
    const ele = this.locator.selector;
    cy.cget(ele).check({ force: true });
  }
}

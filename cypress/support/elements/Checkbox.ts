/* tslint:disable:quotemark */
/// <reference types="cypress" />

import BaseElement from "./BaseElement";

export default class Checkbox extends BaseElement {
  public check(): void {
    this.scrollIntoView().check({ force: true });
  }

  public checkWithValues(value: any): void {
    if (!value.includes("<>")) {
      const ele = this.locator.selector;
      const selectorDynamic = ele.replace(/\%s/g, value);
      // @ts-ignore
      cy.xpath(selectorDynamic).check({ force: true });
    } else {
      const valueArray = value.split("<>");
      for (const val of valueArray) {
        const ele = this.locator.selector;
        const selectorDynamic = ele.replace(/\%s/g, val);
        // @ts-ignore
        cy.xpath(selectorDynamic).check({ force: true });
      }
    }
  }

  public uncheck(): void {
    this.scrollIntoView().uncheck({ force: true });
  }

  public set(check: boolean): void {
    if (check) {
      this.check();
    } else {
      this.uncheck();
    }
  }
}

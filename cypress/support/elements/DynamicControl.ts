/// <reference types="cypress" />
import BaseElement from './BaseElement';
import * as util from 'util';

export default class DynamicControl extends BaseElement {

  public clickDynamicControl(value: string): void {
    const ele = this.locator.selector;
    const selectorDynamic = util.format(ele, value);
    // @ts-ignore
    cy.xpath(selectorDynamic).click({ force: true });
  }
}

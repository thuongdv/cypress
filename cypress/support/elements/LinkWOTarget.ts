/// <reference types="cypress" />

import BaseElement from './BaseElement';

export default class LinkWOTarget extends BaseElement {

  public click(): void {
    cy.cget(this.getLocator().selector)
      .invoke('removeAttr', 'target').click({force: true});
  }
}

/* tslint:disable:quotemark */
/// <reference types="cypress" />

import ComboBox from "./ComboBox";
import LoadingElement from "./LoadingElement";

export default class UnstableComboBox extends ComboBox {

  public select(text: string): void {
    LoadingElement.waitForSpinnerComplete();
    this.waitForVisible(Cypress.env('waitForControlTimeOut'));
    this.scrollIntoView().select(text, {force: true});
  }
}

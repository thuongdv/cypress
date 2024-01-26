/* tslint:disable:quotemark */
/// <reference types="cypress" />

import BaseElement from "./BaseElement";

export default class ComboBox extends BaseElement {
  public select(text: string): void {
    this.scrollIntoView().select(text, { force: true });
  }

  public selectByText(text: string): void {
    this.scrollIntoView()
      .children("option")
      .then((options) => {
        return [...options].filter((o) => o.text.trim() === text)[0];
      })
      .invoke("attr", "selected", "selected");
    this.chain().trigger("change", { force: true });
  }

  public selectByIndex(index: number): void {
    this.scrollIntoView().select(index, { force: true });
  }

  public getAllText(): Cypress.Chainable<number[]> {
    return this.chain()
      .children("option")
      .then((options) => {
        return [...options].filter((o) => o.text.trim() !== "Please select").map((o) => Number(o.text));
      });
  }
}

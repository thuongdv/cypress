import BaseElement from "./BaseElement";

export default class HtmlFile extends BaseElement {
  public selectFixtureFile(fileName: string): void {
    this.chain().selectFile(fileName);
  }
}

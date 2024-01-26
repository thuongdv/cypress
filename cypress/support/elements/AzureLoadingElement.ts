import LoadingElement from "./LoadingElement";

export default class AzureLoadingElement {
  /**
   * Wait for Loading complete
   */
  public static waitForLoadingComplete(): void {
    const locator = "div.simplemodal-container";
    LoadingElement.waitForElementInvisible(locator);
  }
}

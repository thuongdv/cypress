export default class LoadingElement {
  /**
   * Wait for Loading complete
   */
  public static waitForLoadingComplete(): void {
    const locator = "da-portal-processing-bar, da-portal-loading-progress";
    LoadingElement.waitForElementInvisible(locator);
  }

  public static waitForSpinnerComplete(): void {
    const locator = ".spinner-border, .da-loading-spinner:visible";
    LoadingElement.waitForElementInvisible(locator);
  }

  public static waitForWorkingComplete(): void {
    cy.waitUntil(() => Cypress.$("div.working:visible").length === 0, {
      timeout: 5000,
      description: `Wait for div.working invisible`,
    });
  }

  public static waitForProgressComplete(): void {
    const locator = ".progress-bar:visible";
    LoadingElement.waitForElementInvisible(locator);
  }

  public static waitForElementInvisible(locator: string): void {
    cy.waitUntil(() => Cypress.$(locator).length > 0, {
      timeout: 3000,
      description: "Wait for loading visible",
    });

    cy.waitUntil(
      () => {
        if (Cypress.$(locator)[0] === undefined) {
          return true;
        }
        const viewportHeight = Cypress.config("viewportHeight");
        const top = viewportHeight / 2 - 50;
        Cypress.$(locator)[0].scrollTo({ left: 0, top: -top });
        return Cypress.$(locator).length === 0;
      },
      {
        timeout: Cypress.env("loadingTimeout"),
        description: "Wait for loading invisible",
      },
    );
  }
}

import BasePage from "./BasePage";
import Button from "../elements/Button";
import { JsonLocator } from "../helpers/json-locator";

export default class LoginPage extends BasePage {
  private readonly btnLogin: Button = new Button(JsonLocator.get(this.constructor.name, "Login"));
  public open(): void {
    cy.visit("/web/index.php/auth/login");
  }

  public login(data: any): void {
    this.fillDataForPage(this.constructor.name, data);
    this.btnLogin.click();
  }
}

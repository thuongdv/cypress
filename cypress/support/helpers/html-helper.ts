import { parse, HTMLElement } from "node-html-parser";

class HtmlHelper {
  private readonly htmlContent: string;

  constructor(htmlContent: string) {
    this.htmlContent = htmlContent;
  }

  public getCode(): string | null {
    try {
      const root: HTMLElement = parse(this.htmlContent);
      const codeElement: HTMLElement | null = root.querySelector(
        "#BodyPlaceholder_UserVerificationEmailBodySentence2",
      );

      if (!codeElement) {
        return null;
      }

      const codeText: string | undefined = codeElement.textContent;

      if (!codeText) {
        return null;
      }

      const matches = codeText.match(/Your code is: (\d+)/);

      return matches ? matches[1] : null;
    } catch (error) {
      console.error("Error parsing HTML: ", error);
      return null;
    }
  }
}

export default HtmlHelper;

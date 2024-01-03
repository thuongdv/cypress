import {parse} from 'node-html-parser';

class HtmlHelper {
  private readonly htmlContent: string;

  constructor(htmlContent: string) {
    this.htmlContent = htmlContent;
  }

  public getCode(): string {
    const root = parse(this.htmlContent);
    const codeText: string = root.querySelector('#BodyPlaceholder_UserVerificationEmailBodySentence2').textContent;
    const matches = codeText.match(/Your code is: (\d+)/);

    return matches[1];
  }
}

export default HtmlHelper;

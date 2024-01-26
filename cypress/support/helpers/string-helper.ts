export default class StringHelper {
  public static getNumberFromString(text: string): string {
    const regex = /(-?[\d,]+\.*\d+)/;
    const match = text.match(regex);
    if (match == null) {
      return text;
    }

    return match[1].replace(/,/g, "");
  }

  public static isPositiveNumeric(value): boolean {
    return /^\d+$/.test(value);
  }

  public static getFilterStatusText(text: string): string {
    const regex = /(.*)(\(\d+\))/;
    const match = text.match(regex);
    if (match == null) {
      return text;
    }

    return match[1].trim();
  }

  /**
   * Get random string
   * @return generateString('abcdefghi', 3), returns abc or cdi
   * @param characters
   * @param length
   */
  public static generateString(characters: string, length: number): string {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public static matchRegex(regExp: RegExp, str: string): boolean {
    return regExp.test(str);
  }

  public static sanitize(text: string): string {
    return text.replace(/\\n+/gm, "").replace(/\s{2,}/gm, " ");
  }

  public static capitalizeFirstLetter(text: string): string {
    return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  public static isXpath(locator: string): boolean {
    return locator.match(/^(\/\/)|^(\.\/)|^(\/)|^(\(\/).*/i) !== null;
  }
}

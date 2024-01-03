export default class BooleanHelper {
  /**
   * Return true or false
   * @param value e.g. 1 or true
   */
  public static getBoolean(value: string | boolean | number): boolean {
    const v = typeof value === 'string' ? value.toLowerCase() : value;
    switch (v) {
      case true:
      case 'true':
      case 1:
      case '1':
      case 'on':
      case 'yes':
        return true;
      default:
        return false;
    }
  }

  /**
   * Check whether a string is a Boolean type or not
   * @param value e.g. 'no' is Boolean, 'yes' is Boolean
   */
  public static isBoolean(value: string): boolean {
    return value.match(/^(true|false|yes|no)$/i) !== null;
  }
}

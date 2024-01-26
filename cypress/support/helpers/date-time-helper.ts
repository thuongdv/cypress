import { DateTime } from "luxon";

export class DateTimeHelper {
  public static readonly DEFAULT_DATE_FORMAT: string = "yyyy-MM-dd'T'HH:mm:ss";
  public static readonly COMMON_DATE_FORMAT: string = "yyyy-MM-dd";
  public static readonly DATE_FORMAT: string = "dd/MM/yyyy";

  /**
   * Get today datetime with format
   * @returns string e.g. 2022-10-06T00:00:00
   */
  public static getToday(): string {
    return DateTime.now().toFormat(this.DEFAULT_DATE_FORMAT);
  }

  /**
   * Get the date from today then adding number of days
   * @returns string e.g. 2022-10-06T00:00:00
   */
  public static getDatePlusDay(numberOfDays: number): string {
    return DateTime.now().plus({ days: numberOfDays }).toFormat(this.DEFAULT_DATE_FORMAT);
  }

  /**
   * Get the date from date then adding number of days
   * @returns string e.g. 2022-10-06T00:00:00
   */
  public static getPlusDayFromInputDate(fromDate: string, numberOfDays: number): string {
    return DateTime.fromFormat(fromDate, this.DEFAULT_DATE_FORMAT)
      .plus({ days: numberOfDays })
      .toFormat(this.DEFAULT_DATE_FORMAT);
  }

  /**
   * Get the date from today then adding number of days
   * @returns string with given format
   */
  public static getDatePlusDayWithFormat(numberOfDays: number, format: string): string {
    return DateTime.now().plus({ days: numberOfDays }).toFormat(format);
  }

  /**
   * Get the date with given format
   * @returns string with given format
   */
  public static getDateWithFormat(date: string, format: string): string {
    return DateTime.fromFormat(date, this.DEFAULT_DATE_FORMAT).toFormat(format);
  }

  /**
   * Get the date with given format
   * @returns string with given format
   */
  public static getDateFromFormatToFormat(date: string, fromFormat, toFormat: string): string {
    return DateTime.fromFormat(date, fromFormat).toFormat(toFormat);
  }

  /**
   * Get the date with given format
   * @returns string with given format
   */
  public static changeDateFormat(date: string, fromFormat: string, toFormat: string): string {
    return DateTime.fromFormat(date, fromFormat).toFormat(toFormat);
  }

  /**
   * Get the date from date and then adding number of years
   * @param fromDate string e.g. 2022-10-06T00:00:00
   * @param year number e.g. 1
   * @returns string e.g. 2023-10-06T00:00:00
   */
  public static getDatePlusYear(fromDate: string, year: number): string {
    return DateTime.fromFormat(fromDate, this.DEFAULT_DATE_FORMAT)
      .plus({ years: year })
      .toFormat(this.DEFAULT_DATE_FORMAT);
  }

  /**
   * Get the date from date and then adding number of years with given format
   * @param fromDate string
   * @param year number
   * @param format string
   * @returns string with given format
   */
  public static getDatePlusYearWithFormat(fromDate: string, year: number, format: string): string {
    return DateTime.fromFormat(fromDate, this.DEFAULT_DATE_FORMAT).plus({ years: year }).toFormat(format);
  }

  /**
   * Get the date then adding number of years
   * @param year number e.g. -10, today is 2022-05-31
   * @returns string e.g. 2012-05-31
   */
  public static getDateWithYear(year: number): string {
    return DateTime.now().plus({ years: year }).toFormat(this.COMMON_DATE_FORMAT);
  }

  /**
   * Is data valid by format
   * @param date as string
   * @param format as string
   */
  public static isDate(date: string, format: string): boolean {
    return DateTime.fromFormat(date, format).isValid;
  }

  /**
   * Generate back years from current year
   * If current date is grater than 1/10, adding next year
   * @param backYear e.g 50
   * @return if current year is 2022, returns [2022, 2021,.....]
   */
  public static generateBackYearFromCurrentYear(backYear: number): number[] {
    const currentDateTime: DateTime = DateTime.now();
    let currentYear = currentDateTime.year;
    const currentMonth = currentDateTime.month;
    if (currentMonth >= 10) {
      currentYear += 1;
      backYear += 1;
    }

    const arrYear = [];
    for (let i = 0; i <= backYear; i++) {
      arrYear.push(currentYear - i);
    }

    return arrYear;
  }

  /**
   * Get month and year by plus month
   * @param month e.g -1
   * @param format e.g. Mar 2023
   * @return e.g. current month is Api, returns Mar
   */
  public static getMonthPlus(month: number, format: string): string {
    return DateTime.now().plus({ months: month }).toFormat(format);
  }

  public static getYearPlus(year: number): string {
    return DateTime.now().plus({ years: year }).toFormat("yyyy");
  }

  public static getTodayDay(): number {
    return DateTime.now().day.valueOf();
  }

  public static getDatePlusDayFrom(fromDate: string, day: number): string {
    return DateTime.fromFormat(fromDate, this.DEFAULT_DATE_FORMAT)
      .plus({ days: day })
      .toFormat(this.DEFAULT_DATE_FORMAT);
  }
}

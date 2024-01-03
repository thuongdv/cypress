/* tslint:disable:prefer-const triple-equals typedef */
import {DateTimeHelper} from './date-time-helper';
import CacheStorageKey from './cache-storage-key';
import {CacheHelper} from './cache-helper';
import {faker} from '@faker-js/faker';
import {v4 as uuidv4} from 'uuid';
import * as util from "util";

export class CommonHelper {
  public static getUuid(): string {
    return uuidv4();
  }

  public static getRandomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * end) + start;
  }

  public static generateEmailAddress(): string {
    return 'auto-' + new Date().getTime() + '@test.com';
  }

  public static copyObject(object: any): any {
    return JSON.parse(JSON.stringify(object));
  }

  public static generateValue(value: any): any {
    let result;
    let newValue = value;
    let seekNumber = 0;
    let variableName;

    if (typeof newValue === 'string') {
      // Handle for e.g. <NEXT_30_DAY>, or <PREVIOUS_40_YEAR>
      const matchRex = newValue.match(/<.*_(-?\d+)_.*>/i);
      if (matchRex !== null) {
        newValue = newValue.replace(new RegExp(`_${matchRex[1]}_`, 'ig'), '_n_');
        seekNumber = Number(matchRex[1]);
      }

      const variableTypeRegex = /<([a-zA-Z_]*)(_\d+)?>/i;
      const matchVarTypeRex = newValue.match(variableTypeRegex);
      if (matchVarTypeRex !== null) {
        newValue = matchVarTypeRex[1];
      }

      const variableNameMatchRex = value.match(/<(.*)>/i);
      if (variableNameMatchRex !== null) {
        variableName = variableNameMatchRex[1];
      }
    }

    // Return value if already cached
    if (CacheHelper.getInstance().getItem(variableName) !== null) {
      return CacheHelper.getInstance().getItem(variableName);
    }

    switch (newValue) {
      case 'FIRSTNAME':
        result = CommonHelper.sanitizeXpathString(faker.name.firstName());
        break;
      case 'FULL_NAME':
        result = CommonHelper.sanitizeXpathString(faker.name.fullName());
        CacheHelper.getInstance().setItem(variableName, result);
        break;
      case 'PREFERRED_NAME':
        result = 'PN ' + CommonHelper.sanitizeXpathString(faker.name.fullName());
        CacheHelper.getInstance().setItem(variableName, result);
        break;
      case 'LASTNAME':
        result = CommonHelper.sanitizeXpathString(faker.name.lastName());
        break;
      case 'RANDOM_VEHICLE_NUMBER':
        result = 'TEST' + this.getRandomNumber(1000, 9999);
        break;
      case 'NRIC_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['nric'];
        break;
      case 'FULL_NAME_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['lastName'];
        break;
      case 'PREFERRED_NAME_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['preferredName'];
        break;
      case 'GENDER_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['gender'] === 1 ? 'Female' : 'Male';
        break;
      case 'MARITAL_STATUS_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['maritalStatus'] === 1 ? 'Single' : 'Married';
        break;
      case 'POSTAL_CODE_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['postalCode'];
        break;
      case 'BUILDING_NAME_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['buildingName'];
        break;
      case 'STREET_NAME_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['streetName'];
        break;
      case 'BLOCK_NUMBER_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['blockNumber'];
        break;
      case 'UNIT_NUMBER_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['unitNumber'];
        break;
      case 'EMAIL_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['email'];
        break;
      case 'PHONE_NUMBER_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['mobile'];
        break;
      case 'DATE_OF_BIRTH_FROM_API':
        result = CacheHelper.getInstance().getItem(CacheStorageKey.API_CONTACT)['dateOfBirth'];
        break;
      case 'UNIQUE_EMAIL':
        result = CommonHelper.generateEmailAddress();
        break;
      case 'NUMBER':
        result = CommonHelper.getRandomNumber(100000, 999999);
        break;
      case 'TODAY':
        result = DateTimeHelper.getDateWithFormat(DateTimeHelper.getToday(), DateTimeHelper.COMMON_DATE_FORMAT);
        break;
      case 'TOMORROW':
        result = DateTimeHelper.getDateWithFormat(DateTimeHelper.getDatePlusDay(1), DateTimeHelper.COMMON_DATE_FORMAT);
        break;
      case 'YESTERDAY':
        result = DateTimeHelper.getDateWithFormat(DateTimeHelper.getDatePlusDay(-1), DateTimeHelper.COMMON_DATE_FORMAT);
        break;
      case 'NEXT_n_DAY':
        result = DateTimeHelper.getDatePlusDayWithFormat(seekNumber, DateTimeHelper.COMMON_DATE_FORMAT);
        break;
      case 'IDIT_NEXT_n_DAY':
        result = DateTimeHelper.getDatePlusDayWithFormat(seekNumber, DateTimeHelper.DATE_FORMAT);
        break;
      case 'PREVIOUS_n_YEAR':
        result = DateTimeHelper.getDateWithFormat(DateTimeHelper.getDatePlusYear(DateTimeHelper.getDatePlusDay(-2), -seekNumber),
          DateTimeHelper.COMMON_DATE_FORMAT);
        break;
      case 'NEXT_PREVIOUS_n_YEAR':
        result = DateTimeHelper.getYearPlus(seekNumber);
        break;
      case 'NEXT_YEAR_FROM_TODAY':
        result = DateTimeHelper.getDateWithFormat(DateTimeHelper.getDatePlusYear(DateTimeHelper.getDatePlusDay(-1), 1),
          DateTimeHelper.COMMON_DATE_FORMAT);
        break;
      case 'NEXT_YEAR_FROM_TOMORROW':
        result = DateTimeHelper.getDateWithFormat(DateTimeHelper.getDatePlusYear(DateTimeHelper.getToday(), 1),
          DateTimeHelper.COMMON_DATE_FORMAT);
        break;
      case 'NEXT_YEAR_FROM_NEXT_n_DAY':
        result = DateTimeHelper.getDateWithFormat(DateTimeHelper.getDatePlusYear(DateTimeHelper.getDatePlusDay(seekNumber - 1), 1),
          DateTimeHelper.COMMON_DATE_FORMAT);
        break;
      case 'PHONE_NUMBER':
        result = this.generateSGPhoneNumber();
        CacheHelper.getInstance().setItem(variableName, result);
        break;
      case 'DOB_n_AGE':
        result = DateTimeHelper.getDateWithYear(-seekNumber);
        break;
      default:
        result = newValue;
    }

    return result;
  }

  public static generateSGPhoneNumber() {
    return faker.helpers.objectValue({one: faker.phone.number('8#######'), two: faker.phone.number('9#######')});
  }

  /**
   * Remove any character in the string that cause invalid xpath
   * @param text String e.g. IRENE O'REILLY
   * @return String IRENE OREILLY
   */
  public static sanitizeXpathString(text: string): string {
    // Remove '  character
    return text.replace(/'/gm, '');
  }

  public static generateJsonQueryConditions(filterBy: any[]): string {
    let conditions: string[] = [];
    filterBy.forEach(condition => {
      let newValue = condition['value'];
      // Handle for date field e.g. policyStartDate
      if (condition['field'].toLowerCase().includes('date')) {
        newValue = util.format('"%s"', CommonHelper.generateValue(condition['value']));
      }
      conditions.push(util.format("@.%s%s%s", condition['field'], condition['operation'], newValue));
    });
    return conditions.join(' && ');
  }
}

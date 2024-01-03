/* tslint:disable:prefer-const triple-equals typedef */

export class LocalStorageHelper {
  public static setDataToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public static getDataFromLocalStorage(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  public static removeDataFromLocalStorage(key: any): void {
    localStorage.removeItem(key);
  }

  public static deleteAllDataFromLocalStorage(): void {
    localStorage.clear();
  }

  public static setDataToExistingDataInLocalStorage(dataName: string, key: string, newValue: any) {
    let dataExistingInLocalStorage = LocalStorageHelper.getDataFromLocalStorage(dataName);
    if (dataExistingInLocalStorage === null) {
      return;
    }

    dataExistingInLocalStorage[key] = newValue;
    LocalStorageHelper.setDataToLocalStorage(dataName, dataExistingInLocalStorage);
  }
}

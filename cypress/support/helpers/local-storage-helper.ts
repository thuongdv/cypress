/* tslint:disable:prefer-const triple-equals typedef */

export class LocalStorageHelper {
  public static setDataToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public static setData<T>(key: string, data: string): void {
    localStorage.setItem(key, data);
  }

  public static getDataFromLocalStorage<T>(key: string): T | null {
    try {
      const storedData = localStorage.getItem(key);
  
      if (storedData) {
        return JSON.parse(storedData) as T;
      }
  
      return null;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage for key '${key}':`, error);
      return null;
    }
  }
  

  public static removeDataFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  public static deleteAllDataFromLocalStorage(): void {
    localStorage.clear();
  }
}

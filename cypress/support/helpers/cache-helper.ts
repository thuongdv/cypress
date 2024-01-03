/* tslint:disable:prefer-const triple-equals typedef */

class CacheObject {
  private obj = {};

  public set(key, value) {
    this.obj[key] = value;
  }

  public remove(key) {
    delete this.obj[key];
  }

  public get(key) {
    return this.obj[key];
  }
}

export class CacheHelper {
  private static instance: CacheHelper;
  private readonly cacheStorage: CacheObject;

  private constructor() {
    this.cacheStorage = new CacheObject();
  }

  public static getInstance(): CacheHelper {
    if (!CacheHelper.instance) {
      CacheHelper.instance = new CacheHelper();
    }

    return CacheHelper.instance;
  }

  public setItem(key: string, data: any): void {
    this.cacheStorage.set(key, data);
  }

  public getItem(key: string): any {
    if (this.cacheStorage.get(key) === undefined) {
      return null;
    } else {
      return this.cacheStorage.get(key);
    }
  }

  public removeItem(key: any): void {
    this.cacheStorage.remove(key);
  }

  public get(): any {
    return this.cacheStorage;
  }

  public removeAll(): void {
    Object.keys(this.cacheStorage).forEach(key => delete this.cacheStorage[key]);
  }
}

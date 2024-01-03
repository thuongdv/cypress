import jwt_decode from "jwt-decode";
import {CacheHelper} from "../helpers/cache-helper";
import CacheStorageKey from "../helpers/cache-storage-key";

export default class AccessTokenFromCache {

  public static tokenExist(): boolean {
    return CacheHelper.getInstance().getItem(CacheStorageKey.ACCESS_TOKEN_INFO) !== null;
  }

  public static isValid(email?: string): boolean {
    const tokenInfo = CacheHelper.getInstance().getItem(CacheStorageKey.ACCESS_TOKEN_INFO);
    let byEmail = true;
    if (email) {
      byEmail = tokenInfo['email'] === email;
    }

    // Get current time
    const currentTime = Date.now() / 1000;
    return byEmail && currentTime < tokenInfo.decodeToken.exp - 3 * 60; // buffer 3 minutes
  }

  public static create(token: string, email: string): void {
    const content = {};
    content['email'] = email;
    content['token'] = token;
    content['decodeToken'] = jwt_decode(token);
    // Get current time
    content['tokenCreated'] = Date.now() / 1000;
    CacheHelper.getInstance().setItem(CacheStorageKey.ACCESS_TOKEN_INFO, content);
  }

  public static getAccessToken(): string {
    return CacheHelper.getInstance().getItem(CacheStorageKey.ACCESS_TOKEN_INFO)['token'];
  }

  public static getTokenInfo(): any {
    return CacheHelper.getInstance().getItem(CacheStorageKey.ACCESS_TOKEN_INFO);
  }

  public static isTokenValidByTime(): boolean {
    // Get current time
    const currentTime = Date.now() / 1000;
    // Move timeout (10) to config
    return currentTime < CacheHelper.getInstance().getItem(CacheStorageKey.ACCESS_TOKEN_INFO)['tokenCreated'] + 10 * 60;
  }
}

import portalElements from '../locators/elements.json';
import {HtmlLocatorType, ILocator} from './ILocator';

export class JsonLocator {
  public static get(page: string, field: string): ILocator {
    try {
      const element = portalElements[page][field];
      return {
        selector: element.selector,
        gSelector: element.gSelector,
        type: HtmlLocatorType[element.type as keyof typeof HtmlLocatorType],
        reload: element.hasOwnProperty('reload')
      };
    } catch (e) {
      const moreInfo = `\nFailed to get locator: page "${page}", field "${field}"`;
      e.message += moreInfo;
      console.log(moreInfo);
      throw e;
    }
  }
}

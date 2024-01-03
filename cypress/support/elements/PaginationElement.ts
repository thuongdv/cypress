import Element from "./Element";
import {CacheHelper} from "../helpers/cache-helper";
import CacheStorageKey from "../helpers/cache-storage-key";
import Link from "./Link";

export default class PaginationElement {
  private readonly elePaginationText: Element = new Element('//div[contains(@class,"pagination")]/span');
  private readonly lnkPrevPage: Link = new Link('div.pagination a.prev-page');
  private readonly lnkNextPage: Link = new Link('div.pagination a.next-page');

  public verifyPaginationDisplays(): void {
    const elePagination: Element = new Element('//div[contains(@class,"pagination")]');
    elePagination.chain().should('be.visible');
  }

  public verifyPaginationText(text: string): void {
    this.elePaginationText.chain().then($ele => {
      expect($ele.text().trim()).to.eq(text);
    });
  }

  public getPaginationText(): void {
    this.elePaginationText.chain().then($ele => {
      CacheHelper.getInstance().setItem(CacheStorageKey.PAGINATION_TEXT, $ele.text().trim());
    });
  }

  public clickPrevPageIcon(): void {
    this.lnkPrevPage.click();
  }

  public verifyPreviousPageIconIsDisable(): void {
    new Element('div.pagination .prev-page-disabled').chain().should('be.visible');
    new Element('div.pagination a.next-page').chain().should('be.visible');
  }

  public clickNextPageIcon(): void {
    this.lnkNextPage.click();
  }

  public verifyNextPageIconIsDisable(): void {
    new Element('div.pagination a.prev-page-disabled').chain().should('be.visible');
    new Element('div.pagination a.prev-page').chain().should('be.visible');
  }
}

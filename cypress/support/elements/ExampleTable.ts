import * as util from 'util';
import Chainable = Cypress.Chainable;

export default class ExampleTable {
  private static readonly COLUMNS = {
    columnHeader: {name: 'Column Header', position: 1},
    columnHeader1: {name: 'Column Header 1', position: 2}
  };

  // Args: column index, cell value
  private readonly rowLocator: string = '//div[contains(@class,"policy-list-container")]/div[@class="data-container"]/div[contains(@class,"-row")][./*[%s and .="%s"]]';

  public getRowDataByColumnHeader(term: string): Chainable<any> {
    const rowLocator = util.format(this.rowLocator,
      ExampleTable.COLUMNS.columnHeader.position, term);

    // Get data
    const noTestRecords = [];
    cy.xpath(rowLocator).each((ele, index, $list) => {
      const customerRecord = {};
      Object.keys(ExampleTable.COLUMNS).forEach((column) => {
        customerRecord[ExampleTable.COLUMNS[column]['name']] = Cypress.$(ele).find(util.format(' > *:nth-child(%s)',
          ExampleTable.COLUMNS[column]['position'])).text().trim();
      });

      noTestRecords.push(customerRecord);
    });

    return cy.cqueue().then(() => {
      return noTestRecords;
    });
  }

  public clickTextInColumnHeader(text: any): void {
    const rowLocator = util.format(this.rowLocator,
      ExampleTable.COLUMNS.columnHeader.position, text);
    cy.xpath(rowLocator).first().within(() => {
      cy.get(util.format('a:nth-child(%s)', ExampleTable.COLUMNS.columnHeader.position)).click({force: true});
    });
  }

  public verifyTextOnCurrentPage(text: any): void {
    const rowLocator = util.format(this.rowLocator,
      ExampleTable.COLUMNS.columnHeader.position, text);
    cy.xpath(rowLocator).first().within(() => {
      cy.get(util.format('a:nth-child(%s)', ExampleTable.COLUMNS.columnHeader.position)).should("be.visible");
    });
  }
}

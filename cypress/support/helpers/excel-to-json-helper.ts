import { CellObject, WorkBook, WorkSheet } from "xlsx";
import path from "path";
import fs from "fs";
import XLSX from "xlsx";

/**
 * The JSON structure looks like:
 * {
 *   "001": {
 *     "PortalPage": {
 *       "CModel": "Infiniti_Q30 1.5",
 *     },
 *     "002": {
 *       "PortalPage": {
 *         "CModel": "Honda_CIVIC SIR 3M",
 *       }
 *     }
 *   }
 * }
 */
export default class ExcelToJsonHelper {
  constructor(excelFilePath, out) {
    this.excelFilePath = excelFilePath;
    this.outputFolder = out;

    if (!fs.existsSync(this.excelFilePath)) {
      throw new Error(`Converted Excel to JSON failed. The file "${this.excelFilePath}" does not exist`);
    }
    this.workbook = XLSX.readFile(this.excelFilePath);
  }
  private static readonly EXCLUDED_SHEETS = ["DataValidation"];
  private static readonly PAGE_ROW_INDEX = 0;
  private static readonly HEADER_ROW_INDEX = 1;
  private static readonly DATA_ROW_INDEX = 2;
  private static readonly TC_ID_INDEX = 0;

  private readonly excelFilePath: string;
  private readonly outputFolder: string;

  private workbook: WorkBook;
  private worksheet: WorkSheet;

  /**
   * Convert excel data to json with given structure
   */
  public excelToJson(): void {
    const sheetNames = this.workbook.SheetNames;
    sheetNames.forEach((sheet: string) => {
      if (ExcelToJsonHelper.EXCLUDED_SHEETS.includes(sheet)) {
        return;
      }
      const content = this.excelToJsonBySheet(sheet);
      fs.writeFileSync(path.resolve(this.outputFolder, `${sheet}.json`), content);
    });
  }

  /**
   * Get sheet's data as JSON string
   */
  private excelToJsonBySheet(sheet: string): any {
    this.worksheet = this.workbook.Sheets[sheet];
    const pagesWithRange: any = this.getPagesWithRange();
    const headers: Array<string> = this.getHeaders();
    const data: Array<any> = this.getData();

    const result: any = {};
    for (const item of data) {
      const pageData = {};
      for (const [name, value] of Object.entries(pagesWithRange)) {
        const kv = {};
        // @ts-ignore
        for (let columnIdx: any = value.startColumn; columnIdx <= value.endColumn; columnIdx++) {
          kv[headers[columnIdx]] = item[columnIdx];
        }
        pageData[name] = kv;
      }

      result[item[ExcelToJsonHelper.TC_ID_INDEX]] = pageData;
    }

    return JSON.stringify(result, null, 2);
  }

  /**
   * Get data only
   */
  private getData(): Array<any> {
    const range = XLSX.utils.decode_range(this.worksheet["!ref"]);
    const result = [];
    for (let rowNum = ExcelToJsonHelper.DATA_ROW_INDEX; rowNum <= range.e.r; rowNum++) {
      const row = [];
      for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
        const cell = this.worksheet[XLSX.utils.encode_cell({ r: rowNum, c: colNum })];
        if (typeof cell === "undefined") {
          row.push("");
        } else {
          row.push(cell.v);
        }
      }
      result.push(row);
    }

    return result;
  }

  /**
   * Get header data only
   */
  private getHeaders(): Array<string> {
    const headers = [];
    const range = XLSX.utils.decode_range(this.worksheet["!ref"]);
    for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
      const cell = this.worksheet[XLSX.utils.encode_cell({ r: ExcelToJsonHelper.HEADER_ROW_INDEX, c: colNum })];
      if (typeof cell === "undefined") {
        headers.push("");
      } else {
        headers.push(cell.v);
      }
    }

    return headers;
  }

  /**
   *
   * @return e.g.
   * {
   *     "APage": {
   *         "startColumn": 3,
   *         "endColumn": 113
   *     },
   *     "BPage": {
   *         "startColumn": 3,
   *         "endColumn": 113
   *     }
   * }
   */
  private getPagesWithRange(): any {
    const mergedCells = this.worksheet["!merges"];

    mergedCells.sort((a, b) => {
      if (a.s.c > b.s.c) {
        return 1;
      } else if (a.s.c < b.s.c) {
        return -1;
      } else {
        return 0;
      }
    });

    const pagesWithRange = {};

    mergedCells.forEach((obj) => {
      for (let column = obj.s.c; column <= obj.e.c; column++) {
        const cell: CellObject =
          this.worksheet[XLSX.utils.encode_cell({ r: ExcelToJsonHelper.PAGE_ROW_INDEX, c: column })];
        if (typeof cell === "undefined") {
          continue;
        }

        pagesWithRange[cell.v.toString()] = {
          startColumn: obj.s.c,
          endColumn: obj.e.c,
        };
      }
    });

    return pagesWithRange;
  }
}

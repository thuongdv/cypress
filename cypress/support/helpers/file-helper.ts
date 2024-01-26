import * as fs from "fs";
import * as path from "path";

export default class FileHelper {
  private static readonly CYPRESS_PATH = "../..";

  public static isFileExist(filePath): boolean {
    const absoluteFilePath = path.resolve(__dirname, FileHelper.CYPRESS_PATH, filePath);
    return fs.existsSync(absoluteFilePath);
  }
}

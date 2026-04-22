import * as fs from "fs";
import * as path from "path";

export class FileSystem {
  read(filePath: string): string {
    return fs.readFileSync(filePath, "utf8");
  }

  readAsync(filePath: string): Promise<string> {
    return fs.promises.readFile(filePath, "utf8");
  }

  write(filePath: string, data: string) {
    fs.writeFileSync(filePath, data, "utf8");
  }

  writeAsync(filePath: string, data: string): Promise<void> {
    return fs.promises.writeFile(filePath, data, "utf8");
  }

  exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  ensureDir(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  join(...parts: string[]): string {
    return path.join(...parts);
  }

  list(dirPath: string): string[] {
    return fs.readdirSync(dirPath);
  }

  listAsync(dirPath: string): Promise<string[]> {
    return fs.promises.readdir(dirPath);
  }
}


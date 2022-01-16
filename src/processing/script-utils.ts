import { createWriteStream, PathLike, promises as fs } from "fs";
import { dirname } from "path";
import axios from "axios";
import yauzl, { Entry } from "yauzl";
import * as prettier from "prettier";
import { inspect } from "util";

type DownloadFileOptions = {
  lazy?: boolean;
};

/**
 * A concise way to check if file exists.
 */
export async function fileExists(filePath: PathLike): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (error) {
    return false;
  }
}

/**
 * A concise way to check if directory exists.
 */
export async function dirExists(dirPath: PathLike): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}

/**
 * A concise way to ensure directory exists.
 */
export async function ensureDirectory(dirPath: PathLike): Promise<void> {
  if (await dirExists(dirPath)) {
    return;
  }
  await fs.mkdir(dirPath, { recursive: true });
}

/**
 * Download file to the given location.
 */
export async function downloadFile(
  url: string,
  destinationPath: string,
  options: DownloadFileOptions = {}
): Promise<boolean> {
  const { lazy = true } = options;
  if (lazy && (await fileExists(destinationPath))) {
    return false;
  }

  await ensureDirectory(dirname(destinationPath));
  const output = createWriteStream(destinationPath);

  try {
    const response = await axios.get(url, { responseType: "stream" });
    response.data.pipe(output);

    const downloadCompletion = new Promise<void>((resolve, reject) => {
      output.on("finish", resolve);
      output.on("error", reject);
    });

    await downloadCompletion;
    return true;
  } catch (error) {
    await fs.unlink(destinationPath);
    throw error;
  } finally {
    output.close();
  }
}

type UnzipFileOptions = {
  lazy?: boolean;
};

/**
 * Unzip local archive.
 */
export async function unzipFile(
  archivePath: string,
  entryName: string,
  destinationPath: string,
  options: UnzipFileOptions = {}
): Promise<boolean> {
  const { lazy = true } = options;
  if (lazy && (await fileExists(destinationPath))) {
    return false;
  }

  await ensureDirectory(dirname(destinationPath));
  const output = createWriteStream(destinationPath);

  // Promesify unzipping
  const unzipCompletion = new Promise<void>((resolve, reject) => {
    yauzl.open(
      archivePath,
      { lazyEntries: true, autoClose: false },
      (error, zipFile) => {
        if (error || zipFile == null) {
          return reject(error);
        }

        // With {lazyEntries: true} we should explicitly
        // call readEntry() for the next entry to be read.
        zipFile.readEntry();

        // Track entry presence
        let entryFound = false;

        // Handle entries
        zipFile.on("entry", (entry: Entry) => {
          if (entry.fileName === entryName) {
            entryFound = true;
            zipFile.openReadStream(entry, (err, readStream) => {
              if (error || readStream == null) {
                return reject(error);
              }
              readStream.on("end", () => {
                zipFile.close();
                resolve();
              });
              readStream.on("error", (error) => {
                zipFile.close();
                reject(error);
              });
              readStream.pipe(output);
            });
          } else {
            zipFile.readEntry();
          }
        });

        // Ensure entry is found
        zipFile.on("end", () => {
          zipFile.close();
          if (!entryFound) {
            reject(new Error(`Zip archive entry not found: ${entryName}`));
          }
        });
      }
    );
  });

  try {
    await unzipCompletion;
  } catch (error) {
    await fs.unlink(destinationPath);
    throw error;
  } finally {
    output.close();
  }

  return true;
}

/**
 * Convert value to TypeScript literal.
 */
export function toTypeScriptLiteral(value: unknown): string {
  return inspect(value, {
    depth: null,
    maxArrayLength: null,
    maxStringLength: null,
    showHidden: false,
    colors: false,
  });
}

/**
 * Write type-script module.
 */
export async function writeTypeScriptModule(
  filePath: string,
  content: string
): Promise<void> {
  const defaultOptions: prettier.Options = { parser: "babel" };
  const options = await prettier.resolveConfig(filePath);
  const prettyContent = prettier.format(content, {
    ...defaultOptions,
    ...options,
  });

  // Write content
  await fs.writeFile(filePath, prettyContent);
}

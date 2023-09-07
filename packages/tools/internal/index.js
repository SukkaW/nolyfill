'use strict';

// @ts-check
const fs = require('fs');
const fsPromises = fs.promises;

/**
 * @param {string} path
 */
const fileExists = (path) => fsPromises.access(path, fs.constants.F_OK).then(() => true, () => false);

/**
 * - If filePath doesn't exist, create new file with content, then return true.
 * - If filePath already exists, compare content with existing file, update the file when
 *   content changed and return true, otherwise return false.
 *
 * @param {string} filePath
 * @param {string} fileContent
 * @param {Set<string> | undefined} [existingFiles] - Set of existing files, if provided, will help speed up fileExists check.
 * @returns {Promise<boolean>}
 */
async function compareAndWriteFile(filePath, fileContent, existingFiles) {
  if ((existingFiles && existingFiles.has(filePath)) || await fileExists(filePath)) {
    const existingContent = await fsPromises.readFile(filePath, { encoding: 'utf8' });
    if (existingContent !== fileContent) {
      await fsPromises.writeFile(filePath, fileContent, { encoding: 'utf-8' });
      return true;
    }

    return false;
  }

  await fsPromises.writeFile(filePath, fileContent, { encoding: 'utf-8' });
  return true;
}

module.exports.fileExists = fileExists;
module.exports.compareAndWriteFile = compareAndWriteFile;

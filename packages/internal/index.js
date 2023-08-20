'use strict';

const fs = require('fs');
const fsPromises = fs.promises;

/**
 * @param {string} path
 */
const fileExists = (path) => fsPromises.access(path, fs.constants.F_OK).then(() => true, () => false);
/**
 * If filePath doesn't exist, create new file with content.
 * If filePath already exists, compare content with existing file, only update the file when content changes.
 *
 * @param {string} filePath
 * @param {string} fileContent
 */
async function compareAndWriteFile(filePath, fileContent) {
  if (await fileExists(filePath)) {
    const existingContent = await fsPromises.readFile(filePath, { encoding: 'utf8' });
    if (existingContent !== fileContent) {
      return fsPromises.writeFile(filePath, fileContent, { encoding: 'utf-8' });
    }
  } else {
    return fsPromises.writeFile(filePath, fileContent, { encoding: 'utf-8' });
  }
}

module.exports.fileExists = fileExists;
module.exports.compareAndWriteFile = compareAndWriteFile;

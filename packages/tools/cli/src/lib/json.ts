import fsp from 'node:fs/promises';
import detectIndent from 'detect-indent';

export async function readJSON<T>(filepath: string): Promise<T | null> {
  try {
    return JSON.parse(await fsp.readFile(filepath, 'utf-8')) as T;
  } catch {
    return null;
  }
}

/** Write JSON back with the indentation of the existing file */
export async function writeJSON(filepath: string, data: unknown) {
  let fileIndent = '  ';
  try {
    const original = await fsp.readFile(filepath, 'utf-8');
    const detected = detectIndent(original).indent;
    if (detected) fileIndent = detected;
  } catch {
    // new file
  }

  return fsp.writeFile(filepath, `${JSON.stringify(data, null, fileIndent)}\n`, 'utf-8');
}

import fsp from 'node:fs/promises';
import detectIndent from 'detect-indent';

export async function readJSON<T>(filepath: string): Promise<T | null> {
  try {
    return JSON.parse(await fsp.readFile(filepath, 'utf-8')) as T;
  } catch (error) {
    return null;
  }
}

export async function writeJSON(filepath: string, data: unknown) {
  const original = await fsp.readFile(filepath, 'utf-8');
  const fileIndent = detectIndent(original).indent || '  ';

  return fsp.writeFile(filepath, `${JSON.stringify(data, null, fileIndent)}\n`, 'utf-8');
}

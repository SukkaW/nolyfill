export function fileExists(path: string): Promise<boolean>;
export function compareAndWriteFile(filePath: string, fileContent: string): Promise<void>;

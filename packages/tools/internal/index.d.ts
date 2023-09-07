export function fileExists(path: string): Promise<boolean>;
export function compareAndWriteFile(filePath: string, fileContent: string, existingFiles?: Set<string> | undefined): Promise<boolean>;

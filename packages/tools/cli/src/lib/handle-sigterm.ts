import process from 'node:process';

export function handleSigTerm() {
  process.on('SIGINT', () => process.exit(0));
  process.on('SIGTERM', () => process.exit(0));
}

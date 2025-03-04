import process from 'node:process';

const onSigExit = () => process.exit(0);

export function handleSigTerm() {
  process.on('SIGINT', onSigExit);
  process.on('SIGTERM', onSigExit);
}

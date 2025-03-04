import picocolors from 'picocolors';
import process from 'node:process';

export default function handleError(error: Error, debug: boolean) {
  if (debug) {
    console.trace(error);
  } else {
    console.error(picocolors.red(error.message.replace('Error: ', '')));
  }

  // eslint-disable-next-line sukka/unicorn/no-process-exit -- CLI
  process.exit(1);
}

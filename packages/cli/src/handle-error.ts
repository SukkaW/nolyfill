import picocolors from 'picocolors';

export default function handleError(error: Error, debug: boolean) {
  if (!debug) {
    console.error(picocolors.red(error.message.replace('Error: ', '')));
  } else {
    console.trace(error);
  }

  process.exit(1);
}

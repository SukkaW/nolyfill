// eslint-disable-next-line n/no-extraneous-import -- config file
import { defineConfig } from 'bumpp';

export default defineConfig({
  // ...options
  all: true,
  commit: 'release: %s',
  tag: '%s'
});

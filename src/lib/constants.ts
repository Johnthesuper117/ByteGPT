// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../../package.json') as { version: string };
export const APP_VERSION = `v${pkg.version}`;
export const MAX_TEXTAREA_HEIGHT = 128;

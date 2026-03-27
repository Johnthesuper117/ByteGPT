const rawVersion = process.env.NEXT_PUBLIC_APP_VERSION;
export const APP_VERSION = rawVersion ? `v${rawVersion}` : 'v0.0.0';
export const MAX_TEXTAREA_HEIGHT = 128;

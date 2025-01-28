import NodeCache from 'node-cache';

declare global {
  var appCache: NodeCache; // Ensure global declaration
}

if (!global.appCache) {
  global.appCache = new NodeCache({
    stdTTL: 60 * 60 * 24,
    checkperiod: 60 * 60,
    maxKeys: 1000,
  });
}

export const cache = global.appCache;

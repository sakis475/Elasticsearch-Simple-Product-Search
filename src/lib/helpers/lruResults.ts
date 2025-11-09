// Simple LRU cache for 10 most frequent queries
const LRU_MAX = 10;
export const lruCache = new Map<string, any>();

export function getFromCache(key: string) {
  if (lruCache.has(key)) {
    const value = lruCache.get(key);
    // Move to end to mark as recently used
    lruCache.delete(key);
    lruCache.set(key, value);
    return value;
  }
  return undefined;
}

export function setToCache(key: string, value: any) {
  if (lruCache.has(key)) {
    lruCache.delete(key);
  } else if (lruCache.size >= LRU_MAX) {
    // Remove least recently used (first item)
    const firstKeyIter = lruCache.keys().next();
    if (!firstKeyIter.done) {
      lruCache.delete(firstKeyIter.value);
    }
  }
  lruCache.set(key, value);
}

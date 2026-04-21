const store = new Map();

export function setCache(key, value, ttlMs = 0) {
  const expiresAt = ttlMs > 0 ? Date.now() + ttlMs : null;
  store.set(key, { value, expiresAt });
  return true;
}

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;

  if (entry.expiresAt && Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value;
}

export function deleteCache(key) {
  return store.delete(key);
}

export function clearCache() {
  store.clear();
}

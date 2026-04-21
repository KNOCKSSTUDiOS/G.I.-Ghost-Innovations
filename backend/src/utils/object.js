export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function merge(target = {}, source = {}) {
  const out = { ...target };
  for (const key in source) {
    if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key])
    ) {
      out[key] = merge(out[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

export function isEmpty(obj = {}) {
  return Object.keys(obj).length === 0;
}

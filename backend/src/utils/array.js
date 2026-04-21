export function unique(arr = []) {
  return Array.from(new Set(arr));
}

export function chunk(arr = [], size = 2) {
  if (size <= 0) return [];
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function flatten(arr = []) {
  return arr.reduce((acc, val) => acc.concat(val), []);
}

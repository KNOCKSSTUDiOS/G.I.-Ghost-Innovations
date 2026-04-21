export function int(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function float(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

export function pick(arr = []) {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

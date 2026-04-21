export function isEmail(str = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

export function isUUID(str = "") {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export function isNumeric(str = "") {
  return /^[0-9]+$/.test(str);
}

export function minLength(str = "", len = 1) {
  return str.length >= len;
}

export function maxLength(str = "", len = 255) {
  return str.length <= len;
}


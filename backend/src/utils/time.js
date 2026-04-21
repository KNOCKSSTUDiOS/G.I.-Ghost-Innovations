export function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function seconds(n = 1) {
  return n * 1000;
}

export function minutes(n = 1) {
  return n * 60 * 1000;
}

export function hours(n = 1) {
  return n * 60 * 60 * 1000;
}

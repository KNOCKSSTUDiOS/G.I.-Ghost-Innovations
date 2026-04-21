export function now() {
  return new Date();
}

export function toISO(date = new Date()) {
  return date.toISOString();
}

export function addDays(date = new Date(), days = 1) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

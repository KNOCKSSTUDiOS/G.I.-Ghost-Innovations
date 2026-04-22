export function isDev(mode: string) {
  return mode === "dev";
}

export function isProd(mode: string) {
  return mode === "prod";
}

export function selectMode(env: string | undefined) {
  return env === "prod" ? "prod" : "dev";
}


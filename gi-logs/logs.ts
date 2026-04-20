// G.I. LOGS — Telemetry & Event Logging
// Centralized logging for all G.I. subsystems.

export function logGiEvent(type: string, data: unknown) {
  const timestamp = new Date().toISOString();

  console.log(
    `[G.I. LOG] ${timestamp} | ${type}: ${JSON.stringify(data, null, 2)}`
  );
}


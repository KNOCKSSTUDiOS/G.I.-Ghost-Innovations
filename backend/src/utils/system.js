import os from "os";

export function getSystemInfo() {
  return {
    platform: os.platform(),
    release: os.release(),
    cpus: os.cpus().length,
    memory: {
      total: os.totalmem(),
      free: os.freemem()
    },
    uptime: os.uptime()
  };
}

export function getUptime() {
  return os.uptime();
}

export function getCPUCount() {
  return os.cpus().length;
}


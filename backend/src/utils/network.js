import os from "os";

export function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "0.0.0.0";
}

export function getHostname() {
  return os.hostname();
}

export function getNetworkSummary() {
  return {
    hostname: getHostname(),
    ip: getLocalIP()
  };
}


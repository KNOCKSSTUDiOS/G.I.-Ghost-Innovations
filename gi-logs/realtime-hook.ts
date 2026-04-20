// Push log events into WebSocket broadcast

import { broadcastEvent } from "../gi-realtime/ws-server";
import { pushEvent } from "./recent";

export function logRealtime(event: any) {
  pushEvent(event);       // store in recent buffer
  broadcastEvent(event);  // broadcast to all dashboards
}


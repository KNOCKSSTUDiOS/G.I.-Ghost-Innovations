import { EventEmitter } from "events";

const emitter = new EventEmitter();

export function on(event, handler) {
  emitter.on(event, handler);
}

export function off(event, handler) {
  emitter.off(event, handler);
}

export function emit(event, payload = {}) {
  emitter.emit(event, payload);
}

export function once(event, handler) {
  emitter.once(event, handler);
}


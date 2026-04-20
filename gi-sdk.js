// G.I. SDK — JavaScript Client Wrapper
// Connects web/mobile apps to the G.I. backend.

export class GI {
  constructor(config) {
    this.endpoint = config.endpoint;
    this.engine_id = config.engine_id ?? "gi-web";
    this.device_id = config.device_id ?? this.#generateDeviceId();
    this.user_id = config.user_id ?? "anonymous";
    this.defaultContext = config.context ?? {};
  }

  // ---------- PRIVATE: Device ID ----------
  #generateDeviceId() {
    return "dev-" + Math.random().toString(36).substring(2, 12);
  }

  // ---------- INIT ----------
  init(options = {}) {
    if (options.user_id) this.user_id = options.user_id;
    if (options.context) this.defaultContext = options.context;
  }

  // ---------- SEND MESSAGE ----------
  async send(message, context = {}) {
    const body = {
      gi_version: "1.0.0",
      gi_client: {
        engine_id: this.engine_id,
        device_id: this.device_id,
        platform: typeof navigator !== "undefined" ? navigator.userAgent : "server"
      },
      gi_user: {
        user_id: this.user_id
      },
      gi_context: {
        ...this.defaultContext,
        ...context
      },
      gi_message: message
    };

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`G.I. SDK Error: ${res.status}`);
    }

    return await res.json();
  }
}


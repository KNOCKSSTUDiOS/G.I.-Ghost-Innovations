import { GIBootstrap } from "./engine-bootstrap";

export interface GIRuntimeOptions {
  config?: any;
  memory?: any;
  session?: any;
  auth?: any;
  upgrades?: any;
  logging?: any;
  webhooks?: any;
  engine?: any;
}

export class GI_Runtime {
  config: any;
  logs: any;
  memory: any;
  sessions: any;
  auth: any;
  upgrades: any;
  webhooks: any;
  hooks: any;
  engine: any;

  ready: boolean = false;

  constructor() {}

  async init(options: GIRuntimeOptions = {}) {
    const boot = await GIBootstrap(options);

    this.config = boot.config;
    this.logs = boot.logs;
    this.memory = boot.memory;
    this.sessions = boot.sessions;
    this.auth = boot.auth;
    this.upgrades = boot.upgrades;
    this.webhooks = boot.webhooks;
    this.hooks = boot.hooks;
    this.engine = boot.engine;

    this.ready = true;
    return this;
  }

  requireReady() {
    if (!this.ready) {
      throw new Error("GI Runtime not initialized");
    }
  }

  getEngine() {
    this.requireReady();
    return this.engine;
  }

  getHooks() {
    this.requireReady();
    return this.hooks;
  }

  getMemory() {
    this.requireReady();
    return this.memory;
  }

  getSessions() {
    this.requireReady();
    return this.sessions;
  }

  getAuth() {
    this.requireReady();
    return this.auth;
  }

  getUpgrades() {
    this.requireReady();
    return this.upgrades;
  }

  getLogs() {
    this.requireReady();
    return this.logs;
  }

  getConfig() {
    this.requireReady();
    return this.config;
  }
}

export async function createGIRuntime(options: GIRuntimeOptions = {}) {
  const rt = new GI_Runtime();
  await rt.init(options);
  return rt;
}


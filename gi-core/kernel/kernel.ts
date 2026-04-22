export class Kernel {
  private services: Map<string, any> = new Map();
  private started = false;

  register(name: string, service: any) {
    if (this.started) return;
    this.services.set(name, service);
  }

  get(name: string) {
    return this.services.get(name);
  }

  async boot() {
    if (this.started) return;
    this.started = true;

    for (const service of this.services.values()) {
      if (typeof service.boot === "function") {
        await service.boot();
      }
    }
  }
}


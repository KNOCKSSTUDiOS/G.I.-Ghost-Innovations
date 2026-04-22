export class EngineContext {
  req: any;
  res: any;
  state: Record<string, any>;

  constructor(req: any, res: any) {
    this.req = req;
    this.res = res;
    this.state = {};
  }

  set(key: string, value: any) {
    this.state[key] = value;
  }

  get(key: string) {
    return this.state[key];
  }

  all() {
    return { ...this.state };
  }
}


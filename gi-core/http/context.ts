import { HttpRequest } from "./request";
import { HttpResponse } from "./response";

export class HttpContext {
  req: HttpRequest;
  res: HttpResponse;
  state: Record<string, any>;

  constructor(req: HttpRequest, res: HttpResponse) {
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


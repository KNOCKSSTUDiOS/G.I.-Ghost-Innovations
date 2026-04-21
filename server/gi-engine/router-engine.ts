export type GIMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

export interface GIRouteContext {
  path: string;
  method: GIMethod;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  headers: Record<string, string>;
  body?: any;
  raw?: any;
}

export type GIRouteHandler = (ctx: GIRouteContext) => Promise<any> | any;

export interface GIRoute {
  id: string;
  method: GIMethod | "*";
  pattern: string;
  segments: string[];
  handler: GIRouteHandler;
}

export class GI_RouterEngine {
  private routes: GIRoute[] = [];

  add(method: GIMethod | "*", pattern: string, handler: GIRouteHandler): GIRoute {
    const id = `${method}:${pattern}`;
    const segments = pattern.split("/").filter(Boolean);
    const route: GIRoute = { id, method, pattern, segments, handler };
    this.routes.push(route);
    return route;
  }

  get(pattern: string, handler: GIRouteHandler) {
    return this.add("GET", pattern, handler);
  }

  post(pattern: string, handler: GIRouteHandler) {
    return this.add("POST", pattern, handler);
  }

  put(pattern: string, handler: GIRouteHandler) {
    return this.add("PUT", pattern, handler);
  }

  patch(pattern: string, handler: GIRouteHandler) {
    return this.add("PATCH", pattern, handler);
  }

  delete(pattern: string, handler: GIRouteHandler) {
    return this.add("DELETE", pattern, handler);
  }

  any(pattern: string, handler: GIRouteHandler) {
    return this.add("*", pattern, handler);
  }

  private matchPath(patternSegs: string[], pathSegs: string[]) {
    if (patternSegs.length !== pathSegs.length) return null;

    const params: Record<string, string> = {};
    for (let i = 0; i < patternSegs.length; i++) {
      const p = patternSegs[i];
      const s = pathSegs[i];

      if (p.startsWith(":")) {
        params[p.slice(1)] = decodeURIComponent(s);
      } else if (p !== s) {
        return null;
      }
    }

    return params;
  }

  resolve(method: GIMethod, path: string): { route: GIRoute; params: Record<string, string> } | null {
    const segs = path.split("/").filter(Boolean);

    for (const route of this.routes) {
      if (route.method !== "*" && route.method !== method) continue;
      const params = this.matchPath(route.segments, segs);
      if (!params) continue;
      return { route, params };
    }

    return null;
  }

  async dispatch(ctx: GIRouteContext): Promise<any> {
    const match = this.resolve(ctx.method, ctx.path);
    if (!match) {
      const err: any = new Error("Route not found");
      err.status = 404;
      throw err;
    }

    const fullCtx: GIRouteContext = {
      ...ctx,
      params: match.params
    };

    return await match.route.handler(fullCtx);
  }

  list() {
    return [...this.routes];
  }

  clear() {
    this.routes = [];
  }
}

export function createGIRouterEngine() {
  return new GI_RouterEngine();
}

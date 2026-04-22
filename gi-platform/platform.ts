import { Core } from "../gi-core/core";
import { Router } from "../gi-router/router";

export class Platform {
  core: Core;
  router: Router;

  constructor(core: Core, router: Router) {
    this.core = core;
    this.router = router;
    this.core.attachRouter(this.router);
  }

  register(method: string, path: string, handler: any) {
    this.router.register(method, path, handler);
  }

  start(port: number) {
    this.core.server.listen(port);
  }
}


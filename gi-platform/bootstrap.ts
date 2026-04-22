import { Core } from "../gi-core/core";
import { Router } from "../gi-router/router";
import { Platform } from "./platform";
import { PlatformConfig } from "./types";

export function bootstrap(config: PlatformConfig) {
  const core = new Core();
  const router = new Router();
  const platform = new Platform(core, router);

  platform.start(config.port);

  return platform;
}


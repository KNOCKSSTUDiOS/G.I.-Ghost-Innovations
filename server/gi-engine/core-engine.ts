import { createGIAuthEngine } from "./auth-engine";
import { createGISessionEngine } from "./session-engine";
import { createGIMemoryEngine } from "./memory-engine";
import { createGIErrorEngine } from "./error-engine";
import { createGICacheEngine } from "./cache-engine";
import { createGICachePersistEngine } from "./cache-persist-engine";
import { createGICryptoEngine } from "./crypto-engine";
import { createGIEventEngine } from "./event-engine";
import { createGITaskEngine } from "./task-engine";
import { createGIPipelineEngine } from "./pipeline-engine";
import { createGIStorageEngine } from "./storage-engine";
import { createGILoggerEngine, GI_ConsoleSink } from "./logger-engine";
import { createGIConfigEngine } from "./config-engine";
import { createGIUserEngine } from "./user-engine";
import { createGIPermissionsEngine } from "./permissions-engine";
import { createGIRolesEngine } from "./roles-engine";
import { createGIAccessEngine } from "./access-engine";

export interface GICoreEngine {
  auth: ReturnType<typeof createGIAuthEngine>;
  session: ReturnType<typeof createGISessionEngine>;
  memory: ReturnType<typeof createGIMemoryEngine>;
  error: ReturnType<typeof createGIErrorEngine>;
  cache: ReturnType<typeof createGICacheEngine>;
  cachePersist: ReturnType<typeof createGICachePersistEngine>;
  crypto: ReturnType<typeof createGICryptoEngine>;
  events: ReturnType<typeof createGIEventEngine>;
  tasks: ReturnType<typeof createGITaskEngine>;
  pipeline: ReturnType<typeof createGIPipelineEngine>;
  storage: ReturnType<typeof createGIStorageEngine>;
  logger: ReturnType<typeof createGILoggerEngine>;
  config: ReturnType<typeof createGIConfigEngine>;
  user: ReturnType<typeof createGIUserEngine>;
  permissions: ReturnType<typeof createGIPermissionsEngine>;
  roles: ReturnType<typeof createGIRolesEngine>;
  access: ReturnType<typeof createGIAccessEngine>;
}

export function createGICoreEngine(): GICoreEngine {
  const config = createGIConfigEngine();
  config.loadEnv(".env");

  const logger = createGILoggerEngine();
  logger.addSink(new GI_ConsoleSink());

  const error = createGIErrorEngine();
  error.on(err => logger.error("Engine error", err));

  const engine: GICoreEngine = {
    auth: createGIAuthEngine({
      secret: config.get("GI_AUTH_SECRET", "dev-secret"),
      tokenTTL: 1000 * 60 * 60
    }),
    session: createGISessionEngine(),
    memory: createGIMemoryEngine(),
    error,
    cache: createGICacheEngine(),
    cachePersist: createGICachePersistEngine(),
    crypto: createGICryptoEngine(),
    events: createGIEventEngine(),
    tasks: createGITaskEngine(),
    pipeline: createGIPipelineEngine(),
    storage: createGIStorageEngine(),
    logger,
    config,
    user: createGIUserEngine(),
    permissions: createGIPermissionsEngine(),
    roles: createGIRolesEngine(),
    access: createGIAccessEngine()
  };

  engine.tasks.start();

  return engine;
}

export interface RouteDefinition {
  method: string;
  path: string;
  handler: Function;
  middlewares?: Function[];
}


export interface Lifecycle {
  init?(): Promise<void> | void;
  boot?(): Promise<void> | void;
  shutdown?(): Promise<void> | void;
}

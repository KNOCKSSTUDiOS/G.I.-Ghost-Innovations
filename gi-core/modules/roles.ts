export class Roles {
  private list: Set<string>;

  constructor() {
    this.list = new Set();
  }

  add(role: string) {
    this.list.add(role);
  }

  remove(role: string) {
    this.list.delete(role);
  }

  has(role: string) {
    return this.list.has(role);
  }

  all() {
    return Array.from(this.list);
  }

  clear() {
    this.list.clear();
  }
}

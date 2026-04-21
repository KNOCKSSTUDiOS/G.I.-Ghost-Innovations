export interface UserRecord {
  id: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export class Users {
  private list: Map<string, UserRecord>;

  constructor() {
    this.list = new Map();
  }

  create(id: string, name: string) {
    const record: UserRecord = {
      id,
      name,
      roles: [],
      permissions: []
    };

    this.list.set(id, record);
    return record;
  }

  get(id: string) {
    return this.list.get(id) || null;
  }

  all() {
    return Array.from(this.list.values());
  }

  assignRole(id: string, role: string) {
    const user = this.list.get(id);
    if (!user) return;

    if (!user.roles.includes(role)) {
      user.roles.push(role);
    }
  }

  removeRole(id: string, role: string) {
    const user = this.list.get(id);
    if (!user) return;

    user.roles = user.roles.filter(r => r !== role);
  }

  assignPermission(id: string, permission: string) {
    const user = this.list.get(id);
    if (!user) return;

    if (!user.permissions.includes(permission)) {
      user.permissions.push(permission);
    }
  }

  removePermission(id: string, permission: string) {
    const user = this.list.get(id);
    if (!user) return;

    user.permissions = user.permissions.filter(p => p !== permission);
  }

  delete(id: string) {
    this.list.delete(id);
  }

  clear() {
    this.list.clear();
  }
}


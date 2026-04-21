import { GI } from "./index";

export interface GIRoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // permission IDs
  inherits: string[]; // role IDs
}

export interface GIUserRoles {
  [userId: string]: string[]; // array of role IDs
}

export class GI_RolesEngine {
  private engine = GI();
  private file = "roles.json";

  private roles: Record<string, GIRoleRecord> = {};
  private userRoles: GIUserRoles = {};

  constructor() {
    this.load();
  }

  // --------------------------------------
  // LOAD FROM STORAGE
  // --------------------------------------
  private load() {
    try {
      if (this.engine.storage.exists(this.file)) {
        const data = this.engine.storage.readJSON(this.file);
        this.roles = data.roles || {};
        this.userRoles = data.userRoles || {};
      }
    } catch {
      this.roles = {};
      this.userRoles = {};
    }
  }

  // --------------------------------------
  // SAVE TO STORAGE
  // --------------------------------------
  private save() {
    this.engine.storage.writeJSON(
      this.file,
      {
        roles: this.roles,
        userRoles: this.userRoles
      },
      true
    );
  }

  // --------------------------------------
  // CREATE ROLE
  // --------------------------------------
  createRole(
    name: string,
    description: string,
    permissions: string[] = [],
    inherits: string[] = []
  ) {
    const id = this.engine.crypto.uuid();

    const role: GIRoleRecord = {
      id,
      name,
      description,
      permissions,
      inherits
    };

    this.roles[id] = role;
    this.save();

    return role;
  }

  // --------------------------------------
  // DELETE ROLE
  // --------------------------------------
  deleteRole(roleId: string) {
    if (!this.roles[roleId]) return false;

    delete this.roles[roleId];

    // Remove from all users
    for (const uid of Object.keys(this.userRoles)) {
      this.userRoles[uid] = this.userRoles[uid].filter(r => r !== roleId);
    }

    this.save();
    return true;
  }

  // --------------------------------------
  // LIST ROLES
  // --------------------------------------
  listRoles() {
    return Object.values(this.roles);
  }

  // --------------------------------------
  // ASSIGN ROLE TO USER
  // --------------------------------------
  assignRole(userId: string, roleId: string) {
    if (!this.roles[roleId]) return false;

    if (!this.userRoles[userId]) {
      this.userRoles[userId] = [];
    }

    if (!this.userRoles[userId].includes(roleId)) {
      this.userRoles[userId].push(roleId);
    }

    this.save();
    return true;
  }

  // --------------------------------------
  // REMOVE ROLE FROM USER
  // --------------------------------------
  removeRole(userId: string, roleId: string) {
    if (!this.userRoles[userId]) return false;

    this.userRoles[userId] = this.userRoles[userId].filter(r => r !== roleId);

    this.save();
    return true;
  }

  // --------------------------------------
  // LIST USER ROLES
  // --------------------------------------
  listUserRoles(userId: string) {
    return this.userRoles[userId] || [];
  }

  // --------------------------------------
  // RESOLVE ROLE PERMISSIONS (WITH INHERITANCE)
  // --------------------------------------
  resolveRolePermissions(roleId: string, visited = new Set<string>()) {
    if (!this.roles[roleId]) return [];

    if (visited.has(roleId)) return [];
    visited.add(roleId);

    const role = this.roles[roleId];
    let perms = [...role.permissions];

    for (const parent of role.inherits) {
      perms = perms.concat(this.resolveRolePermissions(parent, visited));
    }

    return Array.from(new Set(perms));
  }

  // --------------------------------------
  // GET USER EFFECTIVE PERMISSIONS
  // --------------------------------------
  getUserPermissions(userId: string) {
    const directPerms = this.engine.permissions.listUserPermissions(userId);
    const roles = this.listUserRoles(userId);

    let rolePerms: string[] = [];

    for (const roleId of roles) {
      rolePerms = rolePerms.concat(this.resolveRolePermissions(roleId));
    }

    const all = Array.from(new Set([...directPerms, ...rolePerms]));
    return all;
  }

  // --------------------------------------
  // CHECK PERMISSION (ROLE + DIRECT)
  // --------------------------------------
  hasPermission(userId: string, permissionName: string) {
    const all = this.getUserPermissions(userId);

    for (const permId of all) {
      const perm = this.engine.permissions.listPermissions().find(p => p.id === permId);
      if (perm && perm.name === permissionName) return true;
    }

    return false;
  }
}

export function createGIRolesEngine() {
  return new GI_RolesEngine();
}


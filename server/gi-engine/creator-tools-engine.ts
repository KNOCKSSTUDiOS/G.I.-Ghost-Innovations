import { GI } from "./index";

export interface GICreatorProject {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  modules: string[]; // module IDs
  members: string[]; // user IDs
}

export interface GICreatorModule {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // creator-permission IDs
}

export interface GICreatorPermission {
  id: string;
  name: string;
  description: string;
}

export interface GICreatorRoles {
  [userId: string]: string[]; // creator-role IDs
}

export interface GICreatorRoleRecord {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // creator-permission IDs
}

export class GI_CreatorToolsEngine {
  private engine = GI();

  private fileProjects = "creator-projects.json";
  private fileModules = "creator-modules.json";
  private filePermissions = "creator-permissions.json";
  private fileRoles = "creator-roles.json";

  private projects: Record<string, GICreatorProject> = {};
  private modules: Record<string, GICreatorModule> = {};
  private permissions: Record<string, GICreatorPermission> = {};
  private roles: Record<string, GICreatorRoleRecord> = {};
  private userRoles: GICreatorRoles = {};

  constructor() {
    this.load();
  }

  // --------------------------------------
  // LOAD
  // --------------------------------------
  private load() {
    try {
      if (this.engine.storage.exists(this.fileProjects)) {
        this.projects = this.engine.storage.readJSON(this.fileProjects) || {};
      }
      if (this.engine.storage.exists(this.fileModules)) {
        this.modules = this.engine.storage.readJSON(this.fileModules) || {};
      }
      if (this.engine.storage.exists(this.filePermissions)) {
        this.permissions = this.engine.storage.readJSON(this.filePermissions) || {};
      }
      if (this.engine.storage.exists(this.fileRoles)) {
        const data = this.engine.storage.readJSON(this.fileRoles) || {};
        this.roles = data.roles || {};
        this.userRoles = data.userRoles || {};
      }
    } catch {
      this.projects = {};
      this.modules = {};
      this.permissions = {};
      this.roles = {};
      this.userRoles = {};
    }
  }

  // --------------------------------------
  // SAVE
  // --------------------------------------
  private save() {
    this.engine.storage.writeJSON(this.fileProjects, this.projects, true);
    this.engine.storage.writeJSON(this.fileModules, this.modules, true);
    this.engine.storage.writeJSON(this.filePermissions, this.permissions, true);
    this.engine.storage.writeJSON(
      this.fileRoles,
      { roles: this.roles, userRoles: this.userRoles },
      true
    );
  }

  // --------------------------------------
  // PROJECTS
  // --------------------------------------
  createProject(ownerId: string, name: string, description: string) {
    const id = this.engine.crypto.uuid();

    const project: GICreatorProject = {
      id,
      ownerId,
      name,
      description,
      modules: [],
      members: [ownerId]
    };

    this.projects[id] = project;
    this.save();
    return project;
  }

  listProjects() {
    return Object.values(this.projects);
  }

  addMember(projectId: string, userId: string) {
    const p = this.projects[projectId];
    if (!p) return false;

    if (!p.members.includes(userId)) {
      p.members.push(userId);
      this.save();
    }

    return true;
  }

  attachModule(projectId: string, moduleId: string) {
    const p = this.projects[projectId];
    if (!p) return false;

    if (!p.modules.includes(moduleId)) {
      p.modules.push(moduleId);
      this.save();
    }

    return true;
  }

  // --------------------------------------
  // MODULES
  // --------------------------------------
  createModule(name: string, description: string, permissions: string[] = []) {
    const id = this.engine.crypto.uuid();

    const mod: GICreatorModule = {
      id,
      name,
      description,
      permissions
    };

    this.modules[id] = mod;
    this.save();
    return mod;
  }

  listModules() {
    return Object.values(this.modules);
  }

  // --------------------------------------
  // CREATOR PERMISSIONS
  // --------------------------------------
  createPermission(name: string, description: string) {
    const id = this.engine.crypto.uuid();

    const perm: GICreatorPermission = {
      id,
      name,
      description
    };

    this.permissions[id] = perm;
    this.save();
    return perm;
  }

  listPermissions() {
    return Object.values(this.permissions);
  }

  // --------------------------------------
  // CREATOR ROLES
  // --------------------------------------
  createRole(name: string, description: string, permissions: string[] = []) {
    const id = this.engine.crypto.uuid();

    const role: GICreatorRoleRecord = {
      id,
      name,
      description,
      permissions
    };

    this.roles[id] = role;
    this.save();
    return role;
  }

  assignRole(userId: string, roleId: string) {
    if (!this.roles[roleId]) return false;

    if (!this.userRoles[userId]) {
      this.userRoles[userId] = [];
    }

    if (!this.userRoles[userId].includes(roleId)) {
      this.userRoles[userId].push(roleId);
      this.save();
    }

    return true;
  }

  listUserRoles(userId: string) {
    return this.userRoles[userId] || [];
  }

  // --------------------------------------
  // EFFECTIVE CREATOR PERMISSIONS
  // --------------------------------------
  getUserPermissions(userId: string) {
    const roles = this.listUserRoles(userId);
    let perms: string[] = [];

    for (const roleId of roles) {
      const r = this.roles[roleId];
      if (r) perms = perms.concat(r.permissions);
    }

    return Array.from(new Set(perms));
  }

  hasPermission(userId: string, permissionName: string) {
    const effective = this.getUserPermissions(userId);

    for (const permId of effective) {
      const perm = this.permissions[permId];
      if (perm && perm.name === permissionName) return true;
    }

    return false;
  }
}

export function createGICreatorToolsEngine() {
  return new GI_CreatorToolsEngine();
}

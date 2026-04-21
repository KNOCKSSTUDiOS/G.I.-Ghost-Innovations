import crypto from "crypto";

export interface GITreeNode<T = any> {
  id: string;
  parent: string | null;
  data: T;
  createdAt: number;
}

export class GI_TreeEngine {
  nodes: Map<string, GITreeNode>;

  constructor() {
    this.nodes = new Map();
  }

  createNode<T = any>(data: T, parent: string | null = null) {
    const node: GITreeNode<T> = {
      id: crypto.randomUUID(),
      parent,
      data,
      createdAt: Date.now()
    };

    this.nodes.set(node.id, node);
    return node;
  }

  removeNode(id: string) {
    const children = this.getChildren(id);
    for (const child of children) {
      this.removeNode(child.id);
    }
    this.nodes.delete(id);
  }

  getNode(id: string) {
    return this.nodes.get(id) || null;
  }

  getChildren(id: string) {
    return [...this.nodes.values()].filter(n => n.parent === id);
  }

  getParent(id: string) {
    const node = this.getNode(id);
    if (!node || !node.parent) return null;
    return this.getNode(node.parent);
  }

  getRootNodes() {
    return [...this.nodes.values()].filter(n => n.parent === null);
  }

  traverse(id: string, list: GITreeNode[] = []) {
    const node = this.getNode(id);
    if (!node) return list;

    list.push(node);

    const children = this.getChildren(id);
    for (const child of children) {
      this.traverse(child.id, list);
    }

    return list;
  }

  cloneSubtree(id: string, newParent: string | null = null) {
    const original = this.getNode(id);
    if (!original) return null;

    const clone = this.createNode(original.data, newParent);

    const children = this.getChildren(id);
    for (const child of children) {
      this.cloneSubtree(child.id, clone.id);
    }

    return clone;
  }

  moveNode(id: string, newParent: string | null) {
    const node = this.getNode(id);
    if (!node) return null;

    node.parent = newParent;
    this.nodes.set(id, node);
    return node;
  }

  toJSON() {
    return [...this.nodes.values()];
  }
}

export function createGITreeEngine() {
  return new GI_TreeEngine();
}


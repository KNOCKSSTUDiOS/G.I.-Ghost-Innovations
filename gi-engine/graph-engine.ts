import crypto from "crypto";

export interface GIGraphNode<T = any> {
  id: string;
  key: string;
  data: T;
  createdAt: number;
}

export interface GIGraphEdge {
  id: string;
  from: string;
  to: string;
  createdAt: number;
}

export class GI_GraphEngine {
  nodes: Map<string, GIGraphNode>;
  edges: Map<string, GIGraphEdge>;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode<T = any>(key: string, data: T) {
    const node: GIGraphNode<T> = {
      id: crypto.randomUUID(),
      key,
      data,
      createdAt: Date.now()
    };

    this.nodes.set(node.id, node);
    return node;
  }

  removeNode(id: string) {
    this.nodes.delete(id);
    for (const [eid, edge] of this.edges.entries()) {
      if (edge.from === id || edge.to === id) {
        this.edges.delete(eid);
      }
    }
  }

  addEdge(from: string, to: string) {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error("Invalid node reference");
    }

    const edge: GIGraphEdge = {
      id: crypto.randomUUID(),
      from,
      to,
      createdAt: Date.now()
    };

    this.edges.set(edge.id, edge);
    return edge;
  }

  removeEdge(id: string) {
    this.edges.delete(id);
  }

  getNode(id: string) {
    return this.nodes.get(id) || null;
  }

  getEdgesFrom(id: string) {
    return [...this.edges.values()].filter(e => e.from === id);
  }

  getEdgesTo(id: string) {
    return [...this.edges.values()].filter(e => e.to === id);
  }

  neighbors(id: string) {
    return this.getEdgesFrom(id).map(e => this.getNode(e.to));
  }

  traverse(startId: string, visited: Set<string> = new Set()) {
    if (!this.nodes.has(startId)) return [];

    const result: GIGraphNode[] = [];
    const stack = [startId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;

      visited.add(current);
      const node = this.getNode(current);
      if (node) result.push(node);

      const next = this.getEdgesFrom(current).map(e => e.to);
      stack.push(...next);
    }

    return result;
  }

  detectCycle() {
    const visited = new Set<string>();
    const stack = new Set<string>();

    const visit = (id: string): boolean => {
      if (stack.has(id)) return true;
      if (visited.has(id)) return false;

      visited.add(id);
      stack.add(id);

      for (const edge of this.getEdgesFrom(id)) {
        if (visit(edge.to)) return true;
      }

      stack.delete(id);
      return false;
    };

    for (const id of this.nodes.keys()) {
      if (visit(id)) return true;
    }

    return false;
  }

  toJSON() {
    return {
      nodes: [...this.nodes.values()],
      edges: [...this.edges.values()]
    };
  }
}

export function createGIGraphEngine() {
  return new GI_GraphEngine();
}


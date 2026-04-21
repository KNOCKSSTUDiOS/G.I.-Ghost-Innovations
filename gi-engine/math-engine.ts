import { GI_VectorEngine, createGIVectorEngine } from "./vector-engine";
import { GI_MatrixEngine, createGIMatrixEngine } from "./matrix-engine";

export class GI_MathEngine {
  vectors: GI_VectorEngine;
  matrices: GI_MatrixEngine;

  constructor() {
    this.vectors = createGIVectorEngine();
    this.matrices = createGIMatrixEngine();
  }

  // ---------- SCALAR OPS ----------
  clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }

  lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
  }

  roundTo(value: number, decimals: number) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  // ---------- STATISTICS ----------
  mean(values: number[]) {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  median(values: number[]) {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  variance(values: number[]) {
    if (values.length === 0) return 0;
    const m = this.mean(values);
    return this.mean(values.map(v => (v - m) ** 2));
  }

  stddev(values: number[]) {
    return Math.sqrt(this.variance(values));
  }

  min(values: number[]) {
    return Math.min(...values);
  }

  max(values: number[]) {
    return Math.max(...values);
  }

  // ---------- RANDOM ----------
  randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  randomInt(min: number, max: number) {
    return Math.floor(this.randomRange(min, max + 1));
  }

  choose<T>(arr: T[]) {
    if (arr.length === 0) return null;
    return arr[this.randomInt(0, arr.length - 1)];
  }

  shuffle<T>(arr: T[]) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  // ---------- VECTOR + MATRIX SHORTCUTS ----------
  vec(values: number[]) {
    return { values };
  }

  mat(rows: number, cols: number, fill: number = 0) {
    return this.matrices.create(rows, cols, fill);
  }

  identity(size: number) {
    return this.matrices.identity(size);
  }
}

export function createGIMathEngine() {
  return new GI_MathEngine();
}


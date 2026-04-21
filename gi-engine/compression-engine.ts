import zlib from "zlib";

export class GI_CompressionEngine {
  // ---------- GZIP ----------
  gzip(data: Buffer | string): Promise<Buffer> {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
    return new Promise((resolve, reject) => {
      zlib.gzip(buf, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  gunzip(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.gunzip(data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // ---------- DEFLATE ----------
  deflate(data: Buffer | string): Promise<Buffer> {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
    return new Promise((resolve, reject) => {
      zlib.deflate(buf, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  inflate(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.inflate(data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // ---------- BROTLI ----------
  brotliCompress(data: Buffer | string): Promise<Buffer> {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");
    return new Promise((resolve, reject) => {
      zlib.brotliCompress(buf, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  brotliDecompress(data: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.brotliDecompress(data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // ---------- GENERIC ----------
  async autoCompress(data: Buffer | string): Promise<{ algo: string; output: Buffer }> {
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data, "utf8");

    const gzip = await this.gzip(buf);
    const def = await this.deflate(buf);
    const bro = await this.brotliCompress(buf);

    const smallest = [gzip, def, bro].sort((a, b) => a.length - b.length)[0];

    if (smallest === gzip) return { algo: "gzip", output: gzip };
    if (smallest === def) return { algo: "deflate", output: def };
    return { algo: "brotli", output: bro };
  }
}

export function createGICompressionEngine() {
  return new GI_CompressionEngine();
}


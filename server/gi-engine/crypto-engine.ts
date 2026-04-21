import crypto from "crypto";

export interface GICryptoHashOptions {
  saltLength?: number;
  iterations?: number;
  keyLength?: number;
  digest?: string;
}

export interface GICryptoEncryptOptions {
  algorithm?: string;
}

export class GI_CryptoEngine {
  private defaultHashOptions: Required<GICryptoHashOptions>;
  private defaultEncryptAlgorithm: string;

  constructor() {
    this.defaultHashOptions = {
      saltLength: 16,
      iterations: 100000,
      keyLength: 64,
      digest: "sha512"
    };

    this.defaultEncryptAlgorithm = "aes-256-gcm";
  }

  // -----------------------------
  // RANDOM
  // -----------------------------
  randomBytes(size: number = 32): string {
    return crypto.randomBytes(size).toString("hex");
  }

  randomToken(size: number = 48): string {
    return crypto.randomBytes(size).toString("base64url");
  }

  // -----------------------------
  // HASHING
  // -----------------------------
  async hash(
    input: string,
    options: GICryptoHashOptions = {}
  ): Promise<{ hash: string; salt: string }> {
    const cfg = { ...this.defaultHashOptions, ...options };
    const salt = crypto.randomBytes(cfg.saltLength).toString("hex");

    const derived = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(
        input,
        salt,
        cfg.iterations,
        cfg.keyLength,
        cfg.digest,
        (err, key) => {
          if (err) reject(err);
          else resolve(key);
        }
      );
    });

    return {
      hash: derived.toString("hex"),
      salt
    };
  }

  async verify(
    input: string,
    hash: string,
    salt: string,
    options: GICryptoHashOptions = {}
  ): Promise<boolean> {
    const cfg = { ...this.defaultHashOptions, ...options };

    const derived = await new Promise<Buffer>((resolve, reject) => {
      crypto.pbkdf2(
        input,
        salt,
        cfg.iterations,
        cfg.keyLength,
        cfg.digest,
        (err, key) => {
          if (err) reject(err);
          else resolve(key);
        }
      );
    });

    return derived.toString("hex") === hash;
  }

  // -----------------------------
  // SYMMETRIC ENCRYPTION
  // -----------------------------
  encrypt(
    plaintext: string,
    secret: string,
    options: GICryptoEncryptOptions = {}
  ): { ciphertext: string; iv: string; tag: string } {
    const algorithm = options.algorithm ?? this.defaultEncryptAlgorithm;
    const iv = crypto.randomBytes(12);

    const key = crypto.createHash("sha256").update(secret).digest();
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return {
      ciphertext: encrypted.toString("base64url"),
      iv: iv.toString("base64url"),
      tag: tag.toString("base64url")
    };
  }

  decrypt(
    ciphertext: string,
    secret: string,
    iv: string,
    tag: string,
    options: GICryptoEncryptOptions = {}
  ): string {
    const algorithm = options.algorithm ?? this.defaultEncryptAlgorithm;

    const key = crypto.createHash("sha256").update(secret).digest();
    const ivBuf = Buffer.from(iv, "base64url");
    const tagBuf = Buffer.from(tag, "base64url");
    const cipherBuf = Buffer.from(ciphertext, "base64url");

    const decipher = crypto.createDecipheriv(algorithm, key, ivBuf);
    decipher.setAuthTag(tagBuf);

    const decrypted = Buffer.concat([decipher.update(cipherBuf), decipher.final()]);
    return decrypted.toString("utf8");
  }
}

export function createGICryptoEngine() {
  return new GI_CryptoEngine();
}


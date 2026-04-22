import { createHash, randomBytes } from "crypto";

export class CryptoCore {
  hash(input: string, algorithm: string = "sha256"): string {
    return createHash(algorithm).update(input).digest("hex");
  }

  randomId(bytes: number = 16): string {
    return randomBytes(bytes).toString("hex");
  }
}


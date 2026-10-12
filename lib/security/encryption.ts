import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Server-side only: never import this module into a Client Component.
const ALGORITHM = "aes-256-gcm" as const;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const AAD = Buffer.from("findseat:sensitive-data:v1", "utf8");

type Payload = {
  version: 1;
  algorithm: typeof ALGORITHM;
  iv: string;
  ciphertext: string;
  tag: string;
};

function assertKey(key: Buffer): void {
  if (!Buffer.isBuffer(key) || key.length !== 32) {
    throw new Error("Kunci AES-256 harus berupa Buffer tepat 32 byte.");
  }
}

export function getFindSeatEncryptionKey(): Buffer {
  const encoded = process.env.FINDSEAT_ENCRYPTION_KEY;
  if (!encoded) throw new Error("FINDSEAT_ENCRYPTION_KEY belum diatur.");
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32 || key.toString("base64") !== encoded) {
    throw new Error("FINDSEAT_ENCRYPTION_KEY harus berupa base64 dari tepat 32 byte.");
  }
  return key;
}

export function encryptSensitiveData(
  plaintext: string,
  key: Buffer = getFindSeatEncryptionKey(),
): string {
  assertKey(key);
  if (typeof plaintext !== "string") {
    throw new Error("Data yang akan dienkripsi harus berupa string.");
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(AAD);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const payload: Payload = {
    version: 1,
    algorithm: ALGORITHM,
    iv: iv.toString("base64url"),
    ciphertext: ciphertext.toString("base64url"),
    tag: cipher.getAuthTag().toString("base64url"),
  };
  return JSON.stringify(payload);
}

export function decryptSensitiveData(
  serialized: string,
  key: Buffer = getFindSeatEncryptionKey(),
): string {
  assertKey(key);

  let raw: unknown;
  try {
    raw = JSON.parse(serialized);
  } catch {
    throw new Error("Payload terenkripsi bukan JSON yang valid.");
  }
  if (!raw || typeof raw !== "object") throw new Error("Struktur payload tidak valid.");

  const p = raw as Record<string, unknown>;
  if (p.version !== 1 || p.algorithm !== ALGORITHM ||
      typeof p.iv !== "string" || typeof p.ciphertext !== "string" ||
      typeof p.tag !== "string") {
    throw new Error("Versi atau struktur payload terenkripsi tidak didukung.");
  }
  const isB64Url = (s: string) => /^[A-Za-z0-9_-]*$/.test(s);
  if (![p.iv, p.ciphertext, p.tag].every((s) => isB64Url(s as string))) {
    throw new Error("Format payload terenkripsi tidak valid.");
  }
  const iv = Buffer.from(p.iv, "base64url");
  const tag = Buffer.from(p.tag, "base64url");
  if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH) {
    throw new Error("Panjang IV atau authentication tag tidak valid.");
  }

  try {
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAAD(AAD);
    decipher.setAuthTag(tag);
    return Buffer.concat([
      decipher.update(Buffer.from(p.ciphertext as string, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    throw new Error("Data gagal didekripsi: autentikasi gagal atau kunci salah.");
  }
}

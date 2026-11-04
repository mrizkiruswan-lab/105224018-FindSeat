
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// Server-side only: never import this module into a Client Component.
const ALGORITHM = "aes-256-gcm" as const;
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const AAD = Buffer.from("findseat:sensitive-data:v1", "utf8");
const MAX_PLAINTEXT_LENGTH = 1_000_000;

type Payload = {
  version: 1;
  algorithm: typeof ALGORITHM;
  iv: string;
  ciphertext: string;
  tag: string;
};

function assertKey(key: Buffer): void {
  if (!Buffer.isBuffer(key) || key.length !== KEY_LENGTH) {
    throw new Error("Kunci AES-256 harus berupa Buffer tepat 32 byte.");
  }
}

function decodeBase64Url(value: string): Buffer {
  if (!/^[A-Za-z0-9_-]*$/.test(value)) {
    throw new Error("Format payload terenkripsi tidak valid.");
  }

  const decoded = Buffer.from(value, "base64url");

  // Reject non-canonical Base64URL representations.
  if (decoded.toString("base64url") !== value) {
    throw new Error("Format payload terenkripsi tidak valid.");
  }

  return decoded;
}

export function getFindSeatEncryptionKey(): Buffer {
  const encoded = process.env.FINDSEAT_ENCRYPTION_KEY;

  if (!encoded) {
    throw new Error("FINDSEAT_ENCRYPTION_KEY belum diatur.");
  }

  const key = Buffer.from(encoded, "base64");

  if (
    key.length !== KEY_LENGTH ||
    key.toString("base64") !== encoded
  ) {
    throw new Error(
      "FINDSEAT_ENCRYPTION_KEY harus berupa base64 dari tepat 32 byte."
    );
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

  if (Buffer.byteLength(plaintext, "utf8") > MAX_PLAINTEXT_LENGTH) {
    throw new Error("Ukuran data melebihi batas maksimum 1 MB.");
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  cipher.setAAD(AAD);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

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

  if (typeof serialized !== "string") {
    throw new Error("Payload terenkripsi harus berupa string.");
  }

  if (Buffer.byteLength(serialized, "utf8") > MAX_PLAINTEXT_LENGTH * 2) {
    throw new Error("Ukuran payload terenkripsi melebihi batas.");
  }

  let raw: unknown;

  try {
    raw = JSON.parse(serialized);
  } catch {
    throw new Error("Payload terenkripsi bukan JSON yang valid.");
  }

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("Struktur payload tidak valid.");
  }

  const p = raw as Record<string, unknown>;

  if (
    p.version !== 1 ||
    p.algorithm !== ALGORITHM ||
    typeof p.iv !== "string" ||
    typeof p.ciphertext !== "string" ||
    typeof p.tag !== "string"
  ) {
    throw new Error("Versi atau struktur payload terenkripsi tidak didukung.");
  }

  const iv = decodeBase64Url(p.iv);
  const ciphertext = decodeBase64Url(p.ciphertext);
  const tag = decodeBase64Url(p.tag);

  if (iv.length !== IV_LENGTH || tag.length !== TAG_LENGTH) {
    throw new Error("Panjang IV atau authentication tag tidak valid.");
  }

  try {
    const decipher = createDecipheriv(ALGORITHM, key, iv);

    decipher.setAAD(AAD);
    decipher.setAuthTag(tag);

    return Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    throw new Error(
      "Data gagal didekripsi: autentikasi gagal atau kunci salah."
    );
  }
}

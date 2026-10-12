import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { decryptSensitiveData, encryptSensitiveData } from "../lib/security/encryption";

const key = randomBytes(32);

test("1. round-trip data sintetis", () => {
  const original = JSON.stringify({ userId: "demo-001", seatId: "A-12", note: "data sintetis" });
  const encrypted = encryptSensitiveData(original, key);
  assert.notEqual(encrypted, original);
  assert.equal(decryptSensitiveData(encrypted, key), original);
});

test("2. setiap enkripsi memakai IV acak baru", () => {
  const a = JSON.parse(encryptSensitiveData("catatan sintetis", key));
  const b = JSON.parse(encryptSensitiveData("catatan sintetis", key));
  assert.notEqual(a.iv, b.iv);
  assert.notEqual(a.ciphertext, b.ciphertext);
});

test("3. payload yang dimodifikasi ditolak (uji negatif)", () => {
  const p = JSON.parse(encryptSensitiveData("kursi A-12", key));
  p.ciphertext = (p.ciphertext[0] === "A" ? "B" : "A") + p.ciphertext.slice(1);
  assert.throws(() => decryptSensitiveData(JSON.stringify(p), key), /gagal didekripsi|tidak valid/);
});

test("4. kunci yang salah ditolak", () => {
  const encrypted = encryptSensitiveData("data sintetis", key);
  assert.throws(() => decryptSensitiveData(encrypted, randomBytes(32)), /gagal didekripsi/);
});

test("5. panjang kunci yang salah ditolak (uji batas)", () => {
  assert.throws(() => encryptSensitiveData("contoh", randomBytes(16)), /tepat 32 byte/);
});

test("6. JSON payload rusak ditolak", () => {
  assert.throws(() => decryptSensitiveData("{rusak", key), /bukan JSON yang valid/);
});

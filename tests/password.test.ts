
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../lib/auth/password";

describe("Password hashing dengan Argon2id", () => {
  it("menghasilkan hash yang berbeda dari password asli", async () => {
    const password = "FindSeatDemo2026!";
    const hash = await hashPassword(password);

    assert.notEqual(hash, password);
    assert.ok(hash.startsWith("$argon2id$"));
  });

  it("menerima password yang benar", async () => {
    const password = "FindSeatDemo2026!";
    const hash = await hashPassword(password);

    assert.equal(await verifyPassword(password, hash), true);
  });

  it("menolak password yang salah", async () => {
    const hash = await hashPassword("FindSeatDemo2026!");

    assert.equal(await verifyPassword("PasswordSalah123!", hash), false);
  });
});

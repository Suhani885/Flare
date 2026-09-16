import { randomBytes, createHash } from "crypto";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/** Raw token goes in the emailed link; only its hash is ever stored. */
export function generateResetToken(): { raw: string; hashed: string } {
  const raw = randomBytes(32).toString("hex");
  return { raw, hashed: hashResetToken(raw) };
}

export function hashResetToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

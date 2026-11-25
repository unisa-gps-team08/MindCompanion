import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  lunghezza: number,
) => Promise<Buffer>;

const LUNGHEZZA_CHIAVE = 64;

/** Calcola l'hash della password nel formato "salt:hash" (esadecimale), da salvare in passwordHash. */
export async function calcolaHashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const chiave = await scrypt(password, salt, LUNGHEZZA_CHIAVE);
  return `${salt.toString("hex")}:${chiave.toString("hex")}`;
}

/** Confronta la password con l'hash salvato, in tempo costante per non rivelare informazioni. */
export async function verificaPassword(password: string, passwordHash: string): Promise<boolean> {
  const [saltHex, chiaveHex] = passwordHash.split(":");
  if (!saltHex || !chiaveHex) return false;

  const attesa = Buffer.from(chiaveHex, "hex");
  const calcolata = await scrypt(password, Buffer.from(saltHex, "hex"), attesa.length);
  return attesa.length === calcolata.length && timingSafeEqual(attesa, calcolata);
}

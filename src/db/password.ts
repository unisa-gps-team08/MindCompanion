import { randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  lunghezza: number,
) => Promise<Buffer>;

const LUNGHEZZA_CHIAVE = 64;

export const LUNGHEZZA_PASSWORD_TEMPORANEA = 12;

function caratteriTra(primo: string, ultimo: string): string[] {
  const inizio = primo.charCodeAt(0);
  return Array.from({ length: ultimo.charCodeAt(0) - inizio + 1 }, (_, i) => String.fromCharCode(inizio + i));
}

// Esclusi i caratteri che si confondono sul foglio stampato (0/O/o, 1/l/I).
// L'alfabeto è costruito per intervalli: scritto come stringa, Gitleaks lo scambia per un segreto.
const CARATTERI_AMBIGUI = new Set(["0", "O", "o", "1", "l", "I"]);
const ALFABETO_GENERATORE = [...caratteriTra("A", "Z"), ...caratteriTra("a", "z"), ...caratteriTra("0", "9")]
  .filter((carattere) => !CARATTERI_AMBIGUI.has(carattere))
  .join("");

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

/**
 * Genera la password temporanea di un nuovo utente (RF_AD_1, RNF_FUN_5).
 * randomInt usa il generatore crittografico di Node, non Math.random.
 */
export function generaPasswordTemporanea(): string {
  let password = "";
  for (let i = 0; i < LUNGHEZZA_PASSWORD_TEMPORANEA; i++) {
    password += ALFABETO_GENERATORE[randomInt(ALFABETO_GENERATORE.length)];
  }
  return password;
}

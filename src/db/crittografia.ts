import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

// Servizio Crittografia (SDD): cifra i dati sanitari con AES-256 prima della
// scrittura nel database e li decifra in lettura (RNF_FUN_4, DG_1).
// Formato salvato: "enc:v1:" + base64(iv di 12 byte | tag di 16 byte | testo cifrato).
// Lo script src/db/setup/applica.mjs usa lo stesso formato per il seed.

const ALGORITMO = "aes-256-gcm";
const PREFISSO = "enc:v1:";
const LUNGHEZZA_IV = 12;
const LUNGHEZZA_TAG = 16;

let chiaveInCache: Buffer | undefined;

/**
 * Chiave da CHIAVE_CIFRATURA (32 byte in base64). Solo in sviluppo, se manca,
 * si usa una chiave derivata fissa, uguale a quella del seed; in produzione è obbligatoria.
 */
function getChiave(): Buffer {
  if (chiaveInCache) return chiaveInCache;

  const valore = process.env.CHIAVE_CIFRATURA;
  if (valore) {
    const chiave = Buffer.from(valore, "base64");
    if (chiave.length !== 32) {
      throw new Error("CHIAVE_CIFRATURA deve contenere 32 byte codificati in base64.");
    }
    chiaveInCache = chiave;
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("CHIAVE_CIFRATURA mancante: in produzione è obbligatoria.");
  } else {
    chiaveInCache = scryptSync("mindcompanion-solo-sviluppo", "mindcompanion", 32);
  }
  return chiaveInCache;
}

/** Indica se il valore è già nel formato cifrato. */
export function isCifrato(valore: string): boolean {
  return valore.startsWith(PREFISSO);
}

/** Cifra un testo. Un valore già cifrato resta invariato, così non viene cifrato due volte. */
export function cifra(testo: string): string {
  if (isCifrato(testo)) return testo;

  const iv = randomBytes(LUNGHEZZA_IV);
  const cifrario = createCipheriv(ALGORITMO, getChiave(), iv, { authTagLength: LUNGHEZZA_TAG });
  const cifrato = Buffer.concat([cifrario.update(testo, "utf8"), cifrario.final()]);
  return PREFISSO + Buffer.concat([iv, cifrario.getAuthTag(), cifrato]).toString("base64");
}

/** Decifra un valore prodotto da cifra(). Rifiuta i valori in chiaro o alterati. */
export function decifra(valore: string): string {
  if (!isCifrato(valore)) {
    throw new Error("Dato sanitario non cifrato nel database.");
  }

  const dati = Buffer.from(valore.slice(PREFISSO.length), "base64");
  const iv = dati.subarray(0, LUNGHEZZA_IV);
  const tag = dati.subarray(LUNGHEZZA_IV, LUNGHEZZA_IV + LUNGHEZZA_TAG);
  // authTagLength fissa la lunghezza attesa: un tag più corto, che renderebbe
  // falsificabili i dati, viene rifiutato.
  const decifrario = createDecipheriv(ALGORITMO, getChiave(), iv, {
    authTagLength: LUNGHEZZA_TAG,
  });
  decifrario.setAuthTag(tag);
  return Buffer.concat([
    decifrario.update(dati.subarray(LUNGHEZZA_IV + LUNGHEZZA_TAG)),
    decifrario.final(),
  ]).toString("utf8");
}

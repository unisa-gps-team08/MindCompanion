import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { connectDB } from "@/db/connect";
import { SessioneAccesso } from "@/db/models/SessioneAccesso";
import { Utente } from "@/db/models/Utente";

export const NOME_COOKIE = "sessione";
const DURATA_SESSIONE_MS = 8 * 60 * 60 * 1000;

function calcolaHashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Crea la sessione dopo un login riuscito e imposta il cookie nel browser. */
export async function creaSessione(utenteId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const scadenza = new Date(Date.now() + DURATA_SESSIONE_MS);

  await connectDB();
  await SessioneAccesso.create({ tokenHash: calcolaHashToken(token), utente: utenteId, scadenza });

  const archivioCookie = await cookies();
  archivioCookie.set(NOME_COOKIE, token, {
    // httpOnly: il JavaScript della pagina non può leggere il cookie.
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: scadenza,
  });
}

/** Restituisce l'utente che ha fatto login, oppure null se la sessione manca o è scaduta. */
export async function getUtenteCorrente() {
  return getUtenteDaToken((await cookies()).get(NOME_COOKIE)?.value);
}

/** Come getUtenteCorrente, ma a partire dal token: lo usa il proxy, che legge i cookie dalla richiesta. */
export async function getUtenteDaToken(token: string | undefined) {
  if (!token) return null;

  await connectDB();
  const sessione = await SessioneAccesso.findOne({
    tokenHash: calcolaHashToken(token),
    scadenza: { $gt: new Date() },
  });
  if (!sessione) return null;

  return Utente.findById(sessione.utente);
}

/**
 * Chiude le altre sessioni dell'utente e lascia aperta quella corrente. Dopo un cambio
 * password chi aveva usato le credenziali precedenti su un altro dispositivo deve rientrare.
 */
export async function eliminaAltreSessioni(utenteId: string): Promise<void> {
  const token = (await cookies()).get(NOME_COOKIE)?.value;

  await connectDB();
  await SessioneAccesso.deleteMany({
    utente: utenteId,
    ...(token ? { tokenHash: { $ne: calcolaHashToken(token) } } : {}),
  });
}

/** Chiude la sessione corrente: la elimina dal database e cancella il cookie. */
export async function eliminaSessione(): Promise<void> {
  const archivioCookie = await cookies();
  const token = archivioCookie.get(NOME_COOKIE)?.value;

  if (token) {
    await connectDB();
    await SessioneAccesso.deleteOne({ tokenHash: calcolaHashToken(token) });
  }
  archivioCookie.delete(NOME_COOKIE);
}

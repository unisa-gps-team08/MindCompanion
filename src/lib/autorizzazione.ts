import type { Ruolo } from "@/db/models/Utente";
import { getUtenteCorrente } from "@/lib/sessione";

type UtenteAutenticato = NonNullable<Awaited<ReturnType<typeof getUtenteCorrente>>>;

/** Esito del controllo: l'utente autorizzato oppure la risposta di errore da restituire. */
export type EsitoAutorizzazione =
  | { utente: UtenteAutenticato; risposta?: undefined }
  | { utente?: undefined; risposta: Response };

/**
 * Controllo del ruolo per le API (RNF_FUN_3): 401 se manca la sessione,
 * 403 se il ruolo non è tra quelli ammessi.
 *
 * Uso in una route:
 *   const { utente, risposta } = await richiediRuolo("AMMINISTRATORE");
 *   if (risposta) return risposta;
 */
export async function richiediRuolo(...ruoliAmmessi: Ruolo[]): Promise<EsitoAutorizzazione> {
  const utente = await getUtenteCorrente();
  if (!utente) {
    return {
      risposta: Response.json({ errore: "Accesso richiesto." }, { status: 401 }),
    };
  }
  if (!(ruoliAmmessi as readonly string[]).includes(utente.ruolo)) {
    return {
      risposta: Response.json({ errore: "Operazione non consentita per il tuo ruolo." }, { status: 403 }),
    };
  }
  return { utente };
}

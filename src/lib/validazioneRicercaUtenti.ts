import type { Ruolo } from "@/db/models/Utente";

// Tutti i ruoli della piattaforma ammessi come filtro in VisualizzaElencoUtenti (RF_AD_7).
// Dichiarati qui per evitare import runtime di Mongoose nei componenti View.
export const RUOLI_UTENTE = [
  "AMMINISTRATORE",
  "MEDICO",
  "NUTRIZIONISTA",
  "TUTORE",
  "PAZIENTE",
] as const satisfies readonly Ruolo[];

// Limite per evitare ricerche con stringhe abnormi sul database.
export const LUNGHEZZA_MASSIMA_RICERCA = 100;

export type UtenteAnagrafico = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  codiceFiscale: string;
  dataNascita: string;
  ruolo: Ruolo;
};

export type FiltroRicercaUtenti = {
  search?: string;
  role?: Ruolo;
};

export type EsitoValidazioneRicercaUtenti =
  | { valido: true; filtro: FiltroRicercaUtenti }
  | { valido: false; errore: string };

function isRuoloValido(valore: string): valore is Ruolo {
  return (RUOLI_UTENTE as readonly string[]).includes(valore);
}

/**
 * Valida lato server i parametri query `search` e `role` di GET /api/admin/users (RF_AD_7).
 * Parametri assenti o vuoti corrispondono a nessun filtro applicato.
 */
export function validaRicercaUtenti(parametri: URLSearchParams): EsitoValidazioneRicercaUtenti {
  const search = (parametri.get("search") ?? "").trim();
  const roleGrezzo = (parametri.get("role") ?? "").trim().toUpperCase();

  if (search.length > LUNGHEZZA_MASSIMA_RICERCA) {
    return {
      valido: false,
      errore: `Il testo di ricerca non può superare ${LUNGHEZZA_MASSIMA_RICERCA} caratteri.`,
    };
  }

  if (roleGrezzo && !isRuoloValido(roleGrezzo)) {
    return { valido: false, errore: "Il ruolo selezionato non è valido." };
  }

  return {
    valido: true,
    filtro: {
      ...(search ? { search } : {}),
      ...(roleGrezzo && isRuoloValido(roleGrezzo) ? { role: roleGrezzo } : {}),
    },
  };
}

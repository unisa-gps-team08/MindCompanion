import type { Ruolo } from "@/db/models/Utente";
import { getAreaRuolo } from "@/lib/aree";

export type RuoloUtente = Ruolo;

export type ProfiloUtente = {
  nome: string;
  cognome: string;
  email: string;
  ruolo: RuoloUtente;
};

export type IconaMenu =
  | "utenti"
  | "centri"
  | "pazienti"
  | "esercizi"
  | "andamento"
  | "alimentazione"
  | "questionari";

export type VoceMenu = {
  titolo: string;
  percorso: string;
  icona: IconaMenu;
  corrispondenzaEsatta?: boolean;
  sottoPercorsi?: readonly string[];
};

export type BreadcrumbNavigazione = {
  area: { titolo: string; percorso: string };
  pagina?: { titolo: string; percorso?: string };
  sottoPagina?: string;
};

export const ETICHETTE_RUOLO: Record<RuoloUtente, string> = {
  AMMINISTRATORE: "Amministratore",
  MEDICO: "Medico",
  NUTRIZIONISTA: "Nutrizionista",
  TUTORE: "Tutore",
  PAZIENTE: "Paziente",
};

export const ETICHETTE_AREA: Record<RuoloUtente, string> = {
  AMMINISTRATORE: "Area Amministratore",
  MEDICO: "Area Medico",
  NUTRIZIONISTA: "Area Nutrizionista",
  TUTORE: "Area Tutore",
  PAZIENTE: "Area Paziente",
};

// Voci di navigazione profilate per ruolo secondo NP_AD, NP_NT, NP_MD, NP_TT e NP_PZ.
export const VOCI_MENU_PER_RUOLO: Record<RuoloUtente, readonly VoceMenu[]> = {
  AMMINISTRATORE: [
    {
      titolo: "Gestione Utenti",
      percorso: "/amministratore",
      icona: "utenti",
      corrispondenzaEsatta: true,
      sottoPercorsi: ["/amministratore/utenti"],
    },
    {
      titolo: "Centri e Attività",
      percorso: "/amministratore/centri",
      icona: "centri",
    },
  ],
  NUTRIZIONISTA: [
    {
      titolo: "I miei pazienti",
      percorso: "/nutrizionista",
      icona: "pazienti",
    },
  ],
  MEDICO: [
    {
      titolo: "I miei pazienti",
      percorso: "/medico",
      icona: "pazienti",
    },
  ],
  TUTORE: [
    {
      titolo: "I miei pazienti",
      percorso: "/tutore",
      icona: "pazienti",
      corrispondenzaEsatta: true,
      sottoPercorsi: ["/tutore/pazienti"],
    },
    {
      titolo: "Centri e Attività",
      percorso: "/tutore/centri",
      icona: "centri",
    },
  ],
  PAZIENTE: [
    {
      titolo: "Sessione Esercizi",
      percorso: "/paziente",
      icona: "esercizi",
      corrispondenzaEsatta: true,
      sottoPercorsi: ["/paziente/esercizi"],
    },
    {
      titolo: "Storico e Andamento",
      percorso: "/paziente/andamento",
      icona: "andamento",
    },
    {
      titolo: "Piano Alimentare",
      percorso: "/paziente/piano-alimentare",
      icona: "alimentazione",
    },
    {
      titolo: "Questionari",
      percorso: "/paziente/questionari",
      icona: "questionari",
    },
  ],
};

const SOTTOPAGINE_NOTE: Record<string, string> = {
  "/amministratore/utenti/nuovo": "Aggiungi nuovo utente",
};

function isRuoloValido(valore: unknown): valore is RuoloUtente {
  return (
    typeof valore === "string" &&
    Object.prototype.hasOwnProperty.call(ETICHETTE_RUOLO, valore)
  );
}

function percorsoCorrisponde(base: string, pathname: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

/** Verifica a runtime che la risposta ricevuta da /api/auth/me abbia i campi attesi. */
export function isProfiloUtente(dati: unknown): dati is ProfiloUtente {
  if (typeof dati !== "object" || dati === null) return false;
  const candidato = dati as Record<string, unknown>;
  return (
    typeof candidato.nome === "string" &&
    typeof candidato.cognome === "string" &&
    typeof candidato.email === "string" &&
    isRuoloValido(candidato.ruolo)
  );
}

/** Indica se la voce di menu corrisponde al percorso corrente (o a un suo sottopercorso). */
export function voceAttiva(voce: VoceMenu, pathname: string): boolean {
  if (voce.corrispondenzaEsatta) {
    if (pathname === voce.percorso) return true;
    return voce.sottoPercorsi?.some((sotto) => percorsoCorrisponde(sotto, pathname)) ?? false;
  }
  return percorsoCorrisponde(voce.percorso, pathname);
}

/** Restituisce le iniziali maiuscole dell'utente per il segnaposto dell'avatar. */
export function calcolaIniziali(nome: string, cognome: string): string {
  const inizialeNome = nome.trim().charAt(0);
  const inizialeCognome = cognome.trim().charAt(0);
  const iniziali = `${inizialeNome}${inizialeCognome}`.toUpperCase();
  return iniziali || "MC";
}

/** Ricava area, voce principale ed eventuale sottopagina per il breadcrumb dell'header. */
export function ricavaBreadcrumb(ruolo: RuoloUtente, pathname: string): BreadcrumbNavigazione {
  const area = {
    titolo: ETICHETTE_AREA[ruolo],
    percorso: getAreaRuolo(ruolo),
  };
  const voce = VOCI_MENU_PER_RUOLO[ruolo].find((elemento) => voceAttiva(elemento, pathname));
  if (!voce) {
    return { area };
  }

  const sottoPagina = SOTTOPAGINE_NOTE[pathname];
  if (sottoPagina) {
    return {
      area,
      pagina: { titolo: voce.titolo, percorso: voce.percorso },
      sottoPagina,
    };
  }

  return {
    area,
    pagina: { titolo: voce.titolo },
  };
}

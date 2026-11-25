import type { Ruolo } from "@/db/models/Utente";

// Ruoli che l'amministratore può assegnare (RF_AD_1): l'amministratore non si registra dal form.
export const RUOLI_REGISTRABILI = ["PAZIENTE", "MEDICO", "NUTRIZIONISTA", "TUTORE"] as const satisfies readonly Ruolo[];
export const LUNGHEZZA_MINIMA_PASSWORD = 8;
const LUNGHEZZA_MASSIMA_PASSWORD = 128;

const REGEX_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// Stesso formato del validatore della collezione utenti (src/db/setup/schema/utenti.json).
const REGEX_CODICE_FISCALE =
  /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/;

export type NuovoUtente = {
  nome: string;
  cognome: string;
  email: string;
  codiceFiscale: string;
  dataNascita: Date;
  ruolo: (typeof RUOLI_REGISTRABILI)[number];
  password: string;
  codiceMedico?: string;
  specializzazione?: string;
};

export type ErroriCampi = Partial<Record<keyof NuovoUtente, string>>;

export type EsitoValidazione =
  | { valido: true; valori: NuovoUtente }
  | { valido: false; errori: ErroriCampi };

function testo(valore: unknown): string {
  return typeof valore === "string" ? valore.trim() : "";
}

function isRuoloRegistrabile(ruolo: string): ruolo is NuovoUtente["ruolo"] {
  return (RUOLI_REGISTRABILI as readonly string[]).includes(ruolo);
}

/** Valida lato server i dati del form InserisciUtente (RF_AD_1), anche se il browser li ha già controllati. */
export function validaNuovoUtente(dati: unknown): EsitoValidazione {
  const campi = (typeof dati === "object" && dati !== null ? dati : {}) as Record<string, unknown>;
  const errori: ErroriCampi = {};

  const nome = testo(campi.nome);
  const cognome = testo(campi.cognome);
  const email = testo(campi.email).toLowerCase();
  const codiceFiscale = testo(campi.codiceFiscale).toUpperCase();
  const dataNascita = new Date(testo(campi.dataNascita));
  const ruolo = testo(campi.ruolo);
  // La password non si accorcia con trim: gli spazi fanno parte della password.
  const password = typeof campi.password === "string" ? campi.password : "";

  if (!nome) errori.nome = "Inserisci il nome.";
  if (!cognome) errori.cognome = "Inserisci il cognome.";
  if (!REGEX_EMAIL.test(email)) errori.email = "Inserisci un indirizzo e-mail valido.";
  if (!REGEX_CODICE_FISCALE.test(codiceFiscale)) errori.codiceFiscale = "Il codice fiscale non è valido.";
  if (Number.isNaN(dataNascita.getTime()) || dataNascita > new Date()) {
    errori.dataNascita = "Inserisci una data di nascita valida.";
  }
  if (!isRuoloRegistrabile(ruolo)) errori.ruolo = "Seleziona il ruolo dell'utente.";
  if (password.length < LUNGHEZZA_MINIMA_PASSWORD || password.length > LUNGHEZZA_MASSIMA_PASSWORD) {
    errori.password = `La password deve avere da ${LUNGHEZZA_MINIMA_PASSWORD} a ${LUNGHEZZA_MASSIMA_PASSWORD} caratteri.`;
  }

  const codiceMedico = testo(campi.codiceMedico);
  const specializzazione = testo(campi.specializzazione);
  if (ruolo === "MEDICO") {
    if (!codiceMedico) errori.codiceMedico = "Inserisci il codice del medico.";
    if (!specializzazione) errori.specializzazione = "Inserisci la specializzazione.";
  }

  if (Object.keys(errori).length > 0 || !isRuoloRegistrabile(ruolo)) {
    return { valido: false, errori };
  }

  return {
    valido: true,
    valori: {
      nome,
      cognome,
      email,
      codiceFiscale,
      dataNascita,
      ruolo,
      password,
      ...(ruolo === "MEDICO" ? { codiceMedico, specializzazione } : {}),
    },
  };
}

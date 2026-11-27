/** Lunghezza massima ammessa per il testo di ricerca dei pazienti. */
export const LUNGHEZZA_MASSIMA_RICERCA_PAZIENTI = 100;

export type TutoreAssociato = {
  id: string;
  nome: string;
  cognome: string;
  email: string;
};

export type PazienteAssociato = {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  email: string;
  dataNascita: string;
  tutori: TutoreAssociato[];
};

export type EsitoValidazioneRicercaPazienti =
  | { valido: true; search: string }
  | { valido: false; errore: string };

const FORMATO_DATA_ITALIANO = new Intl.DateTimeFormat("it-IT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Valida lato server il parametro query `search` delle API elenco pazienti associati.
 * Parametro assente o vuoto corrisponde a nessun filtro applicato.
 */
export function validaRicercaPazienti(
  parametri: URLSearchParams,
): EsitoValidazioneRicercaPazienti {
  const search = (parametri.get("search") ?? "").trim();

  if (search.length > LUNGHEZZA_MASSIMA_RICERCA_PAZIENTI) {
    return {
      valido: false,
      errore: `Il testo di ricerca non può superare ${LUNGHEZZA_MASSIMA_RICERCA_PAZIENTI} caratteri.`,
    };
  }

  return { valido: true, search };
}

/** Formatta una data ISO in formato italiano leggibile; restituisce "—" se non valida. */
export function formattaDataNascita(dataIso: string): string {
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) {
    return "—";
  }
  return FORMATO_DATA_ITALIANO.format(data);
}

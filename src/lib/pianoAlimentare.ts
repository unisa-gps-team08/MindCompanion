// Valori ammessi per i pasti del PianoAlimentare, condivisi tra View e validazione lato server.
// Stanno qui e non nel model perché la View non può importare da @/db. Lo schema della
// collezione (src/db/setup/schema/pianiAlimentari.json) ripete le liste: vanno tenuti allineati.

export const GIORNI_SETTIMANA = [
  "LUNEDI",
  "MARTEDI",
  "MERCOLEDI",
  "GIOVEDI",
  "VENERDI",
  "SABATO",
  "DOMENICA",
] as const;
export const TIPI_PASTO = ["COLAZIONE", "PRANZO", "CENA", "SPUNTINO"] as const;

export type GiornoSettimana = (typeof GIORNI_SETTIMANA)[number];
export type TipoPasto = (typeof TIPI_PASTO)[number];

/** Pasto del piano già validato: ogni alimento ha la porzione nella stessa posizione. */
export type PastoInserito = {
  giorno: GiornoSettimana;
  tipo: TipoPasto;
  alimenti: string[];
  porzioni: string[];
};

/** Dati di un piano alimentare da salvare, dopo la validazione lato server. */
export type NuovoPianoAlimentare = {
  raccomandazioniIdriche?: string;
  raccomandazioniNutrizionali?: string;
  pasti: PastoInserito[];
};

export const ETICHETTE_GIORNO: Record<GiornoSettimana, string> = {
  LUNEDI: "Lunedì",
  MARTEDI: "Martedì",
  MERCOLEDI: "Mercoledì",
  GIOVEDI: "Giovedì",
  VENERDI: "Venerdì",
  SABATO: "Sabato",
  DOMENICA: "Domenica",
};

export const ETICHETTE_PASTO: Record<TipoPasto, string> = {
  COLAZIONE: "Colazione",
  PRANZO: "Pranzo",
  CENA: "Cena",
  SPUNTINO: "Spuntini",
};

/** Chiave dell'errore di un singolo pasto, ad esempio "pasti.LUNEDI.PRANZO". */
export function chiavePasto(giorno: GiornoSettimana, tipo: TipoPasto): string {
  return `pasti.${giorno}.${tipo}`;
}

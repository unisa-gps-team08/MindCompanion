import {
  chiavePasto,
  ETICHETTE_GIORNO,
  ETICHETTE_PASTO,
  GIORNI_SETTIMANA,
  TIPI_PASTO,
  type GiornoSettimana,
  type NuovoPianoAlimentare,
  type PastoInserito,
  type TipoPasto,
} from "@/lib/pianoAlimentare";

export type { NuovoPianoAlimentare, PastoInserito };

export const MAX_LUNGHEZZA_RACCOMANDAZIONI = 2000;
export const MAX_LUNGHEZZA_VOCE = 200;
export const MAX_ALIMENTI_PER_PASTO = 30;

/**
 * Errori per campo. Le chiavi sono "raccomandazioniIdriche", "raccomandazioniNutrizionali",
 * "pasti" per gli errori sull'intero piano e chiavePasto(giorno, tipo) per un singolo pasto.
 */
export type ErroriPianoAlimentare = Record<string, string>;

export type EsitoValidazionePiano =
  | { valido: true; valori: NuovoPianoAlimentare }
  | { valido: false; errori: ErroriPianoAlimentare };

function isOggetto(valore: unknown): valore is Record<string, unknown> {
  return typeof valore === "object" && valore !== null && !Array.isArray(valore);
}

function isGiorno(valore: unknown): valore is GiornoSettimana {
  return typeof valore === "string" && (GIORNI_SETTIMANA as readonly string[]).includes(valore);
}

function isTipoPasto(valore: unknown): valore is TipoPasto {
  return typeof valore === "string" && (TIPI_PASTO as readonly string[]).includes(valore);
}

/** Restituisce il testo ripulito, oppure null se il valore non è una stringa. */
function testo(valore: unknown): string | null {
  return typeof valore === "string" ? valore.trim() : null;
}

function validaRaccomandazione(
  valore: unknown,
  nome: string,
  errori: ErroriPianoAlimentare,
): string | undefined {
  if (valore == null) return undefined;
  const pulito = testo(valore);
  if (pulito === null) {
    errori[nome] = "Il testo delle raccomandazioni non è valido.";
    return undefined;
  }
  if (pulito.length > MAX_LUNGHEZZA_RACCOMANDAZIONI) {
    errori[nome] = `Scrivi al massimo ${MAX_LUNGHEZZA_RACCOMANDAZIONI} caratteri.`;
    return undefined;
  }
  return pulito || undefined;
}

/** Controlla le voci di un pasto: ogni alimento ha la sua porzione, entrambi non vuoti. */
function erroreVoci(alimenti: unknown, porzioni: unknown): string | null {
  if (!Array.isArray(alimenti) || !Array.isArray(porzioni) || alimenti.length !== porzioni.length) {
    return "Ogni alimento deve avere la sua porzione.";
  }
  if (alimenti.length === 0) return "Inserisci almeno un alimento.";
  if (alimenti.length > MAX_ALIMENTI_PER_PASTO) {
    return `Inserisci al massimo ${MAX_ALIMENTI_PER_PASTO} alimenti per pasto.`;
  }
  const voci = [...alimenti, ...porzioni].map(testo);
  if (voci.some((voce) => !voce)) return "Compila alimento e porzione in ogni riga.";
  if (voci.some((voce) => voce !== null && voce.length > MAX_LUNGHEZZA_VOCE)) {
    return `Ogni alimento e porzione può avere al massimo ${MAX_LUNGHEZZA_VOCE} caratteri.`;
  }
  return null;
}

function validaPasti(valore: unknown, errori: ErroriPianoAlimentare): PastoInserito[] {
  if (!Array.isArray(valore) || valore.length === 0) {
    errori.pasti = "Inserisci almeno un pasto nel piano alimentare.";
    return [];
  }
  if (valore.length > GIORNI_SETTIMANA.length * TIPI_PASTO.length) {
    errori.pasti = "Il piano contiene troppi pasti.";
    return [];
  }

  const pasti: PastoInserito[] = [];
  const visti = new Set<string>();
  for (const elemento of valore) {
    if (!isOggetto(elemento) || !isGiorno(elemento.giorno) || !isTipoPasto(elemento.tipo)) {
      errori.pasti = "Un pasto ha un giorno o un tipo non valido.";
      continue;
    }
    const { giorno, tipo } = elemento;
    const chiave = chiavePasto(giorno, tipo);
    // Un solo pasto per giorno e tipo: più spuntini dello stesso giorno sono voci dello stesso pasto.
    if (visti.has(chiave)) {
      errori[chiave] ??= `${ETICHETTE_PASTO[tipo]} di ${ETICHETTE_GIORNO[giorno].toLowerCase()} è ripetuto.`;
      continue;
    }
    visti.add(chiave);

    const errore = erroreVoci(elemento.alimenti, elemento.porzioni);
    if (errore) {
      errori[chiave] = errore;
      continue;
    }
    pasti.push({
      giorno,
      tipo,
      alimenti: (elemento.alimenti as string[]).map((voce) => voce.trim()),
      porzioni: (elemento.porzioni as string[]).map((voce) => voce.trim()),
    });
  }
  return pasti;
}

/**
 * Valida lato server i dati del form CreaPianoAlimentare (RF_NT_1), anche se il browser li ha
 * già controllati. Le raccomandazioni sono facoltative; serve almeno un pasto.
 */
export function validaPianoAlimentare(dati: unknown): EsitoValidazionePiano {
  const campi = isOggetto(dati) ? dati : {};
  const errori: ErroriPianoAlimentare = {};

  const raccomandazioniIdriche = validaRaccomandazione(
    campi.raccomandazioniIdriche,
    "raccomandazioniIdriche",
    errori,
  );
  const raccomandazioniNutrizionali = validaRaccomandazione(
    campi.raccomandazioniNutrizionali,
    "raccomandazioniNutrizionali",
    errori,
  );
  const pasti = validaPasti(campi.pasti, errori);

  if (Object.keys(errori).length > 0) return { valido: false, errori };
  return {
    valido: true,
    valori: {
      ...(raccomandazioniIdriche ? { raccomandazioniIdriche } : {}),
      ...(raccomandazioniNutrizionali ? { raccomandazioniNutrizionali } : {}),
      pasti,
    },
  };
}

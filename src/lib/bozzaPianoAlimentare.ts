import { chiavePasto, GIORNI_SETTIMANA, TIPI_PASTO } from "@/lib/pianoAlimentare";
import type { NuovoPianoAlimentare, PastoInserito } from "@/lib/validazionePianoAlimentare";

// Stato del form CreaPianoAlimentare: una lista di voci (alimento e porzione) per ogni
// giorno e tipo di pasto, più le raccomandazioni.

export type VoceAlimento = { id: string; alimento: string; porzione: string };

export type BozzaPianoAlimentare = {
  raccomandazioniIdriche: string;
  raccomandazioniNutrizionali: string;
  /** Voci per pasto, indicizzate con chiavePasto(giorno, tipo). */
  pasti: Record<string, VoceAlimento[]>;
};

/** Bozza vuota: ogni pasto parte con una riga da compilare. */
export function creaBozzaVuota(): BozzaPianoAlimentare {
  const pasti: Record<string, VoceAlimento[]> = {};
  for (const giorno of GIORNI_SETTIMANA) {
    for (const tipo of TIPI_PASTO) {
      const chiave = chiavePasto(giorno, tipo);
      pasti[chiave] = [{ id: `${chiave}-0`, alimento: "", porzione: "" }];
    }
  }
  return { raccomandazioniIdriche: "", raccomandazioniNutrizionali: "", pasti };
}

function isVoceVuota(voce: VoceAlimento): boolean {
  return !voce.alimento.trim() && !voce.porzione.trim();
}

/** Numero di righe compilate, anche solo in parte, in un pasto. */
export function contaVociCompilate(voci: readonly VoceAlimento[] | undefined): number {
  return voci?.filter((voce) => !isVoceVuota(voce)).length ?? 0;
}

/**
 * Converte la bozza nel corpo della richiesta. Le righe del tutto vuote e i pasti senza
 * righe compilate non si inviano: il piano contiene solo i pasti scritti dal nutrizionista.
 */
export function bozzaInPiano(bozza: BozzaPianoAlimentare): NuovoPianoAlimentare {
  const pasti: PastoInserito[] = [];
  for (const giorno of GIORNI_SETTIMANA) {
    for (const tipo of TIPI_PASTO) {
      const voci = (bozza.pasti[chiavePasto(giorno, tipo)] ?? []).filter((voce) => !isVoceVuota(voce));
      if (voci.length === 0) continue;
      pasti.push({
        giorno,
        tipo,
        alimenti: voci.map((voce) => voce.alimento.trim()),
        porzioni: voci.map((voce) => voce.porzione.trim()),
      });
    }
  }
  return {
    raccomandazioniIdriche: bozza.raccomandazioniIdriche.trim(),
    raccomandazioniNutrizionali: bozza.raccomandazioniNutrizionali.trim(),
    pasti,
  };
}

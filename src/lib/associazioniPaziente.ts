// Tipi e validazione condivisi da route e form della ModificaAssociazioniUtente (RF_AD_8, RF_AD_10).
// Non importa i model: la View può usarli (architettura a livelli dell'SDD).

export const RUOLI_FIGURA = ["MEDICO", "NUTRIZIONISTA", "TUTORE"] as const;
export type RuoloFigura = (typeof RUOLI_FIGURA)[number];

/** Figura di supporto che si può associare a un paziente. Solo dati anagrafici. */
export type FiguraDisponibile = {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  email: string;
  ruolo: RuoloFigura;
};

/** Paziente nell'elenco da cui l'amministratore sceglie di gestire le associazioni. Solo dati anagrafici. */
export type PazienteElenco = {
  id: string;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  email: string;
};

export type AssociazioniPazienteAttuali = {
  pazienteId: string;
  nomePaziente: string;
  cognomePaziente: string;
  medicoId: string | null;
  nutrizionistaId: string | null;
  tutoriIds: string[];
};

/** Medico e nutrizionista si sostituiscono con `nuovoIdFigura` (0..1); i tutori con l'elenco completo (0..*). */
export type RichiestaModificaAssociazione =
  | { ruoloFigura: "MEDICO" | "NUTRIZIONISTA"; nuovoIdFigura: string }
  | { ruoloFigura: "TUTORE"; tutoriIds: string[] };

export type EsitoRichiesta =
  | { valido: true; richiesta: RichiestaModificaAssociazione }
  | { valido: false; errore: string };

export function isIdValido(id: unknown): id is string {
  return typeof id === "string" && /^[0-9a-f]{24}$/i.test(id);
}

function isRuoloFigura(ruolo: unknown): ruolo is RuoloFigura {
  return (RUOLI_FIGURA as readonly unknown[]).includes(ruolo);
}

/** Valida lato server il corpo della richiesta, anche se il form lo ha già controllato. */
export function validaRichiestaAssociazione(dati: unknown): EsitoRichiesta {
  const campi = (typeof dati === "object" && dati !== null ? dati : {}) as Record<string, unknown>;
  const ruolo = campi.ruoloFigura;

  if (!isRuoloFigura(ruolo)) {
    return { valido: false, errore: `Ruolo non valido (ammessi: ${RUOLI_FIGURA.join(", ")}).` };
  }

  if (ruolo === "TUTORE") {
    const elenco = campi.tutoriIds;
    if (!Array.isArray(elenco) || !elenco.every(isIdValido)) {
      return { valido: false, errore: "Elenco dei tutori non valido." };
    }
    // Un tutore non può comparire due volte (RF_AD_8).
    return { valido: true, richiesta: { ruoloFigura: ruolo, tutoriIds: [...new Set(elenco)] } };
  }

  if (!isIdValido(campi.nuovoIdFigura)) {
    return { valido: false, errore: `Seleziona un ${ruolo.toLowerCase()} valido.` };
  }
  return { valido: true, richiesta: { ruoloFigura: ruolo, nuovoIdFigura: campi.nuovoIdFigura } };
}

/** Rimozione di un'associazione: per i tutori serve anche quale tutore togliere. */
export type RichiestaRimozioneAssociazione =
  | { ruoloFigura: "MEDICO" | "NUTRIZIONISTA" }
  | { ruoloFigura: "TUTORE"; tutoreId: string };

export type EsitoRimozione =
  | { valido: true; richiesta: RichiestaRimozioneAssociazione }
  | { valido: false; errore: string };

/** Valida lato server i parametri di RimuoviAssociazioneUtente (RF_AD_11, nel RAD precedente RF_AD_13). */
export function validaRimozioneAssociazione(ruoloFigura: unknown, tutoreId: unknown): EsitoRimozione {
  if (!isRuoloFigura(ruoloFigura)) {
    return { valido: false, errore: `Specifica un ruolo valido da rimuovere (${RUOLI_FIGURA.join(", ")}).` };
  }
  if (ruoloFigura !== "TUTORE") return { valido: true, richiesta: { ruoloFigura } };

  if (!isIdValido(tutoreId)) {
    return { valido: false, errore: "Specifica l'identificativo del tutore da rimuovere." };
  }
  return { valido: true, richiesta: { ruoloFigura, tutoreId } };
}

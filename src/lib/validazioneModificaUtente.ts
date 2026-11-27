import { RUOLI_REGISTRABILI, validaNuovoUtente, type EsitoValidazione, type NuovoUtente } from "@/lib/validazioneNuovoUtente";

/** Indica se l'amministratore può modificare un utente con questo ruolo (RF_AD_2). */
export function isRuoloModificabile(ruolo: string): ruolo is NuovoUtente["ruolo"] {
  return (RUOLI_REGISTRABILI as readonly string[]).includes(ruolo);
}

/**
 * Valida lato server i dati di ModificaUtenteForm (RF_AD_2) con le stesse regole di InserisciUtente.
 * Il ruolo non si modifica: si usa quello salvato e si ignora quello eventualmente inviato,
 * perché cambiarlo trasformerebbe l'utente in un Medico o in un Paziente con campi diversi.
 */
export function validaModificaUtente(dati: unknown, ruoloAttuale: NuovoUtente["ruolo"]): EsitoValidazione {
  const campi = typeof dati === "object" && dati !== null ? dati : {};
  return validaNuovoUtente({ ...campi, ruolo: ruoloAttuale });
}

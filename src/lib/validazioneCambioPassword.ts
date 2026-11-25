// Regole della password scelta dall'utente (RNF_FUN_5).
export const LUNGHEZZA_MINIMA_PASSWORD = 8;
const LUNGHEZZA_MASSIMA_PASSWORD = 128;

export type CambioPassword = {
  passwordAttuale: string;
  nuovaPassword: string;
  confermaPassword: string;
};

export type ErroriCambioPassword = Partial<Record<keyof CambioPassword, string>>;

export type EsitoValidazioneCambioPassword =
  | { valido: true; valori: CambioPassword }
  | { valido: false; errori: ErroriCambioPassword };

// Niente trim: gli spazi fanno parte della password.
function password(valore: unknown): string {
  return typeof valore === "string" ? valore : "";
}

/** Valida lato server i dati di CambiaPasswordForm (RF_UE_3, RF_UE_4). */
export function validaCambioPassword(dati: unknown): EsitoValidazioneCambioPassword {
  const campi = (typeof dati === "object" && dati !== null ? dati : {}) as Record<string, unknown>;
  const valori = {
    passwordAttuale: password(campi.passwordAttuale),
    nuovaPassword: password(campi.nuovaPassword),
    confermaPassword: password(campi.confermaPassword),
  };
  const errori: ErroriCambioPassword = {};

  if (!valori.passwordAttuale) errori.passwordAttuale = "Inserisci la password attuale.";
  if (
    valori.nuovaPassword.length < LUNGHEZZA_MINIMA_PASSWORD ||
    valori.nuovaPassword.length > LUNGHEZZA_MASSIMA_PASSWORD
  ) {
    errori.nuovaPassword = `La password deve avere da ${LUNGHEZZA_MINIMA_PASSWORD} a ${LUNGHEZZA_MASSIMA_PASSWORD} caratteri.`;
  } else if (valori.nuovaPassword === valori.passwordAttuale) {
    errori.nuovaPassword = "La nuova password deve essere diversa da quella attuale.";
  }
  if (valori.confermaPassword !== valori.nuovaPassword) {
    errori.confermaPassword = "Le due password non coincidono.";
  }

  return Object.keys(errori).length > 0 ? { valido: false, errori } : { valido: true, valori };
}

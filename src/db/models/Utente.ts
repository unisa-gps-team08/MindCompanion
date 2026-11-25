import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { calcolaHashPassword, verificaPassword } from "@/db/password";

/** Ruoli del class diagram, più MEDICO e PAZIENTE per le sottoclassi Medico e Paziente. */
export const RUOLI = ["NUTRIZIONISTA", "TUTORE", "AMMINISTRATORE", "MEDICO", "PAZIENTE"] as const;
export type Ruolo = (typeof RUOLI)[number];

const utenteSchema = new Schema(
  {
    // Dati anagrafici: in chiaro, perché l'amministratore li cerca (RF_AD_7).
    nome: { type: String, required: true, trim: true },
    cognome: { type: String, required: true, trim: true },
    codiceFiscale: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      match: /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/,
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    dataNascita: { type: Date, required: true },
    // Solo l'hash; select: false lo esclude da ogni ricerca.
    passwordHash: { type: String, required: true, select: false },
    // true finché l'utente non sostituisce la password generata dal sistema (RF_UE_4).
    passwordTemporanea: { type: Boolean, default: false },
    ruolo: { type: String, enum: RUOLI, required: true },
  },
  // Medico e Paziente sono salvati nella stessa collezione, distinti dal campo ruolo.
  { discriminatorKey: "ruolo", collection: "utenti" },
);

export type Utente = InferSchemaType<typeof utenteSchema>;

// models.Utente evita OverwriteModelError quando Next.js ricarica il modulo.
export const Utente = (models.Utente as Model<Utente>) ?? model<Utente>("Utente", utenteSchema);

/**
 * Restituisce l'utente se e-mail e password sono corrette, altrimenti null.
 * Usata dal login, che con una sola query verifica le credenziali e ottiene ruolo e id.
 */
export async function autenticaUtente(email: string, password: string) {
  const utente = await Utente.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
  if (!utente || !(await verificaPassword(password, utente.passwordHash))) return null;
  return utente;
}

/** verificaCredenziali(email, password) del class diagram: true se l'utente esiste e la password è corretta. */
export async function verificaCredenziali(email: string, password: string): Promise<boolean> {
  return (await autenticaUtente(email, password)) !== null;
}

/**
 * cambiaPassword(passwordAttuale, nuovaPassword) del class diagram (RF_UE_3, RF_UE_4).
 * Come gli altri metodi di questo model è una funzione del modulo: utenteId indica
 * l'Utente su cui il diagramma chiama il metodo.
 * Restituisce false se la password attuale non è corretta. Dopo il cambio la password
 * non è più temporanea.
 */
export async function cambiaPassword(
  utenteId: string,
  passwordAttuale: string,
  nuovaPassword: string,
): Promise<boolean> {
  const utente = await Utente.findById(utenteId).select("+passwordHash");
  if (!utente || !(await verificaPassword(passwordAttuale, utente.passwordHash))) return false;

  utente.passwordHash = await calcolaHashPassword(nuovaPassword);
  utente.passwordTemporanea = false;
  await utente.save();
  return true;
}

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

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
    ruolo: { type: String, enum: RUOLI, required: true },
  },
  // Medico e Paziente sono salvati nella stessa collezione, distinti dal campo ruolo.
  { discriminatorKey: "ruolo", collection: "utenti" },
);

export type Utente = InferSchemaType<typeof utenteSchema>;

// models.Utente evita OverwriteModelError quando Next.js ricarica il modulo.
export const Utente = (models.Utente as Model<Utente>) ?? model<Utente>("Utente", utenteSchema);
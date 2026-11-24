import { Schema, models, type InferSchemaType, type Model } from "mongoose";
import { Utente } from "./Utente";

export const LIVELLI_TESTO = ["NORMALE", "GRANDE", "MOLTO_GRANDE"] as const;

const pazienteSchema = new Schema({
  livelloTesto: { type: String, enum: LIVELLI_TESTO, default: "NORMALE" },
  // Associazioni RF_AD_8: al massimo un medico e un nutrizionista, zero o più tutori.
  // MongoDB non controlla la cardinalità: la verifica il codice prima di salvare.
  medico: { type: Schema.Types.ObjectId, ref: "Medico", default: null },
  nutrizionista: { type: Schema.Types.ObjectId, ref: "Utente", default: null },
  tutori: { type: [{ type: Schema.Types.ObjectId, ref: "Utente" }], default: [] },
});

export type Paziente = Utente & InferSchemaType<typeof pazienteSchema>;

export const Paziente =
  (models.Paziente as Model<Paziente>) ??
  Utente.discriminator<Paziente>("Paziente", pazienteSchema, "PAZIENTE");
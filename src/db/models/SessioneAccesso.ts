import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Entity tecnica, non presente nel class diagram: ricorda chi ha fatto login (RF_UE_1).
const sessioneAccessoSchema = new Schema(
  {
    // Solo l'hash del token: chi legge il database non può riusare le sessioni.
    tokenHash: { type: String, required: true, unique: true },
    utente: { type: Schema.Types.ObjectId, ref: "Utente", required: true },
    // Indice TTL: MongoDB cancella da solo le sessioni scadute.
    scadenza: { type: Date, required: true, expires: 0 },
  },
  { collection: "sessioniAccesso" },
);

export type SessioneAccesso = InferSchemaType<typeof sessioneAccessoSchema>;

export const SessioneAccesso =
  (models.SessioneAccesso as Model<SessioneAccesso>) ??
  model<SessioneAccesso>("SessioneAccesso", sessioneAccessoSchema);

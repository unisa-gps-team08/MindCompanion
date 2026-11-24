import { Schema, models, type InferSchemaType, type Model } from "mongoose";
import { Utente } from "./Utente";

const medicoSchema = new Schema({
  codiceMedico: { type: String, required: true, trim: true },
  specializzazione: { type: String, required: true, trim: true },
});

export type Medico = Utente & InferSchemaType<typeof medicoSchema>;

export const Medico =
  (models.Medico as Model<Medico>) ?? Utente.discriminator<Medico>("Medico", medicoSchema, "MEDICO");
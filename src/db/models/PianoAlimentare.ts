import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { cifra, decifra } from "@/db/crittografia";
import {
  GIORNI_SETTIMANA,
  TIPI_PASTO,
  type GiornoSettimana,
  type NuovoPianoAlimentare,
  type PastoInserito,
  type PianoAlimentareDettaglio,
  type TipoPasto,
} from "@/lib/pianoAlimentare";

// Le liste di giorni e tipi di pasto stanno in src/lib/pianoAlimentare.ts perché le usa
// anche la View, che non può importare da @/db.
export { GIORNI_SETTIMANA, TIPI_PASTO };

// Setter e getter dei campi sanitari: si cifra in scrittura e si decifra in lettura (RNF_FUN_4).
// Gli array vanno sempre assegnati per intero: un push() salterebbe il setter
// e il validatore del database rifiuterebbe il documento.
function cifraTesto(valore: string | null | undefined) {
  return valore == null ? valore : cifra(valore);
}
function decifraTesto(valore: string | null | undefined) {
  return valore == null ? valore : decifra(valore);
}
function cifraLista(valori: string[] | null | undefined) {
  return valori == null ? valori : valori.map(cifra);
}
function decifraLista(valori: string[] | null | undefined) {
  return valori == null ? valori : Array.from(valori, decifra);
}

const OPZIONI_GETTER = { toJSON: { getters: true }, toObject: { getters: true } };

/** Pasto: composizione di PianoAlimentare, incorporato nel documento del piano. */
const pastoSchema = new Schema(
  {
    giorno: { type: String, enum: GIORNI_SETTIMANA, required: true },
    tipo: { type: String, enum: TIPI_PASTO, required: true },
    alimenti: { type: [String], set: cifraLista, get: decifraLista },
    porzioni: { type: [String], set: cifraLista, get: decifraLista },
  },
  { _id: false, ...OPZIONI_GETTER },
);

const pianoAlimentareSchema = new Schema(
  {
    // unique: al massimo un piano alimentare per paziente (associazione segue 0..1).
    paziente: { type: Schema.Types.ObjectId, ref: "Paziente", required: true, unique: true },
    dataCreazione: { type: Date, required: true, default: Date.now },
    dataUltimaModifica: { type: Date, default: null },
    raccomandazioniIdriche: { type: String, set: cifraTesto, get: decifraTesto },
    raccomandazioniNutrizionali: { type: String, set: cifraTesto, get: decifraTesto },
    pasti: {
      type: [pastoSchema],
      validate: {
        validator: (pasti: unknown[]) => pasti.length > 0,
        message: "Il piano alimentare deve contenere almeno un pasto.",
      },
    },
  },
  { collection: "pianiAlimentari", ...OPZIONI_GETTER },
);

export type PianoAlimentare = InferSchemaType<typeof pianoAlimentareSchema>;

export const PianoAlimentare =
  (models.PianoAlimentare as Model<PianoAlimentare>) ??
  model<PianoAlimentare>("PianoAlimentare", pianoAlimentareSchema);

/**
 * salvaPiano (RF_NT_1, class diagram e SD_UC_NT_1): salva il piano alimentare di un paziente.
 * I setter dello schema cifrano con AES-256 raccomandazioni, alimenti e porzioni prima della
 * scrittura.
 * Associazione con il nutrizionista e piano già esistente li verifica il chiamante;
 * l'indice univoco su paziente blocca comunque un secondo piano.
 */
export async function salvaPiano(
  pazienteId: string,
  pasti: PastoInserito[],
  raccomandazioniIdriche?: string,
  raccomandazioniNutrizionali?: string,
) {
  return PianoAlimentare.create({
    paziente: pazienteId,
    pasti,
    ...(raccomandazioniIdriche ? { raccomandazioniIdriche } : {}),
    ...(raccomandazioniNutrizionali ? { raccomandazioniNutrizionali } : {}),
  });
}

/**
 * leggiPianoAlimentare (RF_NT_7): restituisce il piano del paziente già decifrato dai getter
 * dello schema, oppure null se il paziente non ha un piano. L'associazione con il
 * nutrizionista la verifica il chiamante.
 */
export async function leggiPianoAlimentare(
  pazienteId: string,
): Promise<PianoAlimentareDettaglio | null> {
  const documento = await PianoAlimentare.findOne({ paziente: pazienteId });
  if (!documento) return null;

  const piano = documento.toObject({ getters: true });
  return {
    id: documento._id.toString(),
    dataCreazione: piano.dataCreazione.toISOString(),
    dataUltimaModifica: piano.dataUltimaModifica ? piano.dataUltimaModifica.toISOString() : null,
    ...(piano.raccomandazioniIdriche ? { raccomandazioniIdriche: piano.raccomandazioniIdriche } : {}),
    ...(piano.raccomandazioniNutrizionali
      ? { raccomandazioniNutrizionali: piano.raccomandazioniNutrizionali }
      : {}),
    pasti: piano.pasti.map((pasto) => ({
      giorno: pasto.giorno as GiornoSettimana,
      tipo: pasto.tipo as TipoPasto,
      alimenti: [...pasto.alimenti],
      porzioni: [...pasto.porzioni],
    })),
  };
}

/**
 * modifica (RF_NT_4, class diagram): sostituisce pasti e raccomandazioni del piano del
 * paziente e aggiorna la data di ultima modifica. Restituisce false se il piano non esiste.
 * Gli array si assegnano interi, così i setter dello schema li cifrano di nuovo.
 */
export async function modifica(
  pazienteId: string,
  valori: NuovoPianoAlimentare,
): Promise<boolean> {
  const piano = await PianoAlimentare.findOne({ paziente: pazienteId });
  if (!piano) return false;

  piano.set({
    pasti: valori.pasti,
    raccomandazioniIdriche: valori.raccomandazioniIdriche,
    raccomandazioniNutrizionali: valori.raccomandazioniNutrizionali,
    dataUltimaModifica: new Date(),
  });
  await piano.save();
  return true;
}

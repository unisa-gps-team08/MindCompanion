import { Schema, Types, models, type InferSchemaType, type Model } from "mongoose";
import type { PazienteAssociato, TutoreAssociato } from "@/lib/validazioneRicercaPazienti";
import { Utente } from "./Utente";

export const LIVELLI_TESTO = ["NORMALE", "GRANDE", "MOLTO_GRANDE"] as const;

export type CampoAssociazionePaziente = "nutrizionista" | "medico" | "tutori";

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

const CAMPI_PAZIENTE_ANAGRAFICI = "nome cognome codiceFiscale email dataNascita tutori";
const CAMPI_TUTORE_ANAGRAFICI = "nome cognome email";
const PATTERN_OBJECT_ID = /^[0-9a-fA-F]{24}$/;

type DocumentoPazientePopolato = {
  _id: Types.ObjectId;
  nome: string;
  cognome: string;
  codiceFiscale: string;
  email: string;
  dataNascita: Date;
  tutori?: unknown;
};

type CondizioneRegex = { $regex: string; $options: "i" };
type CondizioneTesto = {
  $or: Array<
    | { nome: CondizioneRegex }
    | { cognome: CondizioneRegex }
    | { codiceFiscale: CondizioneRegex }
    | { email: CondizioneRegex }
  >;
};

// Types.ObjectId.isValid accetta anche stringhe arbitrarie di 12 byte: il controllo hex evita falsi positivi.
function isObjectIdValido(valore: string): boolean {
  return PATTERN_OBJECT_ID.test(valore) && Types.ObjectId.isValid(valore);
}

// Evita metacaratteri regex nell'input utente per prevenire errori di query e ReDoS.
function escapaRegex(valore: string): string {
  return valore.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function condizioneTermine(termine: string): CondizioneTesto {
  const pattern: CondizioneRegex = { $regex: escapaRegex(termine), $options: "i" };
  return {
    $or: [{ nome: pattern }, { cognome: pattern }, { codiceFiscale: pattern }, { email: pattern }],
  };
}

function aggiungiFiltroRicerca(query: Record<string, unknown>, search?: string): void {
  const testo = search?.trim();
  if (!testo) return;

  // Ogni parola separata da spazio deve trovare corrispondenza (es. "Giuseppe Russo").
  const termini = Array.from(new Set(testo.split(/\s+/)));
  if (termini.length === 1) {
    query.$or = condizioneTermine(termini[0]).$or;
  } else {
    query.$and = termini.map(condizioneTermine);
  }
}

function estraiId(valore: unknown): string | null {
  if (typeof valore === "string" && isObjectIdValido(valore)) return valore;
  if (valore instanceof Types.ObjectId) return valore.toHexString();
  if (typeof valore === "object" && valore !== null) {
    const testo = String(valore);
    return isObjectIdValido(testo) ? testo : null;
  }
  return null;
}

function estraiTutori(valore: unknown): TutoreAssociato[] {
  if (!Array.isArray(valore)) return [];

  const tutori: TutoreAssociato[] = [];
  for (const elemento of valore) {
    if (typeof elemento !== "object" || elemento === null) continue;
    const record = elemento as Record<string, unknown>;
    const id = estraiId(record._id);
    if (
      !id ||
      typeof record.nome !== "string" ||
      typeof record.cognome !== "string" ||
      typeof record.email !== "string"
    ) {
      continue;
    }
    tutori.push({
      id,
      nome: record.nome,
      cognome: record.cognome,
      email: record.email,
    });
  }

  return tutori.sort(
    (a, b) =>
      a.cognome.localeCompare(b.cognome, "it") ||
      a.nome.localeCompare(b.nome, "it") ||
      a.email.localeCompare(b.email, "it"),
  );
}

function mappaPazienteAssociato(doc: DocumentoPazientePopolato): PazienteAssociato {
  return {
    id: doc._id.toString(),
    nome: doc.nome,
    cognome: doc.cognome,
    codiceFiscale: doc.codiceFiscale,
    email: doc.email,
    dataNascita: doc.dataNascita.toISOString(),
    tutori: estraiTutori(doc.tutori),
  };
}

/**
 * Restituisce i pazienti associati all'utente indicato (`nutrizionista`, `medico` o `tutori`),
 * completi dei tutori associati e filtrabili per nome, cognome, codice fiscale o e-mail.
 * Espone esclusivamente i campi anagrafici, ordinati per cognome, nome ed e-mail.
 */
export async function cercaPazientiAssociati(
  campo: CampoAssociazionePaziente,
  utenteId: string,
  search?: string,
): Promise<PazienteAssociato[]> {
  if (!isObjectIdValido(utenteId)) return [];

  const query: Record<string, unknown> = {
    [campo]: new Types.ObjectId(utenteId),
  };
  aggiungiFiltroRicerca(query, search);

  const documenti = await Paziente.find(query)
    .select(CAMPI_PAZIENTE_ANAGRAFICI)
    .populate({ path: "tutori", match: { ruolo: "TUTORE" }, select: CAMPI_TUTORE_ANAGRAFICI })
    .sort({ cognome: 1, nome: 1, email: 1 })
    .lean<DocumentoPazientePopolato[]>();

  return documenti.map(mappaPazienteAssociato);
}

/**
 * Restituisce i dettagli anagrafici di base del paziente e i relativi tutori solo se
 * il paziente esiste ed è associato all'utente indicato; altrimenti restituisce null.
 */
export async function trovaPazienteAssociato(
  campo: CampoAssociazionePaziente,
  utenteId: string,
  pazienteId: string,
): Promise<PazienteAssociato | null> {
  if (!isObjectIdValido(utenteId) || !isObjectIdValido(pazienteId)) {
    return null;
  }

  const documento = await Paziente.findOne({
    _id: new Types.ObjectId(pazienteId),
    [campo]: new Types.ObjectId(utenteId),
  })
    .select(CAMPI_PAZIENTE_ANAGRAFICI)
    .populate({ path: "tutori", match: { ruolo: "TUTORE" }, select: CAMPI_TUTORE_ANAGRAFICI })
    .lean<DocumentoPazientePopolato | null>();

  return documento ? mappaPazienteAssociato(documento) : null;
}
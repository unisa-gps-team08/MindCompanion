import mongoose, { Types, type ClientSession } from "mongoose";
import { Paziente } from "@/db/models/Paziente";
import { PianoAlimentare } from "@/db/models/PianoAlimentare";
import { SessioneAccesso } from "@/db/models/SessioneAccesso";
import { Utente, type Ruolo } from "@/db/models/Utente";

// Codice MongoDB (IllegalOperation) restituito da un'istanza standalone che non supporta transazioni.
const CODICE_TRANSAZIONE_NON_SUPPORTATA = 20;
const COLLEZIONE_PIANI_STIMOLAZIONE = "pianiStimolazione";
const COLLEZIONE_SESSIONI_STIMOLAZIONE = "sessioniStimolazione";

export type EsitoEliminazioneUtente =
  | { esito: "eliminato"; id: string }
  | { esito: "non_trovato" }
  | { esito: "non_eliminabile" };

function isTransazioneNonSupportata(errore: unknown): boolean {
  if (typeof errore !== "object" || errore === null) return false;
  const codice = "code" in errore ? errore.code : undefined;
  const messaggio = "message" in errore && typeof errore.message === "string" ? errore.message : "";
  return codice === CODICE_TRANSAZIONE_NON_SUPPORTATA && messaggio.includes("replica set");
}

/** Rimuove i riferimenti dell'utente da tutti i pazienti associati per evitare associazioni orfane. */
async function rimuoviAssociazioni(
  utenteId: Types.ObjectId,
  ruolo: Ruolo,
  session?: ClientSession,
): Promise<void> {
  const opzioni = session ? { session } : {};
  if (ruolo === "MEDICO") {
    await Paziente.updateMany({ medico: utenteId }, { $set: { medico: null } }, opzioni);
    return;
  }
  if (ruolo === "NUTRIZIONISTA") {
    await Paziente.updateMany({ nutrizionista: utenteId }, { $set: { nutrizionista: null } }, opzioni);
    return;
  }
  if (ruolo === "TUTORE") {
    await Paziente.updateMany({ tutori: utenteId }, { $pull: { tutori: utenteId } }, opzioni);
  }
}

/** Rimuove piani e sessioni cliniche collegati a un paziente per evitare documenti orfani. */
async function rimuoviDatiPaziente(
  utenteId: Types.ObjectId,
  session?: ClientSession,
): Promise<void> {
  const opzioni = session ? { session } : {};
  await PianoAlimentare.deleteMany({ paziente: utenteId }, opzioni);
  // Piani e sessioni di stimolazione non hanno ancora un model Mongoose dedicato:
  // si puliscono direttamente le collezioni definite in src/db/setup/schema/.
  await mongoose.connection
    .collection(COLLEZIONE_PIANI_STIMOLAZIONE)
    .deleteMany({ paziente: utenteId }, opzioni);
  await mongoose.connection
    .collection(COLLEZIONE_SESSIONI_STIMOLAZIONE)
    .deleteMany({ paziente: utenteId }, opzioni);
}

async function eseguiEliminazione(
  utenteId: Types.ObjectId,
  id: string,
  session?: ClientSession,
): Promise<EsitoEliminazioneUtente> {
  const opzioni = session ? { session } : {};
  const utente = await Utente.findById(utenteId, "ruolo", opzioni).lean();
  if (!utente) return { esito: "non_trovato" };
  if (utente.ruolo === "AMMINISTRATORE") return { esito: "non_eliminabile" };

  // Si rimuovono prima riferimenti, piani e sessioni: se un'operazione fallisce fuori transazione,
  // il documento utente resta presente e consente di ripetere la richiesta senza lasciare orfani.
  await rimuoviAssociazioni(utenteId, utente.ruolo, session);

  if (utente.ruolo === "PAZIENTE") {
    await rimuoviDatiPaziente(utenteId, session);
  }

  await SessioneAccesso.deleteMany({ utente: utenteId }, opzioni);
  const eliminazione = await Utente.deleteOne({ _id: utenteId, ruolo: { $ne: "AMMINISTRATORE" } }, opzioni);
  if (eliminazione.deletedCount === 0) return { esito: "non_trovato" };

  // In assenza di transazione (MongoDB standalone), un secondo passaggio idempotente dopo la
  // rimozione dell'utente elimina eventuali riferimenti o piani inseriti in concorrenza.
  if (!session) {
    await rimuoviAssociazioni(utenteId, utente.ruolo);
    if (utente.ruolo === "PAZIENTE") {
      await rimuoviDatiPaziente(utenteId);
    }
  }

  return { esito: "eliminato", id };
}

/**
 * Elimina un utente non amministratore dalla piattaforma (RF_AD_3).
 * Esegue pulizia delle associazioni, dei piani collegati, delle sessioni attive e del documento
 * Utente in una transazione atomica quando MongoDB opera in replica set; su istanze standalone
 * (es. Docker Compose locale) ricade su una sequenza idempotente con pulizia finale anti-orfani.
 */
export async function eliminaUtente(id: string): Promise<EsitoEliminazioneUtente> {
  const utenteId = new Types.ObjectId(id);
  const session = await mongoose.startSession();
  try {
    let esito: EsitoEliminazioneUtente = { esito: "non_trovato" };
    await session.withTransaction(async () => {
      esito = await eseguiEliminazione(utenteId, id, session);
    });
    return esito;
  } catch (errore: unknown) {
    if (isTransazioneNonSupportata(errore)) {
      return eseguiEliminazione(utenteId, id);
    }
    throw errore;
  } finally {
    await session.endSession();
  }
}

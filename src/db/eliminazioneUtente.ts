import { Types } from "mongoose";
import { Paziente } from "@/db/models/Paziente";
import { PianoAlimentare } from "@/db/models/PianoAlimentare";
import { SessioneAccesso } from "@/db/models/SessioneAccesso";
import { Utente, type Ruolo } from "@/db/models/Utente";

export type EsitoEliminazioneUtente =
  | { esito: "eliminato"; id: string }
  | { esito: "non_trovato" }
  | { esito: "non_eliminabile" };

/** Rimuove i riferimenti dell'utente da tutti i pazienti associati per evitare associazioni orfane. */
async function rimuoviAssociazioni(utenteId: Types.ObjectId, ruolo: Ruolo): Promise<void> {
  if (ruolo === "MEDICO") {
    await Paziente.updateMany({ medico: utenteId }, { $set: { medico: null } });
    return;
  }
  if (ruolo === "NUTRIZIONISTA") {
    await Paziente.updateMany({ nutrizionista: utenteId }, { $set: { nutrizionista: null } });
    return;
  }
  if (ruolo === "TUTORE") {
    await Paziente.updateMany({ tutori: utenteId }, { $pull: { tutori: utenteId } });
  }
}

/**
 * Elimina un utente non amministratore dalla piattaforma (RF_AD_3).
 * Ripulisce le associazioni sui pazienti, l'eventuale piano alimentare e le sessioni attive
 * prima di rimuovere il documento Utente, così un eventuale retry resta idempotente.
 */
export async function eliminaUtente(id: string): Promise<EsitoEliminazioneUtente> {
  const utenteId = new Types.ObjectId(id);
  const utente = await Utente.findById(utenteId).select("ruolo").lean();
  if (!utente) return { esito: "non_trovato" };
  if (utente.ruolo === "AMMINISTRATORE") return { esito: "non_eliminabile" };

  // Si rimuovono prima riferimenti, piani e sessioni: se un'operazione fallisce,
  // il documento utente resta presente e consente di ripetere la richiesta senza lasciare orfani.
  await rimuoviAssociazioni(utenteId, utente.ruolo);

  if (utente.ruolo === "PAZIENTE") {
    // Settimana prossima con le successive task verrà aggiornata elimina utente includendo anche il piano di stimolazione e piano alimentare a lui associato
    await PianoAlimentare.deleteMany({ paziente: utenteId });
  }

  await SessioneAccesso.deleteMany({ utente: utenteId });
  await Utente.deleteOne({ _id: utenteId });

  return { esito: "eliminato", id };
}

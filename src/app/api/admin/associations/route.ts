import type { Types } from "mongoose";
import { connectDB } from "@/db/connect";
import { Paziente } from "@/db/models/Paziente";
import { richiediRuolo } from "@/lib/autorizzazione";
import type { PazienteElenco } from "@/lib/associazioniPaziente";

type DatiPaziente = Omit<PazienteElenco, "id"> & { _id: Types.ObjectId };

// Elenco dei pazienti da cui si apre la gestione delle associazioni (RF_AD_10, RF_AD_11).
// Provvisorio fino all'Elenco utenti (RF_AD_7, issue #20). Solo l'amministratore (RNF_FUN_3).
export async function GET() {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  try {
    await connectDB();
    const pazienti = await Paziente.find()
      .select("nome cognome codiceFiscale email")
      .sort({ cognome: 1, nome: 1 })
      .lean<DatiPaziente[]>();

    const elenco: PazienteElenco[] = pazienti.map(({ _id, ...dati }) => ({ id: String(_id), ...dati }));
    return Response.json({ pazienti: elenco });
  } catch {
    return Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });
  }
}

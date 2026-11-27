import { connectDB } from "@/db/connect";
import { eliminaUtente } from "@/db/eliminazioneUtente";
import { richiediRuolo } from "@/lib/autorizzazione";

type Contesto = { params: Promise<{ id: string }> };

const REGEX_OBJECT_ID = /^[0-9a-fA-F]{24}$/;
const INTESTAZIONI_NO_CACHE = { "Cache-Control": "no-store" };
const MESSAGGIO_NON_TROVATO = "Utente non trovato.";
const MESSAGGIO_NON_VALIDO = "Richiesta non valida.";
const MESSAGGIO_NON_DISPONIBILE = "Servizio non disponibile, riprova più tardi.";
const MESSAGGIO_ERRORE_INTERNO = "Errore interno durante l'eliminazione dell'utente.";

const ERRORI_VALIDAZIONE = new Set(["CastError", "ValidationError"]);
const ERRORI_DISPONIBILITA_DB = new Set([
  "MongoNetworkError",
  "MongoNetworkTimeoutError",
  "MongoServerSelectionError",
  "MongoTopologyClosedError",
  "MongoWaitQueueTimeoutError",
  "MongoNotPrimaryError",
]);

function classificaErrore(errore: unknown): { stato: number; messaggio: string } {
  const nome = errore instanceof Error ? errore.name : "";
  if (ERRORI_VALIDAZIONE.has(nome)) {
    return { stato: 400, messaggio: MESSAGGIO_NON_VALIDO };
  }
  if (ERRORI_DISPONIBILITA_DB.has(nome)) {
    return { stato: 503, messaggio: MESSAGGIO_NON_DISPONIBILE };
  }
  return { stato: 500, messaggio: MESSAGGIO_ERRORE_INTERNO };
}

// EliminaUtenteControl (RF_AD_3): solo l'amministratore elimina un utente non amministratore,
// rimuovendo anche le associazioni e i dati collegati per evitare riferimenti orfani.
export async function DELETE(_request: Request, { params }: Contesto) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const { id } = await params;
  if (!REGEX_OBJECT_ID.test(id)) {
    return Response.json({ errore: MESSAGGIO_NON_TROVATO }, { status: 404, headers: INTESTAZIONI_NO_CACHE });
  }

  try {
    await connectDB();
  } catch {
    return Response.json(
      { errore: MESSAGGIO_NON_DISPONIBILE },
      { status: 503, headers: INTESTAZIONI_NO_CACHE },
    );
  }

  try {
    const risultato = await eliminaUtente(id);

    if (risultato.esito === "non_trovato") {
      return Response.json({ errore: MESSAGGIO_NON_TROVATO }, { status: 404, headers: INTESTAZIONI_NO_CACHE });
    }
    if (risultato.esito === "non_eliminabile") {
      return Response.json(
        { errore: "Non è possibile eliminare un account amministratore." },
        { status: 403, headers: INTESTAZIONI_NO_CACHE },
      );
    }

    return Response.json({ id: risultato.id }, { status: 200, headers: INTESTAZIONI_NO_CACHE });
  } catch (errore: unknown) {
    const { stato, messaggio } = classificaErrore(errore);
    return Response.json({ errore: messaggio }, { status: stato, headers: INTESTAZIONI_NO_CACHE });
  }
}

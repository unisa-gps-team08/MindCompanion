import { connectDB } from "@/db/connect";
import { eliminaUtente } from "@/db/eliminazioneUtente";
import { richiediRuolo } from "@/lib/autorizzazione";

type Contesto = { params: Promise<{ id: string }> };

const REGEX_OBJECT_ID = /^[0-9a-fA-F]{24}$/;
const INTESTAZIONI_NO_CACHE = { "Cache-Control": "no-store" };
const MESSAGGIO_NON_TROVATO = "Utente non trovato.";
const MESSAGGIO_NON_DISPONIBILE = "Servizio non disponibile, riprova più tardi.";

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
  } catch {
    return Response.json(
      { errore: MESSAGGIO_NON_DISPONIBILE },
      { status: 503, headers: INTESTAZIONI_NO_CACHE },
    );
  }
}

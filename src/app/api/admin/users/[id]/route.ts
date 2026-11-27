import { isValidObjectId } from "mongoose";
import { connectDB } from "@/db/connect";
import { eliminaUtente } from "@/db/eliminazioneUtente";
import { Medico } from "@/db/models/Medico";
import { Utente } from "@/db/models/Utente";
import { richiediRuolo } from "@/lib/autorizzazione";
import { isRuoloModificabile, validaModificaUtente } from "@/lib/validazioneModificaUtente";
import type { ErroriCampi, NuovoUtente } from "@/lib/validazioneNuovoUtente";

type Contesto = { params: Promise<{ id: string }> };

const REGEX_OBJECT_ID = /^[0-9a-fA-F]{24}$/;
const INTESTAZIONI_NO_CACHE = { "Cache-Control": "no-store" };
const MESSAGGIO_DUPLICATO = "E-mail o codice fiscale già usati da un altro utente.";
const MESSAGGIO_NON_TROVATO = "Utente non trovato.";
const MESSAGGIO_NON_VALIDO = "Richiesta non valida.";
const MESSAGGIO_NON_DISPONIBILE = "Servizio non disponibile, riprova più tardi.";
const MESSAGGIO_ERRORE_INTERNO = "Errore interno durante l'eliminazione dell'utente.";

// Solo dati anagrafici e, per il medico, i suoi campi professionali: nessun dato sanitario.
const CAMPI_RESTITUITI = "nome cognome email codiceFiscale dataNascita ruolo codiceMedico specializzazione";

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

/** Indica quali campi univoci sono già usati da un utente diverso da quello in modifica. */
async function trovaDuplicati(id: string, email: string, codiceFiscale: string): Promise<ErroriCampi | null> {
  const esistente = await Utente.findOne({ _id: { $ne: id }, $or: [{ email }, { codiceFiscale }] })
    .select("email codiceFiscale")
    .lean();
  if (!esistente) return null;

  const errori: ErroriCampi = {};
  if (esistente.email === email) errori.email = "E-mail già usata da un altro utente.";
  if (esistente.codiceFiscale === codiceFiscale) errori.codiceFiscale = "Codice fiscale già usato da un altro utente.";
  return errori;
}

// updateOne invece di save(): non costruisce il documento, quindi funziona anche per i ruoli
// senza sottoclasse (TUTORE, NUTRIZIONISTA). Il medico passa dal suo model per i campi propri.
async function aggiornaUtente(id: string, valori: NuovoUtente) {
  const { ruolo, codiceMedico, specializzazione, ...anagrafica } = valori;
  const opzioni = { runValidators: true };
  if (ruolo === "MEDICO") {
    return Medico.updateOne({ _id: id }, { $set: { ...anagrafica, codiceMedico, specializzazione } }, opzioni);
  }
  return Utente.updateOne({ _id: id }, { $set: anagrafica }, opzioni);
}

// Due modifiche quasi contemporanee possono superare trovaDuplicati: l'indice univoco le blocca.
function isChiaveDuplicata(errore: unknown): boolean {
  return typeof errore === "object" && errore !== null && "code" in errore && errore.code === 11000;
}

// ModificaUtenteControl (RF_AD_2): dati attuali dell'utente per precompilare il form.
export async function GET(_request: Request, { params }: Contesto) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const { id } = await params;
  if (!isValidObjectId(id)) return Response.json({ errore: MESSAGGIO_NON_TROVATO }, { status: 404 });

  try {
    await connectDB();
    const utente = await Utente.findById(id).select(CAMPI_RESTITUITI).lean();
    if (!utente) return Response.json({ errore: MESSAGGIO_NON_TROVATO }, { status: 404 });
    const { _id, ...dati } = utente;
    return Response.json({ id: _id.toString(), ...dati });
  } catch {
    return Response.json({ errore: MESSAGGIO_NON_DISPONIBILE }, { status: 503 });
  }
}

// ModificaUtenteControl (RF_AD_2): l'amministratore aggiorna i dati di un utente esistente.
export async function PUT(request: Request, { params }: Contesto) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const { id } = await params;
  if (!isValidObjectId(id)) return Response.json({ errore: MESSAGGIO_NON_TROVATO }, { status: 404 });
  const dati: unknown = await request.json().catch(() => null);

  try {
    await connectDB();
    const attuale = await Utente.findById(id).select("ruolo").lean();
    if (!attuale) return Response.json({ errore: MESSAGGIO_NON_TROVATO }, { status: 404 });
    if (!isRuoloModificabile(attuale.ruolo)) {
      return Response.json({ errore: "Questo utente non si può modificare da qui." }, { status: 403 });
    }

    const esito = validaModificaUtente(dati, attuale.ruolo);
    if (!esito.valido) {
      return Response.json({ errore: "Controlla i campi evidenziati.", campi: esito.errori }, { status: 400 });
    }

    const duplicati = await trovaDuplicati(id, esito.valori.email, esito.valori.codiceFiscale);
    if (duplicati) return Response.json({ errore: MESSAGGIO_DUPLICATO, campi: duplicati }, { status: 409 });

    await aggiornaUtente(id, esito.valori);
    return Response.json({ id });
  } catch (errore) {
    if (isChiaveDuplicata(errore)) return Response.json({ errore: MESSAGGIO_DUPLICATO }, { status: 409 });
    return Response.json({ errore: MESSAGGIO_NON_DISPONIBILE }, { status: 503 });
  }
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
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/db/connect";
import { Medico } from "@/db/models/Medico";
import { Utente } from "@/db/models/Utente";
import { richiediRuolo } from "@/lib/autorizzazione";
import { isRuoloModificabile, validaModificaUtente } from "@/lib/validazioneModificaUtente";
import type { ErroriCampi, NuovoUtente } from "@/lib/validazioneNuovoUtente";

type Contesto = { params: Promise<{ id: string }> };

const MESSAGGIO_DUPLICATO = "E-mail o codice fiscale già usati da un altro utente.";
const MESSAGGIO_NON_TROVATO = "Utente non trovato.";
const MESSAGGIO_NON_DISPONIBILE = "Servizio non disponibile, riprova più tardi.";

// Solo dati anagrafici e, per il medico, i suoi campi professionali: nessun dato sanitario.
const CAMPI_RESTITUITI = "nome cognome email codiceFiscale dataNascita ruolo codiceMedico specializzazione";

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

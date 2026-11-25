import { connectDB } from "@/db/connect";
import { Medico } from "@/db/models/Medico";
import { Paziente } from "@/db/models/Paziente";
import { Utente } from "@/db/models/Utente";
import { calcolaHashPassword } from "@/db/password";
import { richiediRuolo } from "@/lib/autorizzazione";
import { validaNuovoUtente, type ErroriCampi, type NuovoUtente } from "@/lib/validazioneNuovoUtente";

const MESSAGGIO_DUPLICATO = "Esiste già un utente con questa e-mail o con questo codice fiscale.";

/** Indica quali campi univoci sono già usati da un altro utente. */
async function trovaDuplicati(email: string, codiceFiscale: string): Promise<ErroriCampi | null> {
  const esistente = await Utente.findOne({ $or: [{ email }, { codiceFiscale }] })
    .select("email codiceFiscale")
    .lean();
  if (!esistente) return null;

  const errori: ErroriCampi = {};
  if (esistente.email === email) errori.email = "E-mail già registrata.";
  if (esistente.codiceFiscale === codiceFiscale) errori.codiceFiscale = "Codice fiscale già registrato.";
  return errori;
}

/** Salva l'utente con il model del suo ruolo: Medico e Paziente hanno campi propri. */
async function salvaUtente(valori: NuovoUtente) {
  const { password, codiceMedico, specializzazione, ...anagrafica } = valori;
  const documento = { ...anagrafica, passwordHash: await calcolaHashPassword(password) };

  if (valori.ruolo === "MEDICO") return Medico.create({ ...documento, codiceMedico, specializzazione });
  if (valori.ruolo === "PAZIENTE") return Paziente.create(documento);
  return Utente.create(documento);
}

// Due inserimenti quasi contemporanei possono superare trovaDuplicati: l'indice univoco li blocca.
function isChiaveDuplicata(errore: unknown): boolean {
  return typeof errore === "object" && errore !== null && "code" in errore && errore.code === 11000;
}

// InserisciUtenteControl (RF_AD_1): solo l'amministratore registra nuovi utenti (RNF_FUN_3).
export async function POST(request: Request) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const esito = validaNuovoUtente(await request.json().catch(() => null));
  if (!esito.valido) {
    return Response.json({ errore: "Controlla i campi evidenziati.", campi: esito.errori }, { status: 400 });
  }

  try {
    await connectDB();
    const duplicati = await trovaDuplicati(esito.valori.email, esito.valori.codiceFiscale);
    if (duplicati) {
      return Response.json({ errore: MESSAGGIO_DUPLICATO, campi: duplicati }, { status: 409 });
    }

    const utente = await salvaUtente(esito.valori);
    return Response.json({ id: utente._id.toString() }, { status: 201 });
  } catch (errore) {
    if (isChiaveDuplicata(errore)) {
      return Response.json({ errore: MESSAGGIO_DUPLICATO }, { status: 409 });
    }
    return Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });
  }
}

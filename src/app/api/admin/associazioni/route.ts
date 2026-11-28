import { isValidObjectId } from "mongoose";
import { connectDB } from "@/db/connect";
import { Medico } from "@/db/models/Medico";
import { Paziente } from "@/db/models/Paziente";
import { Utente, type Ruolo } from "@/db/models/Utente";
import { richiediRuolo } from "@/lib/autorizzazione";

const RUOLI_ASSOCIABILI = ["MEDICO", "NUTRIZIONISTA", "TUTORE"] as const;
type RuoloAssociabile = (typeof RUOLI_ASSOCIABILI)[number];

function èRuoloAssociabile(valore: unknown): valore is RuoloAssociabile {
  return typeof valore === "string" && RUOLI_ASSOCIABILI.includes(valore as RuoloAssociabile);
}

function datiAnagrafici(utente: {
  _id: unknown;
  nome: string;
  cognome: string;
  email: string;
  codiceFiscale: string;
  dataNascita: Date;
}) {
  return {
    id: String(utente._id),
    nome: utente.nome,
    cognome: utente.cognome,
    email: utente.email,
    codiceFiscale: utente.codiceFiscale,
    dataNascita: utente.dataNascita,
  };
}

/** Restituisce pazienti e candidati del ruolo richiesto, senza esporre dati non anagrafici. */
export async function GET(request: Request) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const ruolo = new URL(request.url).searchParams.get("ruolo");
  if (!èRuoloAssociabile(ruolo)) {
    return Response.json({ errore: "Seleziona un ruolo valido." }, { status: 400 });
  }

  try {
    await connectDB();
    const [pazienti, utenti, figure] = await Promise.all([
      Paziente.find({ ruolo: "PAZIENTE" })
        .select("nome cognome email codiceFiscale dataNascita medico nutrizionista tutori")
        .lean(),
      Utente.find({ ruolo: ruolo as Ruolo })
        .select("nome cognome email codiceFiscale dataNascita")
        .sort({ cognome: 1, nome: 1 })
        .lean(),
      Utente.find({ ruolo: { $in: RUOLI_ASSOCIABILI } })
        .select("nome cognome")
        .lean(),
    ]);
    const nomiFigure = new Map(figure.map((figura) => [String(figura._id), `${figura.nome} ${figura.cognome}`]));

    return Response.json({
      pazienti: pazienti.map((paziente) => ({
        ...datiAnagrafici(paziente),
        associazioni: {
          medico: paziente.medico ? String(paziente.medico) : null,
          medicoNome: paziente.medico ? nomiFigure.get(String(paziente.medico)) ?? "Utente non disponibile" : null,
          nutrizionista: paziente.nutrizionista ? String(paziente.nutrizionista) : null,
          nutrizionistaNome: paziente.nutrizionista
            ? nomiFigure.get(String(paziente.nutrizionista)) ?? "Utente non disponibile"
            : null,
          tutori: (paziente.tutori ?? []).map(String),
          tutoriNomi: (paziente.tutori ?? []).map((id) => nomiFigure.get(String(id)) ?? "Utente non disponibile"),
        },
      })),
      utenti: utenti.map(datiAnagrafici),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ errore: "Impossibile recuperare gli utenti. Riprova più tardi." }, { status: 503 });
  }
}

/** Assegna una figura di supporto verificando ruolo, duplicati e cardinalità sul documento paziente. */
export async function POST(request: Request) {
  const { risposta } = await richiediRuolo("AMMINISTRATORE");
  if (risposta) return risposta;

  const corpo: unknown = await request.json().catch(() => null);
  if (typeof corpo !== "object" || corpo === null) {
    return Response.json({ errore: "Richiesta non valida." }, { status: 400 });
  }

  const dati = corpo as Record<string, unknown>;
  const pazienteId = dati.pazienteId;
  const utenteId = dati.utenteId;
  const ruolo = dati.ruolo;

  if (
    typeof pazienteId !== "string" || !isValidObjectId(pazienteId) ||
    typeof utenteId !== "string" || !isValidObjectId(utenteId) ||
    !èRuoloAssociabile(ruolo)
  ) {
    return Response.json({ errore: "Paziente, utente o ruolo non validi." }, { status: 400 });
  }

  try {
    await connectDB();

    const pazienteEsistente = await Paziente.exists({ _id: pazienteId, ruolo: "PAZIENTE" });
    if (!pazienteEsistente) {
      return Response.json({ errore: "Il paziente selezionato non esiste." }, { status: 404 });
    }

    const figura = ruolo === "MEDICO"
      ? await Medico.exists({ _id: utenteId, ruolo: "MEDICO" })
      : await Utente.exists({ _id: utenteId, ruolo });

    if (!figura) {
      return Response.json({ errore: "L'utente selezionato non appartiene al ruolo richiesto." }, { status: 400 });
    }

    let esito;
    if (ruolo === "MEDICO") {
      esito = await Paziente.updateOne(
        { _id: pazienteId, medico: null },
        { $set: { medico: utenteId } },
      );
      if (esito.modifiedCount === 0) {
        const paziente = await Paziente.findById(pazienteId).select("medico").lean();
        const messaggio = String(paziente?.medico ?? "") === utenteId
          ? "Questo medico è già associato al paziente."
          : "Il paziente ha già un medico associato. Rimuovi o sostituisci l'associazione esistente.";
        return Response.json({ errore: messaggio }, { status: 409 });
      }
    } else if (ruolo === "NUTRIZIONISTA") {
      esito = await Paziente.updateOne(
        { _id: pazienteId, nutrizionista: null },
        { $set: { nutrizionista: utenteId } },
      );
      if (esito.modifiedCount === 0) {
        const paziente = await Paziente.findById(pazienteId).select("nutrizionista").lean();
        const messaggio = String(paziente?.nutrizionista ?? "") === utenteId
          ? "Questo nutrizionista è già associato al paziente."
          : "Il paziente ha già un nutrizionista associato. Rimuovi o sostituisci l'associazione esistente.";
        return Response.json({ errore: messaggio }, { status: 409 });
      }
    } else {
      esito = await Paziente.updateOne(
        { _id: pazienteId, tutori: { $ne: utenteId } },
        { $addToSet: { tutori: utenteId } },
      );
      if (esito.modifiedCount === 0) {
        return Response.json({ errore: "Questo tutore è già associato al paziente." }, { status: 409 });
      }
    }

    return Response.json({ messaggio: "Associazione creata correttamente." }, { status: 201 });
  } catch {
    return Response.json({ errore: "Impossibile creare l'associazione. Riprova più tardi." }, { status: 503 });
  }
}

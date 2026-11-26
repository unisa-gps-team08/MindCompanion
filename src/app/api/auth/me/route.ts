import { getUtenteCorrente } from "@/lib/sessione";

const INTESTAZIONI_NO_CACHE = { "Cache-Control": "no-store" };

// AutenticazioneControl, profilo utente corrente (issue #19).
export async function GET() {
  try {
    const utente = await getUtenteCorrente();
    if (!utente) {
      return Response.json(
        { errore: "Accesso richiesto." },
        { status: 401, headers: INTESTAZIONI_NO_CACHE },
      );
    }

    return Response.json(
      {
        nome: utente.nome,
        cognome: utente.cognome,
        email: utente.email,
        ruolo: utente.ruolo,
      },
      { headers: INTESTAZIONI_NO_CACHE },
    );
  } catch {
    return Response.json(
      { errore: "Servizio non disponibile, riprova più tardi." },
      { status: 503, headers: INTESTAZIONI_NO_CACHE },
    );
  }
}

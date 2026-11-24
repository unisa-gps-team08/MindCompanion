import { eliminaSessione } from "@/lib/sessione";

// AutenticazioneControl, logout (RF_UE_2).
export async function POST() {
  try {
    await eliminaSessione();
    return Response.json({ esito: "ok" });
  } catch {
    return Response.json({ errore: "Servizio non disponibile, riprova più tardi." }, { status: 503 });
  }
}

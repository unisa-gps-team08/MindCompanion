import type { Ruolo } from "@/db/models/Utente";

/** Pagina di arrivo di ogni ruolo dopo il login (RF_UE_1). Da concordare con la issue #19. */
export const AREA_PER_RUOLO: Record<Ruolo, string> = {
  AMMINISTRATORE: "/amministratore",
  MEDICO: "/medico",
  NUTRIZIONISTA: "/nutrizionista",
  TUTORE: "/tutore",
  PAZIENTE: "/paziente",
};

const AREE = Object.values(AREA_PER_RUOLO);

/** Area del ruolo indicato; per un ruolo sconosciuto si torna al login. */
export function getAreaRuolo(ruolo: string): string {
  return AREA_PER_RUOLO[ruolo as Ruolo] ?? "/login";
}

/** Area a cui appartiene il percorso, oppure null se il percorso non è in nessuna area. */
export function getAreaDelPercorso(percorso: string): string | null {
  return AREE.find((area) => percorso === area || percorso.startsWith(`${area}/`)) ?? null;
}

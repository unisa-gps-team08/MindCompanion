import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UtenteAnagrafico } from "@/lib/validazioneRicercaUtenti";

export const ETICHETTE_RUOLO: Record<UtenteAnagrafico["ruolo"], string> = {
  AMMINISTRATORE: "Amministratore",
  MEDICO: "Medico",
  NUTRIZIONISTA: "Nutrizionista",
  TUTORE: "Tutore",
  PAZIENTE: "Paziente",
};

type TabellaUtentiProps = {
  utenti: UtenteAnagrafico[];
  inCaricamento: boolean;
  haFiltriAttivi: boolean;
  onAzzeraFiltri: () => void;
  onRichiediEliminazione: (utente: UtenteAnagrafico) => void;
};

/** Tabella anagrafica degli utenti con azioni per riga (RF_AD_7, RF_AD_3). */
export function TabellaUtenti({
  utenti,
  inCaricamento,
  haFiltriAttivi,
  onAzzeraFiltri,
  onRichiediEliminazione,
}: TabellaUtentiProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-xs">
      <table className="w-full border-collapse text-left text-sm text-card-foreground">
        <thead>
          <tr className="bg-primary text-primary-foreground">
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
              Cognome
            </th>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
              Nome
            </th>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
              Codice fiscale
            </th>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
              E-mail
            </th>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">
              Ruolo
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold whitespace-nowrap">
              Azioni
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {inCaricamento && utenti.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                Caricamento elenco utenti…
              </td>
            </tr>
          ) : utenti.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-3">
                  <p>
                    {haFiltriAttivi
                      ? "Nessun utente corrisponde ai criteri di ricerca selezionati."
                      : "Nessun utente registrato nella piattaforma."}
                  </p>
                  {haFiltriAttivi && (
                    <button
                      type="button"
                      onClick={onAzzeraFiltri}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      Azzera filtri
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            utenti.map((utente) => (
              <tr
                key={utente.id}
                className={cn(
                  "transition-colors hover:bg-muted/60",
                  inCaricamento && "opacity-60",
                )}
              >
                <td className="px-4 py-3 font-medium whitespace-nowrap">{utente.cognome}</td>
                <td className="px-4 py-3 whitespace-nowrap">{utente.nome}</td>
                <td className="px-4 py-3 font-mono text-xs tracking-wide whitespace-nowrap">
                  {utente.codiceFiscale}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{utente.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">{ETICHETTE_RUOLO[utente.ruolo]}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/amministratore/utenti/${utente.id}/modifica`}
                      aria-label={`Modifica utente ${utente.nome} ${utente.cognome}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      Modifica Utente
                    </Link>
                    {utente.ruolo !== "AMMINISTRATORE" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        aria-label={`Elimina utente ${utente.nome} ${utente.cognome}`}
                        onClick={() => onRichiediEliminazione(utente)}
                      >
                        Elimina
                      </Button>
                    )}
                    {/* Gestisci associazioni è previsto solo per gli utenti con ruolo Paziente. */}
                    {utente.ruolo === "PAZIENTE" && (
                      <Link
                        href={`/amministratore/pazienti/${utente.id}/associazioni`}
                        aria-label={`Gestisci associazioni di ${utente.nome} ${utente.cognome}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        Gestisci associazioni
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

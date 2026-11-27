"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  createColumnHelper,
  createPaginatedRowModel,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { PaginazioneTabella } from "@/components/PaginazioneTabella";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { UtenteAnagrafico } from "@/lib/validazioneRicercaUtenti";

export const ETICHETTE_RUOLO: Record<UtenteAnagrafico["ruolo"], string> = {
  AMMINISTRATORE: "Amministratore",
  MEDICO: "Medico",
  NUTRIZIONISTA: "Nutrizionista",
  TUTORE: "Tutore",
  PAZIENTE: "Paziente",
};

const RIGHE_PER_PAGINA_INIZIALI = 10;

const FUNZIONALITA_TABELLA = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

const helperColonne = createColumnHelper<typeof FUNZIONALITA_TABELLA, UtenteAnagrafico>();

function creaColonneUtenti(onRichiediEliminazione: (utente: UtenteAnagrafico) => void) {
  return helperColonne.columns([
    helperColonne.accessor("cognome", {
      header: "Cognome",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),
    helperColonne.accessor("nome", {
      header: "Nome",
      cell: (info) => info.getValue(),
    }),
    helperColonne.accessor("codiceFiscale", {
      header: "Codice fiscale",
      cell: (info) => <span className="font-mono text-xs tracking-wide">{info.getValue()}</span>,
    }),
    helperColonne.accessor("email", {
      header: "E-mail",
      cell: (info) => info.getValue(),
    }),
    helperColonne.accessor("ruolo", {
      header: "Ruolo",
      cell: (info) => ETICHETTE_RUOLO[info.getValue()],
    }),
    helperColonne.display({
      id: "azioni",
      header: () => <span className="block text-right">Azioni</span>,
      cell: ({ row }) => {
        const utente = row.original;
        return (
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
        );
      },
    }),
  ]);
}

type TabellaUtentiProps = {
  utenti: UtenteAnagrafico[];
  inCaricamento: boolean;
  haFiltriAttivi: boolean;
  onAzzeraFiltri: () => void;
  onRichiediEliminazione: (utente: UtenteAnagrafico) => void;
};

/** Data Table shadcn con paginazione client per l'elenco utenti anagrafici (RF_AD_7). */
export function TabellaUtenti({
  utenti,
  inCaricamento,
  haFiltriAttivi,
  onAzzeraFiltri,
  onRichiediEliminazione,
}: TabellaUtentiProps) {
  const colonne = useMemo(
    () => creaColonneUtenti(onRichiediEliminazione),
    [onRichiediEliminazione],
  );

  const tabella = useTable(
    {
      features: FUNZIONALITA_TABELLA,
      columns: colonne,
      data: utenti,
      getRowId: (utente) => utente.id,
      autoResetPageIndex: true,
      initialState: {
        pagination: { pageIndex: 0, pageSize: RIGHE_PER_PAGINA_INIZIALI },
      },
    },
    (state) => ({ pagination: state.pagination }),
  );

  const righe = tabella.getRowModel().rows;
  const { pageIndex, pageSize } = tabella.state.pagination;
  const totaleUtenti = tabella.getRowCount();
  const totalePagine = Math.max(1, tabella.getPageCount());

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
        <Table>
          <TableHeader>
            {tabella.getHeaderGroups().map((gruppo) => (
              <TableRow
                key={gruppo.id}
                className="border-b-0 bg-primary text-primary-foreground hover:bg-primary"
              >
                {gruppo.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 font-semibold text-primary-foreground"
                  >
                    {header.isPlaceholder ? null : <tabella.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {inCaricamento && totaleUtenti === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={colonne.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Caricamento elenco utenti…
                </TableCell>
              </TableRow>
            ) : righe.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={colonne.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-3">
                    <p>
                      {haFiltriAttivi
                        ? "Nessun utente corrisponde ai criteri di ricerca selezionati."
                        : "Nessun utente registrato nella piattaforma."}
                    </p>
                    {haFiltriAttivi && (
                      <Button variant="outline" size="sm" onClick={onAzzeraFiltri}>
                        Azzera filtri
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              righe.map((riga) => (
                <TableRow key={riga.id} className={cn(inCaricamento && "opacity-60")}>
                  {riga.getAllCells().map((cella) => (
                    <TableCell key={cella.id} className="px-4 py-3">
                      <tabella.FlexRender cell={cella} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginazioneTabella
        pageIndex={pageIndex}
        pageSize={pageSize}
        totaleRighe={totaleUtenti}
        totalePagine={totalePagine}
        puoIndietro={tabella.getCanPreviousPage()}
        puoAvanti={tabella.getCanNextPage()}
        onPrimaPagina={() => tabella.firstPage()}
        onPaginaPrecedente={() => tabella.previousPage()}
        onPaginaSuccessiva={() => tabella.nextPage()}
        onUltimaPagina={() => tabella.lastPage()}
        onCambiaDimensione={(dimensione) => tabella.setPageSize(dimensione)}
      />
    </div>
  );
}

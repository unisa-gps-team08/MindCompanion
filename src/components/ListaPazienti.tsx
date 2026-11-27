"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  formattaDataNascita,
  type PazienteAssociato,
} from "@/lib/validazioneRicercaPazienti";

type ListaPazientiProps = {
  pazienti: PazienteAssociato[];
  percorsoBaseScheda: string;
  inCaricamento: boolean;
  haRicercaAttiva: boolean;
  messaggioVuoto: string;
  onAzzeraRicerca: () => void;
};

const RIGHE_SKELETON = [0, 1, 2] as const;
const NUMERO_COLONNE = 5;

function RigheSkeleton() {
  return (
    <>
      {RIGHE_SKELETON.map((indice) => (
        <TableRow key={indice} className="hover:bg-transparent">
          <TableCell className="px-4 py-3.5">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>
          <TableCell className="px-4 py-3.5">
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="px-4 py-3.5">
            <Skeleton className="h-4 w-44" />
          </TableCell>
          <TableCell className="px-4 py-3.5">
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell className="px-4 py-3.5 text-right">
            <Skeleton className="ml-auto h-7 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

/**
 * Tabella riutilizzabile dei pazienti associati e dei rispettivi tutori.
 * Progettata per essere condivisa tra Nutrizionista, Medico e Tutore.
 */
export function ListaPazienti({
  pazienti,
  percorsoBaseScheda,
  inCaricamento,
  haRicercaAttiva,
  messaggioVuoto,
  onAzzeraRicerca,
}: ListaPazientiProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="border-b-0 bg-primary text-primary-foreground hover:bg-primary">
            <TableHead className="h-11 px-4 font-semibold text-primary-foreground">
              Paziente
            </TableHead>
            <TableHead className="h-11 px-4 font-semibold text-primary-foreground">
              Codice fiscale
            </TableHead>
            <TableHead className="h-11 px-4 font-semibold text-primary-foreground">
              E-mail
            </TableHead>
            <TableHead className="h-11 px-4 font-semibold text-primary-foreground">
              Tutori associati
            </TableHead>
            <TableHead className="h-11 px-4 text-right font-semibold text-primary-foreground">
              Azioni
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {inCaricamento && pazienti.length === 0 ? (
            <RigheSkeleton />
          ) : pazienti.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={NUMERO_COLONNE}
                className="px-4 py-10 text-center whitespace-normal text-muted-foreground"
              >
                <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                  <Users aria-hidden="true" className="size-6 text-muted-foreground/80" />
                  <p className="text-sm">
                    {haRicercaAttiva
                      ? "Nessun paziente associato corrisponde ai criteri di ricerca."
                      : messaggioVuoto}
                  </p>
                  {haRicercaAttiva && (
                    <Button variant="outline" size="sm" onClick={onAzzeraRicerca}>
                      Azzera ricerca
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            pazienti.map((paziente) => (
              <TableRow key={paziente.id} className={cn(inCaricamento && "opacity-60")}>
                <TableCell className="px-4 py-3.5 whitespace-normal">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {paziente.cognome} {paziente.nome}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Nato il {formattaDataNascita(paziente.dataNascita)}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3.5">
                  <span className="font-mono text-xs tracking-wide text-foreground">
                    {paziente.codiceFiscale}
                  </span>
                </TableCell>

                <TableCell className="px-4 py-3.5 text-foreground">{paziente.email}</TableCell>

                <TableCell className="px-4 py-3.5 whitespace-normal">
                  {paziente.tutori.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Nessun tutore associato</span>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {paziente.tutori.map((tutore) => (
                        <li key={tutore.id} className="text-sm leading-snug">
                          <span className="font-medium text-foreground">
                            {tutore.cognome} {tutore.nome}
                          </span>{" "}
                          <span className="text-xs text-muted-foreground">({tutore.email})</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </TableCell>

                <TableCell className="px-4 py-3.5 text-right">
                  <Link
                    href={`${percorsoBaseScheda}/${paziente.id}`}
                    aria-label={`Apri scheda di ${paziente.nome} ${paziente.cognome}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <span>Apri scheda</span>
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

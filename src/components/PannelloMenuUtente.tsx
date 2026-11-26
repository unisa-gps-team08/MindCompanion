"use client";

import { KeyRoundIcon, LoaderCircle, LogOutIcon } from "lucide-react";
import { BadgeRuolo } from "@/components/BadgeRuolo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { ProfiloUtente } from "@/lib/navigazione";
import { cn } from "@/lib/utils";

type AvatarUtenteProps = {
  iniziali: string;
  className: string;
  classeTesto: string;
};

// Avatar circolare con iniziali dell'utente, coerente con la scheda di ModificaUtente.
export function AvatarUtente({
  iniziali,
  className,
  classeTesto,
}: AvatarUtenteProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback
        className={cn(
          "bg-primary font-semibold text-primary-foreground",
          classeTesto,
        )}
      >
        {iniziali}
      </AvatarFallback>
    </Avatar>
  );
}

type PannelloMenuUtenteProps = {
  utente: ProfiloUtente;
  nomeCompleto: string;
  iniziali: string;
  modalitaPaziente: boolean;
  isMobile: boolean;
  uscitaInCorso: boolean;
  onCambiaPassword: () => void;
  onEsci: () => void;
};

// Pannello dropdown del profilo utente con cambio password (RF_UE_3) e logout (RF_UE_2).
export function PannelloMenuUtente({
  utente,
  nomeCompleto,
  iniziali,
  modalitaPaziente,
  isMobile,
  uscitaInCorso,
  onCambiaPassword,
  onEsci,
}: PannelloMenuUtenteProps) {
  const classeVoce = cn(
    "cursor-pointer rounded-lg font-medium",
    modalitaPaziente
      ? "min-h-13 gap-3 px-3.5 py-3 text-lg"
      : "gap-2.5 px-3 py-2.5 text-sm",
  );
  const classeIcona = modalitaPaziente ? "size-5" : "size-4";

  return (
    <DropdownMenuContent
      className="w-auto max-w-[calc(100vw-2rem)] min-w-80 overflow-hidden rounded-xl border border-border bg-popover p-0 font-sans shadow-md ring-0"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={8}
    >
      <DropdownMenuGroup>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-3.5 py-3 text-left">
            <AvatarUtente
              iniziali={iniziali}
              className={modalitaPaziente ? "size-11" : "size-10"}
              classeTesto={modalitaPaziente ? "text-lg" : "text-sm"}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span
                className={cn(
                  "truncate font-sans font-semibold text-foreground",
                  modalitaPaziente ? "text-xl" : "text-base",
                )}
              >
                {nomeCompleto}
              </span>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <BadgeRuolo
                  ruolo={utente.ruolo}
                  modalitaPaziente={modalitaPaziente}
                  className="shrink-0"
                />
                <span
                  title={utente.email}
                  className={cn(
                    "min-w-0 truncate",
                    modalitaPaziente
                      ? "text-lg text-foreground/85"
                      : "text-xs text-muted-foreground",
                  )}
                >
                  {utente.email}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuGroup>

      <div className="flex flex-col gap-1 p-1.5">
        {/* CambiaPasswordButton (RF_UE_3): apre CambiaPasswordForm. */}
        <DropdownMenuItem onClick={onCambiaPassword} className={classeVoce}>
          <KeyRoundIcon className={classeIcona} aria-hidden="true" />
          <span>Cambia password</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="mx-0 my-0.5" />

        <DropdownMenuItem
          variant="destructive"
          disabled={uscitaInCorso}
          onClick={onEsci}
          className={classeVoce}
        >
          {uscitaInCorso ? (
            <LoaderCircle
              className={cn(
                "animate-spin motion-reduce:animate-none",
                classeIcona,
              )}
              aria-hidden="true"
            />
          ) : (
            <LogOutIcon className={classeIcona} aria-hidden="true" />
          )}
          <span>{uscitaInCorso ? "Uscita in corso…" : "Logout"}</span>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  );
}

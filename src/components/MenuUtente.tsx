"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDownIcon, CircleX } from "lucide-react";
import { AvatarUtente, PannelloMenuUtente } from "@/components/PannelloMenuUtente";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { PERCORSO_CAMBIA_PASSWORD } from "@/lib/aree";
import {
  calcolaIniziali,
  ETICHETTE_RUOLO,
  type ProfiloUtente,
} from "@/lib/navigazione";
import { cn } from "@/lib/utils";

type MenuUtenteProps = {
  utente: ProfiloUtente;
  modalitaPaziente: boolean;
};

// Trigger e stato del menu utente nel footer della sidebar (RF_UE_2, RF_UE_3).
export function MenuUtente({ utente, modalitaPaziente }: MenuUtenteProps) {
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const [uscitaInCorso, setUscitaInCorso] = useState(false);
  const [erroreLogout, setErroreLogout] = useState("");

  const nomeCompleto = `${utente.nome} ${utente.cognome}`.trim();
  const etichettaRuolo = ETICHETTE_RUOLO[utente.ruolo];
  const iniziali = calcolaIniziali(utente.nome, utente.cognome);

  function apriCambiaPassword() {
    setOpenMobile(false);
    router.push(PERCORSO_CAMBIA_PASSWORD);
  }

  async function esci() {
    setErroreLogout("");
    setUscitaInCorso(true);
    try {
      const risposta = await fetch("/api/auth/logout", { method: "POST" });
      if (!risposta.ok) {
        setErroreLogout("Uscita non riuscita, riprova.");
        return;
      }
      setOpenMobile(false);
      router.push("/login");
      router.refresh();
    } catch {
      setErroreLogout(
        "Servizio non raggiungibile, controlla la connessione e riprova.",
      );
    } finally {
      setUscitaInCorso(false);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={nomeCompleto}
                aria-label={nomeCompleto}
                className="h-auto min-h-14 rounded-xl border border-sidebar-border/80 bg-card/85 px-2.5 py-2 shadow-2xs transition-[background-color,border-color,box-shadow,transform] duration-150 hover:border-sidebar-border hover:bg-card active:scale-[0.985] aria-expanded:border-sidebar-border aria-expanded:bg-card focus-visible:ring-3 focus-visible:ring-sidebar-ring/40 motion-reduce:transition-none motion-reduce:transform-none group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:hover:bg-transparent group-data-[collapsible=icon]:aria-expanded:bg-transparent"
              />
            }
          >
            <AvatarUtente
              iniziali={iniziali}
              className={cn(
                "group-data-[collapsible=icon]:size-8",
                modalitaPaziente ? "size-10" : "size-9",
              )}
              classeTesto={
                modalitaPaziente
                  ? "text-lg group-data-[collapsible=icon]:text-xs"
                  : "text-xs"
              }
            />
            <div className="grid flex-1 text-left leading-snug group-data-[collapsible=icon]:hidden">
              <span
                className={cn(
                  "truncate font-semibold text-foreground",
                  modalitaPaziente ? "text-lg" : "text-sm",
                )}
              >
                {nomeCompleto}
              </span>
              <span
                className={cn(
                  "truncate font-medium",
                  modalitaPaziente
                    ? "text-lg text-foreground/85"
                    : "text-xs text-muted-foreground",
                )}
              >
                {etichettaRuolo}
              </span>
            </div>
            <ChevronsUpDownIcon
              className={cn(
                "ml-auto shrink-0 group-data-[collapsible=icon]:hidden",
                modalitaPaziente
                  ? "size-5 text-foreground"
                  : "size-4 text-muted-foreground",
              )}
              aria-hidden="true"
            />
          </DropdownMenuTrigger>

          <PannelloMenuUtente
            utente={utente}
            nomeCompleto={nomeCompleto}
            iniziali={iniziali}
            modalitaPaziente={modalitaPaziente}
            isMobile={isMobile}
            uscitaInCorso={uscitaInCorso}
            onCambiaPassword={apriCambiaPassword}
            onEsci={esci}
          />
        </DropdownMenu>
      </SidebarMenuItem>

      {erroreLogout && (
        <SidebarMenuItem>
          <p
            role="alert"
            className={cn(
              "mt-1.5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 font-medium text-destructive group-data-[collapsible=icon]:hidden",
              modalitaPaziente ? "text-lg" : "text-xs",
            )}
          >
            <CircleX
              aria-hidden="true"
              className={cn(
                "mt-0.5 shrink-0",
                modalitaPaziente ? "size-5" : "size-4",
              )}
            />
            <span>{erroreLogout}</span>
          </p>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDownIcon, KeyRoundIcon, LogOutIcon, CircleX } from "lucide-react";
import { AvatarUtente } from "@/components/PannelloMenuUtente";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Menu utente con nome, e-mail, ruolo, cambio password (RF_UE_3) e logout collegato a
// POST /api/auth/logout (RF_UE_2).
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

          <DropdownMenuContent
            className="min-w-60"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1.5 py-1.5 text-left">
                  <Avatar>
                    <AvatarFallback>{iniziali}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span
                      className={cn(
                        "truncate font-semibold text-foreground",
                        modalitaPaziente ? "text-base" : "text-sm",
                      )}
                    >
                      {nomeCompleto}
                    </span>
                    <span
                      className={cn(
                        "truncate font-medium",
                        modalitaPaziente
                          ? "text-sm text-foreground/90"
                          : "text-xs text-muted-foreground",
                      )}
                    >
                      {etichettaRuolo}
                    </span>
                    <span
                      className={cn(
                        "truncate",
                        modalitaPaziente
                          ? "text-sm text-foreground/80"
                          : "text-xs text-muted-foreground",
                      )}
                    >
                      {utente.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* CambiaPasswordButton (RF_UE_3): apre CambiaPasswordForm. */}
            <DropdownMenuItem
              onClick={() => router.push(PERCORSO_CAMBIA_PASSWORD)}
              className={cn(modalitaPaziente && "py-2.5 text-lg font-medium")}
            >
              <KeyRoundIcon aria-hidden="true" />
              <span>Cambia password</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              disabled={uscitaInCorso}
              onClick={esci}
              className={cn(modalitaPaziente && "py-2.5 text-lg font-medium")}
            >
              <LogOutIcon aria-hidden="true" />
              <span>{uscitaInCorso ? "Uscita in corso…" : "Logout"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDownIcon, KeyRoundIcon, LogOutIcon } from "lucide-react";
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
  const { isMobile } = useSidebar();
  const [uscitaInCorso, setUscitaInCorso] = useState(false);
  const [erroreLogout, setErroreLogout] = useState("");

  const nomeCompleto = `${utente.nome} ${utente.cognome}`.trim();
  const etichettaRuolo = ETICHETTE_RUOLO[utente.ruolo];
  const iniziali = calcolaIniziali(utente.nome, utente.cognome);

  async function esci() {
    setErroreLogout("");
    setUscitaInCorso(true);
    try {
      const risposta = await fetch("/api/auth/logout", { method: "POST" });
      if (!risposta.ok) {
        setErroreLogout("Uscita non riuscita, riprova.");
        return;
      }
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
                className={cn(
                  "h-auto min-h-12 py-2 aria-expanded:bg-muted group-data-[collapsible=icon]:min-h-0",
                  modalitaPaziente && "text-foreground",
                )}
              />
            }
          >
            <Avatar>
              <AvatarFallback
                className={cn(
                  modalitaPaziente && "font-semibold text-foreground",
                )}
              >
                {iniziali}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left leading-tight">
              <span
                className={cn(
                  "truncate font-medium",
                  modalitaPaziente ? "text-base text-foreground" : "text-sm",
                )}
              >
                {nomeCompleto}
              </span>
              <span
                className={cn(
                  "truncate",
                  modalitaPaziente
                    ? "text-sm font-medium text-foreground/85"
                    : "text-xs font-medium text-muted-foreground",
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
            <ChevronsUpDownIcon className="ml-auto size-4" aria-hidden="true" />
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
              "px-2 py-1 text-red-700 group-data-[collapsible=icon]:hidden",
              modalitaPaziente ? "text-base font-medium" : "text-xs",
            )}
          >
            {erroreLogout}
          </p>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}

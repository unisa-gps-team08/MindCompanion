"use client";

import type { ComponentProps } from "react";
import { IntestazioneBrand } from "@/components/IntestazioneBrand";
import { MenuUtente } from "@/components/MenuUtente";
import { NavigazionePrincipale } from "@/components/NavigazionePrincipale";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAreaRuolo } from "@/lib/aree";
import {
  ETICHETTE_RUOLO,
  VOCI_MENU_PER_RUOLO,
  type ProfiloUtente,
} from "@/lib/navigazione";
import { cn } from "@/lib/utils";

type SidebarApplicazioneProps = ComponentProps<typeof Sidebar> & {
  utente: ProfiloUtente | null;
  inCaricamento: boolean;
};

const LARGHEZZE_SKELETON = ["max-w-[75%]", "max-w-[60%]", "max-w-[85%]"] as const;

// Skeleton deterministico: evita SidebarMenuSkeleton (che usa Math.random) con cacheComponents attivo.
function RigaMenuSkeleton({ larghezza }: { larghezza: string }) {
  return (
    <div className="flex h-8 items-center gap-2 rounded-md px-2">
      <Skeleton className="size-4 shrink-0 rounded-md" />
      <Skeleton className={cn("h-4 flex-1", larghezza)} />
    </div>
  );
}

// Sidebar condivisa delle aree riservate: mostra le voci solo dopo aver verificato il ruolo.
export function SidebarApplicazione({
  utente,
  inCaricamento,
  ...props
}: SidebarApplicazioneProps) {
  const modalitaPaziente = utente?.ruolo === "PAZIENTE";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <IntestazioneBrand
          percorsoHome={utente ? getAreaRuolo(utente.ruolo) : "/"}
          etichettaRuolo={utente ? ETICHETTE_RUOLO[utente.ruolo] : undefined}
          modalitaPaziente={modalitaPaziente}
        />
      </SidebarHeader>

      <SidebarContent>
        {inCaricamento ? (
          <SidebarGroup>
            <SidebarMenu>
              {LARGHEZZE_SKELETON.map((larghezza) => (
                <SidebarMenuItem key={larghezza}>
                  <RigaMenuSkeleton larghezza={larghezza} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          utente && (
            <NavigazionePrincipale
              voci={VOCI_MENU_PER_RUOLO[utente.ruolo]}
              modalitaPaziente={modalitaPaziente}
            />
          )
        )}
      </SidebarContent>

      <SidebarFooter>
        {inCaricamento ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <RigaMenuSkeleton larghezza="max-w-[70%]" />
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          utente && (
            <MenuUtente utente={utente} modalitaPaziente={modalitaPaziente} />
          )
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

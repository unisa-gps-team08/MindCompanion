"use client";

import { Suspense, type ComponentProps } from "react";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAreaRuolo } from "@/lib/aree";
import {
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
    <div className="flex h-11 items-center gap-3 rounded-xl px-3 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
      <Skeleton className="size-4.5 shrink-0 rounded-md group-data-[collapsible=icon]:size-4" />
      <Skeleton
        className={cn(
          "h-4 flex-1 group-data-[collapsible=icon]:hidden",
          larghezza,
        )}
      />
    </div>
  );
}

function NavigazioneSkeleton() {
  return (
    <SidebarGroup className="p-0">
      <SidebarMenu className="gap-1">
        {LARGHEZZE_SKELETON.map((larghezza) => (
          <SidebarMenuItem key={larghezza}>
            <RigaMenuSkeleton larghezza={larghezza} />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
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
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
        <IntestazioneBrand
          percorsoHome={utente ? getAreaRuolo(utente.ruolo) : "/"}
          modalitaPaziente={modalitaPaziente}
        />
      </SidebarHeader>

      <SidebarSeparator className="mx-3 group-data-[collapsible=icon]:mx-2" />

      <SidebarContent className="px-2.5 py-3 group-data-[collapsible=icon]:px-2">
        {inCaricamento ? (
          <NavigazioneSkeleton />
        ) : (
          utente && (
            <Suspense fallback={<NavigazioneSkeleton />}>
              <NavigazionePrincipale
                voci={VOCI_MENU_PER_RUOLO[utente.ruolo]}
                modalitaPaziente={modalitaPaziente}
              />
            </Suspense>
          )
        )}
      </SidebarContent>

      <SidebarSeparator className="mx-3 group-data-[collapsible=icon]:mx-2" />

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        {inCaricamento ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex h-14 items-center gap-3 rounded-xl border border-sidebar-border/60 bg-card/50 px-2.5 py-2 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
                <Skeleton className="size-9 shrink-0 rounded-full group-data-[collapsible=icon]:size-8" />
                <div className="flex flex-1 flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
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

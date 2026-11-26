"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainIcon,
  Building2Icon,
  ClipboardListIcon,
  TrendingUpIcon,
  UserRoundIcon,
  UsersIcon,
  UtensilsIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  voceAttiva,
  type IconaMenu,
  type VoceMenu,
} from "@/lib/navigazione";
import { cn } from "@/lib/utils";

const ICONE_MENU: Record<IconaMenu, ComponentType<SVGProps<SVGSVGElement>>> = {
  utenti: UsersIcon,
  centri: Building2Icon,
  pazienti: UserRoundIcon,
  esercizi: BrainIcon,
  andamento: TrendingUpIcon,
  alimentazione: UtensilsIcon,
  questionari: ClipboardListIcon,
};

type NavigazionePrincipaleProps = {
  voci: readonly VoceMenu[];
  modalitaPaziente: boolean;
};

// Elenco piatto di voci profilate per ruolo; per PAZIENTE applica RNF_USA_3 e RNF_USA_4.
export function NavigazionePrincipale({
  voci,
  modalitaPaziente,
}: NavigazionePrincipaleProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={cn(
          modalitaPaziente && "text-base font-semibold text-foreground",
        )}
      >
        Navigazione
      </SidebarGroupLabel>
      <SidebarMenu className={cn(modalitaPaziente && "gap-1.5")}>
        {voci.map((voce) => {
          const Icona = ICONE_MENU[voce.icona];
          const attiva = voceAttiva(voce, pathname);

          return (
            <SidebarMenuItem key={voce.percorso}>
              <SidebarMenuButton
                isActive={attiva}
                tooltip={voce.titolo}
                className={cn(
                  modalitaPaziente &&
                    "h-auto min-h-12 px-3 py-3 text-lg font-medium text-foreground group-data-[collapsible=icon]:min-h-0 [&_svg]:size-5 group-data-[collapsible=icon]:[&_svg]:size-4 data-active:bg-primary data-active:font-semibold data-active:text-primary-foreground",
                )}
                render={
                  <Link
                    href={voce.percorso}
                    onClick={() => setOpenMobile(false)}
                  />
                }
              >
                <Icona aria-hidden="true" />
                <span>{voce.titolo}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2Icon,
  PuzzleIcon,
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
  esercizi: PuzzleIcon,
  andamento: TrendingUpIcon,
  alimentazione: UtensilsIcon,
};

type NavigazionePrincipaleProps = {
  voci: readonly VoceMenu[];
  modalitaPaziente: boolean;
};

// Elenco piatto di voci profilate per ruolo; per PAZIENTE applica RNF_USA_3, RNF_USA_4 e RNF_USA_6.
export function NavigazionePrincipale({
  voci,
  modalitaPaziente,
}: NavigazionePrincipaleProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel
        className={cn(
          "group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:py-0",
          modalitaPaziente
            ? "mb-2 h-auto px-3 py-1 text-lg font-semibold text-foreground"
            : "mb-1.5 h-7 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase",
        )}
      >
        Navigazione
      </SidebarGroupLabel>
      <SidebarMenu className={cn(modalitaPaziente ? "gap-2" : "gap-1")}>
        {voci.map((voce) => {
          const Icona = ICONE_MENU[voce.icona];
          const attiva = voceAttiva(voce, pathname);

          return (
            <SidebarMenuItem key={voce.percorso}>
              <SidebarMenuButton
                isActive={attiva}
                tooltip={voce.titolo}
                aria-label={voce.titolo}
                aria-current={attiva ? "page" : undefined}
                className={cn(
                  "relative rounded-xl transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.985] focus-visible:ring-3 focus-visible:ring-sidebar-ring/40 motion-reduce:transition-none motion-reduce:transform-none group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:rounded-lg",
                  modalitaPaziente
                    ? "h-auto min-h-14 gap-3.5 px-3.5 py-3 text-lg font-medium text-foreground hover:bg-sidebar-accent hover:text-foreground hover:ring-1 hover:ring-sidebar-border [&_svg]:size-5 group-data-[collapsible=icon]:[&_svg]:size-4 data-active:bg-primary data-active:font-semibold data-active:text-primary-foreground data-active:shadow-xs data-active:ring-0 data-active:hover:bg-primary/95 data-active:hover:text-primary-foreground"
                    : "h-11 gap-3 px-3 text-[0.9375rem] font-medium text-sidebar-foreground/90 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&_svg]:size-[1.125rem] group-data-[collapsible=icon]:[&_svg]:size-4 data-active:bg-card data-active:font-semibold data-active:text-primary data-active:shadow-xs data-active:ring-1 data-active:ring-sidebar-border before:pointer-events-none before:absolute before:inset-y-2 before:left-1 before:w-1 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity data-active:before:opacity-100 group-data-[collapsible=icon]:before:hidden",
                )}
                render={
                  <Link
                    href={voce.percorso}
                    onClick={() => setOpenMobile(false)}
                  />
                }
              >
                <Icona aria-hidden="true" />
                <span className="group-data-[collapsible=icon]:hidden">{voce.titolo}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

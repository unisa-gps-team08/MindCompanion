"use client";

import Link from "next/link";
import { BrainIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type IntestazioneBrandProps = {
  percorsoHome: string;
  etichettaRuolo?: string;
  modalitaPaziente?: boolean;
};

// Sostituisce TeamSwitcher con il brand MindCompanion (issue #19).
export function IntestazioneBrand({
  percorsoHome,
  etichettaRuolo,
  modalitaPaziente = false,
}: IntestazioneBrandProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip="MindCompanion"
          className="h-auto min-h-12 group-data-[collapsible=icon]:min-h-0"
          render={
            <Link href={percorsoHome} onClick={() => setOpenMobile(false)} />
          }
        >
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <BrainIcon className="size-4" aria-hidden="true" />
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span
              className={cn(
                "truncate font-semibold",
                modalitaPaziente ? "text-lg text-foreground" : "text-sm",
              )}
            >
              MindCompanion
            </span>
            <span
              className={cn(
                "truncate",
                modalitaPaziente
                  ? "text-sm font-medium text-foreground/85"
                  : "text-xs text-muted-foreground",
              )}
            >
              {etichettaRuolo ?? "Area riservata"}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

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
  modalitaPaziente?: boolean;
};

// Intestazione del brand MindCompanion con accesso rapido all'area del ruolo (issue #19).
export function IntestazioneBrand({
  percorsoHome,
  modalitaPaziente = false,
}: IntestazioneBrandProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip="MindCompanion"
          aria-label="MindCompanion"
          className="h-auto min-h-12 rounded-xl px-2 py-1.5 transition-[background-color,transform] duration-150 active:scale-[0.985] focus-visible:ring-3 focus-visible:ring-sidebar-ring/40 motion-reduce:transition-none motion-reduce:transform-none group-data-[collapsible=icon]:min-h-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:rounded-lg"
          render={
            <Link href={percorsoHome} onClick={() => setOpenMobile(false)} />
          }
        >
          <div
            className={cn(
              "flex aspect-square shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-xs ring-1 ring-sidebar-primary/15 transition-transform duration-150 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg",
              modalitaPaziente ? "size-10" : "size-9",
            )}
          >
            <BrainIcon
              className={cn(
                "group-data-[collapsible=icon]:size-4",
                modalitaPaziente ? "size-5" : "size-[1.125rem]",
              )}
              aria-hidden="true"
            />
          </div>
          <div className="flex min-w-0 flex-1 items-center group-data-[collapsible=icon]:hidden">
            <span
              className={cn(
                "truncate font-sans font-semibold tracking-[-0.015em] text-sidebar-primary",
                modalitaPaziente ? "text-xl" : "text-[1.0625rem]",
              )}
            >
              MindCompanion
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

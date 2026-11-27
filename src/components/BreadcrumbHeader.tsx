"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { ricavaBreadcrumb, type ProfiloUtente } from "@/lib/navigazione";
import { cn } from "@/lib/utils";

type BreadcrumbHeaderProps = {
  utente: ProfiloUtente | null;
  modalitaPaziente: boolean;
};

// Isola usePathname dentro Suspense così il layout resta compatibile con route parametriche.
export function BreadcrumbHeader({
  utente,
  modalitaPaziente,
}: BreadcrumbHeaderProps) {
  const pathname = usePathname();
  const breadcrumb = utente ? ricavaBreadcrumb(utente.ruolo, pathname) : null;

  if (!breadcrumb) {
    return <Skeleton className="h-5 w-44 rounded-md" />;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList
        className={cn(
          modalitaPaziente && "text-lg font-medium text-foreground",
        )}
      >
        {breadcrumb.pagina ? (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                className="transition-colors hover:text-primary"
                render={<Link href={breadcrumb.area.percorso} />}
              >
                {breadcrumb.area.titolo}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            {breadcrumb.sottoPagina && breadcrumb.pagina.percorso ? (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    className="transition-colors hover:text-primary"
                    render={<Link href={breadcrumb.pagina.percorso} />}
                  >
                    {breadcrumb.pagina.titolo}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-foreground">
                    {breadcrumb.sottoPagina}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-foreground">
                  {breadcrumb.pagina.titolo}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">
              {breadcrumb.area.titolo}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

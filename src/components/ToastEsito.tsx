"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DURATA_TOAST_MS = 5000;

export type DatiToast = {
  id: number;
  tipo: "successo" | "errore";
  messaggio: string;
};

type ToastEsitoProps = {
  toast: DatiToast | null;
  onChiudi: () => void;
};

/** Notifica toast temporanea coerente con la palette della piattaforma (RF_AD_3). */
export function ToastEsito({ toast, onChiudi }: ToastEsitoProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(onChiudi, DURATA_TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast, onChiudi]);

  if (!toast) return null;

  const isSuccesso = toast.tipo === "successo";

  return (
    <div
      role={isSuccesso ? "status" : "alert"}
      aria-live={isSuccesso ? "polite" : "assertive"}
      className={cn(
        "fixed right-4 bottom-4 z-50 flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 motion-reduce:animate-none",
        isSuccesso
          ? "border-success/30 bg-success text-success-foreground"
          : "border-destructive/30 bg-destructive text-primary-foreground",
      )}
    >
      {isSuccesso ? (
        <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0" />
      ) : (
        <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0" />
      )}
      <p className="flex-1 leading-snug font-medium">{toast.messaggio}</p>
      <button
        type="button"
        onClick={onChiudi}
        aria-label="Chiudi notifica"
        className="rounded-md p-0.5 opacity-80 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring outline-none"
      >
        <X aria-hidden className="size-4" />
      </button>
    </div>
  );
}

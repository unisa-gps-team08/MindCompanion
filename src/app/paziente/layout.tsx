import type { ReactNode } from "react";
import { LayoutAreaRiservata } from "@/components/LayoutAreaRiservata";

export default function LayoutPaziente({ children }: { children: ReactNode }) {
  return <LayoutAreaRiservata>{children}</LayoutAreaRiservata>;
}

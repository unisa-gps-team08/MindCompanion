import type { ReactNode } from "react";
import { LayoutAreaRiservata } from "@/components/LayoutAreaRiservata";

export default function LayoutTutore({ children }: { children: ReactNode }) {
  return <LayoutAreaRiservata>{children}</LayoutAreaRiservata>;
}

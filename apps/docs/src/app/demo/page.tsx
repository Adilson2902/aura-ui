import type { Metadata } from "next";
import { DemoShowcase } from "@/components/demo-showcase";

export const metadata: Metadata = {
  title: "Demo — efeitos e cenas 3D — Aura UI",
  description: "Página de demonstração dos efeitos aura-ui-effects e das cenas WebGL aura-ui-three."
};

export default function DemoPage() {
  return <DemoShowcase />;
}

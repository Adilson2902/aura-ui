import type { Metadata } from "next";
import { Lab3D } from "@/components/lab-3d";

export const metadata: Metadata = {
  title: "Lab 3D — Aura UI",
  description: "Playground interativo da suíte 3D do Aura UI."
};

export default function LabPage() {
  return <Lab3D />;
}

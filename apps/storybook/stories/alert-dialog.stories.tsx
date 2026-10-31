import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
} from "@aura/ui/alert-dialog";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof AlertDialogContent> = {
  title: "UI/AlertDialog",
  component: AlertDialogContent,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof AlertDialogContent>;

export const Destructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir projeto</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir “Aura Landing”?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O projeto e todos os deploys serão removidos
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Sim, excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};

export const Confirm: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="3d">Publicar alterações</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Publicar agora?</AlertDialogTitle>
          <AlertDialogDescription>
            As mudanças ficam visíveis para todos os visitantes imediatamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="ghost">Depois</AlertDialogCancel>
          <AlertDialogAction variant="gradient">Publicar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <AlertDialog key={size}>
          <AlertDialogTrigger asChild>
            <Button variant="outline">size="{size}"</Button>
          </AlertDialogTrigger>
          <AlertDialogContent size={size}>
            <AlertDialogHeader>
              <AlertDialogTitle>Tamanho {size}</AlertDialogTitle>
              <AlertDialogDescription>
                Largura máxima controlada pela variante <code>size</code>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Fechar</AlertDialogCancel>
              <AlertDialogAction>Ok</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  )
};

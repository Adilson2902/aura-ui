import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast, Toast } from "@aura/ui/toast";
import { Button } from "@aura/ui/button";

const meta: Meta<typeof ToastProvider> = {
  title: "UI/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Toaster estilo Sonner: 6 posições, atalhos `toast.success/error/warning/info`, ações (ex.: Desfazer), pausa no hover/foco e animação de entrada/saída."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof ToastProvider>;

function Demo() {
  const { toast, dismiss } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="soft"
        onClick={() => toast({ title: "Evento criado", description: "Sexta, 10h" })}
      >
        Padrão
      </Button>
      <Button variant="soft" onClick={() => toast.success("Alterações salvas")}>
        Sucesso
      </Button>
      <Button
        variant="soft"
        onClick={() => toast.warning("Plano perto do limite", { description: "92% usado" })}
      >
        Alerta
      </Button>
      <Button variant="soft" onClick={() => toast.error("Falha ao enviar", { duration: 0 })}>
        Erro (fixo)
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Arquivo movido p/ lixeira",
            action: { label: "Desfazer", onClick: () => toast.info("Restaurado") }
          })
        }
      >
        Com ação
      </Button>
      <Button variant="ghost" onClick={() => dismiss()}>
        Fechar todos
      </Button>
    </div>
  );
}

export const Playground: Story = {
  args: { position: "bottom-right" },
  argTypes: {
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right"
      ]
    }
  },
  render: (args) => (
    <ToastProvider {...args}>
      <Demo />
    </ToastProvider>
  )
};

/** Toast estático (sem provider), p/ composição manual. */
export const Static: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-3">
      <Toast title="Backup concluído" description="12 GB sincronizados." variant="success" />
      <Toast
        title="Atualização disponível"
        variant="info"
        action={{ label: "Atualizar", onClick: () => {} }}
      />
      <Toast
        title="Cartão recusado"
        description="Verifique os dados."
        variant="destructive"
        onClose={() => {}}
      />
    </div>
  )
};

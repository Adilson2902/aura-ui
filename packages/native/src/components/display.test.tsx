import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ActionSheet } from "./action-sheet";
import { Alert } from "./alert";
import { Avatar, AvatarGroup, getInitials } from "./avatar";
import { Badge } from "./badge";
import { BottomSheet } from "./bottom-sheet";
import { Button } from "./button";
import { AlertDialog, Dialog } from "./dialog";
import { EmptyState } from "./empty-state";
import { ListItem, ListSection } from "./list-item";
import { Progress, Skeleton, Spinner } from "./progress";
import { Select } from "./select";
import { Text } from "./text";
import { ToastProvider, useToast } from "./toast";

/** Espera o overlay terminar a animação de saída e desmontar. */
const gone = (text: string) => waitFor(() => expect(screen.queryByText(text)).toBeNull());

describe("exibição", () => {
  it("Badge renderiza texto, dot e variantes", () => {
    for (const variant of [
      "solid",
      "soft",
      "outline",
      "success",
      "warning",
      "destructive"
    ] as const) {
      render(
        <Badge variant={variant} dot>
          {variant}
        </Badge>
      );
      expect(screen.getByText(variant)).toBeTruthy();
    }
    const { container } = render(<Badge dot testID="so-ponto" />);
    expect(container.querySelector('[data-testid="so-ponto"]')).toBeTruthy();
  });

  it("Avatar cai nas iniciais e anuncia o status", () => {
    expect(getInitials("Ana Maria Souza")).toBe("AS");
    expect(getInitials("  bruno ")).toBe("B");
    expect(getInitials("")).toBe("");
    render(<Avatar name="Ana Souza" status="busy" />);
    expect(screen.getByText("AS")).toBeTruthy();
    expect(screen.getByRole("img", { name: "Ana Souza, ocupado" })).toBeTruthy();
  });

  it("Avatar com imagem mantém as iniciais até carregar", () => {
    render(<Avatar name="Carla Dias" source="https://exemplo.com/carla.png" />);
    expect(screen.getByText("CD")).toBeTruthy();
  });

  it("AvatarGroup mostra só `max` e o contador +N", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Ana Souza" />
        <Avatar name="Bruno Lima" />
        <Avatar name="Carla Dias" />
        <Avatar name="Davi Melo" />
      </AvatarGroup>
    );
    expect(screen.getByText("AS")).toBeTruthy();
    expect(screen.getByText("BL")).toBeTruthy();
    expect(screen.queryByText("CD")).toBeNull();
    expect(screen.getByText("+2")).toBeTruthy();
    expect(screen.getByRole("img", { name: "mais 2" })).toBeTruthy();
  });

  it("Alert tem role alert, título, descrição e fechar", () => {
    const onClose = vi.fn();
    render(
      <Alert
        variant="warning"
        title="Atenção"
        description="Plano expira amanhã"
        onClose={onClose}
      />
    );
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Atenção")).toBeTruthy();
    expect(screen.getByText("Plano expira amanhã")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Progress expõe aria-valuenow (com clamp) e indeterminate", () => {
    const { rerender } = render(<Progress value={42.4} label="Upload" />);
    const bar = screen.getByRole("progressbar", { name: "Upload" });
    expect(bar.getAttribute("aria-valuenow")).toBe("42");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");

    rerender(<Progress value={150} label="Upload" />);
    expect(screen.getByRole("progressbar", { name: "Upload" }).getAttribute("aria-valuenow")).toBe(
      "100"
    );

    rerender(<Progress indeterminate label="Upload" />);
    const busy = screen.getByRole("progressbar", { name: "Upload" });
    expect(busy.getAttribute("aria-valuenow")).toBeNull();
    expect(busy.getAttribute("aria-busy")).toBe("true");
  });

  it("Spinner e Skeleton", () => {
    render(<Spinner label="Buscando pedidos" showLabel />);
    expect(screen.getByRole("progressbar", { name: "Buscando pedidos" })).toBeTruthy();
    expect(screen.getByText("Buscando pedidos")).toBeTruthy();
    render(<Skeleton testID="sk" circle width={48} />);
    const sk = screen.getByTestId("sk");
    expect(sk.getAttribute("aria-hidden")).toBe("true");
    expect(sk.style.width).toBe("48px");
    expect(sk.style.height).toBe("48px");
  });

  it("ListItem chama onPress e ListSection agrupa", () => {
    const onPress = vi.fn();
    render(
      <ListSection title="Conta" footer="Você pode sair a qualquer momento.">
        <ListItem title="Perfil" subtitle="Nome e foto" chevron onPress={onPress} />
        <ListItem title="Idioma" right="Português" />
        <ListItem title="Sair" destructive onPress={() => {}} />
      </ListSection>
    );
    expect(screen.getByText("Conta")).toBeTruthy();
    expect(screen.getByRole("list")).toBeTruthy();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    fireEvent.click(screen.getByText("Perfil"));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Perfil, Nome e foto" })).toBeTruthy();
    expect(screen.getByText("Português")).toBeTruthy();
  });

  it("EmptyState com ação simples", () => {
    const onPress = vi.fn();
    render(
      <EmptyState
        icon={<Text>📭</Text>}
        title="Nada por aqui"
        description="Crie seu primeiro projeto."
        action={{ label: "Novo projeto", onPress }}
      />
    );
    expect(screen.getByText("Nada por aqui")).toBeTruthy();
    fireEvent.click(screen.getByText("Novo projeto"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("overlays", () => {
  it("Dialog abre pelo gatilho e fecha pelo backdrop", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog
        trigger={<Button>Abrir</Button>}
        title="Editar perfil"
        description="Altere seus dados"
        onOpenChange={onOpenChange}
        actions={<Button>Salvar</Button>}
      >
        <Text>Conteúdo do diálogo</Text>
      </Dialog>
    );
    expect(screen.queryByText("Editar perfil")).toBeNull();
    fireEvent.click(screen.getByText("Abrir"));
    const dialog = screen.getByRole("dialog", { name: "Editar perfil" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByText("Conteúdo do diálogo")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await gone("Editar perfil");
  });

  it("Dialog controlado e não-dispensável ignora o backdrop", () => {
    render(<Dialog open dismissible={false} title="Obrigatório" />);
    expect(screen.getByText("Obrigatório")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Fechar" })).toBeNull();
  });

  it("AlertDialog confirma e fecha", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <AlertDialog
        trigger={<Button>Excluir projeto</Button>}
        title="Excluir projeto?"
        description="Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        destructive
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByText("Excluir projeto"));
    expect(screen.getByRole("alertdialog", { name: "Excluir projeto?" })).toBeTruthy();
    fireEvent.click(screen.getByText("Excluir"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    await gone("Excluir projeto?");
  });

  it("AlertDialog cancela (botão e backdrop)", async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<AlertDialog defaultOpen title="Sair?" onConfirm={onConfirm} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    await gone("Sair?");

    render(
      <AlertDialog defaultOpen title="Descartar?" onConfirm={onConfirm} onCancel={onCancel} />
    );
    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onCancel).toHaveBeenCalledTimes(2);
    await gone("Descartar?");
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("AlertDialog espera a Promise do onConfirm com loading", async () => {
    let resolve!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((r) => (resolve = r)));
    render(
      <AlertDialog defaultOpen title="Publicar?" confirmLabel="Publicar" onConfirm={onConfirm} />
    );
    fireEvent.click(screen.getByText("Publicar"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Publicar?")).toBeTruthy();
    const busy = screen.getAllByRole("button").find((b) => b.getAttribute("aria-busy") === "true");
    expect(busy).toBeTruthy();
    await act(async () => resolve());
    await gone("Publicar?");
  });

  it("BottomSheet abre e fecha pelo backdrop", async () => {
    const onOpenChange = vi.fn();
    const onClosed = vi.fn();
    render(
      <BottomSheet
        trigger={<Button>Filtros</Button>}
        title="Filtrar"
        onOpenChange={onOpenChange}
        onClosed={onClosed}
      >
        <Text>Somente favoritos</Text>
      </BottomSheet>
    );
    fireEvent.click(screen.getByText("Filtros"));
    expect(screen.getByRole("dialog", { name: "Filtrar" })).toBeTruthy();
    expect(screen.getByText("Somente favoritos")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await gone("Somente favoritos");
    expect(onClosed).toHaveBeenCalledTimes(1);
  });

  it("ActionSheet dispara a ação e fecha", async () => {
    const share = vi.fn();
    const remove = vi.fn();
    const onCancel = vi.fn();
    render(
      <ActionSheet
        trigger={<Button>Opções</Button>}
        title="Arquivo"
        onCancel={onCancel}
        actions={[
          { label: "Compartilhar", onPress: share },
          { label: "Arquivar", disabled: true, onPress: remove },
          { label: "Excluir", destructive: true, onPress: remove }
        ]}
      />
    );
    fireEvent.click(screen.getByText("Opções"));
    fireEvent.click(screen.getByText("Arquivar"));
    expect(screen.getByText("Arquivo")).toBeTruthy();

    fireEvent.click(screen.getByText("Compartilhar"));
    await gone("Arquivo");
    expect(share).toHaveBeenCalledTimes(1);
    expect(remove).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("Opções"));
    fireEvent.click(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    await gone("Arquivo");
  });

  it("Select escolhe uma opção", async () => {
    const onValueChange = vi.fn();
    render(
      <Select
        label="Fruta"
        placeholder="Escolha uma fruta"
        onValueChange={onValueChange}
        options={[
          { value: "maca", label: "Maçã" },
          { value: "banana", label: "Banana" },
          { value: "uva", label: "Uva", disabled: true }
        ]}
      />
    );
    fireEvent.click(screen.getByText("Escolha uma fruta"));
    expect(screen.getByRole("dialog", { name: "Fruta" })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(3);

    fireEvent.click(screen.getByText("Uva"));
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText("Banana"));
    expect(onValueChange).toHaveBeenCalledWith(
      "banana",
      expect.objectContaining({ label: "Banana" })
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByRole("button", { name: "Fruta: Banana" })).toBeTruthy();
    expect(screen.queryByText("Escolha uma fruta")).toBeNull();

    // reabre: a opção atual vem marcada
    fireEvent.click(screen.getByText("Banana"));
    const checked = screen
      .getAllByRole("radio")
      .filter((r) => r.getAttribute("aria-checked") === "true");
    expect(checked).toHaveLength(1);
    expect(checked[0]!.textContent).toContain("Banana");
  });

  it("Select com busca filtra ignorando acentos", () => {
    render(
      <Select
        label="Estado"
        searchable
        error="Obrigatório"
        options={[
          { value: "ba", label: "Bahia" },
          { value: "sp", label: "São Paulo" },
          { value: "pa", label: "Pará" },
          { value: "rj", label: "Rio de Janeiro" }
        ]}
      />
    );
    expect(screen.getByText("Obrigatório")).toBeTruthy();
    fireEvent.click(screen.getByText("Selecione…"));
    fireEvent.change(screen.getByPlaceholderText("Buscar…"), { target: { value: "sao" } });
    expect(screen.getByText("São Paulo")).toBeTruthy();
    expect(screen.queryByText("Bahia")).toBeNull();
    expect(screen.getAllByRole("radio")).toHaveLength(1);

    fireEvent.change(screen.getByPlaceholderText("Buscar…"), { target: { value: "xyz" } });
    expect(screen.getByText("Nenhuma opção encontrada")).toBeTruthy();
  });
});

describe("toast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function Demo() {
    const { toast, dismiss } = useToast();
    return (
      <>
        <Button
          onPress={() => toast.success("Salvo!", { description: "Tudo certo", duration: 1000 })}
        >
          Salvar
        </Button>
        <Button onPress={() => toast({ title: "Fixo", duration: 0 })}>Fixo</Button>
        <Button onPress={() => ["A", "B", "C", "D"].forEach((n) => toast.info(`Aviso ${n}`))}>
          Vários
        </Button>
        <Button onPress={() => dismiss()}>Limpar</Button>
      </>
    );
  }

  it("toast.success aparece e some sozinho", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <Demo />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Salvar"));
    expect(screen.getByText("Salvo!")).toBeTruthy();
    expect(screen.getByText("Tudo certo")).toBeTruthy();
    expect(screen.getByText("Salvo!").closest('[aria-live="polite"]')).toBeTruthy();

    act(() => vi.advanceTimersByTime(900));
    expect(screen.getByText("Salvo!")).toBeTruthy();
    act(() => vi.advanceTimersByTime(100 + 250));
    expect(screen.queryByText("Salvo!")).toBeNull();
  });

  it("toque fecha, empilha até max e dismiss() limpa", () => {
    vi.useFakeTimers();
    render(
      <ToastProvider position="bottom" max={3}>
        <Demo />
      </ToastProvider>
    );
    // "Fixo" é também o texto do botão: filtra só o que está dentro de um toast
    const inToast = (text: string) =>
      screen.queryAllByText(text).filter((el) => el.closest('[aria-live="polite"]'));

    fireEvent.click(screen.getByText("Fixo"));
    act(() => vi.advanceTimersByTime(10_000));
    expect(inToast("Fixo")).toHaveLength(1);

    // toque no toast fecha
    fireEvent.click(inToast("Fixo")[0]!);
    act(() => vi.advanceTimersByTime(250));
    expect(inToast("Fixo")).toHaveLength(0);

    fireEvent.click(screen.getByText("Vários"));
    act(() => vi.advanceTimersByTime(250));
    expect(screen.queryByText("Aviso A")).toBeNull();
    expect(screen.getByText("Aviso B")).toBeTruthy();
    expect(screen.getByText("Aviso D")).toBeTruthy();

    fireEvent.click(screen.getByText("Limpar"));
    act(() => vi.advanceTimersByTime(250));
    expect(screen.queryByText(/Aviso/)).toBeNull();
  });
});

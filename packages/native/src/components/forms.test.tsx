import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AuraProvider } from "../theme/provider";
import { Checkbox } from "./checkbox";
import { Chip, ChipGroup } from "./chip";
import { Input, TextArea } from "./input";
import { OTPInput } from "./otp-input";
import { RadioGroup, RadioGroupItem } from "./radio";
import { SegmentedControl } from "./segmented-control";
import { Switch } from "./switch";

const checkedOf = (el: HTMLElement) => el.getAttribute("aria-checked");

describe("Input", () => {
  it("mostra o rótulo e digitar dispara onChangeText", () => {
    const onChangeText = vi.fn();
    render(
      <AuraProvider defaultMode="light">
        <Input
          label="E-mail"
          description="Usamos só p/ login"
          placeholder="voce@exemplo.com"
          onChangeText={onChangeText}
        />
      </AuraProvider>
    );
    expect(screen.getByText("E-mail")).toBeTruthy();
    expect(screen.getByText("Usamos só p/ login")).toBeTruthy();
    const input = screen.getByLabelText("E-mail");
    fireEvent.change(input, { target: { value: "ana@aura.dev" } });
    expect(onChangeText).toHaveBeenCalledWith("ana@aura.dev");
  });

  it("erro troca a descrição pela mensagem e marca aria-invalid", () => {
    const { rerender } = render(<Input label="Nome" description="Como no documento" />);
    expect(screen.getByLabelText("Nome").getAttribute("aria-invalid")).toBeNull();

    rerender(<Input label="Nome" description="Como no documento" error="Campo obrigatório" />);
    expect(screen.getByRole("alert").textContent).toBe("Campo obrigatório");
    expect(screen.queryByText("Como no documento")).toBeNull();
    expect(screen.getByLabelText("Nome").getAttribute("aria-invalid")).toBe("true");
  });

  it("senha: botão Mostrar/Ocultar alterna a visibilidade", () => {
    render(<Input label="Senha" secureTextEntry />);
    const input = screen.getByLabelText("Senha") as HTMLInputElement;
    expect(input.type).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: "Mostrar" }));
    expect(input.type).toBe("text");
    fireEvent.click(screen.getByRole("button", { name: "Ocultar" }));
    expect(input.type).toBe("password");
  });

  it("textos do botão de senha são customizáveis e o ref aponta p/ o campo", () => {
    const ref = React.createRef<React.ComponentRef<typeof Input>>();
    render(
      <Input
        ref={ref}
        label="PIN"
        secureTextEntry
        showPasswordLabel="Ver"
        hidePasswordLabel="Esconder"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "Ver" }));
    expect(screen.getByRole("button", { name: "Esconder" })).toBeTruthy();
    expect(ref.current).toBe(screen.getByLabelText("PIN"));
  });

  it("disabled não deixa editar; TextArea vira textarea", () => {
    render(
      <>
        <Input label="Bloqueado" disabled />
        <TextArea label="Bio" minRows={4} />
      </>
    );
    expect((screen.getByLabelText("Bloqueado") as HTMLInputElement).readOnly).toBe(true);
    expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
  });
});

describe("Switch", () => {
  it("não-controlado alterna e avisa", () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Notificações" onCheckedChange={onCheckedChange} />);
    const sw = screen.getByRole("switch", { name: "Notificações" });
    expect(checkedOf(sw)).toBe("false");
    fireEvent.click(sw);
    expect(checkedOf(sw)).toBe("true");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    fireEvent.click(screen.getByText("Notificações")); // tocar no rótulo também alterna
    expect(checkedOf(sw)).toBe("false");
  });

  it("controlado só muda quando o pai muda; disabled ignora toques", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Switch
        checked={false}
        onCheckedChange={onCheckedChange}
        aria-label="Wi-Fi"
        variant="success"
      />
    );
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkedOf(screen.getByRole("switch"))).toBe("false");

    rerender(
      <Switch checked onCheckedChange={onCheckedChange} aria-label="Wi-Fi" variant="success" />
    );
    expect(checkedOf(screen.getByRole("switch"))).toBe("true");

    rerender(<Switch checked disabled onCheckedChange={onCheckedChange} aria-label="Wi-Fi" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("switch").getAttribute("aria-disabled")).toBe("true");
  });
});

describe("Checkbox", () => {
  it("não-controlado alterna", () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Aceito os termos"
        description="Leia antes"
        onCheckedChange={onCheckedChange}
      />
    );
    const box = screen.getByRole("checkbox", { name: "Aceito os termos" });
    expect(checkedOf(box)).toBe("false");
    fireEvent.click(box);
    expect(checkedOf(box)).toBe("true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("indeterminado vira aria-checked=mixed e tocar marca", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox checked="indeterminate" onCheckedChange={onCheckedChange} aria-label="Todos" />
    );
    expect(checkedOf(screen.getByRole("checkbox"))).toBe("mixed");
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    // controlado: continua indeterminado até o pai mudar
    expect(checkedOf(screen.getByRole("checkbox"))).toBe("mixed");
    rerender(<Checkbox checked onCheckedChange={onCheckedChange} aria-label="Todos" />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });
});

describe("RadioGroup", () => {
  it("não-controlado: seleciona um por vez", () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup defaultValue="pix" onValueChange={onValueChange} aria-label="Pagamento">
        <RadioGroupItem value="pix" label="Pix" />
        <RadioGroupItem value="cartao" label="Cartão" description="Até 12x" />
        <RadioGroupItem value="boleto" label="Boleto" disabled />
      </RadioGroup>
    );
    expect(screen.getByRole("radiogroup")).toBeTruthy();
    const [pix, cartao, boleto] = screen.getAllByRole("radio");
    expect(checkedOf(pix!)).toBe("true");
    fireEvent.click(cartao!);
    expect(checkedOf(pix!)).toBe("false");
    expect(checkedOf(cartao!)).toBe("true");
    expect(onValueChange).toHaveBeenCalledWith("cartao");
    fireEvent.click(boleto!);
    expect(checkedOf(boleto!)).toBe("false");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("controlado com variante card", () => {
    const onValueChange = vi.fn();
    const ui = (value: string | null) => (
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        variant="card"
        orientation="horizontal"
      >
        <RadioGroupItem value="mensal" label="Mensal" />
        <RadioGroupItem value="anual" label="Anual" description="2 meses grátis" />
      </RadioGroup>
    );
    const { rerender } = render(ui(null));
    const radios = () => screen.getAllByRole("radio");
    expect(radios().map(checkedOf)).toEqual(["false", "false"]);
    fireEvent.click(screen.getByText("Anual"));
    expect(onValueChange).toHaveBeenCalledWith("anual");
    expect(radios().map(checkedOf)).toEqual(["false", "false"]);
    rerender(ui("anual"));
    expect(radios().map(checkedOf)).toEqual(["false", "true"]);
  });
});

describe("SegmentedControl", () => {
  const options = [
    { value: "dia", label: "Dia" },
    { value: "semana", label: "Semana" },
    { value: "mes", label: "Mês" }
  ];

  it("não-controlado: começa na 1ª opção e troca ao tocar", () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl options={options} onValueChange={onValueChange} fullWidth />);
    expect(screen.getByRole("tablist")).toBeTruthy();
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((el) => el.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
    fireEvent.click(screen.getByRole("tab", { name: "Mês" }));
    expect(onValueChange).toHaveBeenCalledWith("mes");
    expect(screen.getByRole("tab", { name: "Mês" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Dia" }).getAttribute("aria-selected")).toBe("false");
  });

  it("controlado", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <SegmentedControl options={options} value="semana" onValueChange={onValueChange} />
    );
    fireEvent.click(screen.getByRole("tab", { name: "Dia" }));
    expect(onValueChange).toHaveBeenCalledWith("dia");
    expect(screen.getByRole("tab", { name: "Semana" }).getAttribute("aria-selected")).toBe("true");
    rerender(<SegmentedControl options={options} value="dia" onValueChange={onValueChange} />);
    expect(screen.getByRole("tab", { name: "Dia" }).getAttribute("aria-selected")).toBe("true");
  });
});

describe("Chip", () => {
  it("chip de filtro não-controlado alterna e o × remove", () => {
    const onRemove = vi.fn();
    const onSelectedChange = vi.fn();
    render(
      <Chip defaultSelected={false} onSelectedChange={onSelectedChange} onRemove={onRemove}>
        Design
      </Chip>
    );
    const chip = screen.getByRole("checkbox", { name: "Design" });
    expect(checkedOf(chip)).toBe("false");
    fireEvent.click(chip);
    expect(checkedOf(chip)).toBe("true");
    expect(onSelectedChange).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole("button", { name: "Remover Design" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onSelectedChange).toHaveBeenCalledTimes(1);
  });

  it("chip controlado e chip de ação", () => {
    const onPress = vi.fn();
    const { rerender } = render(
      <Chip selected={false} variant="outline">
        Ofertas
      </Chip>
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(checkedOf(screen.getByRole("checkbox"))).toBe("false");
    rerender(
      <Chip selected variant="solid">
        Ofertas
      </Chip>
    );
    expect(checkedOf(screen.getByRole("checkbox"))).toBe("true");

    rerender(<Chip onPress={onPress}>Ajuda</Chip>);
    fireEvent.click(screen.getByRole("button", { name: "Ajuda" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("ChipGroup de seleção única (não-controlado)", () => {
    const onValueChange = vi.fn();
    render(
      <ChipGroup defaultValue="p" onValueChange={onValueChange}>
        <Chip value="p">P</Chip>
        <Chip value="m">M</Chip>
        <Chip value="g">G</Chip>
      </ChipGroup>
    );
    expect(screen.getByRole("radiogroup")).toBeTruthy();
    const radios = () => screen.getAllByRole("radio").map(checkedOf);
    expect(radios()).toEqual(["true", "false", "false"]);
    fireEvent.click(screen.getByRole("radio", { name: "G" }));
    expect(radios()).toEqual(["false", "false", "true"]);
    expect(onValueChange).toHaveBeenLastCalledWith("g");
    fireEvent.click(screen.getByRole("radio", { name: "G" })); // desmarca
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("ChipGroup múltiplo (controlado) com máximo", () => {
    const onValueChange = vi.fn();
    const ui = (value: string[]) => (
      <ChipGroup multiple value={value} onValueChange={onValueChange} max={2}>
        <Chip value="react">React</Chip>
        <Chip value="vue">Vue</Chip>
        <Chip value="svelte">Svelte</Chip>
      </ChipGroup>
    );
    const { rerender } = render(ui(["react"]));
    fireEvent.click(screen.getByRole("checkbox", { name: "Vue" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["react", "vue"]);
    rerender(ui(["react", "vue"]));
    expect(screen.getAllByRole("checkbox").map(checkedOf)).toEqual(["true", "true", "false"]);
    fireEvent.click(screen.getByRole("checkbox", { name: "Svelte" })); // passou do máximo
    expect(onValueChange).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("checkbox", { name: "React" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["vue"]);
  });
});

describe("OTPInput", () => {
  it("filtra, avisa a cada mudança e chama onComplete ao preencher", () => {
    const onChange = vi.fn();
    const onComplete = vi.fn();
    render(<OTPInput onChange={onChange} onComplete={onComplete} />);
    const input = screen.getByLabelText("Código de verificação") as HTMLInputElement;
    expect(input.getAttribute("autocomplete")).toBeTruthy();

    fireEvent.change(input, { target: { value: "12" } });
    expect(onChange).toHaveBeenLastCalledWith("12");
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();

    // colar com lixo: só dígitos, cortado no tamanho
    fireEvent.change(input, { target: { value: "12-34 56789" } });
    expect(onChange).toHaveBeenLastCalledWith("123456");
    expect(onComplete).toHaveBeenCalledWith("123456");
    expect(input.value).toBe("123456");
  });

  it("alfanumérico, tamanho customizado e controlado", () => {
    const onComplete = vi.fn();
    const onChange = vi.fn();
    const { rerender } = render(
      <OTPInput
        length={4}
        type="alphanumeric"
        value=""
        onChange={onChange}
        onComplete={onComplete}
        aria-label="Código"
      />
    );
    fireEvent.change(screen.getByLabelText("Código"), { target: { value: "ab1!z" } });
    expect(onChange).toHaveBeenCalledWith("ab1z");
    expect(onComplete).toHaveBeenCalledWith("ab1z");
    rerender(
      <OTPInput
        length={4}
        type="alphanumeric"
        value="ab1z"
        mask
        onChange={onChange}
        aria-label="Código"
      />
    );
    expect(screen.getAllByText("•")).toHaveLength(4);
  });
});

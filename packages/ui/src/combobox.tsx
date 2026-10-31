"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "./command";

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  /** Termos extras para a busca (além do `label`). */
  keywords?: string[];
};

type ComboboxBaseProps = {
  options: ComboboxOption[];
  /** Texto do gatilho sem seleção. */
  placeholder?: string;
  /** Placeholder do campo de busca. */
  searchPlaceholder?: string;
  /** Conteúdo quando a busca não encontra nada. */
  emptyText?: React.ReactNode;
  disabled?: boolean;
  /** Classe do painel (PopoverContent). */
  className?: string;
  /** Classe do botão gatilho. */
  triggerClassName?: string;
  /** Abre/fecha controlado. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Nome p/ formulários nativos — gera `<input type="hidden">` por valor. */
  name?: string;
  id?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean | "true" | "false";
};

export type ComboboxSingleProps = ComboboxBaseProps & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  /** Recebe `""` quando a seleção é limpa (clicar de novo no item selecionado). */
  onValueChange?: (value: string) => void;
};

export type ComboboxMultipleProps = ComboboxBaseProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Máximo de chips no gatilho antes de resumir (padrão 3). */
  maxChips?: number;
  /** Resumo quando há mais chips que `maxChips`. */
  selectedText?: (count: number) => string;
};

export type ComboboxProps = ComboboxSingleProps | ComboboxMultipleProps;

const toArray = (v: string | string[] | undefined): string[] =>
  v == null ? [] : Array.isArray(v) ? v : v === "" ? [] : [v];

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * Combobox — select pesquisável (Popover + Command). Seleção única ou
 * múltipla (`multiple`), controlado ou não-controlado, `role="combobox"`.
 */
const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>((props, ref) => {
  const {
    options,
    placeholder = "Selecione…",
    searchPlaceholder = "Buscar…",
    emptyText = "Nada encontrado.",
    disabled,
    className,
    triggerClassName,
    name,
    id,
    "aria-label": ariaLabel,
    "aria-invalid": ariaInvalid
  } = props;

  const [openState, setOpenState] = React.useState(false);
  const open = props.open ?? openState;
  const setOpen = (next: boolean) => {
    if (props.open === undefined) setOpenState(next);
    props.onOpenChange?.(next);
  };

  const [internal, setInternal] = React.useState<string[]>(() => toArray(props.defaultValue));
  const controlled = props.value !== undefined;
  const selected = controlled ? toArray(props.value) : internal;

  const commit = (next: string[]) => {
    if (!controlled) setInternal(next);
    if (props.multiple) props.onValueChange?.(next);
    else props.onValueChange?.(next[0] ?? "");
  };

  const toggle = (value: string) => {
    if (props.multiple) {
      commit(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
    } else {
      commit(selected[0] === value ? [] : [value]);
      setOpen(false);
    }
  };

  const byValue = new Map(options.map((o) => [o.value, o]));
  const selectedOptions = selected.flatMap((v) => byValue.get(v) ?? []);

  let display: React.ReactNode;
  if (!selectedOptions.length) {
    display = <span className="truncate text-aura-muted-foreground">{placeholder}</span>;
  } else if (!props.multiple) {
    const opt = selectedOptions[0] as ComboboxOption;
    display = (
      <span className="flex min-w-0 items-center gap-2 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
        {opt.icon}
        <span className="truncate">{opt.label}</span>
      </span>
    );
  } else {
    const maxChips = props.maxChips ?? 3;
    const selectedText = props.selectedText ?? ((n: number) => `${n} selecionados`);
    display =
      selectedOptions.length > maxChips ? (
        <span className="truncate">{selectedText(selectedOptions.length)}</span>
      ) : (
        <span className="flex min-w-0 flex-wrap gap-1">
          {selectedOptions.map((o) => (
            <span
              key={o.value}
              className="inline-flex max-w-[10rem] items-center rounded-full bg-aura-primary/10 px-2 py-0.5 text-xs font-medium text-aura-primary"
            >
              <span className="truncate">{o.label}</span>
            </span>
          ))}
        </span>
      );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={ref}
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn(
            "flex min-h-10 w-full items-center justify-between gap-2 rounded-[var(--aura-radius)] border border-aura-border bg-aura-surface px-3 py-1.5 text-left text-sm text-aura-surface-foreground shadow-aura-1 transition-colors",
            "hover:border-aura-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-[invalid=true]:border-aura-destructive",
            triggerClassName
          )}
        >
          {display}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 shrink-0 opacity-60"
          >
            <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
          </svg>
        </button>
      </PopoverTrigger>
      {name && selected.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      <PopoverContent
        align="start"
        className={cn("w-(--radix-popover-trigger-width) min-w-[12rem] p-0", className)}
      >
        <Command className="bg-transparent">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    keywords={[opt.label, ...(opt.keywords ?? [])]}
                    disabled={opt.disabled}
                    onSelect={() => toggle(opt.value)}
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center",
                        props.multiple &&
                          "rounded border border-aura-border data-[on=true]:border-aura-primary data-[on=true]:bg-aura-primary data-[on=true]:text-aura-primary-foreground"
                      )}
                      data-on={isSelected}
                    >
                      <CheckIcon
                        className={cn(
                          "h-3.5 w-3.5 transition-opacity",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </span>
                    {opt.icon}
                    <span className="truncate">{opt.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
Combobox.displayName = "Combobox";

export { Combobox };

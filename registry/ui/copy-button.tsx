"use client";

import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";
import { buttonVariants } from "./button";

export interface CopyButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onCopy">,
    VariantProps<typeof buttonVariants> {
  /** Texto copiado — ou função chamada no clique (ex.: ler de um input). */
  value: string | (() => string);
  /** Callback após copiar (recebe o texto). */
  onCopy?: (text: string) => void;
  /** Tempo em ms exibindo o estado "copiado" (padrão 2000). */
  timeout?: number;
  /** Rótulo acessível antes de copiar (padrão "Copiar"). */
  label?: string;
  /** Rótulo acessível/anunciado após copiar (padrão "Copiado!"). */
  copiedLabel?: string;
}

const CopyIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * CopyButton — copia p/ a área de transferência (Clipboard API com fallback),
 * troca o ícone por ✓ e anuncia o sucesso em `aria-live`. Sem `children`
 * vira botão-ícone; com `children` mostra texto ao lado do ícone.
 */
const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      onCopy,
      timeout = 2000,
      label = "Copiar",
      copiedLabel = "Copiado!",
      variant = "ghost",
      size,
      fullWidth,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const timer = React.useRef<number | undefined>(undefined);

    React.useEffect(() => () => window.clearTimeout(timer.current), []);

    const copy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      const text = typeof value === "function" ? value() : value;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          area.remove();
        }
        setCopied(true);
        onCopy?.(text);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), timeout);
      } catch {
        setCopied(false);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={children ? undefined : copied ? copiedLabel : label}
        data-copied={copied ? "" : undefined}
        onClick={copy}
        className={cn(
          buttonVariants({ variant, size: size ?? (children ? "sm" : "icon-sm"), fullWidth }),
          "data-[copied]:text-aura-success",
          className
        )}
        {...props}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {children}
        <span aria-live="polite" className="sr-only">
          {copied ? copiedLabel : ""}
        </span>
      </button>
    );
  }
);
CopyButton.displayName = "CopyButton";

export { CopyButton };

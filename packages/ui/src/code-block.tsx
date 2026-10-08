"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * CodeBlock — bloco de código com header (linguagem + copiar) e 5 variantes
 * (surface, dark, glass, gradient-border, terminal). Realce de sintaxe fica
 * a cargo do consumidor (children podem ser <code> com highlighter).
 */
const codeBlockVariants = cva(
  "relative overflow-hidden rounded-[var(--aura-radius)] font-mono text-sm",
  {
    variants: {
      variant: {
        surface: "aura-surface aura-elevated",
        dark: "bg-[hsl(232_31%_8%)] text-[hsl(210_40%_96%)] shadow-aura-2",
        glass: "aura-glass-dc text-white border border-white/10",
        "gradient-border":
          "bg-aura-surface p-px shadow-aura-1 [&>*]:rounded-[calc(var(--aura-radius)-1px)]",
        terminal:
          "bg-[hsl(140_12%_6%)] text-[hsl(140_55%_75%)] shadow-aura-2 ring-1 ring-[hsl(140_88%_48%/0.35)]"
      }
    },
    defaultVariants: { variant: "dark" }
  }
);

export interface CodeBlockProps
  extends React.HTMLAttributes<HTMLPreElement>,
    VariantProps<typeof codeBlockVariants> {
  /** Código (string crua — espaçamento preservado). */
  code: string;
  /** Label da linguagem no header (ex.: "tsx"). */
  language?: string;
  /** Título alternativo no header (ex.: "app/page.tsx"). */
  filename?: string;
  /** Mostra botão copiar (padrão true). */
  copyable?: boolean;
}

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M13.25 4.75l-6.5 6.5-3.5-3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3.5 w-3.5">
      <rect x="5.75" y="5.75" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.25 3.5v-.25A1.75 1.75 0 008.5 1.5H3.25A1.75 1.75 0 001.5 3.25v5.25c0 .967.784 1.75 1.75 1.75H3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (
    { code, language, filename, copyable = true, variant, className, children, ...props },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const onDark = variant !== "surface" && variant !== "gradient-border";

    const copy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      } catch {
        /* clipboard indisponível (http/permission) — silencioso */
      }
    };

    const headerText = onDark ? "text-white/50" : "text-aura-muted-foreground";
    const innerBg =
      variant === "gradient-border"
        ? "h-full w-full bg-aura-surface p-4 overflow-x-auto"
        : "overflow-x-auto p-4";

    return (
      <figure className={cn(codeBlockVariants({ variant }), className)}>
        {(language != null || filename != null || copyable) && (
          <figcaption
            className={cn(
              "flex items-center justify-between gap-2 border-b px-4 py-2 text-xs",
              onDark ? "border-white/10 bg-white/5" : "border-aura-border bg-aura-muted/60"
            )}
          >
            <span className={cn("font-mono tracking-wide", headerText)}>
              {filename ?? language}
            </span>
            {copyable && (
              <button
                type="button"
                onClick={copy}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring",
                  onDark
                    ? "text-white/60 hover:bg-white/10 hover:text-white"
                    : "text-aura-muted-foreground hover:bg-aura-muted hover:text-aura-surface-foreground"
                )}
              >
                <CopyIcon copied={copied} />
                {copied ? "Copiado!" : "Copiar"}
              </button>
            )}
          </figcaption>
        )}
        <pre ref={ref} className={innerBg} {...props}>
          {children ?? <code>{code}</code>}
        </pre>
      </figure>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

export { CodeBlock, codeBlockVariants };

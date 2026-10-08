"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * TagsInput — campo de tags estilo "digite + Enter". Controlado
 * (`value`/`onChange`) ou não. Backspace remove a última tag;
 * vírgula também separa. Zero dependências.
 */
const tagsInputVariants = cva(
  "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-[var(--aura-radius)] px-2.5 py-1.5 text-sm transition-all",
  {
    variants: {
      variant: {
        default:
          "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-aura-1 focus-within:ring-2 focus-within:ring-aura-ring",
        soft: "border border-transparent bg-aura-muted text-aura-surface-foreground focus-within:ring-2 focus-within:ring-aura-ring/50",
        outline:
          "border border-aura-border bg-transparent text-aura-surface-foreground focus-within:border-aura-primary",
        glass: "aura-glass-dc border border-white/15 text-white focus-within:border-aura-primary",
        "3d":
          "border border-aura-border bg-aura-surface text-aura-surface-foreground shadow-[0_3px_0_0_hsl(var(--aura-border))] aura-bevel focus-within:shadow-[0_1px_0_0_hsl(var(--aura-border))] focus-within:translate-y-[2px]"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        primary: "bg-aura-primary/12 text-aura-primary ring-1 ring-aura-primary/25",
        gradient: "aura-gradient-primary text-aura-primary-foreground font-semibold",
        glass: "aura-glass-dc text-white ring-1 ring-white/20",
        muted: "bg-aura-muted text-aura-muted-foreground ring-1 ring-aura-border",
        outline: "border border-aura-primary/40 text-aura-primary"
      }
    },
    defaultVariants: { tone: "primary" }
  }
);

export interface TagsInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size">,
    VariantProps<typeof tagsInputVariants> {
  /** Tags atuais (controlado). */
  value?: string[];
  /** Callback controlado — recebe o array completo. */
  onChange?: (tags: string[]) => void;
  /** Estado inicial (não-controlado). */
  defaultValue?: string[];
  /** Tom das tags (padrão primary). */
  tone?: VariantProps<typeof tagVariants>["tone"];
  /** Placeholder do campo interno. */
  placeholder?: string;
  /** Rótulo acessível. */
  label?: string;
}

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    { value: controlled, onChange, defaultValue = [], variant, tone = "primary", placeholder = "Adicionar tag…", label = "Tags", className, ...props },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue);
    const [draft, setDraft] = React.useState("");
    const tags = controlled ?? uncontrolled;

    const commit = (raw: string) => {
      const next = raw.trim().replace(/,+$/, "");
      if (!next || tags.includes(next)) return setDraft("");
      const list = [...tags, next];
      if (controlled == null) setUncontrolled(list);
      onChange?.(list);
      setDraft("");
    };

    const remove = (tag: string) => {
      const list = tags.filter((t) => t !== tag);
      if (controlled == null) setUncontrolled(list);
      onChange?.(list);
    };

    return (
      <div className={cn(tagsInputVariants({ variant }), "cursor-text", className)}>
        {tags.map((tag) => (
          <span key={tag} className={cn(tagVariants({ tone }))}>
            {tag}
            <button
              type="button"
              aria-label={`Remover ${tag}`}
              onClick={() => remove(tag)}
              className="-mr-1 ml-0.5 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring"
            >
              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="h-2.5 w-2.5">
                <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={ref}
          value={draft}
          aria-label={label}
          placeholder={tags.length === 0 ? placeholder : ""}
          onChange={(e) => {
            const v = e.target.value;
            if (v.includes(",")) commit(v);
            else setDraft(v);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit(draft);
            } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
              const last = tags[tags.length - 1];
              if (last !== undefined) remove(last);
            }
          }}
          className="min-w-[6rem] flex-1 bg-transparent text-sm outline-none placeholder:text-aura-muted-foreground"
          {...props}
        />
      </div>
    );
  }
);
TagsInput.displayName = "TagsInput";

export { TagsInput, tagsInputVariants, tagVariants };

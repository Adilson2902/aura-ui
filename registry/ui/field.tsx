"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";
import { Label } from "./label";

type FieldContextValue = {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
  hasDescription: boolean;
  hasError: boolean;
  registerDescription: (present: boolean) => void;
  registerError: (present: boolean) => void;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

/** Lê o contexto do `<Field>` (null fora de um Field). */
function useField() {
  return React.useContext(FieldContext);
}

const fieldVariants = cva("group/field flex gap-2 data-[disabled=true]:opacity-70", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row flex-wrap items-center gap-x-3 [&>[data-slot=field-label]]:min-w-[8rem]"
    }
  },
  defaultVariants: { orientation: "vertical" }
});

export interface FieldProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof fieldVariants> {
  /** Marca o campo como inválido (propaga `aria-invalid` ao controle). */
  invalid?: boolean;
  /** Desabilita o controle e esmaece o campo. */
  disabled?: boolean;
  /** Campo obrigatório (asterisco no label + `aria-required`). */
  required?: boolean;
  /** Id do controle; gerado com `useId` se omitido. */
  id?: string;
}

/**
 * Field — agrupa label, controle, descrição e erro com ids/ARIA automáticos.
 * Pensado p/ react-hook-form/zod: passe `invalid={!!errors.x}` e o erro em `<FieldError>`.
 */
const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    { className, orientation, invalid = false, disabled = false, required = false, id, ...props },
    ref
  ) => {
    const autoId = React.useId();
    const controlId = id ?? `field-${autoId}`;
    const [hasDescription, setHasDescription] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    const value = React.useMemo<FieldContextValue>(
      () => ({
        controlId,
        descriptionId: `${controlId}-description`,
        errorId: `${controlId}-error`,
        invalid,
        disabled,
        required,
        hasDescription,
        hasError,
        registerDescription: setHasDescription,
        registerError: setHasError
      }),
      [controlId, invalid, disabled, required, hasDescription, hasError]
    );

    return (
      <FieldContext.Provider value={value}>
        <div
          ref={ref}
          role="group"
          data-slot="field"
          data-invalid={invalid || undefined}
          data-disabled={disabled || undefined}
          className={cn(fieldVariants({ orientation }), className)}
          {...props}
        />
      </FieldContext.Provider>
    );
  }
);
Field.displayName = "Field";

export interface FieldLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  /** Força/oculta o asterisco (padrão: segue `required` do Field). */
  required?: boolean;
}

/** Label do Field — `htmlFor` automático e asterisco quando obrigatório. */
const FieldLabel = React.forwardRef<React.ElementRef<typeof Label>, FieldLabelProps>(
  ({ className, children, required, htmlFor, ...props }, ref) => {
    const field = useField();
    const showRequired = required ?? field?.required ?? false;
    return (
      <Label
        ref={ref}
        data-slot="field-label"
        htmlFor={htmlFor ?? field?.controlId}
        className={cn(
          "group-data-[invalid=true]/field:text-aura-destructive",
          field?.disabled && "cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
        {showRequired && (
          <span aria-hidden className="ml-0.5 text-aura-destructive">
            *
          </span>
        )}
      </Label>
    );
  }
);
FieldLabel.displayName = "FieldLabel";

/**
 * FieldControl — Slot que injeta `id`, `aria-describedby`, `aria-invalid`,
 * `aria-required` e `disabled` no controle filho (Input, Textarea, Select…).
 */
const FieldControl = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ "aria-describedby": ariaDescribedBy, ...props }, ref) => {
    const field = useField();
    if (!field) return <Slot ref={ref} aria-describedby={ariaDescribedBy} {...props} />;

    const describedBy = [
      ariaDescribedBy,
      field.hasDescription ? field.descriptionId : null,
      field.invalid && field.hasError ? field.errorId : null
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Slot
        ref={ref}
        id={field.controlId}
        aria-describedby={describedBy || undefined}
        aria-invalid={field.invalid || undefined}
        aria-required={field.required || undefined}
        {...({ disabled: field.disabled || undefined } as Record<string, unknown>)}
        data-slot="field-control"
        {...props}
      />
    );
  }
);
FieldControl.displayName = "FieldControl";

/** Texto de ajuda do campo (ligado via `aria-describedby`). */
const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, id, ...props }, ref) => {
  const field = useField();
  const register = field?.registerDescription;
  React.useEffect(() => {
    if (!register) return;
    register(true);
    return () => register(false);
  }, [register]);

  return (
    <p
      ref={ref}
      id={id ?? field?.descriptionId}
      data-slot="field-description"
      className={cn("w-full text-xs text-aura-muted-foreground", className)}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Lista de erros (ex.: `fieldState.error` do RHF ou issues do zod). */
  errors?: Array<{ message?: string } | string | undefined | null>;
}

/**
 * Mensagem de erro (`role="alert"`). Renderiza só quando há conteúdo
 * e o Field está inválido (ou fora de um Field, quando há conteúdo).
 */
const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, children, errors, id, ...props }, ref) => {
    const field = useField();
    const messages = (errors ?? [])
      .map((e) => (typeof e === "string" ? e : e?.message))
      .filter((m): m is string => Boolean(m));
    const unique = Array.from(new Set(messages));

    const content =
      children ??
      (unique.length > 1 ? (
        <ul className="ml-4 list-disc space-y-0.5">
          {unique.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      ) : (
        unique[0]
      ));

    const visible = Boolean(content) && (field ? field.invalid : true);
    const register = field?.registerError;
    React.useEffect(() => {
      if (!register) return;
      register(visible);
      return () => register(false);
    }, [register, visible]);

    if (!visible) return null;

    return (
      <p
        ref={ref}
        id={id ?? field?.errorId}
        role="alert"
        data-slot="field-error"
        className={cn("w-full text-xs font-medium text-aura-destructive", className)}
        {...props}
      >
        {content}
      </p>
    );
  }
);
FieldError.displayName = "FieldError";

/** Empilha vários Fields com espaçamento consistente. */
const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="field-group"
      className={cn("flex w-full flex-col gap-5", className)}
      {...props}
    />
  )
);
FieldGroup.displayName = "FieldGroup";

export interface FieldSetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Título do conjunto (renderizado como `<legend>`). */
  legend?: React.ReactNode;
  /** Texto de apoio abaixo da legenda. */
  description?: React.ReactNode;
}

/** Fieldset semântico com `<legend>` — agrupa radios/checkboxes ou seções do form. */
const FieldSet = React.forwardRef<HTMLFieldSetElement, FieldSetProps>(
  ({ className, legend, description, children, ...props }, ref) => (
    <fieldset
      ref={ref}
      data-slot="field-set"
      className={cn("flex min-w-0 flex-col gap-4 border-0 p-0 disabled:opacity-70", className)}
      {...props}
    >
      {legend && (
        <legend className="mb-1 text-base font-semibold text-aura-surface-foreground">
          {legend}
        </legend>
      )}
      {description && <p className="-mt-3 text-sm text-aura-muted-foreground">{description}</p>}
      {children}
    </fieldset>
  )
);
FieldSet.displayName = "FieldSet";

export {
  Field,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  fieldVariants,
  useField
};

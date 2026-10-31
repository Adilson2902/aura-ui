"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/** Variantes da área de soltar — `data-dragging` realça ao arrastar por cima. */
const fileUploadVariants = cva(
  [
    "group/upload relative flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--aura-radius)] px-6 py-10 text-center transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring focus-visible:ring-offset-2",
    "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
    "aria-[invalid=true]:border-aura-destructive"
  ].join(" "),
  {
    variants: {
      variant: {
        dashed:
          "border-2 border-dashed border-aura-border bg-aura-surface text-aura-surface-foreground hover:border-aura-primary/50 hover:bg-aura-muted/40 data-[dragging=true]:border-aura-primary data-[dragging=true]:bg-aura-primary/5",
        soft: "border border-transparent bg-aura-muted text-aura-surface-foreground hover:bg-aura-muted/70 data-[dragging=true]:bg-aura-primary/10 data-[dragging=true]:ring-2 data-[dragging=true]:ring-aura-primary/40",
        glass:
          "aura-glass-dc border border-dashed border-white/20 text-white hover:border-white/40 data-[dragging=true]:border-aura-primary data-[dragging=true]:bg-white/10",
        glow: "border border-aura-primary/40 bg-aura-muted/40 text-aura-surface-foreground hover:shadow-aura-glow-primary data-[dragging=true]:border-aura-primary data-[dragging=true]:shadow-aura-glow-primary",
        "3d": "aura-elevated border border-aura-border bg-aura-surface text-aura-surface-foreground hover:-translate-y-0.5 data-[dragging=true]:-translate-y-1 data-[dragging=true]:border-aura-primary data-[dragging=true]:shadow-aura-3"
      }
    },
    defaultVariants: { variant: "dashed" }
  }
);

export type FileRejectionReason = "file-too-large" | "file-invalid-type" | "too-many-files";

export type FileRejection = {
  file: File;
  reasons: FileRejectionReason[];
};

const UploadIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-6"
  >
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
  </svg>
);

const FileIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5"
  >
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </svg>
);

/** Formata bytes em B/KB/MB/GB conforme o locale. */
function formatBytes(bytes: number, locale = "pt-BR") {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let n = bytes;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u++;
  }
  const num = new Intl.NumberFormat(locale, { maximumFractionDigits: u === 0 ? 0 : 1 }).format(n);
  return `${num} ${units[u]}`;
}

/** Confere o arquivo contra um `accept` estilo HTML (`.png,image/*,application/pdf`). */
function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const rules = accept
    .split(",")
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

export interface FileUploadProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof fileUploadVariants> {
  /** Tipos aceitos (mesmo formato do `<input accept>`). */
  accept?: string;
  /** Permite vários arquivos (padrão false). */
  multiple?: boolean;
  /** Tamanho máximo por arquivo, em bytes. */
  maxSize?: number;
  /** Quantidade máxima de arquivos na lista. */
  maxFiles?: number;
  disabled?: boolean;
  /** Arquivos (controlado). */
  value?: File[];
  /** Arquivos iniciais (não-controlado). */
  defaultValue?: File[];
  /** Chamado com a lista completa após adicionar/remover. */
  onFilesChange?: (files: File[]) => void;
  /** Chamado com os arquivos recusados e os motivos. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Renderiza a lista de arquivos abaixo da área (padrão true). */
  showList?: boolean;
  /** Nome do `<input type="file">` (envio por form nativo). */
  name?: string;
  /** Marca a área como inválida. */
  invalid?: boolean;
  /** Título da área (padrão: "Arraste arquivos ou clique para selecionar"). */
  label?: React.ReactNode;
  /** Texto auxiliar (padrão: tipos e tamanho máximo). */
  description?: React.ReactNode;
  /** Locale da formatação de tamanhos. */
  locale?: string;
}

/**
 * FileUpload — dropzone acessível (clique, Enter/Espaço, arrastar e soltar)
 * com validação de tipo/tamanho/quantidade e lista com preview de imagens.
 */
const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      disabled = false,
      value: valueProp,
      defaultValue = [],
      onFilesChange,
      onReject,
      showList = true,
      name,
      invalid,
      label,
      description,
      locale = "pt-BR",
      variant,
      className,
      children,
      onKeyDown,
      onClick,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dragDepth = React.useRef(0);
    const [dragging, setDragging] = React.useState(false);
    const [internal, setInternal] = React.useState<File[]>(defaultValue);
    const files = valueProp ?? internal;

    const setFiles = (next: File[]) => {
      if (valueProp === undefined) setInternal(next);
      onFilesChange?.(next);
    };

    const addFiles = (incoming: File[]) => {
      if (disabled || !incoming.length) return;
      const accepted: File[] = [];
      const rejections: FileRejection[] = [];
      const base = multiple ? files : [];
      const limit = multiple ? (maxFiles ?? Infinity) : 1;

      for (const file of incoming) {
        const reasons: FileRejectionReason[] = [];
        if (!matchesAccept(file, accept)) reasons.push("file-invalid-type");
        if (maxSize !== undefined && file.size > maxSize) reasons.push("file-too-large");
        if (!reasons.length && base.length + accepted.length >= limit) {
          reasons.push("too-many-files");
        }
        if (reasons.length) rejections.push({ file, reasons });
        else accepted.push(file);
      }

      if (accepted.length) setFiles([...base, ...accepted]);
      if (rejections.length) onReject?.(rejections);
    };

    const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

    const open = () => {
      if (!disabled) inputRef.current?.click();
    };

    const hint =
      description ??
      [
        accept && `Tipos: ${accept.split(",").join(", ")}`,
        maxSize !== undefined && `até ${formatBytes(maxSize, locale)}`,
        multiple && maxFiles !== undefined && `máx. ${maxFiles} arquivos`
      ]
        .filter(Boolean)
        .join(" · ");

    return (
      <div className="flex w-full flex-col gap-3" data-slot="file-upload">
        <div
          ref={ref}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-invalid={invalid || undefined}
          data-dragging={dragging || undefined}
          className={cn(fileUploadVariants({ variant }), className)}
          onClick={(e) => {
            onClick?.(e);
            if (!e.defaultPrevented) open();
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            if (disabled) return;
            dragDepth.current++;
            setDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = disabled ? "none" : "copy";
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (dragDepth.current === 0) setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            dragDepth.current = 0;
            setDragging(false);
            addFiles(Array.from(e.dataTransfer.files));
          }}
          {...props}
        >
          {children ?? (
            <>
              <span className="flex size-12 items-center justify-center rounded-full bg-aura-primary/10 text-aura-primary transition-transform duration-200 group-data-[dragging=true]/upload:scale-110 group-[.aura-glass-dc]/upload:bg-white/10 group-[.aura-glass-dc]/upload:text-white">
                <UploadIcon />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {label ?? (
                    <>
                      <span className="text-aura-primary group-[.aura-glass-dc]/upload:text-white">
                        Clique para enviar
                      </span>{" "}
                      ou arraste e solte
                    </>
                  )}
                </p>
                {hint && (
                  <p className="text-xs text-aura-muted-foreground group-[.aura-glass-dc]/upload:text-white/60">
                    {hint}
                  </p>
                )}
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            name={name}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden
            className="sr-only"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              addFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </div>

        {showList && files.length > 0 && (
          <FileUploadList>
            {files.map((file, i) => (
              <FileUploadItem
                key={`${file.name}-${file.size}-${file.lastModified}-${i}`}
                file={file}
                locale={locale}
                onRemove={disabled ? undefined : () => removeFile(i)}
              />
            ))}
          </FileUploadList>
        )}
      </div>
    );
  }
);
FileUpload.displayName = "FileUpload";

/** Lista de arquivos (use com `FileUploadItem`). */
const FileUploadList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="file-upload-list"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
);
FileUploadList.displayName = "FileUploadList";

export interface FileUploadItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  file: File;
  /** Progresso 0–100 (ex.: upload em andamento). */
  progress?: number;
  /** Mensagem de erro do item. */
  error?: React.ReactNode;
  /** Exibe miniatura p/ imagens (padrão true). */
  preview?: boolean;
  /** Mostra o botão remover quando definido. */
  onRemove?: () => void;
  /** Rótulo acessível do botão remover. */
  removeLabel?: (file: File) => string;
  locale?: string;
}

/** Item da lista — nome, tamanho, miniatura (imagens), progresso e remover. */
const FileUploadItem = React.forwardRef<HTMLLIElement, FileUploadItemProps>(
  (
    {
      file,
      progress,
      error,
      preview = true,
      onRemove,
      removeLabel = (f) => `Remover ${f.name}`,
      locale = "pt-BR",
      className,
      ...props
    },
    ref
  ) => {
    const isImage = preview && file.type.startsWith("image/");
    const [url, setUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
      if (!isImage) return;
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }, [file, isImage]);

    const pct = progress === undefined ? undefined : Math.min(100, Math.max(0, progress));

    return (
      <li
        ref={ref}
        data-slot="file-upload-item"
        data-error={error ? true : undefined}
        className={cn(
          "flex items-center gap-3 rounded-[var(--aura-radius)] border border-aura-border bg-aura-surface p-2.5 pr-3 text-aura-surface-foreground shadow-aura-1",
          "data-[error=true]:border-aura-destructive/50",
          className
        )}
        {...props}
      >
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[calc(var(--aura-radius)-4px)] bg-aura-muted text-aura-muted-foreground">
          {isImage && url ? (
            <img src={url} alt="" className="size-full object-cover" />
          ) : (
            <FileIcon />
          )}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium" title={file.name}>
              {file.name}
            </p>
            <span className="shrink-0 text-xs tabular-nums text-aura-muted-foreground">
              {pct !== undefined && pct < 100
                ? `${Math.round(pct)}%`
                : formatBytes(file.size, locale)}
            </span>
          </div>
          {pct !== undefined && (
            <div
              role="progressbar"
              aria-valuenow={Math.round(pct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={file.name}
              className="h-1.5 overflow-hidden rounded-full bg-aura-muted"
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-300",
                  pct >= 100 ? "bg-aura-success" : "bg-aura-primary"
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
          {error && <p className="text-xs font-medium text-aura-destructive">{error}</p>}
        </div>
        {onRemove && (
          <button
            type="button"
            aria-label={removeLabel(file)}
            onClick={onRemove}
            className="flex size-7 shrink-0 items-center justify-center rounded-md text-aura-muted-foreground transition-colors hover:bg-aura-muted hover:text-aura-surface-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aura-ring"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="size-4"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </li>
    );
  }
);
FileUploadItem.displayName = "FileUploadItem";

export { FileUpload, FileUploadList, FileUploadItem, fileUploadVariants };

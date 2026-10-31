import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "aura-ui-core";

/**
 * Variantes visuais da tabela — aplicadas no wrapper e propagadas aos
 * descendentes via seletores. `clean`/`striped`/`bordered` são planas,
 * `glass` é dark-glass e `3d` é superfície elevada com hover físico.
 */
const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    variant: {
      default:
        "[&_thead_tr]:border-b [&_tbody_tr]:border-b [&_tbody_tr]:border-aura-border [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-aura-muted/40",
      clean:
        "[&_thead]:border-b-0 [&_thead_th]:text-aura-muted-foreground [&_tbody_tr]:border-0",
      striped:
        "[&_thead]:bg-aura-muted/60 [&_tbody_tr]:border-0 [&_tbody_tr:nth-child(even)]:bg-aura-muted/50 [&_tbody_tr:hover]:bg-aura-muted",
      bordered:
        "[&_thead_tr]:border-b [&_tbody_tr]:border-b [&_*]:border-aura-border [&_td]:border-r [&_th]:border-r [&_tr_*:last-child]:border-r-0",
      glass:
        "aura-glass-dc [&_thead_tr]:border-b [&_thead_tr]:border-white/10 [&_tbody_tr]:border-b [&_tbody_tr]:border-white/10 [&_tbody_tr:hover]:bg-white/5 [&_th]:text-white/70",
      "3d":
        "aura-surface aura-elevated [&_thead]:bg-aura-muted/60 [&_thead_tr]:border-b [&_thead_tr]:border-aura-border [&_tbody_tr]:border-b [&_tbody_tr]:border-aura-border/60 [&_tbody_tr]:transition-[transform,box-shadow] [&_tbody_tr:hover]:bg-aura-muted/40"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /** Container com scroll horizontal (padrão true). */
  scroll?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, scroll = true, ...props }, ref) => {
    const table = (
      <table ref={ref} className={cn(tableVariants({ variant, className }))} {...props} />
    );
    if (!scroll) return table;
    return <div className="relative w-full overflow-x-auto rounded-[var(--aura-radius)]">{table}</div>;
  }
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("border-t bg-aura-muted/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-aura-border transition-colors hover:bg-aura-muted/40 data-[state=selected]:bg-aura-muted",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-11 px-3 text-left align-middle text-xs font-semibold uppercase tracking-wide text-aura-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("px-3 py-3 align-middle", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-3 text-sm text-aura-muted-foreground", className)} {...props} />
  )
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants
};

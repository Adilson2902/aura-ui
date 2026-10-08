"use client";

import * as React from "react";
import { cn } from "aura-ui-core";
import { Button } from "./button";
import { Input } from "./input";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  accessor: (row: T) => string | number;
  cell?: (row: T) => React.ReactNode;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  caption?: string;
  pageSize?: number;
  className?: string;
};

function csvValue(value: string | number) {
  const text = String(value);
  return `"${(/^[=+@\-\t\r]/.test(text) ? `'${text}` : text).replaceAll('"', '""')}"`;
}

/**
 * DataTable Aura — busca global, ordenação (`aria-sort`), seleção com
 * indeterminado, colunas alternáveis, paginação e export CSV com BOM
 * (fórmulas neutralizadas contra CSV-injection). SSR-safe.
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  caption = "Registros",
  pageSize = 5,
  className
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [sort, setSort] = React.useState<{ id: string; descending: boolean } | null>(null);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  const [size, setSize] = React.useState(
    Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize) || 5) : 5
  );
  const visible = columns.filter((column) => !hidden.has(column.id));
  const filtered = data.filter((row) =>
    columns.some((column) =>
      String(column.accessor(row)).toLocaleLowerCase().includes(query.toLocaleLowerCase())
    )
  );
  const sortColumn = columns.find((column) => column.id === sort?.id);
  if (sortColumn && sort)
    filtered.sort((a, b) => {
      const left = sortColumn.accessor(a),
        right = sortColumn.accessor(b);
      const result =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : String(left).localeCompare(String(right), "pt-BR", { numeric: true });
      return sort.descending ? -result : result;
    });
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pages - 1);
  const rows = filtered.slice(currentPage * size, (currentPage + 1) * size);
  const selectedCount = data.filter((row) => selected.has(getRowId(row))).length;
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(getRowId(row)));
  const someSelected = rows.some((row) => selected.has(getRowId(row)));
  const checkRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (checkRef.current) checkRef.current.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);
  function toggle(id: string) {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function exportCsv() {
    const exportRows = selectedCount ? data.filter((row) => selected.has(getRowId(row))) : filtered;
    const csv = [
      visible.map((column) => csvValue(column.header)).join(","),
      ...exportRows.map((row) => visible.map((column) => csvValue(column.accessor(row))).join(","))
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "aura-registros.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div
      className={cn(
        "rounded-xl border border-aura-border bg-aura-surface text-aura-surface-foreground",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3 p-4">
        <Input
          aria-label="Buscar registros"
          placeholder="Buscar em todos os campos…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
          className="max-w-xs"
        />
        <div className="relative ml-auto">
          <details>
            <summary className="cursor-pointer rounded-lg border border-aura-border px-3 py-2 text-sm">
              Colunas
            </summary>
            <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-lg border border-aura-border bg-aura-surface p-3 shadow-aura-2">
              {columns.map((column) => (
                <label key={column.id} className="flex gap-2 py-1 text-sm">
                  <input
                    type="checkbox"
                    checked={!hidden.has(column.id)}
                    disabled={visible.length === 1 && !hidden.has(column.id)}
                    onChange={() =>
                      setHidden((previous) => {
                        const next = new Set(previous);
                        if (next.has(column.id)) next.delete(column.id);
                        else next.add(column.id);
                        return next;
                      })
                    }
                  />
                  {column.header}
                </label>
              ))}
            </div>
          </details>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCsv}
          disabled={!filtered.length && !selectedCount}
        >
          {selectedCount ? `Exportar seleção (${selectedCount})` : "Exportar CSV"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="border-y border-aura-border bg-aura-muted/40 text-aura-muted-foreground">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  ref={checkRef}
                  type="checkbox"
                  aria-label="Selecionar página"
                  checked={allSelected}
                  disabled={!rows.length}
                  onChange={() =>
                    setSelected((previous) => {
                      const next = new Set(previous);
                      rows.forEach((row) => {
                        if (allSelected) next.delete(getRowId(row));
                        else next.add(getRowId(row));
                      });
                      return next;
                    })
                  }
                />
              </th>
              {visible.map((column) => (
                <th
                  key={column.id}
                  aria-sort={
                    sort?.id === column.id ? (sort.descending ? "descending" : "ascending") : "none"
                  }
                  className="px-4 py-3 font-medium"
                >
                  <button
                    type="button"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setSort({
                        id: column.id,
                        descending: sort?.id === column.id && !sort.descending
                      });
                      setPage(0);
                    }}
                  >
                    {column.header}{" "}
                    <span aria-hidden="true">
                      {sort?.id === column.id ? (sort.descending ? "↓" : "↑") : "↕"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr
                  key={getRowId(row)}
                  className={cn(
                    "border-b border-aura-border transition-colors hover:bg-aura-muted/30",
                    selected.has(getRowId(row)) && "bg-aura-primary/5"
                  )}
                >
                  <td className="px-4 py-4">
                    <input
                      aria-label={`Selecionar ${getRowId(row)}`}
                      type="checkbox"
                      checked={selected.has(getRowId(row))}
                      onChange={() => toggle(getRowId(row))}
                    />
                  </td>
                  {visible.map((column) => (
                    <td className="whitespace-nowrap px-4 py-4" key={column.id}>
                      {column.cell ? column.cell(row) : column.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visible.length + 1}
                  className="p-10 text-center text-aura-muted-foreground"
                >
                  Nenhum registro encontrado.{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => {
                      setQuery("");
                      setPage(0);
                    }}
                  >
                    Limpar busca
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center gap-3 p-4 text-xs text-aura-muted-foreground">
        <span role="status">
          {selectedCount} selecionado(s) · {filtered.length} registro(s)
        </span>
        {selectedCount > 0 && (
          <button type="button" className="underline" onClick={() => setSelected(new Set())}>
            Limpar seleção
          </button>
        )}
        <label className="ml-auto">
          Linhas{" "}
          <select
            aria-label="Linhas por página"
            className="rounded border border-aura-border bg-aura-surface p-1"
            value={size}
            onChange={(event) => {
              setSize(Number(event.target.value));
              setPage(0);
            }}
          >
            {Array.from(new Set([size, 5, 10, 20]))
              .sort((a, b) => a - b)
              .map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
        </label>
        <span>
          Página {currentPage + 1} de {pages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 0}
          onClick={() => setPage(currentPage - 1)}
          aria-label="Página anterior"
        >
          ←
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage >= pages - 1}
          onClick={() => setPage(currentPage + 1)}
          aria-label="Próxima página"
        >
          →
        </Button>
      </div>
    </div>
  );
}

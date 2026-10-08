import * as React from "react";
import { cn } from "aura-ui-core";

export type ChartDatum = {
  label: string;
  value: number;
  /** Cor opcional da série/ponto (token ou css color). */
  color?: string;
};

export type ChartSeries = {
  name: string;
  data: ChartDatum[];
  color?: string;
};

/* ---------- helpers ---------- */

function niceMax(values: number[]) {
  const max = Math.max(0, ...values);
  if (max <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / pow) * pow;
}

function pathFromPoints(
  points: { x: number; y: number }[],
  smooth: number
): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dx = (curr.x - prev.x) * smooth;
    d += ` C ${prev.x + dx} ${prev.y}, ${curr.x - dx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

const DEFAULT_PALETTE = [
  "hsl(var(--aura-primary))",
  "hsl(var(--aura-accent))",
  "hsl(var(--aura-cyber))",
  "hsl(var(--aura-success))",
  "hsl(var(--aura-warning))"
];

/* ---------- Chart frame ---------- */

export interface ChartFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Altura do SVG em px (padrão 220). */
  height?: number;
  /** Legenda embaixo. */
  legend?: { name: string; color: string }[];
  action?: React.ReactNode;
}

export function ChartFrame({
  title,
  description,
  height = 220,
  legend,
  action,
  className,
  children,
  ...props
}: ChartFrameProps) {
  return (
    <div className={cn("aura-surface flex flex-col gap-3 p-5", className)} {...props}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && <h4 className="text-sm font-semibold tracking-tight">{title}</h4>}
            {description && (
              <p className="mt-0.5 text-xs text-aura-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </div>
      )}
      <div style={{ height }} className="relative w-full">
        {children}
      </div>
      {legend && legend.length > 0 && (
        <ul className="flex flex-wrap gap-3 text-xs text-aura-muted-foreground">
          {legend.map((item) => (
            <li key={item.name} className="inline-flex items-center gap-1.5">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ background: item.color }}
              />
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- BarChart ---------- */

export interface BarChartProps {
  data: ChartDatum[];
  height?: number;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Raio das barras (padrão 6). */
  radius?: number;
  /** Formata o tooltip / aria. */
  formatValue?: (v: number) => string;
  showGrid?: boolean;
}

/** Barras verticais em SVG — sem dependências. */
export function BarChart({
  data,
  height = 220,
  className,
  title,
  description,
  radius = 6,
  formatValue = (v) => String(v),
  showGrid = true
}: BarChartProps) {
  const max = niceMax(data.map((d) => d.value));
  const barW = 100 / Math.max(data.length, 1);

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      legend={data.map((d) => ({
        name: d.label,
        color: d.color ?? "hsl(var(--aura-primary))"
      }))}
    >
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label={title ? String(title) : "Gráfico de barras"}
      >
        {showGrid &&
          [0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={0}
              x2={100}
              y1={60 * (1 - t)}
              y2={60 * (1 - t)}
              stroke="hsl(var(--aura-border))"
              strokeWidth={0.3}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        {data.map((d, i) => {
          const h = (d.value / max) * 52;
          const x = i * barW + barW * 0.18;
          const w = barW * 0.64;
          return (
            <rect
              key={d.label}
              x={x}
              y={60 - h}
              width={w}
              height={Math.max(h, 0.5)}
              rx={(radius * w) / 40}
              fill={d.color ?? "hsl(var(--aura-primary))"}
            >
              <title>{`${d.label}: ${formatValue(d.value)}`}</title>
            </rect>
          );
        })}
      </svg>
    </ChartFrame>
  );
}

/* ---------- LineChart / AreaChart ---------- */

export interface LineChartProps {
  data: ChartDatum[];
  height?: number;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** 0 = polígonos, 0.5 = bezier suave (padrão). */
  smooth?: number;
  area?: boolean;
  formatValue?: (v: number) => string;
  color?: string;
}

export function LineChart({
  data,
  height = 220,
  className,
  title,
  description,
  smooth = 0.5,
  area = false,
  formatValue = (v) => String(v),
  color = "hsl(var(--aura-primary))"
}: LineChartProps) {
  const max = niceMax(data.map((d) => d.value));
  const pts = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * 100,
    y: 56 - (d.value / max) * 50,
    d
  }));
  const line = pathFromPoints(pts, smooth);
  const areaD =
    area && pts.length > 1
      ? `${line} L 100 60 L 0 60 Z`
      : "";

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      legend={[{ name: title ? String(title) : "Série", color }]}
    >
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label={title ? String(title) : "Gráfico de linha"}
      >
        <defs>
          <linearGradient id="aura-chart-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {area && areaD && <path d={areaD} fill="url(#aura-chart-area)" />}
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
        {pts.map((p) => (
          <circle key={p.d.label} cx={p.x} cy={p.y} r={2.2} fill={color} vectorEffect="non-scaling-stroke">
            <title>{`${p.d.label}: ${formatValue(p.d.value)}`}</title>
          </circle>
        ))}
      </svg>
    </ChartFrame>
  );
}

/* ---------- DonutChart ---------- */

export interface DonutChartProps {
  data: ChartDatum[];
  size?: number;
  thickness?: number;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  formatValue?: (v: number) => string;
  /** Rótulo central (padrão total). */
  centerLabel?: React.ReactNode;
  centerSublabel?: React.ReactNode;
}

export function DonutChart({
  data,
  size = 180,
  thickness = 18,
  className,
  title,
  description,
  formatValue = (v) => String(v),
  centerLabel,
  centerSublabel
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <ChartFrame
      title={title}
      description={description}
      height={size + 24}
      className={className}
      legend={data.map((d, i) => ({
        name: d.label,
        color: d.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]
      }))}
    >
      <div className="relative flex h-full items-center justify-center">
        <svg width={size} height={size} role="img" aria-label={title ? String(title) : "Gráfico de rosca"}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="hsl(var(--aura-muted))"
            strokeWidth={thickness}
          />
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = frac * c;
            const el = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={d.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                strokeLinecap="butt"
              >
                <title>{`${d.label}: ${formatValue(d.value)} (${Math.round(frac * 100)}%)`}</title>
              </circle>
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums tracking-tight">
            {centerLabel ?? formatValue(total)}
          </span>
          {centerSublabel && (
            <span className="text-xs text-aura-muted-foreground">{centerSublabel}</span>
          )}
        </div>
      </div>
    </ChartFrame>
  );
}

/* ---------- Sparkline ---------- */

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  area?: boolean;
  /** Espessura do traço. */
  strokeWidth?: number;
}

export function Sparkline({
  data,
  width = 120,
  height = 36,
  className,
  color = "hsl(var(--aura-primary))",
  area = true,
  strokeWidth = 2
}: SparklineProps) {
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * width,
    y: height - 2 - ((v - min) / span) * (height - 6)
  }));
  const line = pathFromPoints(pts, 0.4);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("overflow-visible", className)}
      aria-hidden
    >
      {area && (
        <path d={`${line} L ${width} ${height} L 0 ${height} Z`} fill={color} opacity={0.15} />
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

/* ---------- RadialProgress ---------- */

export interface RadialProgressProps {
  /** 0–100. */
  value: number;
  size?: number;
  thickness?: number;
  className?: string;
  color?: string;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
}

export function RadialProgress({
  value,
  size = 120,
  thickness = 10,
  className,
  color = "hsl(var(--aura-primary))",
  label,
  sublabel
}: RadialProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = (clamped / 100) * c;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--aura-muted))"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 0.5s var(--aura-ease-spring)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold tabular-nums">{label ?? `${Math.round(clamped)}%`}</span>
        {sublabel && <span className="text-[10px] text-aura-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  );
}

/* ---------- Multi-series line ---------- */

export interface MultiLineChartProps {
  series: ChartSeries[];
  height?: number;
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  formatValue?: (v: number) => string;
  smooth?: number;
}

export function MultiLineChart({
  series,
  height = 220,
  className,
  title,
  description,
  formatValue = (v) => String(v),
  smooth = 0.45
}: MultiLineChartProps) {
  const all = series.flatMap((s) => s.data.map((d) => d.value));
  const max = niceMax(all);
  const len = Math.max(...series.map((s) => s.data.length), 1);

  return (
    <ChartFrame
      title={title}
      description={description}
      height={height}
      className={className}
      legend={series.map((s, i) => ({
        name: s.name,
        color: s.color ?? DEFAULT_PALETTE[i % DEFAULT_PALETTE.length]
      }))}
    >
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label={title ? String(title) : "Gráfico multi-série"}
      >
        {series.map((s, si) => {
          const pts = s.data.map((d, i) => ({
            x: (i / Math.max(len - 1, 1)) * 100,
            y: 56 - (d.value / max) * 50
          }));
          return (
            <path
              key={s.name}
              d={pathFromPoints(pts, smooth)}
              fill="none"
              stroke={s.color ?? DEFAULT_PALETTE[si % DEFAULT_PALETTE.length]}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </ChartFrame>
  );
}

import * as React from "react";
import { cn } from "aura-ui-core";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Proporção largura/altura (ex.: `16 / 9`, `1`, `4 / 3`). Padrão 1. */
  ratio?: number;
}

/**
 * AspectRatio — mantém a proporção via CSS `aspect-ratio` (zero JS, zero deps).
 * Filhos `img`/`video`/`iframe` preenchem a caixa com `object-cover`.
 */
const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 1, className, style, ...props }, ref) => (
    <div
      ref={ref}
      style={{ aspectRatio: String(ratio), ...style }}
      className={cn(
        "relative w-full overflow-hidden [&>img]:absolute [&>img]:inset-0 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>video]:absolute [&>video]:inset-0 [&>video]:h-full [&>video]:w-full [&>video]:object-cover [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:h-full [&>iframe]:w-full",
        className
      )}
      {...props}
    />
  )
);
AspectRatio.displayName = "AspectRatio";

export { AspectRatio };

import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("mescla classes e resolve conflitos tailwind (última vence)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("ignora valores falsy e aceita condicionais", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
    expect(cn("base", true && "on", false && "off")).toBe("base on");
  });

  it("preserva classes aura-* e arbitrárias", () => {
    expect(cn("aura-press", "rounded-[var(--aura-radius)]")).toBe(
      "aura-press rounded-[var(--aura-radius)]"
    );
  });
});

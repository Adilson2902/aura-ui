import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("a demo mostra efeitos e cenas sem violações critical ou serious", async ({ page }) => {
  await page.goto("/demo/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Interfaces com profundidade real" })
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "Efeitos" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Cenas WebGL" })).toBeVisible();
  await page.locator("[data-demo-ready='true']").waitFor();

  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious"
  );

  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
});

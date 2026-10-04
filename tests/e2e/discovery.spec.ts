import { expect, test } from "@playwright/test";

test.describe("discovery", () => {
  test("shows demo properties on the list and the map", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Find your place." })).toBeVisible();
    await expect(page.getByTestId("property-entry")).toHaveCount(10);
    await expect(page.locator(".eo-marker")).toHaveCount(10);
    await expect(page.getByTestId("result-count")).toHaveText("10 lots around Santa Cruz, Bolivia");
    expect(errors).toEqual([]);
  });

  test("filters update both the list and the markers, and reset", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".eo-marker")).toHaveCount(10);

    await page.getByRole("button", { name: "Monthly budget" }).first().click();
    await page.getByRole("radio", { name: /Up to \$150\/mo/ }).click();
    // $100, $105, $125 and $150 a month.
    await expect(page.getByTestId("property-entry")).toHaveCount(4);
    await expect(page.locator(".eo-marker")).toHaveCount(4);
    await expect(page.getByTestId("result-count")).toHaveText("4 of 10 lots match");
    await expect(page).toHaveURL(/budget=150/);

    await page.getByRole("button", { name: "Area" }).first().click();
    // Urubó has nothing at $150 or less, so the option says so and is disabled.
    await expect(page.getByRole("radio", { name: /Urubó/ })).toBeDisabled();
    await page.getByRole("radio", { name: /Porongo/ }).click();
    await expect(page.getByTestId("property-entry")).toHaveCount(1);
    await expect(page.locator(".eo-marker")).toHaveCount(1);

    await page.getByRole("button", { name: "Reset filters" }).first().click();
    await expect(page.getByTestId("property-entry")).toHaveCount(10);
    await expect(page.locator(".eo-marker")).toHaveCount(10);
  });

  test("an empty filter result explains itself", async ({ page }) => {
    // Urubó has one lot, at $275 a month.
    await page.goto("/?budget=150&area=Urub%C3%B3");
    await expect(page.getByTestId("empty-state").first()).toContainText("No land matches these filters.");
    await page.getByTestId("empty-state").first().getByRole("button", { name: "Reset filters" }).click();
    await expect(page.getByTestId("property-entry")).toHaveCount(10);
  });

  test("selecting a marker selects the matching lot in the list", async ({ page }) => {
    await page.goto("/");
    const marker = page.locator('.eo-marker[aria-label^="Las Palmas"]');
    await marker.click();
    await expect(marker).toHaveAttribute("aria-pressed", "true");
    await expect(marker).toHaveAttribute("data-state", "active");
    await expect(page.getByTestId("map-preview")).toContainText("Las Palmas");
    await expect(page.locator('[data-testid="property-entry"][data-slug="las-palmas-lot-14"]')).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("selecting a card highlights its marker and opens its preview", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".eo-marker")).toHaveCount(10);
    const entry = page.locator('[data-testid="property-entry"][data-slug="los-tajibos-lot-9"]');
    await entry.hover();
    await expect(page.locator('.eo-marker[aria-label^="Los Tajibos"]')).toHaveAttribute("data-state", "active");
    await entry.getByRole("button", { name: /Show Los Tajibos/ }).click();
    await expect(page.getByTestId("map-preview")).toContainText("Los Tajibos");
    await page.getByTestId("map-preview").getByRole("link", { name: "View property" }).click();
    await expect(page).toHaveURL(/\/properties\/los-tajibos-lot-9$/);
  });
});

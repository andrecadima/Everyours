import { expect, test } from "@playwright/test";

test("mobile: map first, swipeable lots, and a list view", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".eo-marker")).toHaveCount(10);
  await expect(page.getByTestId("carousel-card").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find your place." })).toBeHidden();

  await page.locator('.eo-marker[aria-label^="El Prado"]').click({ force: true });
  await expect(page.locator('.eo-marker[aria-label^="El Prado"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-testid="carousel-card"] a.ring-2')).toContainText("El Prado");

  await page.getByRole("button", { name: "View list" }).click();
  await expect(page.getByRole("heading", { name: "Find your place." })).toBeVisible();
  await page.getByRole("button", { name: "Show map" }).click();
  await expect(page.getByTestId("carousel-card").first()).toBeVisible();
});

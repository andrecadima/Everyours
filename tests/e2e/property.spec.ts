import { expect, test } from "@playwright/test";

test.describe("property page", () => {
  test("shows the price, the example plan, and the lot on the map", async ({ page }) => {
    await page.goto("/properties/las-palmas-lot-14");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Las Palmas");
    const plan = page.getByTestId("payment-plan");
    await expect(plan).toContainText("$125");
    await expect(plan).toContainText("84 × $125");
    await expect(plan).toContainText("$12,500");
    await expect(plan).toContainText("Final terms are confirmed by the Everyours team.");
    await expect(page.getByText("DEMO-SCZ-001")).toBeVisible();
    await expect(page.locator(".eo-map--lot .eo-marker")).toHaveCount(1);
  });

  test("unknown properties return a helpful 404", async ({ page }) => {
    const response = await page.goto("/properties/this-lot-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "We couldn’t find that land." })).toBeVisible();
    await page.getByRole("link", { name: "Explore the map" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("a reserved lot invites interest instead of a purchase", async ({ page }) => {
    await page.goto("/properties/bosque-norte-lot-22");
    const plan = page.getByTestId("payment-plan");
    await expect(plan).toContainText("Reserved for now");
    await expect(plan.getByRole("link", { name: "I’m interested" })).toBeVisible();
    await expect(plan.getByRole("link", { name: "Make it yours" })).toHaveCount(0);
  });
});

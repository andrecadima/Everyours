import { expect, test } from "@playwright/test";
import { deleteLeadsByEmail, findLeadByEmail } from "./db";

const email = `e2e+${Date.now()}@example.com`;

test.afterAll(async () => {
  await deleteLeadsByEmail(email);
});

test("make it yours: the chosen lot rides into the form and the lead is stored", async ({ page }) => {
  await page.goto("/properties/rio-verde-lot-8");
  await page.getByTestId("payment-plan").getByRole("link", { name: "Make it yours" }).click();
  await expect(page).toHaveURL(/\/properties\/rio-verde-lot-8\/apply$/);
  await expect(page.getByTestId("selected-lot").last()).toContainText("Río Verde");

  // Step 1: validation
  await expect(page.getByTestId("step-indicator")).toHaveText("Step 1 of 3");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Enter your first name.")).toBeVisible();
  await page.getByLabel("First name").fill("Ana");
  await page.getByLabel("Last name").fill("Rivera");
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 2
  await expect(page.getByTestId("step-indicator")).toHaveText("Step 2 of 3");
  await page.getByRole("textbox", { name: "Email" }).fill("not-an-email");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Enter a valid email, like name@example.com.")).toBeVisible();
  await expect(page.getByText("Choose how we should contact you.")).toBeVisible();
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByLabel("Phone number").fill("512 555 0199");
  await page.getByLabel("Country").selectOption("US");
  await page.locator("label", { hasText: "Email" }).filter({ has: page.locator('input[type="radio"]') }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 3: consent is required and never pre-checked
  await expect(page.getByTestId("step-indicator")).toHaveText("Step 3 of 3");
  await expect(page.getByRole("checkbox")).not.toBeChecked();
  await page.locator("label", { hasText: "Not sure yet" }).click();
  await page.getByRole("button", { name: "Send my interest" }).click();
  await expect(page.getByText("Please confirm we may contact you.")).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(2600); // instant submissions are treated as bots
  await page.getByRole("button", { name: "Send my interest" }).dblclick();

  // Confirmation
  await expect(page).toHaveURL(/\/properties\/rio-verde-lot-8\/apply\/thanks$/);
  await expect(page.getByRole("heading", { name: "This could be yours." })).toBeVisible();
  await expect(page.getByTestId("thanks-property")).toHaveText("Río Verde, Lot 8");
  await expect(page.getByRole("link", { name: "Keep exploring" })).toBeVisible();

  // Persisted exactly once, attached to the right lot
  const leads = await findLeadByEmail(email);
  expect(leads).toHaveLength(1);
  expect(leads[0]).toMatchObject({
    slug: "rio-verde-lot-8",
    firstName: "Ana",
    lastName: "Rivera",
    phone: "+15125550199",
    country: "US",
    preferredContactMethod: "EMAIL",
    monthlyBudgetRange: "NOT_SURE",
    status: "NEW",
    source: "WEB_MVP",
  });
  expect(leads[0].consentAt).toBeTruthy();
});

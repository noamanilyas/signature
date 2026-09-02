import { expect, type Locator, type Page } from "@playwright/test";
import { TABLE_CONVERSION_DELAY_MS } from "./constants";

export type HorizontalAlignment = "left" | "center" | "right" | "stretch";

export async function openPropertiesFor(page: Page, target: Locator) {
  await target.scrollIntoViewIfNeeded();
  await target.click();
  await page.locator("#propertiesModel").waitFor({ state: "visible", timeout: 10_000 });
}

/** Open properties for a table or table cell (cell now also exposes Alignment). */
export async function openTableGroupProperties(page: Page, target: Locator) {
  await target.scrollIntoViewIfNeeded();
  await target.evaluate((el) => (el as HTMLElement).click());
  await page.locator("#propertiesModel").waitFor({ state: "visible", timeout: 10_000 });
}

export async function openAlignmentTab(page: Page) {
  const alignmentTab = page.locator("#v-alignment-side");
  await alignmentTab.waitFor({ state: "attached", timeout: 10_000 });
  await expect(alignmentTab).toBeVisible({ timeout: 10_000 });
  await alignmentTab.click();
  await page.locator("#align-horiz-left").waitFor({ state: "visible", timeout: 10_000 });
}

export async function setHorizontalAlignment(page: Page, align: HorizontalAlignment) {
  await page.locator(`#align-horiz-${align}`).click();
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
}

export async function alignTableHorizontally(page: Page, target: Locator, align: HorizontalAlignment) {
  await openTableGroupProperties(page, target);
  await openAlignmentTab(page);
  await setHorizontalAlignment(page, align);
}

export async function closePropertiesModal(page: Page) {
  const modal = page.locator("#propertiesModel");
  if (await modal.isVisible()) {
    await page.locator('#propertiesModel button.close, #propertiesModel [data-dismiss="modal"]').first().click();
    await modal.waitFor({ state: "hidden", timeout: 10_000 }).catch(async () => {
      await page.keyboard.press("Escape");
      await modal.waitFor({ state: "hidden", timeout: 5_000 });
    });
  }
}

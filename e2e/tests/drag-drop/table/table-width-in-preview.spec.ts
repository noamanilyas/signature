import { expect, test } from "@playwright/test";
import { MAIN_DROP_ZONE_SELECTOR, TABLE_CONVERSION_DELAY_MS } from "../../../helpers/constants";
import { dropPanelItemInCanvas, waitForSignatureTable } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { closePropertiesModal } from "../../../helpers/properties-modal";

/**
 * Regression: giving the whole table an explicit width (e.g. 600px via its
 * Group Properties > Size tab) showed correctly in the editor but the
 * Preview's cells collapsed to their content and the text ran together.
 *
 * Cause: getSubItemsForTableItem() copies the editor table's inline style onto
 * the rebuilt <table>, but stripped *every* width/min-width/max-width from it
 * whenever the table wasn't "stretch" - meant only to drop the injected
 * width:100%. An explicit pixel width was removed too, so the inner table fell
 * back to auto layout.
 */
test("a table's explicit width (Size tab) reaches the Preview", async ({ page }) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

  const tableEl = page.locator("table.editor-table").first();
  await tableEl.evaluate((el) => (el as HTMLElement).click());
  await page.locator("#v-size-side").click();
  await page.locator("#size-width").fill("600");
  await page.locator("#size-width").dispatchEvent("change");
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
  await closePropertiesModal(page);

  const previewTable = await waitForSignatureTable(page);
  const inner = previewTable.locator("td > table").first();
  await expect(inner).toBeVisible();
  const box = await inner.boundingBox();
  expect(box!.width).toBeCloseTo(600, 0);
});

/**
 * Regression: a table with an explicit width AND padding/border poked out of
 * its own wrapper cell in the Preview. The same width was also applied to the
 * wrapper <td> (which carries the padding + border), leaving it narrower than
 * the table inside it.
 */
test("a table with explicit width and padding stays inside its wrapper cell in the Preview", async ({ page }) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

  const tableEl = page.locator("table.editor-table").first();
  await tableEl.evaluate((el) => (el as HTMLElement).click());
  await page.locator("#v-padding-side").click();
  await page.locator("#padding-all").waitFor({ state: "visible" });
  await page.locator("#padding-all").fill("20");
  await page.locator("#padding-all").dispatchEvent("change");
  await page.locator("#v-size-side").click();
  await page.locator("#size-width").fill("600");
  await page.locator("#size-width").dispatchEvent("change");
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
  await closePropertiesModal(page);

  const previewTable = await waitForSignatureTable(page);
  const inner = previewTable.locator("td > table").first();
  const wrapper = previewTable.locator("td:has(> table)").first();
  const innerBox = await inner.boundingBox();
  const wrapperBox = await wrapper.boundingBox();
  expect(innerBox!.x + innerBox!.width).toBeLessThanOrEqual(wrapperBox!.x + wrapperBox!.width);
});

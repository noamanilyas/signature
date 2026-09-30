import { expect, test } from "@playwright/test";
import { MAIN_DROP_ZONE_SELECTOR, TABLE_CONVERSION_DELAY_MS } from "../../../helpers/constants";
import { dropPanelItemInCanvas, tableCells, waitForSignatureTable } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { closePropertiesModal, openTableGroupProperties } from "../../../helpers/properties-modal";

/**
 * Regression: giving an individual table cell an explicit width (its own
 * Size tab, not the whole table's Group Properties) applied live in the
 * editor canvas but never reached the Preview - the cell there fell back to
 * the browser's auto table-layout sizing.
 *
 * Cause: getSubItemsForTableItem() in convertToTable.js rebuilds each
 * preview <td> from scratch and copies over only the CSS categories it's
 * told to. Its two applyCSS(td, ...) calls for a cell never included "size"
 * in their type list (unlike the analogous fixes already made for a table's
 * own outer box, and for group2/group3 wrappers), so the width/min-width/
 * max-width that size.js mirrors onto the cell as attributes were read but
 * silently filtered out.
 */
test("an explicit cell width (Size tab) shows in the Preview", async ({ page }) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

  const cells = tableCells(page);
  await expect(cells.first()).toBeVisible();
  const firstCell = cells.first();

  await openTableGroupProperties(page, firstCell);
  await page.locator("#v-size-side").click();
  await page.locator("#size-width").fill("400");
  await page.locator("#size-width").dispatchEvent("change");
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
  await closePropertiesModal(page);

  const editorBox = await firstCell.boundingBox();
  expect(editorBox!.width).toBeCloseTo(400, 0);

  const previewTable = await waitForSignatureTable(page);
  const previewCells = previewTable.locator("td > table").first().locator("> tbody > tr > td");
  await expect(previewCells.first()).toBeVisible();

  const previewBox = await previewCells.first().boundingBox();
  expect(previewBox!.width).toBeCloseTo(400, 0);
});

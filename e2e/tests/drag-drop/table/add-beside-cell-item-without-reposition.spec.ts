import { expect, test } from "@playwright/test";
import { dropPanelItemInCanvas, dropIntoTableCell, tableCells, dragToTarget, getPanelItem } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR, TABLE_CONVERSION_DELAY_MS } from "../../../helpers/constants";
import { SIDE_ZONE_CLASS } from "../../../helpers/elements";

// Control case for reposition-then-add-beside.spec.ts: adding an element
// beside an existing cell item works correctly when the table has never
// been repositioned. Keeping this alongside the repro pins down that the
// bug is specifically about the *reposition* step, not "beside" drops in
// general.
test("control: add element beside existing cell item WITHOUT repositioning the table", async ({ page }) => {
  await openEditor(page);

  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

  const firstCell = tableCells(page).first();
  await dropIntoTableCell(page, firstCell, "textarea");
  const firstItemId = await firstCell.locator(".drag.vertical").first().getAttribute("id");

  const existingCellItem = firstCell.locator(".drag.vertical").first();
  const westZone = existingCellItem.locator(SIDE_ZONE_CLASS.west).first();
  await westZone.waitFor({ state: "visible", timeout: 10_000 });

  const source = await getPanelItem(page, "image");
  await dragToTarget(page, source, westZone);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);

  // A "beside" drop wraps both items in a new group2/group3 container, so
  // the cell now holds 3 `.drag.vertical` elements: the group wrapper plus
  // its two children.
  await expect(firstCell.locator(".drag.vertical")).toHaveCount(3);
  await expect(page.locator(`#${firstItemId}`)).toHaveCount(1);
});

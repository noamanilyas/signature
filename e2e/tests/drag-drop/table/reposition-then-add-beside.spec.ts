import { expect, test } from "@playwright/test";
import { dropOnSide, dropPanelItemInCanvas, dropIntoTableCell, tableCells, dragToTarget, getPanelItem } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR, TABLE_CONVERSION_DELAY_MS } from "../../../helpers/constants";
import { SIDE_ZONE_CLASS } from "../../../helpers/elements";

// Regression test for: after dragging a placed table to a new position,
// adding another element beside an item that already lived in one of its
// cells replaced that item instead of adding alongside it. Root cause was
// registration order in rebindClonedSubtree() (public/javascripts/drop.js):
// jQuery UI's droppable greedy check at drop time relies on ancestors (a
// table cell) being re-registered before descendants (that cell item's own
// side strips), otherwise the cell's own drop handler could fire after the
// descendant's and wrongly replace its content.
test("repro: drag the table itself to a new position, then add another element beside the existing one in a cell", async ({
  page,
}) => {
  await openEditor(page);

  // 1. Drop table onto canvas (root item #1)
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
  const tableItem = page.locator("#drop > .drag.vertical.tableItem").first();

  // 2. Add a second root item (textarea) to the east of the table so there's
  //    somewhere to drop the table when we reposition it.
  await dropOnSide(page, tableItem, "east", "textarea");

  // 3. Add a textarea inside the FIRST table cell.
  const firstCell = tableCells(page).first();
  await dropIntoTableCell(page, firstCell, "textarea");
  const firstItemId = await firstCell.locator(".drag.vertical").first().getAttribute("id");

  // 4. Drag the TABLE ITSELF (grabbing an empty cell, so we pick up the
  //    table's own outer draggable, not the nested item) to a new position:
  //    drop it onto the sibling textarea's south zone.
  const emptyCell = tableCells(page).last();
  const sibling = page.locator("#drop .data2 > .drag.vertical:not(.tableItem)").first();
  const southZone = sibling.locator(SIDE_ZONE_CLASS.south).first();
  await southZone.waitFor({ state: "visible", timeout: 10_000 });
  await dragToTarget(page, emptyCell, southZone);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);

  // 5. Find the same cell (now re-parented after the move) - it should still
  //    have the textarea we put there in step 3.
  const cellAfterMove = tableCells(page).first();
  const existingCellItem = cellAfterMove.locator(".drag.vertical").first();
  await expect(existingCellItem).toHaveCount(1);

  // 6. Add ANOTHER element BESIDE (west) the existing one in that cell.
  const westZone = existingCellItem.locator(SIDE_ZONE_CLASS.west).first();
  await westZone.waitFor({ state: "visible", timeout: 10_000 });

  const source = await getPanelItem(page, "textarea");
  await dragToTarget(page, source, westZone);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);

  // The original item must survive alongside the new one, not be replaced.
  // A "beside" drop wraps both items in a new group2/group3 container, so
  // the cell now holds 3 `.drag.vertical` elements: the group wrapper plus
  // its two children.
  await expect(cellAfterMove.locator(".drag.vertical")).toHaveCount(3);
  await expect(page.locator(`#${firstItemId}`)).toHaveCount(1);
});

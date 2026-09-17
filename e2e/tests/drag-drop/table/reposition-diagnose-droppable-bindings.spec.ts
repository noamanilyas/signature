import { test } from "@playwright/test";
import { dropOnSide, dropPanelItemInCanvas, dropIntoTableCell, tableCells, dragToTarget } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR, TABLE_CONVERSION_DELAY_MS } from "../../../helpers/constants";
import { SIDE_ZONE_CLASS } from "../../../helpers/elements";

// Diagnostic used while tracking down the bug fixed alongside
// reposition-then-add-beside.spec.ts: dumps the jQuery UI droppable
// instance state (greedy option, registration/geometry) on a cell item's
// west zone before and after the table is repositioned, to confirm the
// rebindClonedSubtree() registration-order theory. Kept as a debugging aid
// for any future regression in the same area.
test("diagnose: droppable bindings on cell item's west zone after table reposition", async ({ page }) => {
  await openEditor(page);

  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
  const tableItem = page.locator("#drop > .drag.vertical.tableItem").first();
  await dropOnSide(page, tableItem, "east", "textarea");

  const firstCell = tableCells(page).first();
  await dropIntoTableCell(page, firstCell, "textarea");

  const existingCellItemBefore = firstCell.locator(".drag.vertical").first();
  const westZoneBefore = existingCellItemBefore.locator(SIDE_ZONE_CLASS.west).first();
  const beforeInfo = await westZoneBefore.evaluate((el) => {
    // @ts-ignore
    const $ = (window as any).$;
    const inst = $(el).droppable("instance");
    const rect = el.getBoundingClientRect();
    const cell = el.closest(".editor-td-div");
    const cellRect = cell ? cell.getBoundingClientRect() : null;
    return {
      hasInstance: !!inst,
      greedy: inst ? inst.options.greedy : null,
      rect: { w: rect.width, h: rect.height, x: rect.x, y: rect.y },
      cellRect: cellRect ? { w: cellRect.width, h: cellRect.height, x: cellRect.x, y: cellRect.y } : null,
      classes: el.className,
    };
  });
  console.log("BEFORE reposition - west zone info:", JSON.stringify(beforeInfo, null, 2));

  const emptyCell = tableCells(page).last();
  const sibling = page.locator("#drop .data2 > .drag.vertical:not(.tableItem)").first();
  const southZone = sibling.locator(SIDE_ZONE_CLASS.south).first();
  await southZone.waitFor({ state: "visible", timeout: 10_000 });
  await dragToTarget(page, emptyCell, southZone);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);

  const cellAfterMove = tableCells(page).first();
  const existingCellItemAfter = cellAfterMove.locator(".drag.vertical").first();
  const westZoneAfter = existingCellItemAfter.locator(SIDE_ZONE_CLASS.west).first();
  const afterInfo = await westZoneAfter.evaluate((el) => {
    // @ts-ignore
    const $ = (window as any).$;
    const inst = $(el).droppable("instance");
    const rect = el.getBoundingClientRect();
    const cell = el.closest(".editor-td-div");
    const cellInst = cell ? $(cell).droppable("instance") : null;
    const cellRect = cell ? cell.getBoundingClientRect() : null;
    return {
      hasInstance: !!inst,
      greedy: inst ? inst.options.greedy : null,
      rect: { w: rect.width, h: rect.height, x: rect.x, y: rect.y },
      cellHasInstance: !!cellInst,
      cellGreedy: cellInst ? cellInst.options.greedy : null,
      cellRect: cellRect ? { w: cellRect.width, h: cellRect.height, x: cellRect.x, y: cellRect.y } : null,
      classes: el.className,
      parentChainClasses: (() => {
        let chain = [];
        let p = el.parentElement;
        for (let i = 0; i < 6 && p; i++) {
          chain.push(p.className);
          p = p.parentElement;
        }
        return chain;
      })(),
    };
  });
  console.log("AFTER reposition - west zone info:", JSON.stringify(afterInfo, null, 2));
});

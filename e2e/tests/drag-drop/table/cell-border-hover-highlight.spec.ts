import { expect, test } from "@playwright/test";
import { rootCanvasItems } from "../../../helpers/build-signature";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Regression test for: hovering a table's outer border (bound to the
// group-level .data wrapper) highlighted it, but hovering an individual
// cell's own border/padding did nothing. The cell's visible border and
// padding live on the ancestor td.editor-td, outside the box of the inner
// div.editor-td-div that addMouseOverEvents() was bound to, so mouseenter
// never fired for that band. Fixed by binding the hover highlight to
// td.editor-td (the whole cell) instead, wherever table cells are created
// or rebound - not in addition to the inner div, which would show two
// nested highlight boxes instead of one.
test("hovering a cell highlights the whole cell, not a nested inner box", async ({ page }) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

  const table = rootCanvasItems(page).first();
  const firstCellTd = table.locator("td.editor-td").first();
  const firstCellDiv = firstCellTd.locator("div.editor-td-div").first();
  await expect(firstCellTd).toHaveCount(1);

  // Hover the cell's own border/padding band (inside td.editor-td, outside
  // the inner div.editor-td-div's content box).
  await firstCellTd.hover({ position: { x: 1, y: 1 } });

  const cellBoxShadow = await firstCellTd.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(cellBoxShadow).not.toBe("none");
  // The inner div must not get its own separate highlight box.
  const innerBoxShadow = await firstCellDiv.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(innerBoxShadow).toBe("none");

  // Moving away must clear that cell's own highlight again.
  await page.mouse.move(0, 0);
  const clearedBoxShadow = await firstCellTd.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(clearedBoxShadow).toBe("none");

  // Hovering the cell's content area (inside the inner div) must highlight
  // the same whole-cell box, not a smaller inner one.
  await firstCellDiv.hover();
  const contentHoverCellShadow = await firstCellTd.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(contentHoverCellShadow).not.toBe("none");
  const contentHoverInnerShadow = await firstCellDiv.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(contentHoverInnerShadow).toBe("none");
});

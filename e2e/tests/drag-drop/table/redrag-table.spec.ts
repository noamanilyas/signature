import { expect, test } from "@playwright/test";
import { canvasItems, rootCanvasItems } from "../../../helpers/build-signature";
import {
  dropIntoTableCell,
  dropOnSide,
  dropPanelItemInCanvas,
  moveCanvasItemToSide,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { closePropertiesModal, openTableGroupProperties } from "../../../helpers/properties-modal";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Regression test for: dragging a placed table a second time stripped its
// "tableItem" class and lost all bindings on its inner cells (jQuery's
// clone() used by the drag helper does not carry over event handlers).
test("redragging a placed table repeatedly keeps its cells interactive and the preview clean", async ({
  page,
}) => {
  await openEditor(page);

  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
  await dropOnSide(page, canvasItems(page).first(), "south", "textarea");

  const table = rootCanvasItems(page).first();
  const textarea = rootCanvasItems(page).nth(1);
  await expect(table).toHaveClass(/tableItem/);
  await expect(table.locator(".tableDrop.editor-td-div")).toHaveCount(4);

  // First redrag: move the (still empty) table below the textarea.
  await moveCanvasItemToSide(page, table, textarea, "south");

  const movedTable = rootCanvasItems(page).last();
  await expect(movedTable).toHaveClass(/tableItem/);
  await expect(movedTable.locator(".tableDrop.editor-td-div")).toHaveCount(4);

  // Second redrag: move it back above the textarea. Still empty, so the drag
  // source's bounding-box center is unambiguously the table's own chrome,
  // not any nested content (dragging via a filled cell is a separate concern
  // from the reported bug: repeatedly repositioning the table itself).
  const textareaTarget = rootCanvasItems(page).first();
  await moveCanvasItemToSide(page, movedTable, textareaTarget, "north");

  const finalTable = rootCanvasItems(page).first();
  await expect(finalTable).toHaveClass(/tableItem/);
  await expect(finalTable.locator(".tableDrop.editor-td-div")).toHaveCount(4);

  // Only now check interactivity, after all repositioning is done: cell
  // clicks (properties modal) must still work.
  const firstCell = finalTable.locator(".tableDrop.editor-td-div").first();
  await openTableGroupProperties(page, firstCell);
  await closePropertiesModal(page);

  // Cells must still accept drops.
  await dropIntoTableCell(page, firstCell, "textarea");
  await expect(firstCell.locator(".drag.vertical")).toHaveCount(1);

  const secondCell = finalTable.locator(".tableDrop.editor-td-div").nth(1);
  await dropIntoTableCell(page, secondCell, "textarea");
  await expect(secondCell.locator(".drag.vertical")).toHaveCount(1);

  // Preview must be a clean conversion, never the raw editor markup
  // (.data2/.data3 carry the red/green editor-only borders).
  const previewTable = page.locator(".panelPreview table.mainTable").first();
  await previewTable.waitFor({ state: "visible", timeout: 20_000 });
  await expect(previewTable.locator(".data2, .data3, .tableDrop, .editor-td-div")).toHaveCount(0);
  await expect(previewTable.locator("table")).not.toHaveCount(0);
});

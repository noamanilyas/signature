import { expect, test } from "@playwright/test";
import { expectRedContainer } from "../../../helpers/assertions";
import { canvasItems, rootCanvasItems, tableCells } from "../../../helpers/build-signature";
import {
  dropCanvasItemOnCanvas,
  dropCanvasItemOnDeleteBar,
  dropIntoTableCell,
  dropOnSide,
  dropPanelItemInCanvas,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR, TABLE_CONVERSION_DELAY_MS } from "../../../helpers/constants";

test.describe("delete canvas items", () => {
  test("delete via delDrop bar then drop new item", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    await dropCanvasItemOnDeleteBar(page, canvasItems(page).first());
    await expect(canvasItems(page)).toHaveCount(0);

    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await expect(canvasItems(page)).toHaveCount(1);

    await finishLayoutTest(page, testInfo, "del-bar-restore");
  });

  test("delete via drop on canvas background", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    await dropCanvasItemOnCanvas(page, canvasItems(page).first());
    await expect(canvasItems(page)).toHaveCount(0);

    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await expect(canvasItems(page)).toHaveCount(1);

    await finishLayoutTest(page, testInfo, "del-canvas-restore");
  });

  test("delete middle item from three-item red row", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "west");

    const redItems = page.locator(".data2 > .drag.vertical");
    await expect(redItems).toHaveCount(3);

    await dropCanvasItemOnDeleteBar(page, redItems.nth(1));
    await page.waitForTimeout(300);

    await expectRedContainer(page);
    await expect(redItems).toHaveCount(2);

    await finishLayoutTest(page, testInfo, "del-red-middle");
  });

  test("delete one of two in red leaves one item in red group", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");

    await dropCanvasItemOnDeleteBar(page, page.locator(".data2 > .drag.vertical").last());
    await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);

    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(1);
    await expect(rootCanvasItems(page)).toHaveCount(1);

    await finishLayoutTest(page, testInfo, "del-red-collapse");
  });

  test("delete table cell content resets cell and allows new drop", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

    const cell = tableCells(page).first();
    await dropIntoTableCell(page, cell, "textarea");
    await expect(cell.locator(".drag.vertical")).toHaveCount(1);

    await dropCanvasItemOnDeleteBar(page, cell.locator(".drag.vertical").first());
    await expect(cell.locator(".drag.vertical")).toHaveCount(0);

    await dropIntoTableCell(page, cell, "textarea");
    await expect(cell.locator(".drag.vertical")).toHaveCount(1);

    await finishLayoutTest(page, testInfo, "del-table-cell");
  });
});

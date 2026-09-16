import { expect, test } from "@playwright/test";
import { expectGreenContainer, expectRedContainer } from "../../../helpers/assertions";
import { canvasItems, rootCanvasItems } from "../../../helpers/build-signature";
import {
  dropOnSide,
  dropPanelItemInCanvas,
  dropCanvasItemOnDeleteBar,
  moveCanvasItemToSide,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test("repro: reorder inside green vertical stack via north drop", async ({ page }, testInfo) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
  await dropOnSide(page, canvasItems(page).first(), "west");
  await expectRedContainer(page);

  await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");
  await expectGreenContainer(page);

  const greenItems = page.locator(".data3 > .drag.vertical");
  await expect(greenItems).toHaveCount(2);

  await page.screenshot({ path: testInfo.outputPath("before-reorder.png"), fullPage: true });

  // Try to reorder: drag the LAST green item to the north of the FIRST green item
  await moveCanvasItemToSide(page, greenItems.last(), greenItems.first(), "north");
  await page.waitForTimeout(500);

  await page.screenshot({ path: testInfo.outputPath("after-reorder.png"), fullPage: true });
  console.log("green item count after reorder attempt:", await greenItems.count());
  await expect(greenItems).toHaveCount(2);
});

test("repro: drag item out of green stack to root", async ({ page }, testInfo) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
  await dropOnSide(page, canvasItems(page).first(), "west");
  await expectRedContainer(page);

  await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");
  await expectGreenContainer(page);

  const greenItems = page.locator(".data3 > .drag.vertical");
  await expect(greenItems).toHaveCount(2);

  const redItems = page.locator(".data2 > .drag.vertical");
  await expect(redItems).toHaveCount(2);

  await page.screenshot({ path: testInfo.outputPath("before-drag-out.png"), fullPage: true });

  // Drag the top green item out, dropping it south of the OTHER red sibling
  await moveCanvasItemToSide(page, greenItems.first(), redItems.last(), "south");
  await page.waitForTimeout(500);

  await page.screenshot({ path: testInfo.outputPath("after-drag-out.png"), fullPage: true });
  console.log("green item count after drag-out attempt:", await greenItems.count());
  console.log("root item count:", await rootCanvasItems(page).count());
});

test("repro: move item out of green stack south of a root item, then delete it - neighbor must survive", async ({
  page,
}, testInfo) => {
  await openEditor(page);

  // A, B flat root siblings
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
  await dropOnSide(page, canvasItems(page).first(), "south");
  await expect(rootCanvasItems(page)).toHaveCount(2);

  // Turn A into data2, then nest a data3 (green group) inside it
  await dropOnSide(page, rootCanvasItems(page).first(), "west");
  await expectRedContainer(page);
  await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");
  await expectGreenContainer(page);

  const greenItems = page.locator(".data3 > .drag.vertical");
  await expect(greenItems).toHaveCount(2);

  // B is still a plain flat root item at this point
  const itemB = page.locator("#drop > .drag.vertical.dataItem").first();
  await expect(itemB).toHaveCount(1);

  await page.screenshot({ path: testInfo.outputPath("0-before-move.png"), fullPage: true });

  // Move one green item out of the stack, dropping it south of B
  await moveCanvasItemToSide(page, greenItems.first(), itemB, "south");
  await page.waitForTimeout(500);
  await page.screenshot({ path: testInfo.outputPath("1-after-move.png"), fullPage: true });

  // The moved item now sits directly south of B, as a flat root sibling
  const movedItem = itemB.locator("xpath=following-sibling::*[1]");
  await expect(movedItem).toHaveCount(1);

  // Delete the moved item
  await dropCanvasItemOnDeleteBar(page, movedItem);
  await page.waitForTimeout(500);
  await page.screenshot({ path: testInfo.outputPath("2-after-delete.png"), fullPage: true });

  // B (the "remaining item" the moved item was placed south of) must still be there
  await expect(itemB).toHaveCount(1);
  console.log("root items after delete:", await rootCanvasItems(page).count());
  console.log("B still present:", (await itemB.count()) === 1);
});

test("repro: delete first (top) item from green stack", async ({ page }, testInfo) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
  await dropOnSide(page, canvasItems(page).first(), "west");
  await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");

  const greenItems = page.locator(".data3 > .drag.vertical");
  await expect(greenItems).toHaveCount(2);

  await dropCanvasItemOnDeleteBar(page, greenItems.first());
  await page.waitForTimeout(500);
  await page.screenshot({ path: testInfo.outputPath("after-delete-2to1.png"), fullPage: true });
  console.log("green item count after delete (2->1) attempt:", await greenItems.count());
});

import { expect, test } from "@playwright/test";
import { expectRedContainer, expectGreenContainer } from "../../../helpers/assertions";
import { canvasItems, rootCanvasItems } from "../../../helpers/build-signature";
import {
  dropOnSide,
  dropPanelItemInCanvas,
  dropCanvasItemOnDeleteBar,
  moveCanvasItemToSide,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test("repro: move whole group3 to root between two flat items, then delete it", async ({ page }, testInfo) => {
  await openEditor(page);

  // A, B, C flat root siblings (A south of nothing, B south of A, C south of B)
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
  await dropOnSide(page, canvasItems(page).first(), "south"); // A, B
  await dropOnSide(page, rootCanvasItems(page).last(), "south"); // A, B, C

  await expect(rootCanvasItems(page)).toHaveCount(3);

  // Turn C into data2, then nest a data3 (group3) inside it
  await dropOnSide(page, rootCanvasItems(page).last(), "west");
  await expectRedContainer(page);
  await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");
  await expectGreenContainer(page);
  await expect(page.locator(".data3 > .drag.vertical")).toHaveCount(2);

  await page.screenshot({ path: testInfo.outputPath("0-built.png"), fullPage: true });

  // Move the WHOLE group3 (not a leaf item) to between A and B, via B's north zone.
  // Grab it by its own west edge strip (outside .data3) so the mousedown can't
  // land on one of its nested leaf items instead.
  const group3 = page.locator(".drag.vertical.group3").first();
  const group3Handle = group3.locator(".west").first();
  const itemB = rootCanvasItems(page).nth(1);
  await moveCanvasItemToSide(page, group3Handle, itemB, "north");
  await page.waitForTimeout(500);

  await page.screenshot({ path: testInfo.outputPath("1-after-move.png"), fullPage: true });
  console.log("root items after move:", await rootCanvasItems(page).count());
  console.log("root .group3 count after move:", await page.locator("#drop > .drag.vertical.group3").count());
  console.log("any .group3 count after move:", await page.locator(".group3").count());
  console.log("any .data3 count after move:", await page.locator(".data3").count());
  for (let i = 0; i < (await rootCanvasItems(page).count()); i++) {
    console.log(`root item ${i} class=`, await rootCanvasItems(page).nth(i).getAttribute("class"));
  }

  // Now delete the moved group3 (should now be the 2nd root item: A, group3, B, data2-leftover).
  // Same reasoning as the move above: grab it by its own west edge strip, not
  // its bounding-box center, so the drag can't land on a nested leaf item.
  const movedGroup3 = page.locator("#drop > .drag.vertical.group3").first();
  if ((await movedGroup3.count()) === 0) {
    console.log("ABORT: no root-level .group3 found after move; skipping delete step");
    return;
  }
  const movedGroup3Handle = movedGroup3.locator(".west").first();
  await dropCanvasItemOnDeleteBar(page, movedGroup3Handle);
  await page.waitForTimeout(500);

  await page.screenshot({ path: testInfo.outputPath("2-after-delete.png"), fullPage: true });
  console.log("root items after delete:", await rootCanvasItems(page).count());
  console.log("body html snippet:", (await page.locator("#drop").innerHTML()).slice(0, 3000));
});

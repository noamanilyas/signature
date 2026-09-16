import { expect, test } from "@playwright/test";
import { expectGreenContainer, expectRedContainer } from "../../../helpers/assertions";
import { canvasItems, rootCanvasItems } from "../../../helpers/build-signature";
import {
  dragToTarget,
  dropOnSide,
  dropPanelItemInCanvas,
  dropCanvasItemOnDeleteBar,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR, TABLE_CONVERSION_DELAY_MS } from "../../../helpers/constants";

test("group3 dragged south of its own former group2, then deleted, leaves group2's south zone behind", async ({
  page,
}, testInfo) => {
  await openEditor(page);

  // 1. Add textarea 1
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

  // 2. Add textarea 2 to the east of textarea 1 -> forms group2 (red)
  await dropOnSide(page, canvasItems(page).first(), "east");
  await expectRedContainer(page);
  await expect(rootCanvasItems(page)).toHaveCount(1); // group2 is the sole root item

  // 3. Add textarea 3 below textarea 1 (south of the first data2 child) -> forms group3 (green)
  await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "south");
  await expectGreenContainer(page);
  await expect(page.locator(".data3 > .drag.vertical")).toHaveCount(2);

  const group2 = rootCanvasItems(page).first();
  await page.screenshot({ path: testInfo.outputPath("0-built.png"), fullPage: true });

  // 4. Drag the WHOLE group3 outside, to the south of group2 itself.
  //    Grab it by its own west edge strip so the drag can't land on a nested leaf item.
  //    Target group2's OWN south zone specifically: a plain ".south" locator would
  //    match the nested group3's south zone first, since that one appears earlier
  //    in document order (it's a descendant, inside the data2 row that comes before
  //    group2's own south row).
  const group3 = page.locator(".drag.vertical.group3").first();
  const group3Handle = group3.locator(".west").first();
  const group2Noso = group2.locator(".noso").first();
  const group2South = group2Noso.locator("> .ph-table-row > .south");
  await group2South.waitFor({ state: "visible", timeout: 10_000 });
  await dragToTarget(page, group3Handle, group2South);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
  await page.screenshot({ path: testInfo.outputPath("1-after-move.png"), fullPage: true });

  // It should have been added: group2 (now shrunk to its 1 leftover child) then group3, as 2 root items
  await expect(rootCanvasItems(page)).toHaveCount(2);
  const movedGroup3 = rootCanvasItems(page).nth(1);
  await expect(movedGroup3).toHaveClass(/group3/);

  // 5. Now drag that same group3 to the delete bar.
  const movedGroup3Handle = movedGroup3.locator(".west").first();
  await dropCanvasItemOnDeleteBar(page, movedGroup3Handle);
  await page.waitForTimeout(500);
  await page.screenshot({ path: testInfo.outputPath("2-after-delete.png"), fullPage: true });

  // group2 (the "existing element") must be the only root item left...
  await expect(rootCanvasItems(page)).toHaveCount(1);
  const survivor = rootCanvasItems(page).first();

  // ...and it must have gotten its own south drop zone back, so new items can
  // still be dropped south of it.
  const survivorNoso = survivor.locator(".noso").first();
  const southZone = survivorNoso.locator("> .ph-table-row > .south");
  await expect(southZone).toHaveCount(1);
});

import { expect, test } from "@playwright/test";
import { expectGreenContainer, expectRedContainer } from "../../../helpers/assertions";
import { canvasItems, rootCanvasItems } from "../../../helpers/build-signature";
import {
  dragToTarget,
  dropOnSide,
  dropPanelItemInCanvas,
  getPanelItem,
  moveCanvasItemToSide,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR, TABLE_CONVERSION_DELAY_MS } from "../../../helpers/constants";

test("group3 survives when a 4th item, added south of the whole group, is then moved south of item 3", async ({
  page,
}, testInfo) => {
  await openEditor(page);

  // 1. Add textarea 1
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

  // 2. Add textarea 2 to the east of textarea 1 -> forms group2 (red)
  await dropOnSide(page, canvasItems(page).first(), "east");
  await expectRedContainer(page);
  await expect(rootCanvasItems(page)).toHaveCount(1);

  // 3. Add textarea 3 south of textarea 1 -> forms group3 (green) nested inside group2
  await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "south");
  await expectGreenContainer(page);
  await expect(page.locator(".data3 > .drag.vertical")).toHaveCount(2);

  await page.screenshot({ path: testInfo.outputPath("0-group3-built.png"), fullPage: true });

  // 4. Add textarea 4 south of the WHOLE group3 container - its own outer south
  //    zone (reached the same way group2's own south zone is reached in
  //    group3-south-of-group2.spec.ts) - rather than south of a leaf item inside it.
  //    This nests a brand-new outer group3 around [old group3, item4].
  const group3 = page.locator(".drag.vertical.group3").first();
  const group3Noso = group3.locator(".noso").first();
  const group3South = group3Noso.locator("> .ph-table-row > .south");
  await group3South.waitFor({ state: "visible", timeout: 10_000 });

  const source4 = await getPanelItem(page);
  await dragToTarget(page, source4, group3South);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);

  await page.screenshot({ path: testInfo.outputPath("1-after-4th-added.png"), fullPage: true });

  // The double nesting: an outer group3 wrapping [inner group3, item4].
  await expect(page.locator(".drag.vertical.group3")).toHaveCount(2);
  await expect(page.locator(".drag.vertical")).toHaveCount(7); // group2, outer group3, inner group3, item1-4

  // Sanity check that this step didn't mint two elements sharing a DOM id -
  // jQuery's $('#id') lookups (used by removeExitingItem on every move) pick
  // the first match on a collision, so a duplicate id here would make the
  // rest of this test meaningless.
  const ids = await page.locator(".drag.vertical").evaluateAll((nodes) => nodes.map((n) => n.id));
  expect(new Set(ids).size).toBe(ids.length);

  // item3 is the last leaf inside the ORIGINAL (innermost) group3 stack;
  // item4 is the last leaf added to the tree, sitting in the outer group3.
  const item3 = page.locator(".data3 .data3 > .drag.vertical.dataItem").last();
  const item4 = page.locator(".data3 > .drag.vertical.dataItem").last();

  // 5. Move textarea 4 to south of textarea 3.
  await moveCanvasItemToSide(page, item4, item3, "south");
  await page.waitForTimeout(500);

  await page.screenshot({ path: testInfo.outputPath("2-after-move.png"), fullPage: true });

  // Group3 must not disappear, and no leaf item may be lost in the move.
  await expect(page.locator(".data3")).not.toHaveCount(0);
  await expect(page.locator(".drag.vertical.group3")).not.toHaveCount(0);
  await expect(page.locator(".drag.vertical.dataItem")).toHaveCount(4);
  await expect(rootCanvasItems(page)).toHaveCount(1);
});

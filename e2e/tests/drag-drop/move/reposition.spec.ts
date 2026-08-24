import { expect, test } from "@playwright/test";
import {
  expectHorizontalOrder,
  expectRedContainer,
  expectVerticalOrder,
} from "../../../helpers/assertions";
import { canvasItems, rootCanvasItems } from "../../../helpers/build-signature";
import {
  dropOnSide,
  dropPanelItemInCanvas,
  moveCanvasItemToSide,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test.describe("reposition canvas items", () => {
  test("swap two root textareas via north drop", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "south");

    const lower = canvasItems(page).nth(1);
    const upper = canvasItems(page).first();
    await moveCanvasItemToSide(page, lower, upper, "north");

    await expect(rootCanvasItems(page)).toHaveCount(2);
    await expectVerticalOrder(rootCanvasItems(page));

    await finishLayoutTest(page, testInfo, "move-swap-root");
  });

  test("drag item out of red row collapses to flat stack", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "north");
    await dropOnSide(page, rootCanvasItems(page).nth(1), "west");

    const redItems = page.locator(".data2 > .drag.vertical");
    await moveCanvasItemToSide(page, redItems.last(), rootCanvasItems(page).first(), "south");

    await expect(rootCanvasItems(page)).toHaveCount(3);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(1);

    await finishLayoutTest(page, testInfo, "move-collapse-red");
  });

  test("reorder inside red row via west drop", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "west");

    const redItems = page.locator(".data2 > .drag.vertical");
    await moveCanvasItemToSide(page, redItems.last(), redItems.first(), "west");

    await expectRedContainer(page);
    await expect(redItems).toHaveCount(3);
    await expectHorizontalOrder(redItems);

    await finishLayoutTest(page, testInfo, "move-reorder-red");
  });
});

import { expect, test } from "@playwright/test";
import {
  expectHorizontalOrder,
  expectNoGreenContainer,
  expectNoRedContainer,
  expectPreviewRows,
  expectRedContainer,
  expectVerticalOrder,
} from "../../../helpers/assertions";
import { rootCanvasItems } from "../../../helpers/build-signature";
import {
  dropPanelItemInCanvas,
  dropTextareaOnEastZone,
  dropTextareaOnNorthZone,
  dropTextareaOnSouthZone,
  dropTextareaOnWestZone,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR, TEXT_PLACEHOLDER } from "../../../helpers/constants";

test.describe("textarea root directions", () => {
  test("T1-N: adds textarea above first item (flat stack)", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    const firstItem = page.locator("#drop > .drag.vertical").first();
    await dropTextareaOnNorthZone(page, firstItem);

    await expect(rootCanvasItems(page)).toHaveCount(2);
    await expectVerticalOrder(rootCanvasItems(page));
    await expectNoRedContainer(page);
    await expectNoGreenContainer(page);
    await expectPreviewRows(page, 2);

    const html = await finishLayoutTest(page, testInfo, "t1-n-above");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(2);
  });

  test("T1-S: adds textarea below first item (flat stack)", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    const firstItem = page.locator("#drop > .drag.vertical").first();
    await dropTextareaOnSouthZone(page, firstItem);

    await expect(rootCanvasItems(page)).toHaveCount(2);
    await expectVerticalOrder(rootCanvasItems(page));
    await expectNoRedContainer(page);
    await expectNoGreenContainer(page);
    await expectPreviewRows(page, 2);

    const html = await finishLayoutTest(page, testInfo, "t1-s-below");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(2);
  });

  test("T1-W: adds textarea left of first item (red container)", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    const firstItem = page.locator("#drop > .drag.vertical").first();
    await dropTextareaOnWestZone(page, firstItem);

    await expect(page.locator(".group2")).toBeVisible();
    await expectRedContainer(page);
    await expectNoGreenContainer(page);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(2);
    await expectHorizontalOrder(page.locator(".data2 > .drag.vertical"));
    await expectPreviewRows(page, 1);

    const html = await finishLayoutTest(page, testInfo, "t1-w-left");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(2);
  });

  test("T1-E: adds textarea right of first item (red container)", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    const firstItem = page.locator("#drop > .drag.vertical").first();
    await dropTextareaOnEastZone(page, firstItem);

    await expect(page.locator(".group2")).toBeVisible();
    await expectRedContainer(page);
    await expectNoGreenContainer(page);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(2);
    await expectHorizontalOrder(page.locator(".data2 > .drag.vertical"));
    await expectPreviewRows(page, 1);

    const html = await finishLayoutTest(page, testInfo, "t1-e-right");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(2);
  });
});

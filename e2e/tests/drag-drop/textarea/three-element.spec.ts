import { expect, test } from "@playwright/test";
import {
  expectGreenContainer,
  expectHorizontalOrder,
  expectPreviewRows,
  expectRedContainer,
  expectVerticalOrder,
} from "../../../helpers/assertions";
import { buildLayout, canvasItems } from "../../../helpers/build-signature";
import { dropOnSide, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR, TEXT_PLACEHOLDER } from "../../../helpers/constants";

test.describe("textarea three-element layouts", () => {
  test("T2-H3: three items in one red horizontal row", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, page.locator("#drop > .drag.vertical").first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "west");

    await expectRedContainer(page);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(3);
    await expectHorizontalOrder(page.locator(".data2 > .drag.vertical"));
    await expectPreviewRows(page, 1);

    const html = await finishLayoutTest(page, testInfo, "t2-h3");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(3);
  });

  test("T2-V4: four flat vertical siblings at root", async ({ page }, testInfo) => {
    await openEditor(page);
    await buildLayout(page, [
      {},
      { side: "north", on: 0 },
      { side: "south", on: 1 },
      { side: "south", on: 2 },
    ]);

    await expect(page.locator("#drop > .drag.vertical")).toHaveCount(4);
    await expectVerticalOrder(page.locator("#drop > .drag.vertical"));
    await expectPreviewRows(page, 4);

    const html = await finishLayoutTest(page, testInfo, "t2-v4");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(4);
  });

  test("T2-RG-L: red row with green stack on left item", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");

    await expectRedContainer(page);
    await expectGreenContainer(page);
    await expect(page.locator(".data3 > .drag.vertical")).toHaveCount(2);
    await expectVerticalOrder(page.locator(".data3 > .drag.vertical"));
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "t2-rg-left");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(3);
  });

  test("T2-RG-R: red row with green stack on right item", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "east");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").last(), "south");

    await expectRedContainer(page);
    await expectGreenContainer(page);
    await expect(page.locator(".data3 > .drag.vertical")).toHaveCount(2);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "t2-rg-right");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(3);
  });

  test("T2-V-R: flat stack then red box on lower item", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "north");
    await dropOnSide(page, canvasItems(page).nth(1), "west");

    await expect(page.locator("#drop > .drag.vertical")).toHaveCount(2);
    await expectRedContainer(page);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "t2-v-r");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(3);
  });

  test("T2-H3-E: three items in one red row via east insert", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, page.locator("#drop > .drag.vertical").first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").last(), "east");

    await expectRedContainer(page);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(3);
    await expectHorizontalOrder(page.locator(".data2 > .drag.vertical"));
    await expectPreviewRows(page, 1);

    const html = await finishLayoutTest(page, testInfo, "t2-h3-e");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(3);
  });
});

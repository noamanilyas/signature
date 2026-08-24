import { expect, test } from "@playwright/test";
import {
  expectGreenContainer,
  expectRedContainer,
  expectVerticalOrder,
} from "../../../helpers/assertions";
import { canvasItems } from "../../../helpers/build-signature";
import { dropOnSide, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR, TEXT_PLACEHOLDER } from "../../../helpers/constants";

test.describe("textarea deep nesting", () => {
  test("T3-1: root → red → green → +1 in green (4 textareas)", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");
    await dropOnSide(page, page.locator(".data3 > .drag.vertical").first(), "south");

    await expectRedContainer(page);
    await expectGreenContainer(page);
    await expect(page.locator(".data3 > .drag.vertical")).toHaveCount(3);
    await expectVerticalOrder(page.locator(".data3 > .drag.vertical"));

    const html = await finishLayoutTest(page, testInfo, "t3-1");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(4);
  });

  test("T3-2: root → red → green → nested red inside green", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");
    await dropOnSide(page, page.locator(".data3 > .drag.vertical").first(), "east");

    await expect(page.locator(".data3 .data2")).toHaveCount(1);
    await expect(page.locator(".data3 .data2 > .drag.vertical")).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "t3-2");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(4);
  });

  test("T3-3: red row of three with green on rightmost", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").last(), "north");

    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(3);
    await expectGreenContainer(page);
    await expect(page.locator(".data3 > .drag.vertical")).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "t3-3");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(4);
  });

  test("T3-4: mixed flat + red + green branching", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "north");
    await dropOnSide(page, canvasItems(page).nth(1), "south");
    await dropOnSide(page, canvasItems(page).nth(1), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");

    await expect(page.locator("#drop > .drag.vertical")).toHaveCount(3);
    await expectRedContainer(page);
    await expectGreenContainer(page);

    const html = await finishLayoutTest(page, testInfo, "t3-4");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(5);
  });

  test("T3-1-N: north into existing green stack", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");
    await dropOnSide(page, page.locator(".data3 > .drag.vertical").first(), "north");

    await expectGreenContainer(page);
    await expect(page.locator(".data3 > .drag.vertical")).toHaveCount(3);
    await expectVerticalOrder(page.locator(".data3 > .drag.vertical"));

    const html = await finishLayoutTest(page, testInfo, "t3-1-n");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(4);
  });

  test("T3-2-W: nested red inside green via west", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await dropOnSide(page, canvasItems(page).first(), "west");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north");
    await dropOnSide(page, page.locator(".data3 > .drag.vertical").first(), "west");

    await expect(page.locator(".data3 .data2")).toHaveCount(1);
    await expect(page.locator(".data3 .data2 > .drag.vertical")).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "t3-2-w");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(4);
  });
});

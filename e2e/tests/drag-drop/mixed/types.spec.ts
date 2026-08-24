import { expect, test } from "@playwright/test";
import {
  expectGreenContainer,
  expectPreviewRows,
  expectRedContainer,
} from "../../../helpers/assertions";
import { canvasItems } from "../../../helpers/build-signature";
import { dropOnSide, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR, TEXT_PLACEHOLDER } from "../../../helpers/constants";

test.describe("mixed element types", () => {
  test("MIX-H: textarea with image east in red row", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "textarea");
    await dropOnSide(page, canvasItems(page).first(), "east", "image");

    await expectRedContainer(page);
    await expect(page.locator('.data [category="image"]')).toHaveCount(1);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(2);
    await expectPreviewRows(page, 1);

    const html = await finishLayoutTest(page, testInfo, "mix-h");
    expect(html).toContain('category="image"');
    expect(html).toContain(TEXT_PLACEHOLDER);
  });

  test("MIX-V: textarea with field south as flat stack", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "textarea");
    await dropOnSide(page, canvasItems(page).first(), "south", "field");

    await expect(page.locator("#drop > .drag.vertical")).toHaveCount(2);
    await expectPreviewRows(page, 2);

    const html = await finishLayoutTest(page, testInfo, "mix-v");
    expect(html).toContain("John");
    expect(html).toContain(TEXT_PLACEHOLDER);
  });

  test("MIX-RG: textarea, icon west, field north on icon", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "textarea");
    await dropOnSide(page, canvasItems(page).first(), "west", "icon");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north", "field");

    await expectRedContainer(page);
    await expectGreenContainer(page);
    await expect(page.locator('.data [category="icons"]')).toHaveCount(1);
    await expect(page.locator('.data [category="textField"]')).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "mix-rg");
    expect(html).toContain('category="icons"');
    expect(html).toContain("John");
  });
});

import { expect, test } from "@playwright/test";
import { expectGreenContainer, expectRedContainer } from "../../../helpers/assertions";
import { canvasItems } from "../../../helpers/build-signature";
import { dropOnSide, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test.describe("dynamic field basic layout", () => {
  test("root drop, red container, green stack inside red", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "field");
    await dropOnSide(page, canvasItems(page).first(), "west", "field");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north", "field");

    await expectRedContainer(page);
    await expectGreenContainer(page);
    await expect(page.locator('.data [category="textField"]')).toHaveCount(3);

    const html = await finishLayoutTest(page, testInfo, "field-basic");
    expect(html).toContain('category="textField"');
    expect(html).toContain("John");
  });
});

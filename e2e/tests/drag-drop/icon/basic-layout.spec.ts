import { expect, test } from "@playwright/test";
import { expectGreenContainer, expectRedContainer } from "../../../helpers/assertions";
import { canvasItems } from "../../../helpers/build-signature";
import { dropOnSide, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test.describe("icon basic layout", () => {
  test("root drop, red container, green stack inside red", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "icon");
    await dropOnSide(page, canvasItems(page).first(), "west", "icon");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "north", "icon");

    await expectRedContainer(page);
    await expectGreenContainer(page);
    await expect(page.locator('.data [category="icons"]')).toHaveCount(3);

    const html = await finishLayoutTest(page, testInfo, "icon-basic");
    expect(html).toContain('category="icons"');
  });
});

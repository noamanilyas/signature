import { expect, test } from "@playwright/test";
import {
  expectGreenContainer,
  expectRedContainer,
} from "../../../helpers/assertions";
import { canvasItems } from "../../../helpers/build-signature";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import {
  addFieldRow,
  cancelFieldsModal,
  fillFieldRow,
  saveFieldsModal,
  setMultiLine,
  waitForFieldsModal,
} from "../../../helpers/fields-modal";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test.describe("fields modal drag-drop", () => {
  test("cancel removes placeholder and keeps canvas empty", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "fields");

    await waitForFieldsModal(page);
    await expect(page.locator(".toBeReplacedByActual")).toHaveCount(1);

    await cancelFieldsModal(page);
    await expect(canvasItems(page)).toHaveCount(0);

    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "textarea");
    await expect(canvasItems(page)).toHaveCount(1);

    await finishLayoutTest(page, testInfo, "fields-cancel");
  });

  test("single-line save builds red row with text and field", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "fields");

    await waitForFieldsModal(page);
    await fillFieldRow(page, 0, { text: "Call me", fieldName: "First Name" });
    await saveFieldsModal(page);

    await expectRedContainer(page);
    await expect(page.locator('.data [category="textField"]')).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "fields-single-line");
    expect(html).toContain("Call me");
    expect(html).toContain("John");
  });

  test("multi-line save builds green stack of red rows", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "fields");

    await waitForFieldsModal(page);
    await setMultiLine(page, true);
    await fillFieldRow(page, 0, { text: "Line one" });
    await addFieldRow(page);
    await fillFieldRow(page, 1, { text: "Line two" });
    await saveFieldsModal(page);

    await expectGreenContainer(page);
    await expect(page.locator(".data3 > .group2")).toHaveCount(2);
    await expect(page.locator('.data [category="textField"]')).toHaveCount(2);

    const html = await finishLayoutTest(page, testInfo, "fields-multi-line");
    expect(html).toContain("Line one");
    expect(html).toContain("Line two");
  });
});

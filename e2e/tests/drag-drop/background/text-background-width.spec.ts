import { expect, test } from "@playwright/test";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { openPropertiesFor, closePropertiesModal } from "../../../helpers/properties-modal";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Bug report: giving a text item a background color (Properties > Background
// tab) painted that color across almost the whole preview width instead of
// staying limited to the text itself.
//
// convertToTable.js's textTable() builds two nested cells for a text item:
// an outer `td` (the mainTable row cell - sized by the mainTable's own
// width, so it can be far wider than the text) and an inner `td1` (tightly
// shrink-wrapped to the text via white-space:nowrap). applyCSS's background
// branch used to ignore the `type` list callers pass it and copy background
// onto whatever `td` it was given regardless - so the outer, full-width `td`
// picked up the exact same background as the inner one.
async function setBackgroundColor(page: import("@playwright/test").Page, hex: string) {
  await page.locator("#v-background-side").click();
  await page.locator("#background-colorInput").waitFor({ state: "attached", timeout: 10_000 });
  await page.evaluate((value) => {
    const native = document.getElementById("background-colorInput") as HTMLInputElement;
    native.value = value;
    native.dispatchEvent(new Event("change", { bubbles: true }));
  }, hex);
}

test("a text item's background color stays limited to the text, not the whole preview row", async ({
  page,
}) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

  const textSpan = page.locator("#drop span[category='textField']").first();
  await openPropertiesFor(page, textSpan);
  await setBackgroundColor(page, "#ff0000");
  await closePropertiesModal(page);

  const previewSpan = page.locator(".panelPreview span[category='textField']").first();
  await previewSpan.waitFor({ state: "attached", timeout: 15_000 });

  // Inner td (td1 in textTable): shrink-wrapped to the text, should carry
  // the background - this is the correctly-scoped cell.
  const innerTd = previewSpan.locator("xpath=ancestor::td[1]");
  await expect(innerTd).toHaveCSS("background-color", "rgb(255, 0, 0)");

  // Outer td: the mainTable row cell for this item, sized by the whole
  // mainTable width. Before the fix, this also got painted red, which is
  // what made the color look like it spanned almost the entire preview.
  const outerTd = previewSpan.locator("xpath=ancestor::td[2]");
  await expect(outerTd).not.toHaveCSS("background-color", "rgb(255, 0, 0)");

  // Confirm it's actually visually confined: the colored cell should be
  // much narrower than the row it sits in, not close to the same width.
  const innerBox = await innerTd.boundingBox();
  const outerBox = await outerTd.boundingBox();
  expect(innerBox).not.toBeNull();
  expect(outerBox).not.toBeNull();
  expect(innerBox!.width).toBeLessThan(outerBox!.width * 0.5);
});

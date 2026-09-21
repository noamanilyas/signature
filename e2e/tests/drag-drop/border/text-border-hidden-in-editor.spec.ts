import { expect, test } from "@playwright/test";
import { canvasItems } from "../../../helpers/build-signature";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Per explicit request: a border set on a text item via the Border tab
// should not render live on the editing canvas - it should only show up
// once you look at the generated Preview. The border still needs to reach
// the preview's <td> (see textTable() in convertToTable.js), which reads
// the border-* attribute rather than inline style, so it survives skipping
// the live .css() call.
test("repro: text border stays invisible on canvas, only shows in preview", async ({ page }) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

  const span = canvasItems(page).first().locator("span[category='textField']").first();
  await span.click();
  await page.locator("#propertiesModel").waitFor({ state: "visible", timeout: 10_000 });
  await page.locator("#v-border-side").click();
  await page.locator("#border-size-all").waitFor({ state: "visible", timeout: 10_000 });
  await page.locator("#border-size-all").fill("5");
  await page.locator("#border-size-all").dispatchEvent("change");
  await page.locator("#border-type-all").selectOption("solid");
  await page.waitForTimeout(300);
  await page.locator('#propertiesModel button.close, #propertiesModel [data-dismiss="modal"]').first().click();
  await page.locator("#propertiesModel").waitFor({ state: "hidden", timeout: 10_000 });
  await page.waitForTimeout(500);

  // The attribute (used by the preview generator) must still be set...
  const attrs = await span.evaluate((el) => ({
    borderWidth: el.getAttribute("border-width"),
    borderStyle: el.getAttribute("border-style"),
  }));
  expect(attrs.borderWidth).toBe("5px");
  expect(attrs.borderStyle).toBe("solid");

  // ...but the live canvas element must not actually render that border.
  const computedBorder = await span.evaluate((el) => getComputedStyle(el).borderRightWidth);
  console.log("computed border-right-width on live canvas span:", computedBorder);
  expect(computedBorder).not.toBe("5px");

  // The preview, however, must show the border on its wrapping <td>.
  const previewTd = page.locator(".panelPreview td[style*='border-width: 5px']").first();
  await expect(previewTd).toHaveCount(1);
});

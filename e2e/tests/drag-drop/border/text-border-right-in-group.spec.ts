import { expect, test } from "@playwright/test";
import { expectRedContainer } from "../../../helpers/assertions";
import { canvasItems } from "../../../helpers/build-signature";
import { dropOnSide, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Follow-up repro: a border-right + padding-right set on ONE text item in a
// horizontal group (group2) renders, in the exported preview, as a line
// that spans the full height of the row (matching the tallest sibling,
// e.g. an image) instead of hugging just that one line of text.
test("repro: border-right on a grouped text item must not stretch to the row height in preview", async ({
  page,
}, testInfo) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
  // Mirror the reported repro: an image + two text items side by side in a
  // horizontal group, so the row's height is driven by the (tall) image.
  await dropOnSide(page, canvasItems(page).first(), "west", "image");
  await expectRedContainer(page);
  await dropOnSide(page, page.locator(".data2 > .drag.vertical").first(), "east");

  const group = page.locator(".data2").first();
  const items = group.locator("> .drag.vertical");
  await expect(items).toHaveCount(3);

  const firstSpan = items.filter({ has: page.locator("span[category='textField']") }).first().locator("span[category='textField']").first();
  await firstSpan.click();
  await page.locator("#propertiesModel").waitFor({ state: "visible", timeout: 10_000 });
  await page.locator("#v-border-side").click();
  await page.locator("#border-size-right").waitFor({ state: "visible", timeout: 10_000 });
  await page.locator("#border-size-right").fill("1");
  await page.locator("#border-size-right").dispatchEvent("change");
  await page.locator("#border-type-right").selectOption("solid");
  await page.waitForTimeout(300);

  // Also set right padding to match the reported repro (padding-right: 20px)
  await page.locator("#v-padding-side").click();
  const paddingRightInput = page.locator("#padding-size-right, #padding-right, input[id*='padding'][id*='right']").first();
  if (await paddingRightInput.count()) {
    await paddingRightInput.fill("20");
    await paddingRightInput.dispatchEvent("change");
  }
  await page.waitForTimeout(300);

  await page.locator('#propertiesModel button.close, #propertiesModel [data-dismiss="modal"]').first().click();
  await page.locator("#propertiesModel").waitFor({ state: "hidden", timeout: 10_000 });
  await page.waitForTimeout(500);

  const previewTable = page.locator(".panelPreview table.mainTable").first();
  await previewTable.waitFor({ state: "attached", timeout: 15_000 });
  await previewTable.scrollIntoViewIfNeeded();

  await page.screenshot({ path: testInfo.outputPath("preview-full.png"), fullPage: true });
  const previewBox = await previewTable.boundingBox();
  console.log("previewTable box:", previewBox);

  const previewHTML = await previewTable.evaluate((el) => el.outerHTML);
  console.log("PREVIEW HTML:\n", previewHTML);

  // The td1 that hugs the bordered text should be roughly one line tall,
  // not stretched to the height of the tallest sibling (e.g. an image ~64px).
  const borderedTd = page.locator(".panelPreview td[style*='border-right']").first();
  const box = await borderedTd.boundingBox();
  console.log("bordered td box:", box);
  await page.screenshot({ path: testInfo.outputPath("preview-cropped.png"), clip: previewBox! });
});

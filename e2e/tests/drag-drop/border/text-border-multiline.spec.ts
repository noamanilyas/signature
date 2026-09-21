import { expect, test } from "@playwright/test";
import { canvasItems } from "../../../helpers/build-signature";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Follow-up repro: the in-canvas rich text editor lets a user create a
// second line by pressing Enter, which the browser/jquery-te represents as
// a <div> nested inside the text item's <span category="textField">. That
// nested <div> forces a hard line break inside otherwise-inline content.
// When a border-right is then applied to that span, CSS paints a
// border-right on the right edge of EVERY line box - one short stroke after
// "Your text here!" and a second, much shorter stroke after "hry" - which
// reads as a stray extra border line sitting below the real one.
test("repro: border-right on a two-line text item paints one stroke per line, not one border", async ({
  page,
}, testInfo) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

  const item = canvasItems(page).first();
  const span = item.locator("span[category='textField']").first();

  // Reproduce exactly the DOM the reported session ended up with: a second
  // line represented as a nested <div>, as produced by the rich text editor.
  await span.evaluate((el) => {
    el.innerHTML = "Your text here!<div>hry</div>";
  });

  await span.click();
  await page.locator("#propertiesModel").waitFor({ state: "visible", timeout: 10_000 });
  await page.locator("#v-border-side").click();
  await page.locator("#border-size-right").waitFor({ state: "visible", timeout: 10_000 });
  await page.locator("#border-size-right").fill("1");
  await page.locator("#border-size-right").dispatchEvent("change");
  await page.locator("#border-type-right").selectOption("solid");
  await page.waitForTimeout(300);
  await page.locator('#propertiesModel button.close, #propertiesModel [data-dismiss="modal"]').first().click();
  await page.locator("#propertiesModel").waitFor({ state: "hidden", timeout: 10_000 });
  await page.waitForTimeout(500);

  const previewTable = page.locator(".panelPreview table.mainTable").first();
  await previewTable.waitFor({ state: "attached", timeout: 15_000 });
  const previewHTML = await previewTable.evaluate((el) => el.outerHTML);
  console.log("PREVIEW HTML:\n", previewHTML);

  await previewTable.scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("preview.png"), fullPage: true });

  // Confirm the span really does carry an illegal block child - that's the
  // precondition for the multi-line-boxes-each-get-a-border artifact.
  const previewSpan = page.locator(".panelPreview span[category='textField']").first();
  const hasNestedDiv = await previewSpan.evaluate((el) => !!el.querySelector("div"));
  console.log("preview span has nested <div> (forces a second line box):", hasNestedDiv);
  expect(hasNestedDiv).toBe(true);
});

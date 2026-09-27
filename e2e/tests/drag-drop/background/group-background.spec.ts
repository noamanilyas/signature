import { expect, test } from "@playwright/test";
import { expectRedContainer } from "../../../helpers/assertions";
import { canvasItems } from "../../../helpers/build-signature";
import { dropOnSide, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor, getGeneratedSignatureHtml } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// A group's own background (set via its Group Properties, opened by
// clicking the group's own .data2/.data3 area rather than one of its child
// items) is stored as a "background" attribute on that .data2/.data3
// element (background.js) and forwarded onto the group's own dedicated box
// (td1 in getSubItemsForgroup2/3) by convertToTable.js.
test("a horizontal group's own background (set via its Group Properties) shows in the Preview", async ({
  page,
}) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
  await dropOnSide(page, canvasItems(page).first(), "east");
  await expectRedContainer(page);

  const group = page.locator(".data2").first();
  // Click the group container itself (its own border/background), not a
  // child item - same technique as clicking a table's own <table> element.
  await group.evaluate((el) => (el as HTMLElement).click());
  await expect(page.locator("#propertiesModelLabel")).toContainText("Group Properties");

  await page.locator("#v-background-side").click();
  await page.locator("#background-colorInput").waitFor({ state: "attached", timeout: 10_000 });
  await page.evaluate(() => {
    const native = document.getElementById("background-colorInput") as HTMLInputElement;
    native.value = "#0000ff";
    native.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(300);

  const html = await getGeneratedSignatureHtml(page);
  expect(html).toContain("rgb(0, 0, 255)");
});

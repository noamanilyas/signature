import { expect, test } from "@playwright/test";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor, getGeneratedSignatureHtml } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Regression test for: a table's own border/padding/size - set via "Group
// Properties", opened by clicking the table's own border/background rather
// than one of its cells (the <table class="editor-table"> tag itself carries
// category="group") - applied live in the editor but never reached the
// Preview. getSubItemsForTableItem()'s caller only ever read "align" off the
// table's .data wrapper (applyAlignToCell), never border/padding/size, unlike
// the equivalent group2/group3 code paths which did forward them. Fixed by
// also calling applyCSS(td, editorTable, ["border", "padding", "size"]) at
// each of the four spots in convertToTable.js that build a preview cell for
// a nested tableItem.
test("a table's own padding (set via its Group Properties) shows in the Preview", async ({ page }) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

  const tableEl = page.locator("table.editor-table").first();
  await expect(tableEl).toHaveCount(1);

  // Click the <table> element itself (its own border/background), not a cell.
  await tableEl.evaluate((el) => (el as HTMLElement).click());
  await expect(page.locator("#propertiesModelLabel")).toHaveText("Group Properties");

  await page.locator("#v-padding-side").click();
  await page.locator("#padding-all").waitFor({ state: "visible" });
  await page.locator("#padding-all").fill("35");
  await page.locator("#padding-all").dispatchEvent("change");
  await page.waitForTimeout(300);

  const html = await getGeneratedSignatureHtml(page);
  expect(html).toContain("padding: 35px");
});

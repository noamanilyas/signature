import { expect, test } from "@playwright/test";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor, getGeneratedSignatureHtml } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Regression test for: a table's own background (set via "Group Properties",
// opened by clicking the table's own border/background rather than one of
// its cells) applied live in the editor but never reached the Preview.
//
// convertToTable.js forwards border/padding/size from the <table
// class="editor-table"> element onto the preview `td` that holds the whole
// rebuilt table (see the four applyCSS(td, editorTable, [...]) call sites),
// but "background" was left out of that list - unlike a table cell's own
// background, which is still copied per-cell further down.
test("a table's own background (set via its Group Properties) shows in the Preview", async ({ page }) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

  const tableEl = page.locator("table.editor-table").first();
  await expect(tableEl).toHaveCount(1);

  // Click the <table> element itself (its own border/background), not a cell.
  await tableEl.evaluate((el) => (el as HTMLElement).click());
  await expect(page.locator("#propertiesModelLabel")).toHaveText("Group Properties");

  await page.locator("#v-background-side").click();
  await page.locator("#background-colorInput").waitFor({ state: "attached", timeout: 10_000 });
  await page.evaluate(() => {
    const native = document.getElementById("background-colorInput") as HTMLInputElement;
    native.value = "#00ff00";
    native.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(300);

  const html = await getGeneratedSignatureHtml(page);
  expect(html).toContain("rgb(0, 255, 0)");
});

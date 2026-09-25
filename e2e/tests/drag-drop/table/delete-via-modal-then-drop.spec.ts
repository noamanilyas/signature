import { expect, test } from "@playwright/test";
import { tableCells } from "../../../helpers/build-signature";
import { dropIntoTableCell, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test.describe("delete table cell item via Properties modal then drop", () => {
  test("delete cell item via modal Delete button, then drop a new item into the same cell", async ({
    page,
  }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

    const cell = tableCells(page).first();
    await dropIntoTableCell(page, cell, "textarea");
    await expect(cell.locator(".drag.vertical")).toHaveCount(1);

    // Open the item's own Properties modal (click its .data content) and
    // delete it from there, instead of dragging it to the trash bar.
    await cell.locator(".drag.vertical .data").first().click();
    await page.locator("#propertiesModel").waitFor({ state: "visible", timeout: 10_000 });
    await page.locator("#propertiesModelDelete").click();
    await page.locator("#propertiesModel").waitFor({ state: "hidden", timeout: 10_000 });

    await expect(cell.locator(".drag.vertical")).toHaveCount(0);

    await dropIntoTableCell(page, cell, "textarea");
    await expect(cell.locator(".drag.vertical")).toHaveCount(1);

    await finishLayoutTest(page, testInfo, "del-modal-table-cell");
  });
});

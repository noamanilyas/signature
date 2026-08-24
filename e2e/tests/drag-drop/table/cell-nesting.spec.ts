import { expect, test } from "@playwright/test";
import {
  expectGreenContainer,
  expectNoGreenContainer,
  expectNoRedContainer,
  expectRedContainer,
} from "../../../helpers/assertions";
import {
  buildNestedFlowInCell,
  tableCells,
} from "../../../helpers/build-signature";
import {
  dropIntoTableCell,
  dropOnSide,
  dropPanelItemInCanvas,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR, TEXT_PLACEHOLDER } from "../../../helpers/constants";

test.describe("table cell nesting", () => {
  test("smoke: drop table creates 4 empty cells", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

    await expect(tableCells(page)).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(tableCells(page).nth(i).locator(".drag.vertical")).toHaveCount(0);
    }
    await expect(page.locator("#drop .editor-table")).toHaveCount(1);

    await finishLayoutTest(page, testInfo, "tbl-smoke");
  });

  for (const [index, label] of [
    [0, "tl"],
    [1, "tr"],
    [2, "bl"],
    [3, "br"],
  ] as const) {
    test(`cell ${index} (${label.toUpperCase()}): nested red+green flow`, async ({ page }, testInfo) => {
      await openEditor(page);
      await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

      const cell = tableCells(page).nth(index);
      await buildNestedFlowInCell(page, cell);

      await expect(cell.locator(".data2")).toHaveCount(1);
      await expect(cell.locator(".data3")).toHaveCount(1);
      await expect(cell.locator('.data [category="textField"]')).toHaveCount(4);

      for (let i = 0; i < 4; i++) {
        if (i === index) continue;
        await expect(tableCells(page).nth(i).locator(".drag.vertical")).toHaveCount(0);
      }

      const html = await finishLayoutTest(page, testInfo, `tbl-cell-${label}`);
      expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(4);
    });
  }

  test("complementary directions: east red then green in TL cell", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

    const cell = tableCells(page).first();
    await dropIntoTableCell(page, cell, "textarea");

    const firstItem = cell.locator(".drag.vertical").first();
    await dropOnSide(page, firstItem, "east", "textarea");
    await dropOnSide(page, cell.locator(".data2 > .drag.vertical").first(), "south", "textarea");
    await dropOnSide(page, cell.locator(".data3 > .drag.vertical").first(), "north", "textarea");

    await expectRedContainer(page);
    await expectGreenContainer(page);
    await expect(cell.locator('.data [category="textField"]')).toHaveCount(4);

    const html = await finishLayoutTest(page, testInfo, "tbl-cell-es-n");
    expect((html.match(new RegExp(TEXT_PLACEHOLDER, "g")) || []).length).toBe(4);
  });

  test("replace cell content: image replaces textarea in TR cell", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

    const cell = tableCells(page).nth(1);
    await dropIntoTableCell(page, cell, "textarea");
    await dropIntoTableCell(page, cell, "image");

    await expect(cell.locator('.data [category="image"]')).toHaveCount(1);
    await expect(cell.locator('.data [category="textField"]')).toHaveCount(0);
    await expect(tableCells(page).nth(0).locator(".drag.vertical")).toHaveCount(0);
    await expect(tableCells(page).nth(2).locator(".drag.vertical")).toHaveCount(0);
    await expect(tableCells(page).nth(3).locator(".drag.vertical")).toHaveCount(0);

    const html = await finishLayoutTest(page, testInfo, "tbl-cell-replace");
    expect(html).toContain('category="image"');
    expect(html).not.toContain(TEXT_PLACEHOLDER);
  });
});

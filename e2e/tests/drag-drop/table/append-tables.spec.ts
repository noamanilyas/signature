import { expect, test } from "@playwright/test";
import {
  expectHorizontalOrder,
  expectNoGreenContainer,
  expectNoRedContainer,
  expectRedContainer,
} from "../../../helpers/assertions";
import { canvasItems, rootCanvasItems, tableCells } from "../../../helpers/build-signature";
import {
  dropIntoTableCell,
  dropOnSide,
  dropPanelItemInCanvas,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { finishLayoutTest } from "../../../helpers/finish-test";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test.describe("append tables", () => {
  test("TBL-N: second table north of first", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
    await dropOnSide(page, canvasItems(page).first(), "north", "table");

    await expect(rootCanvasItems(page)).toHaveCount(2);
    await expectNoRedContainer(page);
    await expectNoGreenContainer(page);

    await finishLayoutTest(page, testInfo, "tbl-n");
  });

  test("TBL-S: second table south of first", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
    await dropOnSide(page, canvasItems(page).first(), "south", "table");

    await expect(rootCanvasItems(page)).toHaveCount(2);
    await expectNoRedContainer(page);
    await expectNoGreenContainer(page);

    await finishLayoutTest(page, testInfo, "tbl-s");
  });

  test("TBL-W: second table west of first in red row", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
    await dropOnSide(page, canvasItems(page).first(), "west", "table");

    await expectRedContainer(page);
    await expect(page.locator(".data2 > .drag.vertical.tableItem")).toHaveCount(2);

    await finishLayoutTest(page, testInfo, "tbl-w");
  });

  test("TBL-E: second table east of first in red row", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
    await dropOnSide(page, canvasItems(page).first(), "east", "table");

    await expectRedContainer(page);
    await expect(page.locator(".data2 > .drag.vertical.tableItem")).toHaveCount(2);

    await finishLayoutTest(page, testInfo, "tbl-e");
  });

  test("TBL-H3: three tables in one red row via east insert", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
    await dropOnSide(page, canvasItems(page).first(), "west", "table");
    await dropOnSide(page, page.locator(".data2 > .drag.vertical").last(), "east", "table");

    await expectRedContainer(page);
    await expect(page.locator(".data2 > .drag.vertical.tableItem")).toHaveCount(3);
    await expectHorizontalOrder(page.locator(".data2 > .drag.vertical.tableItem"));

    await finishLayoutTest(page, testInfo, "tbl-h3");
  });

  test("TBL-IN-CELL: nested table inside a cell", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
    await dropIntoTableCell(page, tableCells(page).first(), "table");

    const cell = tableCells(page).first();
    await expect(cell.locator(".editor-table")).toHaveCount(1);
    await expect(tableCells(page)).toHaveCount(8);

    await finishLayoutTest(page, testInfo, "tbl-in-cell");
  });

  test("textarea with table south as root siblings", async ({ page }, testInfo) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "textarea");
    await dropOnSide(page, canvasItems(page).first(), "south", "table");

    await expect(rootCanvasItems(page)).toHaveCount(2);
    await expectNoRedContainer(page);

    await finishLayoutTest(page, testInfo, "tbl-textarea-sibling");
  });
});

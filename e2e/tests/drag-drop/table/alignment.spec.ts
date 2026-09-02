import { expect, test } from "@playwright/test";
import { tableCells } from "../../../helpers/build-signature";
import { openEditor } from "../../../helpers/editor";
import {
  closePropertiesModal,
  openAlignmentTab,
  openTableGroupProperties,
} from "../../../helpers/properties-modal";
import {
  applyAndExpectAlign,
  dropNestedTableInCell,
  dropTableUnderWideRow,
  expectTableHorizontalAlign,
  expectTableStretch,
} from "../../../helpers/table-alignment";
import { alignTableHorizontally } from "../../../helpers/properties-modal";

test.describe("table alignment", () => {
  test.describe("horizontal align moves table in editor + preview", () => {
    for (const align of ["left", "center", "right"] as const) {
      test(`root table: ${align}`, async ({ page }) => {
        await openEditor(page);
        const editorTable = await dropTableUnderWideRow(page);

        // Start from right when testing left so we prove it actually moves back
        if (align === "left") {
          await alignTableHorizontally(page, editorTable, "right");
        }

        await applyAndExpectAlign(page, editorTable, editorTable, align);
      });
    }
  });

  test("alignment tab is available when opening a table cell", async ({ page }) => {
    await openEditor(page);
    await dropTableUnderWideRow(page);

    await openTableGroupProperties(page, tableCells(page).first());
    await openAlignmentTab(page);
    await expect(page.locator("#align-horiz-left")).toBeVisible();
    await expect(page.locator("#align-horiz-center")).toBeVisible();
    await expect(page.locator("#align-horiz-right")).toBeVisible();
    await expect(page.locator("#align-horiz-stretch")).toBeVisible();
    await closePropertiesModal(page);
  });

  test("clicking a table cell aligns the whole table (right)", async ({ page }) => {
    await openEditor(page);
    const editorTable = await dropTableUnderWideRow(page);
    await applyAndExpectAlign(page, tableCells(page).first(), editorTable, "right");
  });

  test("switching left → center → right → stretch → right keeps editor and preview in sync", async ({
    page,
  }) => {
    await openEditor(page);
    const editorTable = await dropTableUnderWideRow(page);

    await applyAndExpectAlign(page, editorTable, editorTable, "left");
    await applyAndExpectAlign(page, editorTable, editorTable, "center");
    await applyAndExpectAlign(page, editorTable, editorTable, "right");

    await alignTableHorizontally(page, editorTable, "stretch");
    await expectTableStretch(page, editorTable);

    // Stretch → Right must clear full-width and move the table again
    await applyAndExpectAlign(page, editorTable, editorTable, "right");
  });

  test("nested table in a cell: horizontal right moves nested table in editor and preview", async ({
    page,
  }) => {
    await openEditor(page);
    const { nestedTable } = await dropNestedTableInCell(page);

    await alignTableHorizontally(page, nestedTable, "right");
    await expectTableHorizontalAlign(page, nestedTable, "right");
  });

  test("root table: stretch sets full width in editor and preview", async ({ page }) => {
    await openEditor(page);
    const editorTable = await dropTableUnderWideRow(page);
    await alignTableHorizontally(page, editorTable, "stretch");
    await expectTableStretch(page, editorTable);
  });
});

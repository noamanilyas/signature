import { expect, type Locator, type Page } from "@playwright/test";
import { MAIN_DROP_ZONE_SELECTOR } from "./constants";
import { canvasItems } from "./build-signature";
import {
  dropIntoTableCell,
  dropOnSide,
  dropPanelItemInCanvas,
  waitForSignatureTable,
} from "./drag-drop";
import {
  alignTableHorizontally,
  type HorizontalAlignment,
} from "./properties-modal";

export type TableHorizontalAlign = Exclude<HorizontalAlignment, "stretch">;

/** Drop two textareas side-by-side, then a table below — canvas wider than the table. */
export async function dropTableUnderWideRow(page: Page) {
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "textarea");
  await dropOnSide(page, canvasItems(page).first(), "east", "textarea");
  await dropOnSide(page, canvasItems(page).first(), "south", "table");
  return page.locator("#drop .tableItem .editor-table").first();
}

export async function dropNestedTableInCell(page: Page) {
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");
  const hostCell = page.locator("#drop .tableDrop.editor-td-div").first();
  await dropIntoTableCell(page, hostCell, "table");
  return {
    hostCell,
    nestedTable: hostCell.locator(".editor-table").first(),
  };
}

export function editorTableOuterPh(table: Locator) {
  return table.locator(
    "xpath=ancestor::*[contains(@class, 'tableItem')][1]/*[contains(@class, 'ph-table')][1]"
  );
}

/** Attrs + editor offset that make Left/Center/Right visible in the drop zone. */
export async function expectEditorTableAligned(table: Locator, align: TableHorizontalAlign) {
  await expect(table).toHaveAttribute("text-align", align);
  await expect(table).not.toHaveAttribute("width-stretch", "100%");

  const outerPh = editorTableOuterPh(table);
  await expect(outerPh).toHaveCSS("position", "relative");

  const leftPx = parseFloat(await outerPh.evaluate((el) => getComputedStyle(el).left));
  if (align === "left") {
    expect(leftPx).toBeLessThan(5);
  } else {
    expect(leftPx).toBeGreaterThan(20);
  }
}

/** Preview wrapping td align + margin on the generated table (same path as text/image). */
export async function expectPreviewTableAligned(page: Page, align: TableHorizontalAlign) {
  const previewTable = await waitForSignatureTable(page);
  const wrappingTd = previewTable.locator(`td[align="${align}"]`).first();
  await expect(wrappingTd).toBeVisible();

  const innerTable = wrappingTd.locator("> table").first();
  await expect(innerTable).toBeVisible();

  if (align === "right") {
    await expect(innerTable).toHaveAttribute("style", /margin-left:\s*auto/i);
  } else if (align === "center") {
    await expect(innerTable).toHaveAttribute("style", /margin-left:\s*auto/i);
    await expect(innerTable).toHaveAttribute("style", /margin-right:\s*auto/i);
  } else {
    await expect(innerTable).toHaveAttribute("style", /margin-left:\s*0/i);
  }
}

/** Geometric check: table mid-x vs canvas mid-x in the drop editor. */
export async function expectTableMovedInEditor(
  page: Page,
  table: Locator,
  align: TableHorizontalAlign
) {
  const canvas = page.locator("#drop");
  const canvasBox = await canvas.boundingBox();
  const tableBox = await table.boundingBox();
  expect(canvasBox, "drop canvas should be visible").toBeTruthy();
  expect(tableBox, "editor table should be visible").toBeTruthy();

  const canvasMidX = canvasBox!.x + canvasBox!.width / 2;
  const tableMidX = tableBox!.x + tableBox!.width / 2;
  const slack = 30;

  if (align === "right") {
    expect(tableMidX).toBeGreaterThan(canvasMidX + slack);
  } else if (align === "center") {
    expect(Math.abs(tableMidX - canvasMidX)).toBeLessThan(canvasBox!.width * 0.25);
  } else {
    expect(tableMidX).toBeLessThan(canvasMidX - slack);
  }
}

export async function expectTableStretch(page: Page, table: Locator) {
  await expect(table).toHaveAttribute("width-stretch", "100%");

  const textAlign = await table.getAttribute("text-align");
  expect(textAlign === null || textAlign === "").toBeTruthy();

  const outerPh = editorTableOuterPh(table);
  const leftPx = parseFloat(await outerPh.evaluate((el) => getComputedStyle(el).left || "0"));
  expect(Number.isNaN(leftPx) ? 0 : Math.abs(leftPx)).toBeLessThan(5);

  const canvasBox = await page.locator("#drop").boundingBox();
  const outerBox = await outerPh.boundingBox();
  expect(canvasBox).toBeTruthy();
  expect(outerBox).toBeTruthy();

  // Outer table block must grow well past a default empty 2x2 (~60px)
  // and cover most of the drop canvas.
  expect(outerBox!.width).toBeGreaterThan(Math.max(150, canvasBox!.width * 0.6));

  const previewTable = await waitForSignatureTable(page);
  await expect(previewTable.locator("td > table").first()).toHaveAttribute(
    "style",
    /width:\s*100%/i
  );
}

/** Full regression check for one horizontal align value. */
export async function expectTableHorizontalAlign(
  page: Page,
  table: Locator,
  align: TableHorizontalAlign
) {
  await expectEditorTableAligned(table, align);
  await expectTableMovedInEditor(page, table, align);
  await expectPreviewTableAligned(page, align);
}

export async function applyAndExpectAlign(
  page: Page,
  target: Locator,
  table: Locator,
  align: TableHorizontalAlign
) {
  await alignTableHorizontally(page, target, align);
  await expectTableHorizontalAlign(page, table, align);
}

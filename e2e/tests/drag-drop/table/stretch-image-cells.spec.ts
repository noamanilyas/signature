import { expect, test } from "@playwright/test";
import { TABLE_CONVERSION_DELAY_MS, MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";
import { dropIntoTableCell, dropPanelItemInCanvas, tableCells, waitForSignatureTable } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { closePropertiesModal, openTableGroupProperties } from "../../../helpers/properties-modal";

/**
 * Regression: a 2-column/1-row table with an image in each cell rendered its
 * images correctly in the editor, but in the preview each image sat in a cell
 * stretched to a share of the full preview width instead of hugging the
 * image. Only visible once a cell had a background colour, which is how it
 * was originally reported.
 *
 * Two separate causes, both in convertToTable.js:
 *  - "Stretch" alignment put width:100% on the rebuilt <table> (directly, and
 *    again via the blanket copy of .editor-table's own inline style), and
 *    table auto-layout split that width across the image columns.
 *  - The width:1% shrink hint on image cells pulls an auto-width table out to
 *    fill its container when no sibling cell is flexible enough to absorb it.
 */

async function buildTwoImageCellTable(page: import("@playwright/test").Page) {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

  // Default drop is 2x2 - shrink to a single row of two columns.
  await openTableGroupProperties(page, tableCells(page).first());
  await page.locator("#v-tableProps-side").click();
  await page.locator("#table-rows").fill("1");
  await page.locator("#table-cols").fill("2");
  await page.locator("#btn-update-rows-cols").click();
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
  await closePropertiesModal(page);

  const cells = tableCells(page);
  await expect(cells).toHaveCount(2);
  await dropIntoTableCell(page, cells.nth(0), "image");
  await dropIntoTableCell(page, cells.nth(1), "image");

  const editorImages = page.locator("#drop img[category='image']");
  await expect(editorImages).toHaveCount(2);
  return { cells, editorImages };
}

async function setBackgroundColor(page: import("@playwright/test").Page, hex: string) {
  await page.locator("#v-background-side").click();
  await page.evaluate((color) => {
    const input = document.getElementById("background-colorInput") as HTMLInputElement;
    input.value = color;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, hex);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
}

/** Every preview cell holding an image must hug that image, not a share of the row. */
async function expectPreviewImageCellsHugTheirImages(page: import("@playwright/test").Page) {
  const previewTable = await waitForSignatureTable(page);
  const innerTable = previewTable.locator("td > table").first();
  const imageCells = innerTable.locator("> tbody > tr > td");
  await expect(imageCells).toHaveCount(2);

  let cellsTotal = 0;
  for (let index = 0; index < 2; index++) {
    const cell = imageCells.nth(index);
    const image = cell.locator("img");
    const cellBox = await cell.boundingBox();
    const imageBox = await image.boundingBox();
    expect(cellBox, "preview image cell should be visible").toBeTruthy();
    expect(imageBox, "preview image should be visible").toBeTruthy();

    // Allow only cell border/padding slack - never a share of the row's width.
    expect(
      cellBox!.width,
      `preview cell ${index} should hug its ${imageBox!.width}px image, not stretch`
    ).toBeLessThan(imageBox!.width + 12);
    cellsTotal += cellBox!.width;
  }

  const innerTableBox = await innerTable.boundingBox();
  expect(innerTableBox!.width).toBeLessThan(cellsTotal + 12);
}

test.describe("table with an image in every cell", () => {
  test("images keep their own width in the preview (left align + background)", async ({ page }) => {
    const { editorImages } = await buildTwoImageCellTable(page);

    for (let index = 0; index < 2; index++) {
      await openTableGroupProperties(page, editorImages.nth(index));
      await setBackgroundColor(page, "#000000");
      await page.locator("#v-alignment-side").click();
      await page.locator("#align-horiz-left").click();
      await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
      await closePropertiesModal(page);
    }

    await expectPreviewImageCellsHugTheirImages(page);
  });

  test("images keep their own width in the preview (right align + background)", async ({ page }) => {
    const { editorImages } = await buildTwoImageCellTable(page);

    for (let index = 0; index < 2; index++) {
      await openTableGroupProperties(page, editorImages.nth(index));
      await setBackgroundColor(page, "#000000");
      await page.locator("#v-alignment-side").click();
      await page.locator("#align-horiz-right").click();
      await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
      await closePropertiesModal(page);
    }

    await expectPreviewImageCellsHugTheirImages(page);
  });

  test("table Stretch does not blow the image cells out to fill the preview", async ({ page }) => {
    const { cells } = await buildTwoImageCellTable(page);

    // Background on the cells themselves - this is what made the stretched
    // cells visible in the original report.
    for (let index = 0; index < 2; index++) {
      await openTableGroupProperties(page, cells.nth(index));
      await setBackgroundColor(page, "#000000");
      await closePropertiesModal(page);
    }

    await openTableGroupProperties(page, cells.first());
    await page.locator("#v-alignment-side").click();
    await page.locator("#align-horiz-stretch").click();
    await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
    await closePropertiesModal(page);

    const previewTable = await waitForSignatureTable(page);
    await expect(previewTable.locator("td > table").first()).not.toHaveAttribute(
      "style",
      /width:\s*100%/i
    );
    await expectPreviewImageCellsHugTheirImages(page);
  });

  test("an explicitly sized image keeps that width in the preview", async ({ page }) => {
    const { editorImages } = await buildTwoImageCellTable(page);

    await openTableGroupProperties(page, editorImages.first());
    await page.locator("#v-size-side").click();
    await page.locator("#size-width").fill("120");
    await page.locator("#size-width").dispatchEvent("change");
    await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
    await page.locator("#v-alignment-side").click();
    await page.locator("#align-horiz-right").click();
    await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
    await closePropertiesModal(page);

    const editorBox = await editorImages.first().boundingBox();
    expect(editorBox!.width).toBeCloseTo(120, 0);

    const previewTable = await waitForSignatureTable(page);
    const previewBox = await previewTable.locator("img").first().boundingBox();
    expect(previewBox!.width).toBeCloseTo(editorBox!.width, 0);

    await expectPreviewImageCellsHugTheirImages(page);
  });
});

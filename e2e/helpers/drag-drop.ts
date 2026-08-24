import type { Locator, Page } from "@playwright/test";
import { TABLE_CONVERSION_DELAY_MS } from "./constants";
import {
  panelSelectorFor,
  SIDE_ZONE_CLASS,
  type DropSide,
  type PanelElementType,
} from "./elements";

const DRAG_STEPS = 24;

/**
 * jQuery UI drag/drop is pointer-driven. Playwright's dragTo is unreliable here,
 * so we simulate a real mouse path with enough steps to cross the drag threshold.
 */
export async function dragToTarget(page: Page, source: Locator, target: Locator) {
  await source.scrollIntoViewIfNeeded();
  await target.scrollIntoViewIfNeeded();

  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Could not resolve drag source or drop target bounding box");
  }

  const sourceX = sourceBox.x + sourceBox.width / 2;
  const sourceY = sourceBox.y + sourceBox.height / 2;
  const targetX = targetBox.x + targetBox.width / 2;
  const targetY = targetBox.y + targetBox.height / 2;

  await page.mouse.move(sourceX, sourceY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: DRAG_STEPS });
  await page.waitForTimeout(120);
  await page.mouse.up();
}

export const dragPanelItemToTarget = dragToTarget;

async function expandAccordionIfNeeded(
  page: Page,
  toggleSelector: string,
  item: Locator
) {
  if (await item.isVisible()) {
    return;
  }

  const toggle = page.locator(toggleSelector);
  const expanded = await toggle.getAttribute("aria-expanded");
  if (expanded !== "true") {
    await toggle.click();
  }
  await item.waitFor({ state: "visible", timeout: 10_000 });
}

export async function getPanelItem(page: Page, element: PanelElementType = "textarea") {
  if (element === "icon") {
    const item = page.locator(panelSelectorFor("icon")).first();
    await expandAccordionIfNeeded(page, '[data-target="#collapseExample"]', item);
    return item;
  }

  if (element === "field") {
    const item = page.locator(panelSelectorFor("field")).first();
    await expandAccordionIfNeeded(page, 'button[data-target="#collapsePersonal"]', item);
    return item;
  }

  return page.locator(panelSelectorFor(element)).first();
}

export async function dropPanelItemToTarget(
  page: Page,
  panelSelector: string,
  target: Locator
) {
  const source = page.locator(panelSelector).first();
  await dragToTarget(page, source, target);
}

export async function dropPanelItemInCanvas(
  page: Page,
  mainDropZone: string | Locator,
  element: PanelElementType = "textarea"
) {
  const source = await getPanelItem(page, element);
  const dropZone = typeof mainDropZone === "string" ? page.locator(mainDropZone) : mainDropZone;
  await dragToTarget(page, source, dropZone);

  if (element === "fields") {
    await page.locator("#fieldsModel").waitFor({ state: "visible", timeout: 10_000 });
    return;
  }

  await page.waitForSelector("#drop .drag.vertical", { timeout: 15_000 });
  await page.waitForSelector(".panelPreview table.mainTable", { timeout: 15_000 });
}

export async function dropOnSide(
  page: Page,
  existingItem: Locator,
  side: DropSide,
  element: PanelElementType = "textarea"
) {
  const source = await getPanelItem(page, element);
  const zone = existingItem.locator(SIDE_ZONE_CLASS[side]).first();

  await zone.waitFor({ state: "visible", timeout: 10_000 });
  await dragToTarget(page, source, zone);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
}

export async function dropIntoTableCell(
  page: Page,
  cell: Locator,
  element: PanelElementType = "textarea"
) {
  const source = await getPanelItem(page, element);
  await dragToTarget(page, source, cell);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
}

export function tableCells(page: Page): Locator {
  return page.locator("#drop .tableDrop.editor-td-div");
}

export async function moveCanvasItemToSide(
  page: Page,
  sourceItem: Locator,
  targetItem: Locator,
  side: DropSide
) {
  const zone = targetItem.locator(SIDE_ZONE_CLASS[side]).first();
  await zone.waitFor({ state: "visible", timeout: 10_000 });
  await dragToTarget(page, sourceItem, zone);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
}

export async function dropCanvasItemOnDeleteBar(page: Page, item: Locator) {
  const deleteBar = page.locator(".delDrop");
  await dragToTarget(page, item, deleteBar);
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
}

export async function dropCanvasItemOnCanvas(page: Page, item: Locator) {
  // Placed canvas items do not get this class by default; script.js only deletes
  // canvas-element drags dropped back onto #drop.
  await item.evaluate((el) => el.classList.add("canvas-element"));

  const dropZone = page.locator("#drop");
  const box = await dropZone.boundingBox();
  if (!box) {
    throw new Error("#drop drop zone is not visible");
  }

  const sourceBox = await item.boundingBox();
  if (!sourceBox) {
    throw new Error("Canvas item is not visible");
  }

  const sourceX = sourceBox.x + sourceBox.width / 2;
  const sourceY = sourceBox.y + sourceBox.height / 2;
  const targetX = box.x + 8;
  const targetY = box.y + 8;

  await item.scrollIntoViewIfNeeded();
  await page.mouse.move(sourceX, sourceY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: DRAG_STEPS });
  await page.waitForTimeout(120);
  await page.mouse.up();
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
}

export async function buildNestedFlowInCell(page: Page, cell: Locator) {
  await dropIntoTableCell(page, cell, "textarea");

  const firstItem = cell.locator(".drag.vertical").first();
  await dropOnSide(page, firstItem, "west", "textarea");

  const redFirst = cell.locator(".data2 > .drag.vertical").first();
  await dropOnSide(page, redFirst, "north", "textarea");

  const greenFirst = cell.locator(".data3 > .drag.vertical").first();
  await dropOnSide(page, greenFirst, "south", "textarea");
}

export async function dropTextareaInMainCanvas(page: Page, mainDropZone: Locator) {
  await dropPanelItemInCanvas(page, mainDropZone, "textarea");
}

export async function dropTextareaOnNorthZone(page: Page, existingItem: Locator) {
  await dropOnSide(page, existingItem, "north", "textarea");
}

export async function dropTextareaOnSouthZone(page: Page, existingItem: Locator) {
  await dropOnSide(page, existingItem, "south", "textarea");
}

export async function dropTextareaOnEastZone(page: Page, existingItem: Locator) {
  await dropOnSide(page, existingItem, "east", "textarea");
}

export async function dropTextareaOnWestZone(page: Page, existingItem: Locator) {
  await dropOnSide(page, existingItem, "west", "textarea");
}

export async function waitForSignatureTable(page: Page) {
  const table = page.locator(".panelPreview table.mainTable").first();
  await table.waitFor({ state: "visible", timeout: 20_000 });
  return table;
}

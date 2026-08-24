import type { Locator, Page } from "@playwright/test";
import { MAIN_DROP_ZONE_SELECTOR } from "./constants";
import {
  buildNestedFlowInCell,
  dropOnSide,
  dropPanelItemInCanvas,
  tableCells,
} from "./drag-drop";
import type { DropSide, PanelElementType } from "./elements";

export type LayoutStep = {
  side: DropSide;
  /** Index of canvas item to drop onto. Defaults to 0 (first item). */
  on?: number;
  element?: PanelElementType;
};

export async function buildLayout(page: Page, steps: LayoutStep[]) {
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, steps[0]?.element ?? "textarea");

  for (let i = 1; i < steps.length; i++) {
    const step = steps[i];
    const targetIndex = step.on ?? 0;
    const target = page.locator("#drop .drag.vertical").nth(targetIndex);
    await dropOnSide(page, target, step.side, step.element ?? "textarea");
  }
}

export function canvasItems(page: Page): Locator {
  return page.locator("#drop .drag.vertical");
}

export function rootCanvasItems(page: Page): Locator {
  return page.locator("#drop > .drag.vertical");
}

export { tableCells, buildNestedFlowInCell };

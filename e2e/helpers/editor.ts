import type { Page } from "@playwright/test";
import {
  EDITOR_BOOT_DELAY_MS,
  EDITOR_PATH,
  TEXTAREA_BUTTON_SELECTOR,
} from "./constants";

export async function openEditor(page: Page) {
  await page.goto(EDITOR_PATH);
  await page.waitForLoadState("domcontentloaded");
  await waitForEditorReady(page);
}

export async function waitForEditorReady(page: Page) {
  await page.waitForSelector(TEXTAREA_BUTTON_SELECTOR, { timeout: 30_000 });
  await page.waitForFunction(() => typeof (window as any).jQuery !== "undefined", null, {
    timeout: 30_000,
  });

  const loadingModal = page.locator(".swal2-container");
  if (await loadingModal.count()) {
    await loadingModal.waitFor({ state: "hidden", timeout: 30_000 }).catch(() => {});
  }

  await page.waitForTimeout(EDITOR_BOOT_DELAY_MS);
}

export async function getGeneratedSignatureHtml(page: Page) {
  const previewTable = page.locator(".panelPreview table.mainTable").first();
  await previewTable.waitFor({ state: "attached", timeout: 20_000 });
  return previewTable.evaluate((table) => table.outerHTML);
}

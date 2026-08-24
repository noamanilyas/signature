import type { Page } from "@playwright/test";
import { TABLE_CONVERSION_DELAY_MS } from "./constants";

export async function waitForFieldsModal(page: Page) {
  await page.locator("#fieldsModel").waitFor({ state: "visible", timeout: 10_000 });
}

export async function fillFieldRow(
  page: Page,
  rowIndex: number,
  options: { text?: string; fieldName?: string; separator?: string }
) {
  const row = page.locator(".field-table > tbody > tr").nth(rowIndex);

  if (options.text !== undefined) {
    await row.locator(".fieldText").fill(options.text);
  }

  if (options.fieldName) {
    await row.locator(".field-select").selectOption(options.fieldName);
  }

  if (options.separator !== undefined) {
    await row.locator(".fieldSeperator").fill(options.separator);
  }
}

export async function addFieldRow(page: Page) {
  await page.locator("#addNewField").click();
}

export async function setMultiLine(page: Page, enabled: boolean) {
  if (enabled) {
    await page.locator('label[for="multiLine"]').click();
  } else {
    await page.locator('label[for="singleLine"]').click();
  }
}

export async function saveFieldsModal(page: Page) {
  await page.locator("#fieldsModelSave").click();
  await page.locator("#fieldsModel").waitFor({ state: "hidden", timeout: 10_000 });
  await page.waitForTimeout(TABLE_CONVERSION_DELAY_MS);
}

export async function cancelFieldsModal(page: Page) {
  await page.locator("#fieldsModel .btn.btn-secondary").click();
  await page.locator("#fieldsModel").waitFor({ state: "hidden", timeout: 10_000 });
}

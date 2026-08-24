import { expect, type Locator, type Page } from "@playwright/test";
import { waitForSignatureTable } from "./drag-drop";

export async function expectRedContainer(page: Page) {
  const redBox = page.locator(".data2").first();
  await expect(redBox).toBeVisible();
  await expect(redBox).toHaveCSS("border-color", "rgb(139, 0, 0)");
}

export async function expectGreenContainer(page: Page) {
  const greenBox = page.locator(".data3").first();
  await expect(greenBox).toBeVisible();
  await expect(greenBox).toHaveCSS("border-color", "rgb(0, 128, 0)");
}

export async function expectNoRedContainer(page: Page) {
  await expect(page.locator(".data2")).toHaveCount(0);
}

export async function expectNoGreenContainer(page: Page) {
  await expect(page.locator(".data3")).toHaveCount(0);
}

export async function expectVerticalOrder(locator: Locator) {
  const positions = await locator.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().top)
  );

  for (let i = 1; i < positions.length; i++) {
    expect(positions[i]).toBeGreaterThan(positions[i - 1]);
  }
}

export async function expectHorizontalOrder(locator: Locator) {
  const positions = await locator.evaluateAll((nodes) =>
    nodes.map((node) => node.getBoundingClientRect().left)
  );

  for (let i = 1; i < positions.length; i++) {
    expect(positions[i]).toBeGreaterThan(positions[i - 1]);
  }
}

export async function expectPreviewRows(page: Page, count: number) {
  const table = await waitForSignatureTable(page);
  await expect(table.locator("> tbody > tr")).toHaveCount(count);
}

export async function expectPreviewCellsInRow(page: Page, rowIndex: number, count: number) {
  const table = await waitForSignatureTable(page);
  await expect(table.locator(`> tbody > tr:nth-child(${rowIndex + 1}) td`)).toHaveCount(count);
}

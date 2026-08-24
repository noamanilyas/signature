import { expect, type Page, type TestInfo } from "@playwright/test";
import { attachTestResults } from "./attach-results";
import { getGeneratedSignatureHtml } from "./editor";
import { normalizeSignatureHtml } from "./normalize-html";
import { waitForSignatureTable } from "./drag-drop";

export async function finishLayoutTest(
  page: Page,
  testInfo: TestInfo,
  snapshotName: string
) {
  const rawHtml = await getGeneratedSignatureHtml(page);
  const html = normalizeSignatureHtml(rawHtml);

  await attachTestResults(testInfo, page, { html, namePrefix: snapshotName });

  const canvas = page.locator("#drop");
  await expect(canvas).toHaveScreenshot(`${snapshotName}-canvas.png`);

  const previewTable = await waitForSignatureTable(page);
  await expect(previewTable).toHaveScreenshot(`${snapshotName}-preview.png`);

  expect(html).toMatchSnapshot(`${snapshotName}.html`);

  return html;
}

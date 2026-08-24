import fs from "node:fs/promises";
import type { Page, TestInfo } from "@playwright/test";

type AttachResultsOptions = {
  html?: string;
  namePrefix?: string;
};

async function saveArtifact(
  testInfo: TestInfo,
  filename: string,
  body: Buffer | string,
  contentType: string
) {
  const filePath = testInfo.outputPath(filename);
  await fs.writeFile(filePath, body);
  await testInfo.attach(filename, {
    path: filePath,
    contentType,
  });
}

export async function attachTestResults(
  testInfo: TestInfo,
  page: Page,
  options: AttachResultsOptions = {}
) {
  const prefix = options.namePrefix ? `${options.namePrefix}-` : "";

  const canvas = page.locator("#drop");
  await canvas.scrollIntoViewIfNeeded();
  const canvasShot = await canvas.screenshot();
  await saveArtifact(testInfo, `${prefix}canvas-layout.png`, canvasShot, "image/png");

  const previewTable = page.locator(".panelPreview table.mainTable").first();
  if (await previewTable.count()) {
    const previewShot = await previewTable.screenshot();
    await saveArtifact(
      testInfo,
      `${prefix}signature-preview.png`,
      previewShot,
      "image/png"
    );
  }

  if (options.html) {
    await saveArtifact(
      testInfo,
      `${prefix}signature-output.html`,
      options.html,
      "text/html"
    );
  }
}

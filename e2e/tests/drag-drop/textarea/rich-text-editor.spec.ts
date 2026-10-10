import { expect, test } from "@playwright/test";
import { canvasItems } from "../../../helpers/build-signature";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";
import { openPropertiesFor } from "../../../helpers/properties-modal";

test.describe("text element rich text editor", () => {
  test("TinyMCE toolbar: bold selection, element-level case + direction, link", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
    await openPropertiesFor(page, canvasItems(page).first());

    const frame = page.frameLocator(".tox-edit-area__iframe");
    const body = frame.locator("body");
    await expect(page.locator(".tox-tinymce")).toBeVisible({ timeout: 15_000 });

    const textEl = page.locator("#drop span[id]").filter({ hasText: /\S/ }).first();

    await body.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type("Hello world");
    await page.keyboard.press("ControlOrMeta+a");
    await page.locator('.tox-tbtn[aria-label="Bold"]').click();
    await expect(textEl).toContainText("Hello world");
    await expect(textEl.locator("strong, b")).toHaveCount(1);

    await page.locator('.tox-tbtn[aria-label="Right to left"]').click();
    await expect(page.locator('.tox-tbtn[aria-label="Right to left"]')).toHaveClass(/tox-tbtn--enabled/);
    await expect(textEl).toHaveAttribute("dir", "rtl");

    await page.locator('.tox-tbtn[aria-label="Uppercase"]').click();
    await expect(textEl).toHaveCSS("text-transform", "uppercase");

    await body.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.locator('.tox-tbtn[aria-label^="Insert/edit link"]').click();
    await page.locator('.tox-dialog input[type="url"], .tox-dialog input.tox-textfield').first().fill("https://example.com");
    await page.locator('.tox-dialog button:has-text("Save")').click();
    await expect(textEl.locator('a[href="https://example.com"]')).toHaveCount(1);
  });
});

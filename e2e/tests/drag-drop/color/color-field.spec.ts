import { expect, test, type Locator, type Page } from "@playwright/test";
import { dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { openPropertiesFor } from "../../../helpers/properties-modal";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Bug report: the color pickers offered no usable hex entry. They were native
// <input type="color"> elements, so the only hex box was the one the OS draws
// inside its own picker - pasting a bare "971414" there (the form most tools
// copy) was rejected and the color silently fell back to black.
//
// They are now in-page color fields: a text input that takes a hex code or a
// CSS color name, plus a swatch button opening an in-page picker.

/** The text input of the color field that replaced the given color input. */
function colorText(page: Page, nativeId: string): Locator {
  return page.locator(`#${nativeId}`).locator("..").locator(".cf-text");
}

function swatchButton(page: Page, nativeId: string): Locator {
  return page.locator(`#${nativeId}`).locator("..").locator(".cf-swatch-btn");
}

const PASTE_KEY = process.platform === "darwin" ? "Meta+V" : "Control+V";

// A real keyboard paste, not fill() - only the genuine clipboard shortcut
// produces the trusted paste event the color field normalizes.
async function pasteInto(page: Page, field: Locator, text: string) {
  await field.click();
  await field.evaluate((el) => {
    (el as HTMLInputElement).value = "";
    (el as HTMLInputElement).select();
  });
  await page.evaluate((t) => navigator.clipboard.writeText(t), text);
  await page.keyboard.press(PASTE_KEY);
}

async function openTextPropsFor(page: Page, target: Locator) {
  await openPropertiesFor(page, target);
  await page.locator("#v-text-side").click();
  await colorText(page, "text-foreground-color").waitFor({ state: "visible", timeout: 10_000 });
}

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test.describe("color field", () => {
  test("pasting a hex without '#' applies the color instead of falling back to black", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    const textSpan = page.locator("#drop span[category='textField']").first();
    await openTextPropsFor(page, textSpan);

    const field = colorText(page, "text-foreground-color");
    await pasteInto(page, field, "971414");

    await expect(field).toHaveValue("#971414");
    await expect(textSpan).toHaveCSS("color", "rgb(151, 20, 20)");
  });

  test("typing a CSS color name resolves to its hex and applies it", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    const textSpan = page.locator("#drop span[category='textField']").first();
    await openTextPropsFor(page, textSpan);

    const field = colorText(page, "text-foreground-color");
    await field.click();
    await field.fill("");
    await field.pressSequentially("Blue");
    await field.press("Enter");

    await expect(field).toHaveValue("#0000FF");
    await expect(textSpan).toHaveCSS("color", "rgb(0, 0, 255)");
  });

  test("a half-typed hex is not hijacked at three digits", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    await openTextPropsFor(page, page.locator("#drop span[category='textField']").first());

    const field = colorText(page, "text-foreground-color");
    await field.click();
    await field.fill("");
    await field.pressSequentially("971");
    // "#971" is a valid 3-digit hex, but the entry is still being typed.
    await expect(field).toHaveValue("971");
    await field.pressSequentially("414");
    await expect(field).toHaveValue("971414");
  });

  test("the swatch button opens an in-page picker whose presets apply", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    const textSpan = page.locator("#drop span[category='textField']").first();
    await openTextPropsFor(page, textSpan);

    await swatchButton(page, "text-foreground-color").click();
    const popup = page.locator(".cf-pop");
    await expect(popup).toBeVisible();

    const red = popup.locator('.cf-preset[title="#FF0000"]');
    await red.click();

    await expect(colorText(page, "text-foreground-color")).toHaveValue("#FF0000");
    await expect(textSpan).toHaveCSS("color", "rgb(255, 0, 0)");
  });

  test("an already-set color is shown when the properties are reopened", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    const textSpan = page.locator("#drop span[category='textField']").first();
    await openTextPropsFor(page, textSpan);

    const field = colorText(page, "text-foreground-color");
    await pasteInto(page, field, "#1a73e8");
    await expect(textSpan).toHaveCSS("color", "rgb(26, 115, 232)");

    await page.locator('#propertiesModel button.close, #propertiesModel [data-dismiss="modal"]').first().click();
    await page.locator("#propertiesModel").waitFor({ state: "hidden", timeout: 10_000 });

    await openTextPropsFor(page, textSpan);
    await expect(colorText(page, "text-foreground-color")).toHaveValue("#1A73E8");
  });
});

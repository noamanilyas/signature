import { expect, test } from "@playwright/test";
import { expectRedContainer } from "../../../helpers/assertions";
import { canvasItems } from "../../../helpers/build-signature";
import { dropOnSide, dropPanelItemInCanvas } from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

// Bug report: setting a border on a text item that lives inside a
// horizontal (group2) or vertical (group3) group ends up painting the
// border on the parent group container instead of (or in addition to) the
// text item itself.
test("repro: border set on a text item inside a horizontal group must not land on the group container", async ({
  page,
}, testInfo) => {
  await openEditor(page);
  await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);
  await dropOnSide(page, canvasItems(page).first(), "west");
  await expectRedContainer(page);

  const group = page.locator(".data2").first();
  const textSpan = group.locator("span[category='textField']").first();
  await expect(textSpan).toHaveCount(1);

  const groupBorderBefore = await group.evaluate((el) => ({
    style: (el as HTMLElement).getAttribute("style"),
    borderColor: (el as HTMLElement).getAttribute("border-color"),
  }));

  // Click directly on the text content to open its own Text Properties.
  await textSpan.click();
  await page.locator("#propertiesModel").waitFor({ state: "visible", timeout: 10_000 });

  await page.screenshot({ path: testInfo.outputPath("0-modal-opened.png"), fullPage: true });
  const modalTitle = await page.locator("#propertiesModelLabel").innerText();
  console.log("modal title after clicking text span in group2:", modalTitle);

  await page.locator("#v-border-side").click();
  await page.locator("#border-size-all").waitFor({ state: "visible", timeout: 10_000 });
  await page.locator("#border-size-all").fill("7");
  await page.locator("#border-size-all").dispatchEvent("change");
  await page.locator("#border-type-all").selectOption("dashed");
  await page.locator("#border-color-all").evaluate((el) => {
    (el as HTMLInputElement).value = "#ff00ff";
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await page.waitForTimeout(500);

  await page.screenshot({ path: testInfo.outputPath("1-border-applied.png"), fullPage: true });

  const spanBorder = await textSpan.evaluate((el) => ({
    borderWidth: (el as HTMLElement).getAttribute("border-width"),
    borderStyle: (el as HTMLElement).getAttribute("border-style"),
    borderColor: (el as HTMLElement).getAttribute("border-color"),
  }));
  const groupBorderAfter = await group.evaluate((el) => ({
    borderWidth: (el as HTMLElement).getAttribute("border-width"),
    borderStyle: (el as HTMLElement).getAttribute("border-style"),
    borderColor: (el as HTMLElement).getAttribute("border-color"),
  }));

  console.log("group border before:", groupBorderBefore);
  console.log("span border after:", spanBorder);
  console.log("group border after:", groupBorderAfter);

  // The border must land on the text span itself...
  expect(spanBorder.borderWidth).toBe("7px");
  expect(spanBorder.borderStyle).toBe("dashed");

  // ...and must NOT have been redirected onto the parent group container.
  expect(groupBorderAfter.borderWidth).not.toBe("7px");
  expect(groupBorderAfter.borderStyle).not.toBe("dashed");

  await page.locator('#propertiesModel button.close, #propertiesModel [data-dismiss="modal"]').first().click();
  await page.locator("#propertiesModel").waitFor({ state: "hidden", timeout: 10_000 });
  await page.waitForTimeout(500);

  await page.screenshot({ path: testInfo.outputPath("2-canvas-after-close.png"), fullPage: true });

  const previewTable = page.locator(".panelPreview table.mainTable").first();
  await previewTable.waitFor({ state: "attached", timeout: 15_000 });
  const previewHTML = await previewTable.evaluate((el) => el.outerHTML);
  console.log("PREVIEW HTML:\n", previewHTML);

  // The generated preview wraps the bordered text in its own small <table>
  // purely for email-client layout. Border and padding both land on the
  // <td> that tightly hugs the text - they have to share one box or the
  // box model breaks (padding outside the border, or a border inflated by
  // the span's padding). That wrapper <table> tag itself must stay
  // borderless.
  const borderedTd = page.locator(".panelPreview td[style*='border-width: 7px']").first();
  await expect(borderedTd).toHaveCount(1);
  const wrapperTable = borderedTd.locator("xpath=ancestor::table[1]");
  const wrapperTableStyle = await wrapperTable.evaluate((el) => (el as HTMLElement).getAttribute("style"));
  console.log("wrapper <table> style:", wrapperTableStyle);
  expect(wrapperTableStyle ?? "").not.toContain("border-width: 7px");
  expect(wrapperTableStyle ?? "").not.toContain("dashed");
});

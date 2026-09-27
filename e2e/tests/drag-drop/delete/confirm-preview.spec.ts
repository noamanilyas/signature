import { expect, test } from "@playwright/test";
import { expectRedContainer } from "../../../helpers/assertions";
import { canvasItems, rootCanvasItems, tableCells } from "../../../helpers/build-signature";
import {
  confirmDelete,
  dragToTarget,
  dropIntoTableCell,
  dropOnSide,
  dropPanelItemInCanvas,
} from "../../../helpers/drag-drop";
import { openEditor } from "../../../helpers/editor";
import { MAIN_DROP_ZONE_SELECTOR } from "../../../helpers/constants";

test.describe("delete confirmation preview", () => {
  test("dragging an item to the trash bar previews it and does not delete until confirmed", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    await dragToTarget(page, canvasItems(page).first(), page.locator(".delDrop"));

    const confirmModal = page.locator("#deleteConfirmModel");
    await confirmModal.waitFor({ state: "visible" });
    await expect(confirmModal).toContainText("Are you sure you want to delete?");
    await expect(page.locator("#deleteConfirmPreview .drag.vertical")).toContainText("Your text here!");

    // Item must still be on the canvas while the confirmation is up.
    await expect(canvasItems(page)).toHaveCount(1);

    await page.locator("#deleteConfirmCancel").click();
    await confirmModal.waitFor({ state: "hidden" });

    await expect(canvasItems(page)).toHaveCount(1);
  });

  test("confirming the dialog deletes the previewed item", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    await dragToTarget(page, canvasItems(page).first(), page.locator(".delDrop"));
    await confirmDelete(page);

    await expect(canvasItems(page)).toHaveCount(0);
  });

  test("deleting a table previews its cell content, and Cancel keeps it intact", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR, "table");

    const cell = tableCells(page).first();
    await dropIntoTableCell(page, cell, "textarea");

    // Grab the table by its own west edge strip, not its bounding-box
    // center, which would land on the nested cell item instead (its
    // bounding box sits on top of the table's).
    const tableHandle = rootCanvasItems(page).first().locator(".west").first();
    await dragToTarget(page, tableHandle, page.locator(".delDrop"));

    const confirmModal = page.locator("#deleteConfirmModel");
    await confirmModal.waitFor({ state: "visible" });
    await expect(page.locator("#deleteConfirmPreview table.editor-table")).toHaveCount(1);
    await expect(page.locator("#deleteConfirmPreview")).toContainText("Your text here!");

    await page.locator("#deleteConfirmCancel").click();
    await confirmModal.waitFor({ state: "hidden" });
    await expect(rootCanvasItems(page)).toHaveCount(1);
    await expect(cell.locator(".drag.vertical")).toHaveCount(1);
  });

  test("deleting a group previews only that group's own children, not sibling items", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR); // A
    // Add sibling B while A is still a plain leaf, then convert A into a
    // data2 group. Doing it in this order keeps each zone lookup
    // unambiguous - once A is a group, a naive "find .south" on the whole
    // group can resolve to a nested child's own south strip instead of the
    // group's own, since children carry full west/north/south/east chrome
    // too and sort earlier in document order.
    await dropOnSide(page, canvasItems(page).first(), "south"); // A, B siblings
    await dropOnSide(page, rootCanvasItems(page).first(), "west"); // A -> group2 with 2 children
    await expectRedContainer(page);

    await expect(rootCanvasItems(page)).toHaveCount(2);
    await expect(page.locator(".data2 > .drag.vertical")).toHaveCount(2);
    await expect(canvasItems(page)).toHaveCount(4); // group2 wrapper + 2 children + sibling

    const group2 = page.locator(".drag.vertical.group2").first();
    const groupHandle = group2.locator(".west").first();
    await dragToTarget(page, groupHandle, page.locator(".delDrop"));

    const confirmModal = page.locator("#deleteConfirmModel");
    await confirmModal.waitFor({ state: "visible" });

    // Only the group's own subtree (itself + its 2 children) should be
    // previewed - the sibling item outside the group must not leak in.
    await expect(page.locator("#deleteConfirmPreview .drag.vertical")).toHaveCount(3);
    await expect(page.locator("#deleteConfirmPreview .data2 > .drag.vertical")).toHaveCount(2);

    await confirmDelete(page);
    await expect(rootCanvasItems(page)).toHaveCount(1);
  });

  test("Properties modal Delete button also asks for confirmation before deleting", async ({ page }) => {
    await openEditor(page);
    await dropPanelItemInCanvas(page, MAIN_DROP_ZONE_SELECTOR);

    await canvasItems(page).first().locator(".data").first().click();
    await page.locator("#propertiesModel").waitFor({ state: "visible" });
    await page.locator("#propertiesModelDelete").click();
    await page.locator("#propertiesModel").waitFor({ state: "hidden" });

    const confirmModal = page.locator("#deleteConfirmModel");
    await confirmModal.waitFor({ state: "visible" });
    await expect(page.locator("#deleteConfirmPreview .drag.vertical")).toContainText("Your text here!");
    await expect(canvasItems(page)).toHaveCount(1);

    await confirmDelete(page);
    await expect(canvasItems(page)).toHaveCount(0);
  });
});

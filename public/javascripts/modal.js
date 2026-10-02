// The draggable wrapper (".drag.vertical") for whichever item the
// Properties popup is currently showing, set by renderModel() so the
// popup's Delete button knows what to remove.
var currentPropsItem = null;

var a = {
  textField: ["text", "background", "visibility", "alignment", "border", "padding", "size"],
  // table: ["tableProps", "text", "background", "visibility", "alignment", "border", "padding", "size"],
  table: ["tableProps", "background", "alignment", "border", "padding", "size"],
  // Cells are a fixed slot in the table's grid, so alignment (which moves an
  // item within free space) doesn't apply here the way it does for the table
  // itself - omitted on purpose, unlike every other category. tableProps
  // (row/col controls) lives on the table's own modal now, not the cell's.
  cell: ["background", "border", "padding", "size"],
  group: ["background", "visibility", "alignment", "border", "padding", "size"],
  // group: ["text", "background", "visibility", "alignment", "border", "padding", "socialMediaIcon"],
  socialIcon: [
    "hyperlink",
    "visibility",
    "alignment",
    "border",
    "padding",
    "size",
    "render",
    "orientation",
    "socialMediaIcon",
  ],
  legalCompliance: ["hyperlink", "text", "background", "visibility", "alignment", "border", "padding", "size"],
  image: ["imageSource", "hyperlink", "background", "visibility", "alignment", "border", "padding", "size"],
  banner: ["imageSource", "hyperlink", "background", "visibility", "alignment", "border", "padding", "size"],
  userPhoto: ["hyperlink", "text", "background", "visibility", "alignment", "border", "padding", "size"],
  icons: ["labelIcon", "hyperlink", "visibility", "alignment", "border", "padding"],
};

// Friendly modal-title text per category. "group" is resolved to either the
// horizontal (group2/data2) or vertical (group3/data3) variant below since
// both share the generic "group" category attribute.
var categoryTitles = {
  textField: "Text Properties",
  table: "Table Properties",
  cell: "Cell Properties",
  socialIcon: "Social Icon Properties",
  legalCompliance: "Legal Compliance Properties",
  image: "Image Properties",
  banner: "Banner Properties",
  userPhoto: "User Photo Properties",
  icons: "Icon Properties",
};

function renderModel(e) {
  console.log("e.target", e.target);
  let category = e.target.getAttribute("category");
  let id = e.target.getAttribute("id");
  // Set alongside category whenever the target resolves to a group, so the
  // modal title can say "Horizontal Group" (group2/data2) vs "Vertical
  // Group" (group3/data3) instead of just "Group".
  let groupOrientation = null;

  if ($(e.target).hasClass("editor-td")) {
    let cell = $(e.target).children().children().eq(0);
    id = cell.attr("id");
    category = cell.attr("category");
  } else if ($(e.target).hasClass("drag vertical")) {
    // Get parent if data2 or data3
    let existingItemParent = $(e.target).closest("div.drag.vertical").parent();
    if (existingItemParent.hasClass("data2")) {
      category = existingItemParent.attr("category");
      id = existingItemParent.attr("id");
      groupOrientation = "Horizontal";
    } else if (existingItemParent.hasClass("data3")) {
      category = existingItemParent.attr("category");
      id = existingItemParent.attr("id");
      groupOrientation = "Vertical";
    }
  } else if ($(e.target).hasClass("we") || $(e.target).hasClass("ns")) {
    // get parent drag
    let existingItemParent = $(e.target).closest("div.drag.vertical").parent();
    if (existingItemParent.hasClass("data2")) {
      // const group2 = existingItemParent.closest("div.drag.vertical");
      console.log("Group2", existingItemParent);
      category = existingItemParent.attr("category");
      id = existingItemParent.attr("id");
      groupOrientation = "Horizontal";
    } else if (existingItemParent.hasClass("data3")) {
      category = existingItemParent.attr("category");
      id = existingItemParent.attr("id");
      groupOrientation = "Vertical";
      console.log("Group3", existingItemParent);
    }
  }

  if (!category) {
    let closestData = $(e.target).closest(".data");
    let firstChild = closestData.children().eq(0)[0];
    // A table's own wrapper (.dataTable) holds the <table> itself, which
    // carries category="group" so the alignment-group logic below can treat
    // it like group2/group3 - but clicking the table's own border/background
    // (as opposed to one of its cells, which has its own category="cell")
    // should open "Table Properties", not fall through to "Group Properties".
    category = closestData.hasClass("dataTable") ? "table" : firstChild.getAttribute("category");
    id = firstChild.getAttribute("id");
  }

  // The most common way to open group properties is clicking directly on the
  // group's own .data2/.data3 area (addModalClick is bound straight to it in
  // addEventsToContainer2/3), so e.target already carries category="group"
  // and none of the ancestor-lookup branches above ever run. Resolve the
  // orientation from the target itself in that case.
  if (category === "group" && !groupOrientation) {
    let groupEl = $(`#${id}`);
    if (groupEl.hasClass("data2")) {
      groupOrientation = "Horizontal";
    } else if (groupEl.hasClass("data3")) {
      groupOrientation = "Vertical";
    }
  }
  // console.log("category", category);
  if (a[category]) {
    // console.log(e.target);
    // Track the same top-level draggable wrapper that dragging to the
    // "Delete Item" trash zone would grab, so the modal's Delete button can
    // remove it via the existing removeAnyElement() flow (script.js /
    // fieldModel.js) with no change to that logic.
    currentPropsItem = $(`#${id}`).closest("div.drag.vertical");
    $("#propertiesModel").modal("show");

    // Fix: modal always showed the generic static "Properties" heading no
    // matter what was clicked. Show a heading specific to what's open
    // instead (e.g. "Image Properties", "Table Properties", or "Horizontal
    // Group Properties" / "Vertical Group Properties" for group2/group3).
    let modalTitle = category === "group" ? `${groupOrientation || ""} Group Properties`.trim() : categoryTitles[category] || "Properties";
    $("#propertiesModelLabel").text(modalTitle);

    // Remove unwanted tabs
    $("#tabListUL li a").each(function (index, item) {
      let key = item.id.split("-")[1];
      if (a[category].indexOf(key) === -1) {
        $(`#${item.id}`)[0].style.display = "none";
      } else {
        $(`#${item.id}`)[0].style.display = "block";
      }
      // Remove active classes
      $(`#v-${key}-side`).removeClass("active");
      $(`#v-${key}-body`).removeClass("show active");
    });

    // Make first item active
    $(`#v-${a[category][0]}-side`).addClass("active");
    $(`#v-${a[category][0]}-body`).addClass("show active");

    // Render TextJS
    if (category !== "group") renderTextTab(id);
    // Render ImageJS
    renderImageTab(id);
    // Render BackgroundJS
    renderBackgroundTab(id);
    // Render SizeJS
    renderSizeTab(id);
    // "table" always resolves to the <table>'s own id now (clicked directly
    // on its .dataTable wrapper), so it can align the same way group2/group3
    // do. "cell" has no alignment tab at all (see `a.cell` above), so it's
    // skipped entirely rather than wiring up a hidden tab.
    if (category === "table" || category === "group") {
      renderAlignmentTabGroup(id);
    } else if (category !== "cell") {
      renderAlignmentTab(id);
    }
    // Render BorderJS
    renderBorderTab(id);
    // Render PaddingJS
    renderPaddingTab(id);
    // Render TableJS
    renderTableTab(id);
    // Render HyperlinkJS
    renderHyperLinkTab(id);
  }
}

function addModalClick(item) {
  $(item).click(function (e) {
    e.stopPropagation();
    // setTimeout(function () {
    renderModel(e);
    // }, 200);
  });
}

$("#propertiesModelDelete").click(function (e) {
  if (currentPropsItem && currentPropsItem.length) {
    const item = currentPropsItem;
    currentPropsItem = null;
    // Wait for the Properties modal to finish hiding before opening the
    // delete-confirmation modal, so Bootstrap doesn't stack two backdrops.
    $("#propertiesModel").one("hidden.bs.modal", function () {
      confirmDeleteElement(item);
    });
  }
  $("#propertiesModel").modal("hide");
});

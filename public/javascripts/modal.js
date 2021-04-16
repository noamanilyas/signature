var a = {
  textField: ["text", "background", "visibility", "alignment", "border", "padding"],
  // table: ["tableProps", "text", "background", "visibility", "alignment", "border", "padding", "size"],
  table: ["tableProps", "background", "alignment", "border", "padding", "size"],
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
function renderModel(e) {
  console.log("e.target", e.target);
  let category = e.target.getAttribute("category");
  let id = e.target.getAttribute("id");

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
    } else if (existingItemParent.hasClass("data3")) {
      category = existingItemParent.attr("category");
      id = existingItemParent.attr("id");
    }
  } else if ($(e.target).hasClass("we") || $(e.target).hasClass("ns")) {
    // get parent drag
    let existingItemParent = $(e.target).closest("div.drag.vertical").parent();
    if (existingItemParent.hasClass("data2")) {
      // const group2 = existingItemParent.closest("div.drag.vertical");
      console.log("Group2", existingItemParent);
      category = existingItemParent.attr("category");
      id = existingItemParent.attr("id");
    } else if (existingItemParent.hasClass("data3")) {
      category = existingItemParent.attr("category");
      id = existingItemParent.attr("id");
      console.log("Group3", existingItemParent);
    }
  }
  console.log("category", category);
  console.log("a[category]", a[category]);
  console.log(id);
  if (a[category]) {
    // console.log(e.target);
    $("#propertiesModel").modal("show");

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
    renderTextTab(id);
    // Render ImageJS
    renderImageTab(id);
    // Render BackgroundJS
    renderBackgroundTab(id);
    // Render SizeJS
    renderSizeTab(id);
    // Render AlignmentJS
    renderAlignmentTab(id);
    // Render BorderJS
    renderBorderTab(id);
    // Render PaddingJS
    renderPaddingTab(id);
    // Render TableJS
    renderTableTab(id);
  }
}

function addModalClick(item) {
  $(item).click(function (e) {
    e.stopPropagation();
    renderModel(e);
  });
}

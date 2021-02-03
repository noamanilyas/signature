function converToTableFunc() {
  const mainItems = $("#drop > .drag.vertical.ph-table-row");
  $(".mainTable").remove();
  let tbody = $("<tbody>");
  let table = $("<table>");
  table.addClass("mainTable");
  $.each(mainItems, function (index, value) {
    // const item = value;
    // console.log(item);
    if ($(this).hasClass("ph-table-row")) {
      let tr = $("<tr>");
      let td = $("<td>");

      if ($(this).hasClass("dataItem")) {
        let dataItem = $(this).find(".data").children().eq(0).clone();
        let vAlign = $(this).find(".data").css("vertical-align");
        if (vAlign) {
          td.css("vertical-align", vAlign);
        }
        let PaddingTabAll = $(this).find(".data").children().eq(0).attr("padding");
        console.log($(this).find(".data"));
        console.log(PaddingTabAll);
        if (PaddingTabAll) {
          td.css("padding", PaddingTabAll);
        }
        let PaddingTabLeft = $(this).find(".data").children().eq(0).attr("padding-left");
        if (PaddingTabLeft) {
          td.css("padding-left", PaddingTabLeft);
        }
        let PaddingTabRight = $(this).find(".data").children().eq(0).attr("padding-right");
        if (PaddingTabRight) {
          td.css("padding-right", PaddingTabRight);
        }
        let PaddingTabTop = $(this).find(".data").children().eq(0).attr("padding-top");
        if (PaddingTabTop) {
          td.css("padding-top", PaddingTabTop);
        }
        let PaddingTabBottom = $(this).find(".data").children().eq(0).attr("padding-bottom");
        if (PaddingTabBottom) {
          td.css("padding-bottom", PaddingTabBottom);
        }

        td.append(dataItem);
      } else if ($(this).hasClass("group2")) {
        let table = getSubItemsForgroup2($(this));
        td.append(table);
      } else if ($(this).hasClass("group3")) {
        let table = getSubItemsForgroup3($(this));
        td.append(table);
      }
      tr.append(td);
      tbody.append(tr);
    }
  });
  table.append(tbody);
  $(".panelPreview").append(table);
  console.log(table);
}

function getSubItemsForgroup2(item) {
  let group = $(item).find(".data2:first").children();
  let tbody = $("<tbody>");
  let table = $("<table>");
  let tr = $("<tr>");
  console.log(group);
  $.each(group, function (index, value) {
    let td = $("<td>");
    console.log($(this));
    if ($(this).hasClass("dataItem")) {
      let dataItem = $(this).find(".data").children().eq(0).clone();
      let vAlign = $(this).find(".data").css("vertical-align");
      if (vAlign) {
        td.css("vertical-align", vAlign);
      }
      let PaddingTabAll = $(this).find(".data").children().eq(0).attr("padding");
      console.log($(this).find(".data"));
      console.log(PaddingTabAll);
      if (PaddingTabAll) {
        td.css("padding", PaddingTabAll);
      }
      let PaddingTabLeft = $(this).find(".data").children().eq(0).attr("padding-left");
      if (PaddingTabLeft) {
        td.css("padding-left", PaddingTabLeft);
      }
      let PaddingTabRight = $(this).find(".data").children().eq(0).attr("padding-right");
      if (PaddingTabRight) {
        td.css("padding-right", PaddingTabRight);
      }
      let PaddingTabTop = $(this).find(".data").children().eq(0).attr("padding-top");
      if (PaddingTabTop) {
        td.css("padding-top", PaddingTabTop);
      }
      let PaddingTabBottom = $(this).find(".data").children().eq(0).attr("padding-bottom");
      if (PaddingTabBottom) {
        td.css("padding-bottom", PaddingTabBottom);
      }
      td.append(dataItem);
    } else if ($(this).hasClass("group2")) {
      let table = getSubItemsForgroup2($(this));
      td.append(table);
    } else if ($(this).hasClass("group3")) {
      let table = getSubItemsForgroup3($(this));
      td.append(table);
    }
    tr.append(td);
  });
  tbody.append(tr);
  table.append(tbody);
  return table;
}

function getSubItemsForgroup3(item) {
  let group = $(item).find(".data3:first").children();
  let tbody = $("<tbody>");
  let table = $("<table>");
  console.log(group);
  $.each(group, function (index, value) {
    let tr = $("<tr>");
    let td = $("<td>");
    console.log($(this));
    if ($(this).hasClass("dataItem")) {
      let dataItem = $(this).find(".data").children().eq(0).clone();
      let vAlign = $(this).find(".data").css("vertical-align");
      if (vAlign) {
        td.css("vertical-align", vAlign);
      }
      let PaddingTabAll = $(this).find(".data").children().eq(0).attr("padding");
      console.log($(this).find(".data"));
      console.log(PaddingTabAll);
      if (PaddingTabAll) {
        td.css("padding", PaddingTabAll);
      }
      let PaddingTabLeft = $(this).find(".data").children().eq(0).attr("padding-left");
      if (PaddingTabLeft) {
        td.css("padding-left", PaddingTabLeft);
      }
      let PaddingTabRight = $(this).find(".data").children().eq(0).attr("padding-right");
      if (PaddingTabRight) {
        td.css("padding-right", PaddingTabRight);
      }
      let PaddingTabTop = $(this).find(".data").children().eq(0).attr("padding-top");
      if (PaddingTabTop) {
        td.css("padding-top", PaddingTabTop);
      }
      let PaddingTabBottom = $(this).find(".data").children().eq(0).attr("padding-bottom");
      if (PaddingTabBottom) {
        td.css("padding-bottom", PaddingTabBottom);
      }
      td.append(dataItem);
    } else if ($(this).hasClass("group2")) {
      let table = getSubItemsForgroup2($(this));
      td.append(table);
    } else if ($(this).hasClass("group3")) {
      let table = getSubItemsForgroup3($(this));
      td.append(table);
    }
    tr.append(td);
    tbody.append(tr);
  });
  table.append(tbody);
  return table;
}

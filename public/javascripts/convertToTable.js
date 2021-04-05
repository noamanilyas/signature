function converToTableFunc() {
  const mainItems = $("#drop > .drag.vertical.ph-table-row");
  $(".mainTable").remove();
  let tbody = $("<tbody>");
  let table = $("<table>");
  table.addClass("mainTable");
  $.each(mainItems, async function (index, value) {
    // const item = value;
    if ($(this).hasClass("ph-table-row")) {
      let tr = $("<tr>");
      let td = $("<td>");

      if ($(this).hasClass("tableItem")) {
        let table = await getSubItemsForTableItem($(this));
        console.log("Returned table", table);
        td.append(table);
      } else if ($(this).hasClass("dataItem")) {
        let dataItem = $(this).find(".data").children().eq(0).clone();
        let vAlign = $(this).find(".data").css("vertical-align");
        if (vAlign) {
          td.css("vertical-align", vAlign);
        }
        let PaddingTabAll = $(this).find(".data").children().eq(0).attr("padding");

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
    if (mainItems.length - 1 === index) {
      console.log("previewDone");
      table.append(tbody);
      $(".panelPreview").append(table);
    }
  });
}

function getSubItemsForTableItem(item) {
  return new Promise((resolve, reject) => {
    let tbl = $(item).find(".data:first").children();
    let tbody = $("<tbody>");
    let table = $("<table>");
    let tblTR = tbl.children().children();
    console.log("tblTR", tblTR);
    $.each(tblTR, function (index, value) {
      let tr = $("<tr>");

      let tbTD = tblTR.eq(index).children();
      console.log("tbTD", tbTD);
      $.each(tbTD, function (index, value) {
        let td = $("<td>");

        const cssItem = $(this).children().children();
        //CSS for td
        let vAlign = cssItem.find(".data").css("vertical-align");
        if (vAlign) {
          td.css("vertical-align", vAlign);
        }
        let PaddingTabAll = cssItem.attr("padding");

        if (PaddingTabAll) {
          td.css("padding", PaddingTabAll);
        }
        let PaddingTabLeft = cssItem.attr("padding-left");
        if (PaddingTabLeft) {
          td.css("padding-left", PaddingTabLeft);
        }
        let PaddingTabRight = cssItem.attr("padding-right");
        if (PaddingTabRight) {
          td.css("padding-right", PaddingTabRight);
        }
        let PaddingTabTop = cssItem.attr("padding-top");
        if (PaddingTabTop) {
          td.css("padding-top", PaddingTabTop);
        }
        let PaddingTabBottom = cssItem.attr("padding-bottom");
        if (PaddingTabBottom) {
          td.css("padding-bottom", PaddingTabBottom);
        }

        const actualItem = $(this).children().children().children();

        if (actualItem.hasClass("tableItem")) {
          let table = getSubItemsForTableItem(actualItem);
          td.append(table);
        } else if (actualItem.hasClass("dataItem")) {
          let dataItem = actualItem.find(".data").children().eq(0).clone();
          console.log("dataItem", dataItem);
          let vAlign = actualItem.find(".data").css("vertical-align");
          if (vAlign) {
            td.css("vertical-align", vAlign);
          }
          let PaddingTabAll = actualItem.find(".data").children().eq(0).attr("padding");

          if (PaddingTabAll) {
            td.css("padding", PaddingTabAll);
          }
          let PaddingTabLeft = actualItem.find(".data").children().eq(0).attr("padding-left");
          if (PaddingTabLeft) {
            td.css("padding-left", PaddingTabLeft);
          }
          let PaddingTabRight = actualItem.find(".data").children().eq(0).attr("padding-right");
          if (PaddingTabRight) {
            td.css("padding-right", PaddingTabRight);
          }
          let PaddingTabTop = actualItem.find(".data").children().eq(0).attr("padding-top");
          if (PaddingTabTop) {
            td.css("padding-top", PaddingTabTop);
          }
          let PaddingTabBottom = actualItem.find(".data").children().eq(0).attr("padding-bottom");
          if (PaddingTabBottom) {
            td.css("padding-bottom", PaddingTabBottom);
          }
          td.append(dataItem);
        } else if (actualItem.hasClass("group2")) {
          let table = getSubItemsForgroup2(actualItem);
          td.append(table);
        } else if (actualItem.hasClass("group3")) {
          let table = getSubItemsForgroup3(actualItem);
          td.append(table);
        }
        tr.append(td);
      });
      tbody.append(tr);
      if (index === tblTR.length - 1) {
        table.append(tbody);
        console.log("Returned table func", table);
        resolve(table);
        // return "table";
      }
    });
  });
}

function getSubItemsForgroup2(item) {
  let group = $(item).find(".data2:first").children();
  let tbody = $("<tbody>");
  let table = $("<table>");
  let tr = $("<tr>");
  $.each(group, function (index, value) {
    let td = $("<td>");
    if ($(this).hasClass("dataItem")) {
      let dataItem = $(this).find(".data").children().eq(0).clone();
      let vAlign = $(this).find(".data").css("vertical-align");
      if (vAlign) {
        td.css("vertical-align", vAlign);
      }
      let PaddingTabAll = $(this).find(".data").children().eq(0).attr("padding");

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
  $.each(group, function (index, value) {
    let tr = $("<tr>");
    let td = $("<td>");
    if ($(this).hasClass("dataItem")) {
      let dataItem = $(this).find(".data").children().eq(0).clone();
      let vAlign = $(this).find(".data").css("vertical-align");
      if (vAlign) {
        td.css("vertical-align", vAlign);
      }
      let PaddingTabAll = $(this).find(".data").children().eq(0).attr("padding");

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

function converToTableFunc() {
  const mainItems = $("#drop > .drag.vertical");
  $(".mainTable").remove();
  let tbody = $("<tbody>");
  let table = $("<table>");
  table.addClass("mainTable");
  $.each(mainItems, async function (index, value) {
    // const item = value;
    if ($(this).hasClass("ph-table-row") || $(this).hasClass("ph-table-cell")) {
      let tr = $("<tr>");
      let td = $("<td>");
      if ($(this).hasClass("tableItem")) {
        let table = await getSubItemsForTableItem($(this));
        // console.log("Returned table", table);
        td.append(table);
      } else if ($(this).hasClass("dataItem")) {
        let dataItem = $(this).find(".data").children().eq(0).clone();
        applyCSS(td, $(this).find(".data").children().eq(0), ["align"]);
        td.append(dataItem);
      } else if ($(this).hasClass("group2")) {
        let table = getSubItemsForgroup2($(this));
        applyCSS(td, $(this).find(".data2:first"), ["align"]);
        td.append(table);
      } else if ($(this).hasClass("group3")) {
        let table = getSubItemsForgroup3($(this));
        applyCSS(td, $(this).find(".data3:first"), ["align"]);
        td.append(table);
      }
      tr.append(td);
      tbody.append(tr);
    }
    if (mainItems.length - 1 === index) {
      // console.log("previewDone");
      table.append(tbody);
      $(".panelPreview2").append(table);
    }
  });
}

function getSubItemsForTableItem(item) {
  return new Promise((resolve, reject) => {
    let tbl = $(item).find(".data:first").children();
    let tbody = $("<tbody>");
    let table = $("<table>");
    let tblTR = tbl.children().children();
    // console.log("tblTR", tblTR);
    $.each(tblTR, function (index, value) {
      let tr = $("<tr>");

      let tbTD = tblTR.eq(index).children();
      // console.log("tbTD", tbTD);
      $.each(tbTD, function (index, value) {
        let td = $("<td>");

        const cssItem = $(this).children().children();

        applyCSS(td, cssItem);
        //CSS for td
        // let vAlign = cssItem.find(".data").css("vertical-align");
        // if (vAlign) {
        //   td.css("vertical-align", vAlign);
        // }
        // let PaddingTabAll = cssItem.attr("padding");

        // if (PaddingTabAll) {
        //   td.css("padding", PaddingTabAll);
        // }
        // let PaddingTabLeft = cssItem.attr("padding-left");
        // if (PaddingTabLeft) {
        //   td.css("padding-left", PaddingTabLeft);
        // }
        // let PaddingTabRight = cssItem.attr("padding-right");
        // if (PaddingTabRight) {
        //   td.css("padding-right", PaddingTabRight);
        // }
        // let PaddingTabTop = cssItem.attr("padding-top");
        // if (PaddingTabTop) {
        //   td.css("padding-top", PaddingTabTop);
        // }
        // let PaddingTabBottom = cssItem.attr("padding-bottom");
        // if (PaddingTabBottom) {
        //   td.css("padding-bottom", PaddingTabBottom);
        // }

        const actualItem = $(this).children().children().children();

        if (actualItem.hasClass("tableItem")) {
          let table = getSubItemsForTableItem(actualItem);
          td.append(table);
        } else if (actualItem.hasClass("dataItem")) {
          let dataItem = actualItem.find(".data").children().eq(0).clone();
          // console.log("dataItem", dataItem);
          applyCSS(td, actualItem.find(".data").children().eq(0), ["align"]);

          // let vAlign = actualItem.find(".data").css("vertical-align");
          // if (vAlign) {
          //   td.css("vertical-align", vAlign);
          // }
          // let PaddingTabAll = actualItem.find(".data").children().eq(0).attr("padding");

          // if (PaddingTabAll) {
          //   td.css("padding", PaddingTabAll);
          // }
          // let PaddingTabLeft = actualItem.find(".data").children().eq(0).attr("padding-left");
          // if (PaddingTabLeft) {
          //   td.css("padding-left", PaddingTabLeft);
          // }
          // let PaddingTabRight = actualItem.find(".data").children().eq(0).attr("padding-right");
          // if (PaddingTabRight) {
          //   td.css("padding-right", PaddingTabRight);
          // }
          // let PaddingTabTop = actualItem.find(".data").children().eq(0).attr("padding-top");
          // if (PaddingTabTop) {
          //   td.css("padding-top", PaddingTabTop);
          // }
          // let PaddingTabBottom = actualItem.find(".data").children().eq(0).attr("padding-bottom");
          // if (PaddingTabBottom) {
          //   td.css("padding-bottom", PaddingTabBottom);
          // }
          td.append(dataItem);
        } else if (actualItem.hasClass("group2")) {
          let table = getSubItemsForgroup2(actualItem);
          applyCSS(td, actualItem.find(".data2:first"), ["align"]);
          td.append(table);
        } else if (actualItem.hasClass("group3")) {
          let table = getSubItemsForgroup3(actualItem);
          applyCSS(td, actualItem.find(".data3:first"), ["align"]);
          td.append(table);
        }
        tr.append(td);
      });
      tbody.append(tr);
      if (index === tblTR.length - 1) {
        table.append(tbody);
        // console.log("Returned table func", table);
        resolve(table);
        // return "table";
      }
    });
  });
}

function getSubItemsForgroup2(item) {
  let group = $(item).find(".data2:first").children();

  // Create table with single TR and TD for the group.
  let tbody1 = $("<tbody>");
  let table1 = $("<table>");
  let tr1 = $("<tr>");
  let td1 = $("<td>");
  applyCSS(td1, $(item).find(".data2:first"), ["border", "padding"]);

  tr1.append(td1);
  tbody1.append(tr1);
  table1.append(tbody1);

  let tbody = $("<tbody>");
  let table = $("<table>");

  let tr = $("<tr>");
  $.each(group, function (index, value) {
    let td = $("<td>");
    if ($(this).hasClass("dataItem")) {
      let dataItem = $(this).find(".data").children().eq(0).clone();
      applyCSS(td, $(this).find(".data").children(), ["align"]);
      td.append(dataItem);
    } else if ($(this).hasClass("group2")) {
      let table = getSubItemsForgroup2($(this));
      applyCSS(td, $(this).find(".data2:first"), ["align"]);
      td.append(table);
    } else if ($(this).hasClass("group3")) {
      let table = getSubItemsForgroup3($(this));
      applyCSS(td, $(this).find(".data3:first"), ["align"]);
      td.append(table);
    }
    tr.append(td);
  });
  tbody.append(tr);
  table.append(tbody);
  td1.append(table);
  return table1;
}

function getSubItemsForgroup3(item) {
  let group = $(item).find(".data3:first").children();

  // Create table with single TR and TD for the group.
  let tbody1 = $("<tbody>");
  let table1 = $("<table>");
  let tr1 = $("<tr>");
  let td1 = $("<td>");
  applyCSS(td1, $(item).find(".data3:first"), ["border", "padding"]);

  tr1.append(td1);
  tbody1.append(tr1);
  table1.append(tbody1);

  let tbody = $("<tbody>");
  let table = $("<table>");

  $.each(group, function (index, value) {
    let tr = $("<tr>");
    let td = $("<td>");
    if ($(this).hasClass("dataItem")) {
      let dataItem = $(this).find(".data").children().eq(0).clone();
      applyCSS(td, $(this).find(".data").children(), ["align"]);
      td.append(dataItem);
    } else if ($(this).hasClass("group2")) {
      let table = getSubItemsForgroup2($(this));
      applyCSS(td, $(this).find(".data2:first"), ["align"]);
      td.append(table);
    } else if ($(this).hasClass("group3")) {
      let table = getSubItemsForgroup3($(this));
      applyCSS(td, $(this).find(".data3:first"), ["align"]);
      td.append(table);
    }
    tr.append(td);
    tbody.append(tr);
  });
  table.append(tbody);
  td1.append(table);
  return table1;
}

function applyCSS(applyTo, applyFrom, type = ["border", "align", "padding"]) {
  //Test
  const elemAttributes = getAttributes(applyFrom);
  console.log("elemAttributes", elemAttributes);
  console.log("type", type);

  for (const attrib of Object.keys(elemAttributes)) {
    if (attrib.indexOf("border") !== -1 && type.indexOf("border") !== -1) {
      applyTo.css(attrib, elemAttributes[attrib]);
    } else if (attrib.indexOf("align") !== -1 && type.indexOf("align") !== -1) {
      applyTo.css(attrib, elemAttributes[attrib]);
    } else if (attrib.indexOf("padding") !== -1 && type.indexOf("padding") !== -1) {
      applyTo.css(attrib, elemAttributes[attrib]);
    } else if (attrib.indexOf("background") !== -1) {
      applyTo.css(attrib, elemAttributes[attrib]);
    }
  }
}

function getAttributes($node) {
  var attrs = {};
  $.each($node[0].attributes, function (index, attribute) {
    attrs[attribute.name] = attribute.value;
  });

  return attrs;
}

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
        console.log("Table found");
        let table = await getSubItemsForTableItem($(this));
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
      // table.appendTo(".panelPreview2", ".panelPreview");
      $(".panelPreview").append(table.clone());
      $(".panelPreview2").append(table.clone());
    }
  });
}

function getSubItemsForTableItem(item) {
  console.log("Called getSubItemsForTableItem");
  return new Promise(async (resolve, reject) => {
    let tbl = $(item).find(".data:first").children();
    let tbody = $("<tbody>");
    let table = $("<table>");
    let tblTR = tbl.children().children();
    // console.log("tblTR", tblTR);
    // $.each(tblTR, async function (index, value) {
    for (let index = 0; index < tblTR.length; index++) {
      let tr = $("<tr>");

      let tbTD = tblTR.eq(index).children();
      // console.log("tbTD", tbTD);
      for (let tdIndex = 0; tdIndex < tbTD.length; tdIndex++) {
        // $.each(tbTD, async function () {
        let td = $("<td>");

        const thisItem = tbTD.eq(tdIndex);

        const cssItem = thisItem.children().children();
        // console.log("cssItem", cssItem);
        // console.log("$(this)", $(this));
        applyCSS(td, cssItem);
        applyCSS(td, thisItem);

        const actualItem = thisItem.children().children().children();
        console.log("actualItem", actualItem);

        if (actualItem.hasClass("tableItem")) {
          console.log("Table found in table", actualItem.attr("id"));
          let table = await getSubItemsForTableItem(actualItem);
          // console.log("table94", table);
          td.append(table);
        } else if (actualItem.hasClass("dataItem")) {
          let dataItem = actualItem.find(".data").children().eq(0).clone();
          // console.log("dataItem", dataItem);
          applyCSS(td, actualItem.find(".data").children().eq(0), ["align"]);

          td.append(dataItem);
        } else if (actualItem.hasClass("group2")) {
          let table = getSubItemsForgroup2(actualItem);
          applyCSS(td, actualItem.find(".data2:first"), ["align"]);
          td.append(table);
        } else if (actualItem.hasClass("group3")) {
          console.log("Group 3 found int table", actualItem);
          let table = getSubItemsForgroup3(actualItem);
          applyCSS(td, actualItem.find(".data3:first"), ["align"]);
          td.append(table);
        }
        tr.append(td);
      }
      // });
      tbody.append(tr);
      if (index === tblTR.length - 1) {
        table.append(tbody);
        console.log("Returned", table);
        resolve(table);
        // return "table";
      }
    }
    // });
  });
}

// function getSubItemsForTableItem(item) {
//   return new Promise(async (resolve, reject) => {
//     let tbl = $(item).find(".data:first").children();
//     let tbody = $("<tbody>");
//     let table = $("<table>");
//     let tblTR = tbl.children().children();
//     // console.log("tblTR", tblTR);
//     $.each(tblTR, async function (index, value) {
//       let tr = $("<tr>");

//       let tbTD = tblTR.eq(index).children();
//       // console.log("tbTD", tbTD);
//       $.each(tbTD, async function (index, value) {
//         let td = $("<td>");

//         const cssItem = $(this).children().children();
//         // console.log("cssItem", cssItem);
//         // console.log("$(this)", $(this));
//         applyCSS(td, cssItem);
//         applyCSS(td, $(this));

//         const actualItem = $(this).children().children().children();
//         console.log("actualItem", actualItem);

//         if (actualItem.hasClass("tableItem")) {
//           let table = await getSubItemsForTableItem(actualItem);
//           console.log("table94", table);
//           td.append(table);
//         } else if (actualItem.hasClass("dataItem")) {
//           let dataItem = actualItem.find(".data").children().eq(0).clone();
//           // console.log("dataItem", dataItem);
//           applyCSS(td, actualItem.find(".data").children().eq(0), ["align"]);

//           td.append(dataItem);
//         } else if (actualItem.hasClass("group2")) {
//           let table = getSubItemsForgroup2(actualItem);
//           applyCSS(td, actualItem.find(".data2:first"), ["align"]);
//           td.append(table);
//         } else if (actualItem.hasClass("group3")) {
//           let table = getSubItemsForgroup3(actualItem);
//           applyCSS(td, actualItem.find(".data3:first"), ["align"]);
//           td.append(table);
//         }
//         tr.append(td);
//       });
//       tbody.append(tr);
//       if (index === tblTR.length - 1) {
//         table.append(tbody);
//         console.log("Returned", table);
//         resolve(table);
//         // return "table";
//       }
//     });
//   });
// }

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

  $.each(group, async function (index, value) {
    let tr = $("<tr>");
    let td = $("<td>");
    if ($(this).hasClass("tableItem")) {
      console.log("Table found in group 3", $(this).attr("id"));
      let table = await getSubItemsForTableItem($(this));
      console.log("Table found in group 3 - recieved", table);
      td.append(table);
    } else if ($(this).hasClass("dataItem")) {
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
  console.log("group 3 returned", table1);
  return table1;
}

function applyCSS(applyTo, applyFrom, type = ["border", "align", "padding"]) {
  //Test
  const elemAttributes = getAttributes(applyFrom);
  // console.log("elemAttributes", elemAttributes);
  // console.log("type", type);

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

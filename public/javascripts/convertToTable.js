async function converToTableFunc() {
  const mainItems = $("#drop > .drag.vertical");
  $(".mainTable").remove();
  let tbody = $("<tbody>");
  let table = $("<table style='font-size: 0px; width:100%;' cellspacing='0' cellpadding='0'>");
  table.addClass("mainTable");
  // $.each(mainItems, async function (index, value) {
  for (let i = 0; i < mainItems.length; i++) {
    // const item = value;
    const thisItem = mainItems.eq(i);
    // console.log("index", i);
    if (thisItem.hasClass("ph-table-row") || thisItem.hasClass("ph-table-cell")) {
      let tr = $("<tr style='font-size: 0px'>");
      let td = $("<td>");
      if (thisItem.hasClass("tableItem")) {
        // console.log("Tacble found herereresssssssssssssss");
        let table = await getSubItemsForTableItem(thisItem);
        // console.log("moved");
        td.append(table);
      } else if (thisItem.hasClass("dataItem")) {
        let dataItem = thisItem.find(".data").children().eq(0).clone();
        dataItem = addHyperLinkToImage(dataItem);
        dataItem = addPaddingToImage(td, dataItem);
        applyCSS(td, thisItem.find(".data").children().eq(0), ["align"]);
        td.append(dataItem);
      } else if (thisItem.hasClass("group2")) {
        let table = await getSubItemsForgroup2(thisItem);
        applyCSS(td, thisItem.find(".data2:first"), ["align"]);
        td.append(table);
      } else if (thisItem.hasClass("group3")) {
        let table = await getSubItemsForgroup3(thisItem);
        applyCSS(td, thisItem.find(".data3:first"), ["align"]);
        td.append(table);
      }
      tr.append(td);
      tbody.append(tr);
    }
  }
  // if (mainItems.length - 1 === index) {
  // setTimeout(function () {
  table.append(tbody);
  // table.appendTo(".panelPreview2", ".panelPreview");
  $(".panelPreview").append(table.clone());
  $(".panelPreview2").append(table.clone());
  // }, 100);
  // }
  // });
}

function getSubItemsForTableItem(item) {
  // console.log("Called getSubItemsForTableItem");
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
        applyCSS(td, thisItem);
        applyCSS(td, cssItem);

        const actualItem = thisItem.children().children().children();
        // console.log("actualItem", actualItem);

        if (actualItem.hasClass("tableItem")) {
          // console.log("Table found in table", actualItem.attr("id"));
          let table = await getSubItemsForTableItem(actualItem);
          // console.log("table94", table);
          td.append(table);
        } else if (actualItem.hasClass("dataItem")) {
          let dataItem = actualItem.find(".data").children().eq(0).clone();
          // console.log("dataItem", dataItem);
          dataItem = addHyperLinkToImage(dataItem);
          dataItem = addPaddingToImage(td, dataItem);
          applyCSS(td, actualItem.find(".data").children().eq(0), ["align"]);

          td.append(dataItem);
        } else if (actualItem.hasClass("group2")) {
          let table = await getSubItemsForgroup2(actualItem);
          applyCSS(td, actualItem.find(".data2:first"), ["align"]);
          td.append(table);
        } else if (actualItem.hasClass("group3")) {
          // console.log("Group 3 found int table", actualItem);
          let table = await getSubItemsForgroup3(actualItem);
          applyCSS(td, actualItem.find(".data3:first"), ["align"]);
          td.append(table);
        }
        tr.append(td);
      }
      // });
      tbody.append(tr);
      if (index === tblTR.length - 1) {
        table.append(tbody);
        // console.log("Returned", table);
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
  return new Promise(async (resolve, reject) => {
    let group = $(item).find(".data2:first").children();

    // Create table with single TR and TD for the group.
    let tbody1 = $("<tbody>");
    let table1 = $("<table style='font-size: 0px; width:100%' cellspacing='0' cellpadding='0'>");
    let tr1 = $("<tr style='font-size: 0px'>");
    let td1 = $("<td>");
    applyCSS(td1, $(item).find(".data2:first"), ["border", "padding"]);

    tr1.append(td1);
    tbody1.append(tr1);
    table1.append(tbody1);

    let tbody = $("<tbody>");
    let table = $("<table style='font-size: 0px;' cellspacing='0' cellpadding='0'>");

    let tr = $("<tr style='font-size: 0px'>");
    for (let index = 0; index < group.length; index++) {
      const thisItem = group.eq(index);
      // $.each(group, async function (index, value) {
      let td = $("<td>");
      if (thisItem.hasClass("dataItem")) {
        let dataItem = thisItem.find(".data").children().eq(0).clone();
        dataItem = addHyperLinkToImage(dataItem);
        dataItem = addPaddingToImage(td, dataItem);
        applyCSS(td, thisItem.find(".data").children(), ["align"]);
        td.append(dataItem);
        /**
         * If width on text item then stretch
         */
        // console.log(dataItem.attr("width-stretch"));
        if (dataItem.attr("width-stretch") == "100%") {
          table.css("width", "100%");
        }
      } else if (thisItem.hasClass("group2")) {
        let table = await getSubItemsForgroup2(thisItem);
        applyCSS(td, thisItem.find(".data2:first"), ["align"]);
        td.append(table);
      } else if (thisItem.hasClass("group3")) {
        let table = await getSubItemsForgroup3(thisItem);
        applyCSS(td, thisItem.find(".data3:first"), ["align"]);
        td.append(table);
      }
      tr.append(td);
      // });
    }
    tbody.append(tr);
    table.append(tbody);
    td1.append(table);
    // return table1;
    resolve(table1);
  });
}

function getSubItemsForgroup3(item) {
  return new Promise(async (resolve, reject) => {
    let group = $(item).find(".data3:first").children();

    // Create table with single TR and TD for the group.
    let tbody1 = $("<tbody>");
    let table1 = $("<table style='font-size: 0px;' cellspacing='0' cellpadding='0'>");
    let tr1 = $("<tr style='font-size: 0px'>");
    let td1 = $("<td>");
    applyCSS(td1, $(item).find(".data3:first"), ["border", "padding"]);

    tr1.append(td1);
    tbody1.append(tr1);
    table1.append(tbody1);

    let tbody = $("<tbody>");
    let table = $("<table style='font-size: 0px;' cellspacing='0' cellpadding='0'>");
    for (let index = 0; index < group.length; index++) {
      const thisItem = group.eq(index);
      // $.each(group, async function (index, value) {
      let tr = $("<tr style='font-size: 0px'>");
      let td = $("<td>");
      if (thisItem.hasClass("tableItem")) {
        // console.log("Table found in group 3", thisItem.attr("id"));
        let table = await getSubItemsForTableItem(thisItem);
        // console.log("Table found in group 3 - recieved", table);
        td.append(table);
      } else if (thisItem.hasClass("dataItem")) {
        let dataItem = thisItem.find(".data").children().eq(0).clone();
        dataItem = addHyperLinkToImage(dataItem);
        dataItem = addPaddingToImage(td, dataItem);
        applyCSS(td, thisItem.find(".data").children(), ["align"]);
        td.append(dataItem);
      } else if (thisItem.hasClass("group2")) {
        let table = await getSubItemsForgroup2(thisItem);
        console.log(table);
        applyCSS(td, thisItem.find(".data2:first"), ["align"]);
        td.append(table);
      } else if (thisItem.hasClass("group3")) {
        let table = await getSubItemsForgroup3(thisItem);
        applyCSS(td, thisItem.find(".data3:first"), ["align"]);
        td.append(table);
      }
      tr.append(td);
      tbody.append(tr);
    }

    // });
    table.append(tbody);
    td1.append(table);
    // console.log("group 3 returned", table1);
    resolve(table1);
    // return table1;
  });
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

function addHyperLinkToImage(item) {
  if (item.is("img")) {
    if (item.attr("hyperlink")) {
      const aTag = $(
        `<a href="${item.attr("hyperlink")}" id=atag_${item.attr("id")} target="_blank" style="text-decoration:none;">`
      );
      aTag.append(item);
      return aTag;
    }
  }

  return item;
}

function addPaddingToImage(td, item) {
  if (item.is("img")) {
    const elemAttributes = getAttributes(item);
    for (const attrib of Object.keys(elemAttributes)) {
      if (attrib.indexOf("padding") !== -1) {
        td.css(attrib, elemAttributes[attrib]);
        item.css({ attrib: "" });
      }
    }
  }

  return item;
}

function getAttributes($node) {
  var attrs = {};
  if ($node[0])
    $.each($node[0].attributes, function (index, attribute) {
      attrs[attribute.name] = attribute.value;
    });

  return attrs;
}

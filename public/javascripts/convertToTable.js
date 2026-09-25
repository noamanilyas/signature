async function converToTableFunc() {
  const mainItems = $("#drop > .drag.vertical");
  let tbody = $("<tbody>");
  let table = $("<table style='font-size: 0px; width:75%;' cellspacing='0' cellpadding='0'>");
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
        let editorTable = thisItem.find(".data").children().eq(0);
        let table = await getSubItemsForTableItem(thisItem);
        const textAlign = applyAlignToCell(td, editorTable);
        applyTableBlockAlign(table, textAlign);
        td.append(table);
      } else if (thisItem.hasClass("dataItem")) {
        let dataItem = thisItem.find(".data").children().eq(0).clone();
        if (thisItem.find("span").attr("category") === "textField") {
          textTable(dataItem, td, thisItem);
        } else {
          dataItem = addHyperLinkToImage(dataItem);
          dataItem = addPaddingToImage(td, dataItem);
          dataItem = await convertCustomFontToImage(dataItem);
          applyCSS(td, thisItem.find(".data").children().eq(0), ["align"]);
          td.append(dataItem);
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
      tbody.append(tr);
    }
  }
  // if (mainItems.length - 1 === index) {
  // setTimeout(function () {
  table.append(tbody);
  // table.appendTo(".panelPreview2", ".panelPreview");
  $(".mainTable").remove();
  $(".panelPreview").append(table.clone());
  $(".panelPreview2").append(table.clone());
  // }, 100);
  // }
  // });
  if (userData) {
    applyRegexReplacementToTable($(".panelPreview .mainTable"), userData);
  }
}
function applyRegexReplacementToTable(table, data) {
  table.html(
    table
      .html()
      .replace(
        /\{Display Name\}|\{First Name\}|\{Last Name\}|\{StreetAddress\}|\{PostalCode\}|\{Mobile No\.\}|\{Telephone Number\}|\{E-Mail\}|\{Web Page\}|\{FAX\}|\{Title\}|\{Company\}|\{Department\}|\{City\}|\{Country\}|\{State\}/g,
        function (match) {
          switch (match) {
            case "{Display Name}":
              return data.Name || data.U_CD || " ";
            case "{First Name}":
              return data.First_Name || data.C_FNAME || " ";
            case "{Last Name}":
              return data.Last_Name || data.C_LNAME || " ";
            case "{StreetAddress}":
              return data.StreetAddress || data.C_ADD1 || " ";
            case "{PostalCode}":
              return data.PostalCode || data.C_ZIP || " ";
            case "{Mobile No.}":
              return data.Mobile_No || " ";
            case "{Telephone Number}":
              return data.telephoneNumber || data.C_TEL || data.Telephone_Number || " ";
            case "{E-Mail}":
              return data.E_Mail || data.U_EMAIL || data.C_USRCD || " ";
            case "{Web Page}":
              return data.WebPage || " ";
            case "{FAX}":
              return data.FAX || " ";
            case "{Title}":
              return data.Title || " ";
            case "{Company}":
              return data.Company || data.U_CONO || data.C_NAME || " ";
            case "{Department}":
              return data.Department || " ";
            case "{City}":
              return data.City || " ";
            case "{Country}":
              return data.Country || data.C_STATE || " ";
            case "{State}":
              return data.State || data.C_TOWN || " ";
            default:
              return " ";
          }
        }
      )
  );
}

function getSubItemsForTableItem(item) {
  // console.log("Called getSubItemsForTableItem");
  return new Promise(async (resolve, reject) => {
    let tbl = $(item).find(".data:first").children();
    let tbody = $("<tbody>");
    let tblTR = tbl.children().children();
    // "Stretch" only has somewhere useful to put the extra width when a cell
    // can actually reflow into it (text, or a nested table/group). A table of
    // plain images has nothing to grow - width:100% on the table would still
    // force the browser's auto-layout to split that width across the image
    // columns anyway (invisible until a cell gets a background color, which
    // is what makes it look like the image itself is "stretched"). So skip
    // the stretch entirely when every cell is image-only, matching how the
    // editor's own div-based table renders it (effectively unchanged). This
    // also gates keepImageCellShrinkToFit below: giving an image cell an
    // explicit (if tiny) percentage width is itself enough to make an
    // otherwise-auto-width table fill its container, so that hint must stay
    // off unless there's a flexible sibling cell it's actually protecting.
    const allImageCells = tableHasOnlyImageCells(tblTR);
    const stretch = tbl.attr("width-stretch") == "100%" && !allImageCells;
    let table = $(`<table style='${stretch ? "width: 100%" : ""}'>`);
    if (tbl.length > 0) {
      let spanStyle = tbl.attr("style");
      // applyEditorTableStretch() (alignmentGroups.js) sets width:100% as a
      // live inline style on the .editor-table element itself, not just the
      // width-stretch attribute checked above. Blindly copying that style
      // string here would put width:100% right back once we've decided
      // (see the stretch computation above) that this table shouldn't
      // stretch, so strip any width out of the copy in that case.
      if (spanStyle && !stretch) {
        spanStyle = spanStyle.replace(/(?:^|;)\s*(?:min-|max-)?width\s*:[^;]*/gi, "");
      }
      if (spanStyle) {
        table.attr("style", spanStyle);
      }
    }
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

        if (cssItem.attr("width-stretch") == "100%") {
          table.css("width", "100%");
        }

        const actualItem = thisItem.children().children().children();
        // console.log("actualItem", actualItem);

        if (actualItem.hasClass("tableItem")) {
          let editorTable = actualItem.find(".data:first").children().eq(0);
          let table = await getSubItemsForTableItem(actualItem);
          const textAlign = applyAlignToCell(td, editorTable);
          applyTableBlockAlign(table, textAlign);
          td.append(table);
        } else if (actualItem.hasClass("dataItem")) {
          let dataItem = actualItem.find(".data").children().eq(0).clone();
          if (thisItem.find("span").attr("category") === "textField") {
            textTable(dataItem, td, thisItem);
          } else {
            dataItem = addHyperLinkToImage(dataItem);
            dataItem = addPaddingToImage(td, dataItem);
            dataItem = await convertCustomFontToImage(dataItem);
            applyCSS(td, thisItem.find(".data").children().eq(0), ["align"]);
            td.append(dataItem);
            if (!allImageCells) {
              keepImageCellShrinkToFit(td, dataItem);
            }
          }
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
    let group = $(item).find(".data2:first");
    let groupChildren = group.children();

    // Create table with single TR and TD for the group.
    let tbody1 = $("<tbody>");
    let table1 = $("<table style='font-size: 0px; width:100%' cellspacing='0' cellpadding='0'>");
    let tdHorizontalAlignment = group.attr("text-align") ? `align="${group.attr("text-align")}"` : "";
    let tr1 = $(`<tr style='font-size: 0px' ${tdHorizontalAlignment}>`);
    let td1 = $(`<td>`);
    // Fix: include "size" so a width/height set on the group in the editor
    // (see size.js) is no longer dropped when the group is rebuilt as a
    // table for the preview.
    applyCSS(td1, $(item).find(".data2:first"), ["border", "padding", "size"]);

    tr1.append(td1);
    tbody1.append(tr1);
    table1.append(tbody1);

    // Same reasoning as getSubItemsForTableItem's `stretch`/`allImageCells`:
    // a row of nothing but images has no flexible cell for "Stretch" to grow
    // into, and even just hinting an image <td> to shrink-to-fit (below) is
    // itself enough to pull an otherwise-auto-width table to fill its
    // container - so both must stay off when every item in the group is a
    // plain image.
    const allImageChildren = groupItemsAreAllImages(groupChildren);
    let tbody = $("<tbody>");
    let table = $(
      `<table style='font-size: 0px;${
        group.attr("width-stretch") == "100%" && !allImageChildren ? "width: 100%" : ""
      }' cellspacing='0' cellpadding='0'>`
    );

    let tr = $("<tr style='font-size: 0px'>");
    for (let index = 0; index < groupChildren.length; index++) {
      const thisItem = groupChildren.eq(index);
      // $.each(group, async function (index, value) {
      let td = $("<td>");
      if (thisItem.hasClass("tableItem")) {
        let editorTable = thisItem.find(".data").children().eq(0);
        let table = await getSubItemsForTableItem(thisItem);
        const textAlign = applyAlignToCell(td, editorTable);
        applyTableBlockAlign(table, textAlign);
        td.append(table);
      } else if (thisItem.hasClass("dataItem")) {
        let dataItem = thisItem.find(".data").children().eq(0).clone();
        if (thisItem.find("span").attr("category") === "textField") {
          textTable(dataItem, td, thisItem);
        } else {
          dataItem = addHyperLinkToImage(dataItem);
          dataItem = addPaddingToImage(td, dataItem);
          dataItem = await convertCustomFontToImage(dataItem);
          applyCSS(td, thisItem.find(".data").children(), ["align"]);
          td.append(dataItem);
          if (!allImageChildren) {
            keepImageCellShrinkToFit(td, dataItem);
          }
          /**
           * If width on text item then stretch
           */
          // console.log(dataItem.attr("width-stretch"));
          if (dataItem.attr("width-stretch") == "100%") {
            table.css("width", "100%");
          }
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
    // Fix: include "size" so a width/height set on the group in the editor
    // (see size.js) is no longer dropped when the group is rebuilt as a
    // table for the preview.
    applyCSS(td1, $(item).find(".data3:first"), ["border", "padding", "size"]);

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
        let editorTable = thisItem.find(".data").children().eq(0);
        let table = await getSubItemsForTableItem(thisItem);
        const textAlign = applyAlignToCell(td, editorTable);
        applyTableBlockAlign(table, textAlign);
        td.append(table);
      } else if (thisItem.hasClass("dataItem")) {
        let dataItem = thisItem.find(".data").children().eq(0).clone();
        if (thisItem.find("span").attr("category") === "textField") {
          textTable(dataItem, td, thisItem);
        } else {
          dataItem = addHyperLinkToImage(dataItem);
          dataItem = addPaddingToImage(td, dataItem);
          dataItem = await convertCustomFontToImage(dataItem);
          applyCSS(td, thisItem.find(".data").children(), ["align"]);
          td.append(dataItem);
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

// Border and padding both go on td1 (below), never split across td1 and
// the span: the box model only works when they share a box. Border on the
// span + padding on td1 puts the padding outside the border, so the border
// stays glued to the text; border on td1 + padding on the span inflates
// the span and so stretches the border. td1 is the box they share because
// it hugs the text (it sits inside textTable, its own shrink-wrapping
// inner <table>, so it stays one line tall rather than stretching to the
// row height - see e2e text-border-right-in-group.spec.ts), it renders a
// single rectangle around multi-line text where an inline span would paint
// one border per line box, and Outlook's Word engine drops border/padding
// on inline(-block) spans but honours it on a <td>.
//
// The span is still forced to display:inline-block (rather than the
// editor's display:block) so its own box wraps all of its content: text
// plus any <div>s jqte inserts per line (see tabsJs/text.js). As a plain
// inline box it would be split into a separate box per line, and
// non-inherited properties like overflow:hidden would then only apply to
// the first line.
function stripBoxModelStyle($el) {
  const style = $el.attr("style");
  if (style) {
    const kept = style
      .split(";")
      .map((rule) => rule.trim())
      .filter((rule) => rule && rule.indexOf("border") !== 0 && rule.indexOf("padding") !== 0);
    $el.attr("style", kept.join("; "));
  }
  $.each(Array.from($el[0]?.attributes || []), function (_index, attribute) {
    if (attribute.name.indexOf("border") === 0 || attribute.name.indexOf("padding") === 0) {
      $el.removeAttr(attribute.name);
    }
  });
}

function textTable(dataItem, td, thisItem) {
  let textTable = $("<table style='font-size: 0px; white-space:nowrap;' cellspacing='0' cellpadding='0'>");
  let textTbody = $("<tbody>");
  let textTr = $("<tr style='font-size: 0px'>");
  let td1 = $("<td>");
  const sourceSpan = thisItem.find(".data").children().eq(0);
  // border.js/padding.js store these as attributes, not inline style, so
  // applyCSS reads them off the live span and paints them onto td1.
  stripBoxModelStyle(dataItem);
  dataItem.css("display", "inline-block");
  let dataItemHTML = dataItem.prop("outerHTML");
  applyCSS(td1, sourceSpan, ["align", "border", "padding"]);
  td1.append(dataItemHTML);
  textTr.append(td1);
  textTbody.append(textTr);
  textTable.append(textTbody);
  applyCSS(td, sourceSpan, ["align"]);
  td.append(textTable);
  let spanStyle = thisItem.find("span").attr("style");
  spanStyle = spanStyle.replace(/display\s*:\s*block\s*;?/g, "");
  if (spanStyle) {
    let cssProperties = spanStyle
      .split(";")
      .map((property) => property.split(":").map((part) => part.trim()))
      .reduce((acc, [key, value]) => {
        // border/padding already went onto td1 (and align onto the outer
        // td) via applyCSS above - copying them here too would
        // additionally paint them onto the wrapping <table>, making the
        // text's own border look like it belongs to a surrounding table.
        if (key && key.indexOf("border") === -1 && key.indexOf("padding") === -1) {
          acc[key] = value;
        }
        return acc;
      }, {});

    // Apply the remaining CSS properties (font, alignment, etc.) to textTable
    textTable.css(cssProperties);
  }
}

function applyAlignToCell(td, source) {
  applyCSS(td, source, ["align"]);
  const textAlign = source.attr("text-align");
  if (textAlign) {
    td.attr("align", textAlign);
  }
  return textAlign;
}

function applyTableBlockAlign($table, textAlign) {
  if (!textAlign || textAlign === "stretch") return;
  if (textAlign === "center" || textAlign === "-webkit-center") {
    $table.css({ "margin-left": "auto", "margin-right": "auto", display: "table" });
  } else if (textAlign === "right" || textAlign === "-webkit-right") {
    $table.css({ "margin-left": "auto", "margin-right": "0", display: "table" });
  } else if (textAlign === "left") {
    $table.css({ "margin-left": "0", "margin-right": "auto", display: "table" });
  }
}

// A "Stretch"-aligned table (width-stretch="100%", see getSubItemsForTableItem
// above) puts width:100% on the rebuilt <table>. Without a width hint on its
// <td>s, the browser's table auto-layout then splits that 100% evenly across
// every column - including ones that hold nothing but a small fixed-size
// image - leaving each image sitting in a cell far wider than itself. That
// extra space is invisible until the cell gets a background color, at which
// point the image appears to be "stretched" way beyond the width it was
// given. width:1% + white-space:nowrap is the standard email-safe way to
// tell auto-layout "this column is exactly as wide as its content, don't
// give it a share of the extra width" - the image's own (possibly explicit)
// width still wins as the column's minimum content width.
function keepImageCellShrinkToFit(td, dataItem) {
  if (dataItem.is("img") || dataItem.find("img").length) {
    td.css({ width: "1%", "white-space": "nowrap" });
  }
}

// True only if every cell in every row is a plain image/icon dataItem (not
// text, and not a nested table/group, which could itself contain text) -
// see keepImageCellShrinkToFit's comment for why that matters for "Stretch".
function tableHasOnlyImageCells(tblTR) {
  for (let rowIndex = 0; rowIndex < tblTR.length; rowIndex++) {
    const tds = tblTR.eq(rowIndex).children();
    for (let tdIndex = 0; tdIndex < tds.length; tdIndex++) {
      const thisItem = tds.eq(tdIndex);
      const actualItem = thisItem.children().children().children();
      const isImageOnly =
        actualItem.hasClass("dataItem") && thisItem.find("span").attr("category") !== "textField";
      if (!isImageOnly) return false;
    }
  }
  return true;
}

// Same check as tableHasOnlyImageCells, for a getSubItemsForgroup2 row: its
// items sit directly in groupChildren rather than nested under an
// editor-td/ph-table-cell chain, so this reads thisItem's own class instead
// of drilling into it.
function groupItemsAreAllImages(groupChildren) {
  for (let index = 0; index < groupChildren.length; index++) {
    const thisItem = groupChildren.eq(index);
    const isImageOnly =
      thisItem.hasClass("dataItem") && thisItem.find("span").attr("category") !== "textField";
    if (!isImageOnly) return false;
  }
  return true;
}

// Real HTML/CSS width & height attribute names carried over by applyCSS
// when "size" is requested. Kept as an explicit whitelist (rather than an
// indexOf("width")/indexOf("height") substring match) so it doesn't also
// pick up the unrelated "width-stretch" attribute used elsewhere.
const SIZE_ATTRIBS = ["width", "height", "min-width", "max-width", "min-height", "max-height"];

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
    } else if (SIZE_ATTRIBS.indexOf(attrib) !== -1 && type.indexOf("size") !== -1) {
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
  if (item.is("img") || item.is("span")) {
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

async function convertCustomFontToImage(item) {
  if (item.is("span")) {
    const elemAttributes = getAttributes(item);
    // console.log(customeFontsArray);
    let customFontExists = false;
    // console.log(elemAttributes.style);
    for (const font of customeFontsArray) {
      if (elemAttributes.style.indexOf(font) !== -1) {
        customFontExists = true;
      }
      // console.log(elemAttributes.style.indexOf(font));
    }

    // Any font-family that isn't in the known email-safe set (Word-catalog
    // picks, typed/pasted custom names) needs rasterizing too, since
    // recipient email clients can't load it as a real web font.
    const fontFamilyMatch = /font-family:\s*([^;]+)/i.exec(elemAttributes.style);
    if (fontFamilyMatch && !isEmailSafeFontFamily(fontFamilyMatch[1])) {
      customFontExists = true;
    }

    // console.log(customFontExists);
    if (customFontExists) {
      const options = {
        // y: 0,
        // x: 0,
        // scrollY: 0,
        // scrollX: 0,
      };
      // console.log(item[0].id);
      let canvas = await html2canvas($(`#${item[0].id}`)[0], options);
      // console.log(canvas);

      if (canvas) {
        let imgData = canvas.toDataURL("image/jpeg");
        let img = $(`<img
        alt="Image"
        title="Image"
        category="image"
        src="${imgData}"
      />`);
        console.log("return");
        return img;
      }
    } else {
      return item;
    }
    // for (const attrib of Object.keys(elemAttributes)) {
    //   if (attrib.indexOf("padding") !== -1) {
    //     td.css(attrib, elemAttributes[attrib]);
    //     item.css({ attrib: "" });
    //   }
    // }
  }
  // console.log("lols");

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

$("#searchEmail").on("input", function () {
  $("#searchResults").show();
  let url_string = window.location.href;
  var url = new URL(url_string);
  var companyId = url.searchParams.get("companyId");
  var query = $(this).val();
  $("#searchResults").empty();
  $.ajax({
    url: `${SERVER_URL}/companyuser`,
    type: "GET",
    data: { query, companyId },
    success: function (data) {
      displaySearchResults(data);
    },
    error: function (error) {
      console.error("Error fetching search results:", error);
    },
  });
});

function displaySearchResults(results) {
  if (results.length > 0) {
    var resultHtml = '<ul style="background: #61a733; color: white;border-radius: 5px;">';
    var displayedResults = results.slice(0, 5);
    displayedResults.forEach(function (email) {
      resultHtml += "<li>" + email + "</li>";
    });
    resultHtml += "</ul>";
    $("#searchResults").html(resultHtml);
  } else {
    $("#searchResults").html("<p style='background: #61a733; color: white;border-radius: 5px;'>No results found.</p>");
  }
}

$("#searchResults").on("click", "li", function () {
  var selectedEmail = $(this).text();
  $("#searchEmail").val("");
  $("#searchEmail").prop("placeholder", selectedEmail);
  $("#searchResults").hide();
  $.ajax({
    url: `${SERVER_URL}/companyuser/${selectedEmail}`,
    type: "GET",
    success: function (data) {
      userData = data;
      converToTableFunc();
    },
    error: function (error) {
      console.error("Error fetching user information:", error);
    },
  });
});

$(document).on("click", function (event) {
  const dropdown = $(".mt-4");
  if (!dropdown.is(event.target) && dropdown.has(event.target).length === 0) {
    $("#searchResults").hide();
  }
});

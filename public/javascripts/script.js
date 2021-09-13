$(document).ready(function () {
  let url_string = window.location.href; //window.location.href
  let url = new URL(url_string);
  let companyId = url.searchParams.get("companyId");
  $("#backIndexBtn").attr("href", `index.html?companyId=${companyId}`);

  /**
   * Sample
   * ["labelIcon", "imageSource", "hyperlink", "text",
   * "background", "visibility", "alignment", "border",
   * "padding", "size", "render", "orientation", "socialMediaIcon"]
   */

  Swal.fire({
    // position: "top-end",
    onBeforeOpen: () => {
      Swal.showLoading();
    },
    // icon: "info",
    iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
    title: "Loading Signature",
    showConfirmButton: false,
    // timer: 1500,
  });
  (async () => {
    let url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    if (id.length > 0) {
      const rawResponse = await fetch(`${SERVER_URL}/getSignatureById?id=` + id, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const content = await rawResponse.json();

      // Set name
      $("#signatureName").val(content.recordset[0].Name);
      let HTMLString = content.recordset[0].HTML;
      let HTMLObj = $(HTMLString);
      setTimeout(function () {
        addDropEvent(HTMLObj.find(".ns"), false);
        addDropEvent(HTMLObj.find(".we"), false);
        addModalClick(HTMLObj.find(".data"));
        addModalClick(HTMLObj.find(".data2"));
        addModalClick(HTMLObj.find(".data3"));
        addMouseOverEvents(HTMLObj.find(".data"));
        $("#drop").droppable("destroy");
        // $("#drop").droppable("option", "disabled", true);
      }, 500);
      $("#drop").append(HTMLObj);
      converToTableFunc();
    }
    setTimeout(function () {
      Swal.close();
    }, 500);
  })();

  function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
      for (var i in css) {
        if (css[i].toLowerCase) {
          s[css[i].toLowerCase()] = css[css[i]];
        }
      }
    } else if (typeof css == "string") {
      css = css.split("; ");
      for (var i in css) {
        var l = css[i].split(": ");
        s[l[0].toLowerCase()] = l[1];
      }
    }
    return s;
  }

  function css(a) {
    var sheets = document.styleSheets,
      o = {};
    for (var i in sheets) {
      var rules = sheets[i].rules || sheets[i].cssRules;
      for (var r in rules) {
        if (a.is(rules[r].selectorText)) {
          o = $.extend(o, css2json(rules[r].style), css2json(a.attr("style")));
        }
      }
    }
    return o;
  }

  function processElementsToAppend(currItem, index, type = "none") {
    try {
      var style = css(currItem);

      // let elemChildren = currItem.children().eq(index).children();
      let elemChildren;
      // if (type === "group2") {
      elemChildren = currItem.children();
      // console.log("elemChildren: ", elemChildren);
      // }

      // console.log("tagName: ", elemChildren.prop("tagName"));
      // console.log("Text", currItem.text().trim());
      if (elemChildren.eq(0).prop("tagName") === "A") {
        // let type = 'none';
        // if ()
        return processElementsToAppend(elemChildren, index, "group2");
      }
      if (elemChildren.eq(0).prop("tagName") === "IMG") {
        let imageElem = elemChildren.eq(0);
        imageElem.attr("category", "image");
        let draggedItem = initDraggedItem(elemChildren.eq(0));
        if (draggedItem.hasClass("ph-table-row") && type === "group2") {
          draggedItem.removeClass("ph-table-row");
          draggedItem.addClass("ph-table-cell");
        }
        return draggedItem;
      } else if (
        elemChildren.eq(0).prop("tagName") === "SPAN" ||
        elemChildren.eq(0).prop("tagName") === "BR" ||
        elemChildren.eq(0).prop("tagName") === "STRONG" ||
        elemChildren.length === 0 ||
        (elemChildren.eq(0).prop("tagName") === "BR" && currItem.text().trim().length > 0)
      ) {
        // console.log(currItem.text().trim());
        let textSpan = $(
          `<span category="textField" 
          style="font-size: 14px; white-space: nowrap;" 
          font-family: Calibri, Arial, sans-serif;>${currItem.html()}</span>`
        );
        // let textSpan = $(`<span category="textField">${currItem.text().trim()}</span>`);
        textSpan.css(style);
        // console.log(textSpan);
        let draggedItem = initDraggedItem(textSpan);
        if (draggedItem.hasClass("ph-table-row") && type === "group2") {
          draggedItem.removeClass("ph-table-row");
          draggedItem.addClass("ph-table-cell");
        }
        return draggedItem;
      } else if (elemChildren.eq(0).prop("tagName") === "TABLE") {
        const parent2nd = currItem.eq(0).parent().parent().parent().parent();
        // console.log("parenttttttttttt", currItem.parent());
        let tableElemTR = elemChildren.eq(0).find("tbody:first").children();
        let tdCountMax = 0;
        tableElemTR.each(function () {
          let tdCount = $(this).eq(0).children().length;
          if (tdCountMax < tdCount) {
            tdCountMax = tdCount;
          }
        });
        console.log("parent2nd", parent2nd.length);

        // if (tableElemTR.length > 1 && tdCoun tMax > 1) {
        if (tableElemTR.length === 1 && tdCountMax > 1 && !parent2nd.length) {
          // Table
          console.log("table");
          return setTableSubItems(tableElemTR);
          // elemChildren.eq(0);
        } else if (tableElemTR.length > 1 && tdCountMax > 1) {
          // Table
          console.log("table");
          return setTableSubItems(tableElemTR);
          // elemChildren.eq(0);
        } else if (tableElemTR.length === 1 && tableElemTR.eq(0).children().length > 1) {
          // Group 2
          let group2 = tableElemTR.eq(0).children();
          let group2HTML = setGroup2SubItems(group2);
          if (group2HTML.hasClass("ph-table-row") && type === "group2") {
            group2HTML.removeClass("ph-table-row");
            group2HTML.addClass("ph-table-cell");
          }
          return group2HTML;
        } else if (tableElemTR.length > 1) {
          // Group 3
          // console.log("Group 3");
          let group3 = tableElemTR;
          let group3HTML = setGroup3SubItems(group3);
          return group3HTML;
        } else if (tableElemTR.length === 1 && tdCountMax === 1) {
          // Group 3
          // console.log("1x1 table");
          return processElementsToAppend(tableElemTR.children(), index, "none");
          // return setTableSubItems(tableElemTR);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function setTableSubItems(tblTRs) {
    // sync changes in initDraggedItem
    let container = getNewContainer();
    container.draggable({
      cancel: false,
      helper: function (e) {
        return $(this).clone();
      },
      cursor: "move",
      start: function (event, ui) {
        $(this).draggable("instance").offset.click = {
          left: 0,
          top: 0,
        };
      },
    });

    let UUID = `item-${Date.now()}`;
    container.attr("id", "container-" + UUID);
    let dataDiv = container.find(".data");
    container.addClass("tableItem");

    let data = container.find("div.data:first");

    let newTbl = $(`<table class="editor-table"><tbody></tbody></table>`);

    tblTRs.each(function (index) {
      trTDs = $(this).children();

      let newTR = $('<tr class="editor-tr"></tr>');
      const trCurrent = $(this);

      trTDs.each(function (index) {
        const newItem = processElementsToAppend(trTDs.eq(index), index, "none");
        const rowspan = trTDs.eq(index).attr("rowspan");
        let addRowSpanVal = ``;
        // console.log("rowspan", rowspan);
        if (rowspan) {
          addRowSpanVal = `rowspan=${rowspan}`;
        }
        const newTD = $(`
          <td class="editor-td" ${addRowSpanVal}>
            <div class="ph-table wh100">
              <div align="left" class="ph-table-cell tableDrop editor-td-div cellWH" category="table">
                
              </div>
            </div>
          </td>`);

        // Copy styles to new td
        for (const cssItem of trTDs.eq(index)[0].style) {
          // console.log(cssItem);
          // console.log(trTDs.eq(index)[0].style[cssItem]);
          newTD.css(cssItem, trTDs.eq(index)[0].style[cssItem]);
          newTD.attr(cssItem, trTDs.eq(index)[0].style[cssItem]);

          // newTD.children().children().css(cssItem, trTDs.eq(index)[0].style[cssItem]);
          newTD.children().children().attr(cssItem, trTDs.eq(index)[0].style[cssItem]);
        }

        // Copy tr styles to new td
        // for (const cssItemTr of trCurrent[0].style) {
        //   // console.log(cssItem);
        //   // console.log(trTDs.eq(index)[0].style[cssItem]);
        //   newTD.css(cssItemTr, trTDs.eq(index)[0].style[cssItem]);
        //   newTD.attr(cssItemTr, trTDs.eq(index)[0].style[cssItem]);
        // }

        // console.log("yyyyyyyyyyyyyy", style);
        // console.log("dddddddddddddd", trTDs.eq(index)[0].style);
        // console.log("dddddddddddddd", trTDs.eq(index)[0].style.length);
        let UUID2 = `item-${Date.now() + index + Date.now()}`;
        let tdDiv = newTD.find("div.editor-td-div");
        tdDiv.attr("id", "editorTD-" + UUID2);
        addDropEvent(tdDiv, true);
        addModalClick(tdDiv);
        addMouseOverEvents(tdDiv);

        newTD.find("div.editor-td-div").append(newItem);
        newTR.append(newTD);
      });
      newTbl.find("tbody:first").append(newTR);
    });

    data.append(newTbl);

    return container;
  }

  function setGroup2SubItems(group2) {
    let container = getNewContainerWE();
    let data2 = container.find("div.data2:first");
    group2.each(function (index) {
      const newItem = processElementsToAppend($(this), index, "group2");
      data2.append(newItem);
    });

    return container;
  }

  function setGroup3SubItems(group3) {
    let container = getNewContainerNS();
    let data3 = container.find("div.data3:first");
    group3.each(function (index) {
      // console.log("Group 3", $(this));
      const newItem = processElementsToAppend($(this).children(), index, "group3");
      data3.append(newItem);
    });

    return container;
  }

  function reverseParseTableHTML(htmlText) {
    // htmlText = ``;
    html = $(htmlText);
    htmlMainTRs = html.find("tbody:first").children();

    htmlMainTRs.each(function (index) {
      const getTD = $(this).children();
      const newItem = processElementsToAppend(getTD, index, "none");
      $("#drop").append(newItem);
    });
    converToTableFunc();
  }

  //Import event listener
  $("#importSource").click(function (e) {
    let importedHTMLText = $("#htmlText").val();
    // let importedHTMLText = sigHTMLSample;

    reverseParseTableHTML(importedHTMLText);
    $("#importModal").modal("hide");
    $("#importModal").trigger("reset");
  });

  // Save signature
  $("#saveSignature").click(function (e) {
    Swal.fire({
      // position: "top-end",
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      // icon: "info",
      iconHtml: `<img src="/images/favicon.png" height="45" alt="" />`,
      title: "Saving Signature",
      showConfirmButton: false,
      // timer: 1500,
    });

    let url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    $("#previewModel").modal("show");
    setTimeout(function () {
      // console.log($("div.panelPreview2")[0]);
      const options = {
        // y: 0,
        // x: 0,
        // scrollY: 0,
        // scrollX: 0,
      };
      (async () => {
        let canvas,
          imgData = "";
        try {
          canvas = await html2canvas($("div.panelPreview2 > table.mainTable")[0], options);
        } catch (e) {
          console.log(e);
        }

        if (canvas) {
          imgData = canvas.toDataURL("image/jpeg");
        }
        let img = $("img#previewImgElem");
        img.attr("src", imgData);
        // document.body.append(canvas);

        // SignatureData
        let name = $("#signatureName").val();
        let html = $("#drop").html();
        let signatureHTML = $(".panelPreview2").html();
        // let body = JSON.stringify({ name, html, signatureHTML, imgData, compNo: companyId });
        let formData = new FormData();
        formData.append("name", name);
        formData.append("html", html);
        formData.append("signatureHTML", signatureHTML);
        formData.append("imgData", imgData);
        formData.append("compNo", companyId);

        let postURL = `${SERVER_URL}/saveHTML`;
        if (id.length > 0) {
          formData.append("id", id);
          // body = JSON.stringify({ name, html, signatureHTML, id, imgData, compNo: companyId });
          postURL = `${SERVER_URL}/updateHTML`;
        }
        console.log(formData);
        const rawResponse = await fetch(postURL, {
          method: "POST",
          body: formData,
        });
        const content = await rawResponse.json();
        Swal.fire({
          // position: "top-end",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
      })();
    }, 1000);
  });

  // function html2Canvas

  function droppableDrop() {
    $("#drop").droppable({
      // accept: function (item) {
      // 	return $(this).data('color') == item.data('color');
      // },
      classes: {
        "ui-droppable-hover": "ui-state-hover",
      },
      bubbles: false,
      greedy: true,
      tolerance: "pointer",
      drop: function (event, ui) {
        console.log("I am i #drop");
        var $canvas = $(this);
        if (!ui.draggable.hasClass("canvas-element")) {
          var $canvasElement = ui.draggable.clone();
          $canvasElement.addClass("canvas-element");

          let draggedItem = $canvasElement;
          draggedItem = initDraggedItem(draggedItem);

          // Mouse events
          // addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));
          // // Dropaable

          // addDropEvent($canvasElement.find(".ns"), true);
          // addDropEvent($canvasElement.find(".we"), true);

          // Draggable
          // $canvasElement.draggable({
          // 	containment: '#container',
          // 	cursor: 'move',
          // 	start: function (event, ui) {
          // 		$(this).draggable('instance').offset.click = {
          // 			left: 0,
          // 			top: 0,
          // 		};
          // 	},
          // });

          $canvas.append(draggedItem);
          // $canvas.droppable("disable");
          $("#drop").droppable("destroy");
          // $canvas.droppable("option", "disabled", true);
          // $canvas.css({ "min-width": "0px" });
          $canvasElement.css({
            my: "center",
            at: "center",
            of: $canvas,
            using: function (pos) {
              $canvas.animate(pos, 200, "linear");
            },
          });
          converToTableFunc();
        }
      },
    });
  }

  setTimeout(function () {
    // addMouseEvents();

    // $("#convertToTable").on("click", function () {
    //   converToTableFunc();
    // });

    $(".drag").draggable({
      cancel: false,
      helper: function (e) {
        return $(this).clone();
      },
      cursor: "move",
      start: function (event, ui) {
        $(this).draggable("instance").offset.click = {
          left: 0,
          top: 0,
        };
      },
    });
    $(".delDrop").droppable({
      bubbles: false,
      classes: {
        "ui-droppable-hover": "delDropHover",
      },
      greedy: false,
      tolerance: "pointer",
      drop: function (event, ui) {
        let canvas = $(this);

        let itemId = ui.draggable.attr("id");

        let canvasParent = ui.draggable.parent();
        $("#" + itemId).remove();

        const canvasParentTable = canvasParent.parent().closest("div.drag.vertical").parent();
        // console.log("canvasParentTable", canvasParentTable);
        // console.log("canvasParentTable.hasClass", canvasParentTable.hasClass("editor-td-div"));
        // console.log("canvasParent.children().length", canvasParent.children().length);

        if (canvasParent.children().length === 1 && canvasParent.hasClass("tableDrop")) {
          canvasParent.html("&nbsp;");
          addDropEvent(canvasParent);
        } else if (canvasParent.children().length === 1 && canvasParent.attr("id") !== "drop") {
          canvasParent.remove();
          if ($("#drop").children().length === 1) {
            droppableDrop();
            // $(".drop")
            //   .droppable({
            //     bubbles: false,
            //     greedy: true,
            //     tolerance: "pointer",
            //     drop: droppableDrop,
            //   })
            //   .droppable("enable");
          }
        } else if (canvasParent.children().length === 1 && canvasParentTable.hasClass("editor-td-div")) {
          canvasParent.parent().closest("div.drag.vertical").remove();
          canvasParentTable.html("&nbsp;");
          addDropEvent(canvasParent);
        }

        setTimeout(function () {
          converToTableFunc();
        }, 200);
      },
    });
    $("#drop").droppable({
      // accept: function (item) {
      // 	return $(this).data('color') == item.data('color');
      // },
      classes: {
        "ui-droppable-hover": "ui-state-hover",
      },
      bubbles: false,
      greedy: true,
      tolerance: "pointer",
      drop: function (event, ui) {
        // console.log("I am i #drop");
        var $canvas = $(this);
        if (!ui.draggable.hasClass("canvas-element")) {
          var $canvasElement = ui.draggable.clone();
          $canvasElement.addClass("canvas-element");

          let draggedItem = $canvasElement;
          draggedItem = initDraggedItem(draggedItem);

          // Mouse events
          // addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));
          // // Dropaable

          // addDropEvent($canvasElement.find(".ns"), true);
          // addDropEvent($canvasElement.find(".we"), true);

          // Draggable
          // $canvasElement.draggable({
          // 	containment: '#container',
          // 	cursor: 'move',
          // 	start: function (event, ui) {
          // 		$(this).draggable('instance').offset.click = {
          // 			left: 0,
          // 			top: 0,
          // 		};
          // 	},
          // });

          $canvas.append(draggedItem);
          // $canvas.droppable("disable");
          $("#drop").droppable("destroy");
          // $canvas.droppable("option", "disabled", true);
          // $canvas.css({ "min-width": "0px" });
          $canvasElement.css({
            my: "center",
            at: "center",
            of: $canvas,
            using: function (pos) {
              $canvas.animate(pos, 200, "linear");
            },
          });
          converToTableFunc();
        }
      },
    });
  }, 500);

  // function addDropEvent(el, greedy) {
  //   el.removeClass("ui-droppable");
  //   $(el).droppable({
  //     classes: {
  //       "ui-droppable-hover": "ui-mouse-enter",
  //     },
  //     bubbles: false,
  //     greedy: greedy,
  //     tolerance: "pointer",
  //     drop: function (event, ui) {
  //       console.log("I am in el");

  //       var $canvas = $(this);
  //       if (!ui.draggable.hasClass("canvas-element")) {
  //         var $canvasElement = ui.draggable.clone();

  //         let itemEdited = false;
  //         if ($canvasElement.attr("id")) {
  //           itemEdited = true;
  //         }
  //         // if (!$canvasElement.attr("id")) {
  //         $canvasElement.addClass("canvas-element");
  //         let draggedItem = $canvasElement;
  //         draggedItem = initDraggedItem(draggedItem);

  //         $canvasElement = draggedItem;
  //         // } else {
  //         //   // $canvasElement.addClass("canvas-element");
  //         //   let draggedItem = $canvasElement.find("");
  //         //   draggedItem = initDraggedItem(draggedItem);

  //         //   $canvasElement = draggedItem;
  //         //   console.log("$canvasElement", $canvasElement);
  //         // }
  //         // else {
  //         //   console.log($("#" + $canvasElement.attr("id")).parent());
  //         //   // Single child case only
  //         //   if (
  //         //     $("#" + $canvasElement.attr("id"))
  //         //       .parent()
  //         //       .children().length === 3
  //         //   ) {
  //         //     const childrenData = $("#" + $canvasElement.attr("id"))
  //         //       .parent()
  //         //       .children();
  //         //     // console.log("childrenData", childrenData);
  //         //     let childLeft;
  //         //     $.each(childrenData, function (key, value) {
  //         //       console.log("childrenData", $(this));
  //         //       if ($(this).attr("id") !== $canvasElement.attr("id")) {
  //         //         childLeft = $(this);
  //         //       }
  //         //     });

  //         //     // childLeft = addMissingNorthSouth(childLeft);
  //         //     // childLeft = addMissingEastWest(childLeft);

  //         //     if (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3")) {
  //         //       childLeft = compareAddRemNSEW(childLeft.parent(), childLeft);
  //         //       const parentId = childLeft.parent().closest("div.drag.vertical").replaceWith(childLeft);
  //         //     }
  //         //     // $("div.second").replaceWith("<h2>New heading</h2>");

  //         //     console.log("childLeft", childLeft);
  //         //   }
  //         //   // Mouse events
  //         //   addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));

  //         //   //Drop events
  //         //   addDropEvent($canvasElement.find(".ns"), true);
  //         //   addDropEvent($canvasElement.find(".we"), true);
  //         //   addMouseOverEvents($canvasElement.find(".data"));
  //         //   addModalClick($canvasElement.find(".data"));
  //         //   $("#" + $canvasElement.attr("id")).remove();
  //         // }

  //         // Mouse events
  //         // addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));

  //         // //Drop events
  //         // addDropEvent($canvasElement.find(".ns"), true);
  //         // addDropEvent($canvasElement.find(".we"), true);

  //         // Draggable
  //         // $canvasElement.draggable({
  //         // 	containment: '#container',
  //         // 	cursor: 'move',
  //         // 	start: function (event, ui) {
  //         // 		$(this).draggable('instance').offset.click = {
  //         // 			left: 0,
  //         // 			top: 0,
  //         // 		};
  //         // 	},
  //         // });

  //         // console.log("Canvas: ", $canvas);
  //         // console.log("Parent: ", $canvas.closest("div.drag.vertical"));
  //         // console.log("east: ", $canvas.hasClass("east"));
  //         // console.log("west: ", $canvas.hasClass("west"));
  //         // console.log("len: ", $canvas.closest("div.data2").length);

  //         if ($canvas.hasClass("east") || $canvas.hasClass("west")) {
  //           let data2Parent = $canvas.closest("div.data2");
  //           // console.log("data2Parent+++", data2Parent);
  //           let existingItemParent = $canvas.closest("div.drag.vertical").parent();

  //           console.log("existingItemParent", existingItemParent);
  //           if (existingItemParent.hasClass("data2")) {
  //             let existingItem = $canvas.closest("div.drag.vertical");
  //             // Change from table row to table cell
  //             if ($canvasElement.hasClass("ph-table-row")) {
  //               $canvasElement.removeClass("ph-table-row");
  //               $canvasElement.addClass("ph-table-cell");
  //             }
  //             if ($canvas.hasClass("east")) {
  //               existingItem.after($canvasElement);
  //               $canvas.remove();
  //             } else if ($canvas.hasClass("west")) {
  //               existingItem.before($canvasElement);
  //               $canvas.remove();
  //             }
  //           }

  //           // If new container
  //           else if (existingItemParent.hasClass("data3") || existingItemParent.attr("id") == "drop") {
  //             let existingItem = $canvas.closest("div.drag.vertical");
  //             let newItem = $canvasElement;

  //             // Change from table row to table cell
  //             if (existingItem.hasClass("ph-table-row")) {
  //               existingItem.removeClass("ph-table-row");
  //               existingItem.addClass("ph-table-cell");
  //             }
  //             if (newItem.hasClass("ph-table-row")) {
  //               newItem.removeClass("ph-table-row");
  //               newItem.addClass("ph-table-cell");
  //             }

  //             let container = getNewContainerWE();

  //             let existingItemNorth = existingItem.find("div.noso:first > div > div.north");
  //             let existingItemSouth = existingItem.find("div.noso:first > div > div.south");
  //             // console.log("existingItem", existingItem);

  //             console.log("Edited", itemEdited);
  //             console.log("Parent item count", existingItem.parent().children().length);

  //             if (!itemEdited) {
  //               if (existingItemNorth.length && !existingItemSouth.length) {
  //                 container.find("div.south").parent().remove();
  //               } else if (existingItemSouth.length && !existingItemNorth.length) {
  //                 container.find("div.north").parent().remove();
  //               }
  //             }

  //             existingItem = addMissingNorthSouth(existingItem);
  //             if ($canvas.hasClass("east")) {
  //               existingItem.after(container);
  //               container.find("div.data2").append(existingItem);
  //               container.find("div.data2:first").append(newItem);
  //               $canvas.remove();
  //             } else if ($canvas.hasClass("west")) {
  //               existingItem.before(container);
  //               container.find("div.data2").append(newItem);
  //               container.find("div.data2").append(existingItem);
  //               $canvas.remove();
  //             }
  //           }
  //         } else if ($canvas.hasClass("north") || $canvas.hasClass("south")) {
  //           // console.log("Canvas: ", $canvas);
  //           // console.log("Parent: ", $canvas.closest("div.drag.vertical"));
  //           // console.log("north: ", $canvas.hasClass("north"));
  //           // console.log("south: ", $canvas.hasClass("south"));

  //           let canvasParent = $canvas.closest("div.drag.vertical").parent();
  //           let existingItem = $canvas.closest("div.drag.vertical");
  //           // console.log("canvasParent: ", canvasParent);
  //           // console.log("existingItem: ", existingItem);
  //           // console.log(" $canvas: ", $canvas);

  //           if (canvasParent.hasClass("data2")) {
  //             let container = getNewContainerNS();

  //             // console.log("New Container NS", container);
  //             // console.log("canvasParent -> Parent", canvasParent);

  //             let existingItem = $canvas.closest("div.drag.vertical");
  //             let newItem = $canvasElement;

  //             // Change from table cell to table row
  //             if (existingItem.hasClass("ph-table-cell")) {
  //               existingItem.removeClass("ph-table-cell");
  //               existingItem.addClass("ph-table-row");
  //             }
  //             if (newItem.hasClass("ph-table-cell")) {
  //               newItem.removeClass("ph-table-cell");
  //               newItem.addClass("ph-table-row");
  //             }

  //             let existingItemEast = existingItem.find("div.eowo:first > div.east");
  //             let existingItemWest = existingItem.find("div.eowo:first > div.west");
  //             if (!itemEdited) {
  //               if (existingItemEast.length && !existingItemWest.length) {
  //                 container.find("div.west").remove();
  //               } else if (existingItemWest.length && !existingItemEast.length) {
  //                 container.find("div.east").remove();
  //               }
  //             }

  //             if ($canvas.hasClass("north")) {
  //               existingItem = addMissingEastWest(existingItem);
  //               existingItem.before(container);
  //               container.find("div.data3").append(newItem);
  //               container.find("div.data3").append(existingItem);
  //               $canvas.parent().remove();
  //             } else if ($canvas.hasClass("south")) {
  //               existingItem = addMissingEastWest(existingItem);
  //               existingItem.after(container);
  //               container.find("div.data3").append(existingItem);
  //               container.find("div.data3:first").append(newItem);
  //               $canvas.parent().remove();
  //             }
  //           } else if (canvasParent.hasClass("data3")) {
  //             if ($canvas.hasClass("north")) {
  //               $canvas.closest("div.drag.vertical").before($canvasElement);
  //               $canvas.parent().remove();
  //             } else if ($canvas.hasClass("south")) {
  //               $canvas.closest("div.drag.vertical").after($canvasElement);
  //               $canvas.parent().remove();
  //             }
  //           } else if (canvasParent.attr("id") == "drop") {
  //             if ($canvas.hasClass("north")) {
  //               $canvas.closest("div.drag.vertical").before($canvasElement);
  //               $canvas.parent().remove();
  //             } else if ($canvas.hasClass("south")) {
  //               $canvas.closest("div.drag.vertical").after($canvasElement);
  //               $canvas.parent().remove();
  //             }
  //           }
  //         } else if ($canvas.hasClass("tableDrop")) {
  //           console.log($canvas);
  //           $canvas.html("");
  //           $canvas.append(draggedItem);
  //           $canvas.droppable("destroy");
  //           // $canvas.droppable("disable");
  //         }

  //         // $canvas.remove();
  //         // $canvas.append($canvasElement);
  //         $canvasElement?.css({
  //           my: "center",
  //           at: "center",
  //           of: $canvas,
  //           using: function (pos) {
  //             $canvas.animate(pos, 200, "linear");
  //           },
  //         });
  //         setTimeout(function () {
  //           converToTableFunc();
  //         }, 1000);
  //         // converToTableFunc();
  //       }
  //     },
  //   });
  // }

  // function compareAddRemNSEW(elem1, elem2) {
  //   let existingItemNorth = elem1.find("div.noso:first > div > div.north");
  //   let existingItemSouth = elem1.find("div.noso:first > div > div.south");
  //   // console.log("existingItem", existingItem);

  //   // console.log("existingItemNorth", existingItemNorth);
  //   // console.log("existingItemSouth", existingItemSouth);
  //   if (existingItemNorth.length && !existingItemSouth.length) {
  //     elem2.find("div.south").parent().remove();
  //   } else if (existingItemSouth.length && !existingItemNorth.length) {
  //     elem2.find("div.north").parent().remove();
  //   }

  //   return elem2;
  // }

  function removeItemWithParent(itemId) {
    let childLeft = $("#" + itemId);
    let siblings = childLeft.parent().children();

    // console.log("siblings", siblings.length);
    // If siblings are 3 then it means there will be only 1 item left in group 2 or group 3.
    if (siblings.length === 3 && (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3"))) {
      // If first item is the one which is left out
      // then replace the data of left out item with data of the group2 or group3
      // Remove group2 or group3 class
      // Add dataItem class so it show ups in preview

      // console.log("itemId", itemId);
      let index = 0;
      $.each(siblings, function (i, item) {
        if (siblings.eq(0).attr("id") !== itemId) {
          index = i;
        }
      });

      // if (siblings.eq(0).attr("id") !== itemId) {
      // console.log("hrer1");
      childLeft.parent().closest("div.drag.vertical").removeClass("group2");
      childLeft.parent().closest("div.drag.vertical").removeClass("group3");
      childLeft.parent().closest("div.drag.vertical").addClass("dataItem");
      childLeft.parent().replaceWith(siblings.eq(index).find(".data:first"));
      // } else if (siblings.eq(2).attr("id") !== itemId) {
      //   console.log("hrer2");
      //   childLeft.parent().closest("div.drag.vertical").removeClass("group2");
      //   childLeft.parent().closest("div.drag.vertical").removeClass("group3");
      //   childLeft.parent().closest("div.drag.vertical").addClass("dataItem");
      //   childLeft.parent().replaceWith(siblings.eq(2).find(".data:first"));
      // }
    } else if (siblings.length === 2 && (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3"))) {
      childLeft.parent().closest("div.drag.vertical").remove();
    } else {
      childLeft.remove();
    }
  }

  // function removeExitingItem(itemId) {
  //   // console.log();

  //   let oldItem = $(`#${itemId}`);
  //   let siblings = oldItem.parent().children();

  //   if (siblings.length === 2 && (oldItem.parent().hasClass("data2") || oldItem.parent().hasClass("data3"))) {
  //     oldItem.parent().closest("div.drag.vertical").remove();
  //   } else {
  //     oldItem.remove();
  //   }
  // }

  // function initDraggedItem(draggedItem) {
  //   let container = getNewContainer();
  //   container.draggable({
  //     cancel: false,
  //     helper: function (e) {
  //       return $(this).clone();
  //     },
  //     cursor: "move",
  //     start: function (event, ui) {
  //       $(this).draggable("instance").offset.click = {
  //         left: 0,
  //         top: 0,
  //       };
  //     },
  //   });

  //   // If existing item is dragged for editing then do belwo tasks

  //   if (draggedItem.attr("id")) {
  //     // removeItemWithParent(draggedItem.attr("id"));
  //     removeExitingItem(draggedItem.attr("id"));
  //     container.attr("id", draggedItem.attr("id"));
  //     container.find(".data").replaceWith(draggedItem.find(".data"));
  //     return container;
  //   }

  //   let UUID = `item-${Date.now()}`;
  //   container.attr("id", "container-" + UUID);
  //   let dataDiv = container.find(".data");

  //   if (draggedItem.attr("item") && itemIds.hasOwnProperty(draggedItem.attr("item"))) {
  //     let item = $(itemIds[draggedItem.attr("item")]);
  //     // addModalClick(item);
  //     if (draggedItem.attr("item") === "btnTable") {
  //       let tds = item.find("div.editor-td-div");
  //       tds.each(function (index) {
  //         let UUID2 = `item-${Date.now() + index}`;
  //         $(this).attr("id", "editorTD-" + UUID2);
  //         addDropEvent($(this), true);
  //         addModalClick($(this));
  //         addMouseOverEvents($(this));
  //       });
  //     } else {
  //       item.attr("id", UUID);
  //     }
  //     if (draggedItem.attr("item") === "btnIcon") {
  //       item.attr("src", draggedItem.attr("src"));
  //     }
  //     dataDiv.append(item);
  //     // addModalClick(draggedItem);
  //     return container;
  //   } else if (draggedItem.attr("category") === "image" || draggedItem.attr("category") === "textField") {
  //     // console.log(draggedItem);
  //     let item = draggedItem;
  //     item.attr("id", UUID);
  //     dataDiv.append(item);
  //     return container;
  //   }

  //   // dataDiv.append(draggedItem);
  //   // return container;
  // }

  // function getNewContainer() {
  //   let containerHTML = `<div class="drag vertical ph-table-row dataItem">
  //         <div class="ph-table">
  //           <div class="ph-table-row eowo">
  //             <div class="ph-table-cell west drop we s"></div>
  //             <div class="ph-table-cell">
  //               <div class="ph-table noso">
  //                 <div class="ph-table-row">
  //                   <div class="ph-table-cell north ns drop s"></div>
  //                 </div>
  //                 <div class="ph-table-row">
  //                   <div class="ph-table-cell data"></div>
  //                 </div>
  //                 <div class="ph-table-row">
  //                   <div class="ph-table-cell south ns drop s"></div>
  //                 </div>
  //               </div>
  //             </div>
  //             <div class="ph-table-cell east drop we s"></div>
  //           </div>
  //         </div>
  //       </div>`;

  //   let container = $(containerHTML);

  //   // Mouse events
  //   // addMouseEvents(container.find(".ns"), container.find(".we"));

  //   //Drop events
  //   addDropEvent(container.find(".ns"), true);
  //   addDropEvent(container.find(".we"), true);
  //   addMouseOverEvents(container.find(".data"));
  //   addModalClick(container.find(".data"));

  //   return container;
  // }

  // function addMissingNorthSouth(existingItem) {
  //   let divnoso = existingItem.find("div.noso:first");
  //   let firstChild = existingItem.find("div.noso:first > div > div.north");
  //   let lastChild = existingItem.find("div.noso:first > div > div.south");
  //   // let existingItemNorth = existingItem.find("div.noso:first > div > div.north");
  //   // let existingItemSouth = existingItem.find("div.noso:first > div > div.south");
  //   // console.log(lastChild);
  //   if (!lastChild.length) {
  //     let n = $(`<div class="ph-table-row">
  // 												<div class="ph-table-cell south ns drop s"></div>
  // 												</div>`);
  //     divnoso.append(n);
  //     //Drop events
  //     addDropEvent(n.find("div"), true);
  //     // addMouseEvents(n.find("div"), null);
  //     return existingItem;
  //   } else if (!firstChild.length) {
  //     let n = $(`<div class="ph-table-row">
  // 												<div class="ph-table-cell north ns drop s"></div>
  // 												</div>`);
  //     divnoso.prepend(n);
  //     //Drop events
  //     addDropEvent(n.find("div"), true);
  //     // addMouseEvents(n.find("div"), null);
  //     return existingItem;
  //   } else {
  //     return existingItem;
  //   }
  // }

  // function addMissingEastWest(existingItem) {
  //   let diveowo = existingItem.find("div.eowo:first");
  //   let firstChild = diveowo.children().first();
  //   let lastChild = diveowo.children().last();
  //   // console.log("existingItem++", existingItem);
  //   // console.log("diveowo++", diveowo);
  //   // console.log("firstChild", firstChild);
  //   // console.log("lastChild", lastChild);
  //   // console.log("firstChild", firstChild.hasClass("west"));
  //   // console.log("lastChild", lastChild.hasClass("east"));
  //   if (!firstChild.hasClass("west")) {
  //     let n = $(`<div class="ph-table-cell west drop we s"></div>`);
  //     //Drop events
  //     addDropEvent(n, true);
  //     // addMouseEvents(null, n);

  //     diveowo.prepend(n);
  //     return existingItem;
  //   } else if (!lastChild.hasClass("east")) {
  //     let n = $(`<div class="ph-table-cell east drop we s"></div>`);
  //     //Drop events
  //     addDropEvent(n, true);
  //     // addMouseEvents(null, n);

  //     diveowo.append(n);
  //     return existingItem;
  //   } else {
  //     return existingItem;
  //   }
  // }

  // function getNewContainerNS() {
  //   let containerHTML = `<div class="drag vertical ph-table-cell group3">
  // 							<div class="ph-table">
  // 								<div class="ph-table-row eowo">
  // 									<div class="ph-table-cell west drop we s"></div>
  // 									<div class="ph-table-cell">
  // 										<div class="ph-table noso">
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell north ns drop s"></div>
  // 											</div>
  // 											<div class="ph-table-row">
  // 												<div class="data3" category="group">

  // 												</div>
  // 											</div>
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell south ns drop s"></div>
  // 											</div>
  // 										</div>
  // 									</div>
  // 									<div class="ph-table-cell east drop we s"></div>
  // 								</div>
  // 							</div>
  // 						</div>`;

  //   let container = $(containerHTML);

  //   // Mouse events
  //   // addMouseEvents(container.find(".ns"), container.find(".we"));

  //   //Drop events
  //   addDropEvent(container.find(".ns"), true);
  //   addDropEvent(container.find(".we"), true);
  //   addMouseOverEvents(container.find(".data3"));
  //   addModalClick(container.find(".data3"));
  //   container.draggable({
  //     cancel: false,
  //     helper: function (e) {
  //       return $(this).clone();
  //     },
  //     cursor: "move",
  //     start: function (event, ui) {
  //       $(this).draggable("instance").offset.click = {
  //         left: 0,
  //         top: 0,
  //       };
  //     },
  //   });
  //   let UUID = `item-${Date.now()}`;
  //   container.attr("id", "container-" + UUID);
  //   return container;
  // }

  // function getNewContainerWE() {
  //   let containerHTML = `<div class="drag vertical ph-table-row group2">
  // 							<div class="ph-table">
  // 								<div class="ph-table-row eowo">
  // 									<div class="ph-table-cell west drop we s"></div>
  // 									<div class="ph-table-cell">
  // 										<div class="ph-table noso">
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell north ns drop s"></div>
  // 											</div>
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell">
  // 													<div class="data2" category="group">

  // 													</div>
  // 												</div>
  // 											</div>
  // 											<div class="ph-table-row">
  // 												<div class="ph-table-cell south ns drop s"></div>
  // 											</div>
  // 										</div>
  // 									</div>
  // 									<div class="ph-table-cell east drop we s"></div>
  // 								</div>
  // 							</div>
  // 						</div>`;

  //   let container = $(containerHTML);

  //   // Mouse events
  //   // addMouseEvents(container.find(".ns"), container.find(".we"));

  //   //Drop events
  //   addDropEvent(container.find(".ns"), true);
  //   addDropEvent(container.find(".we"), true);
  //   addMouseOverEvents(container.find(".data2"));
  //   addModalClick(container.find(".data2"));
  //   container.draggable({
  //     cancel: false,
  //     helper: function (e) {
  //       return $(this).clone();
  //     },
  //     cursor: "move",
  //     start: function (event, ui) {
  //       $(this).draggable("instance").offset.click = {
  //         left: 0,
  //         top: 0,
  //       };
  //     },
  //   });
  //   let UUID = `item-${Date.now()}`;
  //   container.attr("id", "container-" + UUID);
  //   return container;
  // }

  // Table functions
});

// function getSubItemsForgroup2(item) {
//   let group = $(item).find(".data2:first").children();
//   let tbody = $("<tbody>");
//   let table = $("<table>");
//   let tr = $("<tr>");
//   console.log(group);
//   $.each(group, function (index, value) {
//     let td = $("<td>");
//     console.log($(this));
//     if ($(this).hasClass("dataItem")) {
//       let dataItem = $(this).find(".data").children().eq(0).clone();
//       let vAlign = $(this).find(".data").css("vertical-align");
//       if (vAlign) {
//         td.css("vertical-align", vAlign);
//       }
//       td.append(dataItem);
//     } else if ($(this).hasClass("group2")) {
//       let table = getSubItemsForgroup2($(this));
//       td.append(table);
//     } else if ($(this).hasClass("group3")) {
//       let table = getSubItemsForgroup3($(this));
//       td.append(table);
//     }
//     tr.append(td);
//   });
//   tbody.append(tr);
//   table.append(tbody);
//   return table;
// }

// function getSubItemsForgroup3(item) {
//   let group = $(item).find(".data3:first").children();
//   let tbody = $("<tbody>");
//   let table = $("<table>");
//   console.log(group);
//   $.each(group, function (index, value) {
//     let tr = $("<tr>");
//     let td = $("<td>");
//     console.log($(this));
//     if ($(this).hasClass("dataItem")) {
//       let dataItem = $(this).find(".data").children().eq(0).clone();
//       let vAlign = $(this).find(".data").css("vertical-align");
//       if (vAlign) {
//         td.css("vertical-align", vAlign);
//       }
//       td.append(dataItem);
//     } else if ($(this).hasClass("group2")) {
//       let table = getSubItemsForgroup2($(this));
//       td.append(table);
//     } else if ($(this).hasClass("group3")) {
//       let table = getSubItemsForgroup3($(this));
//       td.append(table);
//     }
//     tr.append(td);
//     tbody.append(tr);
//   });
//   table.append(tbody);
//   return table;
// }

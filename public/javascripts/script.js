$(document).ready(function () {
  let url_string = window.location.href; //window.location.href
  let url = new URL(url_string);
  let companyId = url.searchParams.get("companyId");
  let close = false;
  $("#backIndexBtn").click(function (e) {
    if (edited) {
      $("#closeModel").modal("show");
    } else {
      window.location.href = `index.html?companyId=${companyId}`;
    }
  });

  $("#closeModelDSave").click(function (e) {
    window.location.href = `index.html?companyId=${companyId}`;
  });

  $("#closeModelSave").click(function (e) {
    $("#closeModel").modal("hide");
    $("#saveSignature").click();
    close = true;
  });
  /**
   * Sample
   * ["labelIcon", "imageSource", "hyperlink", "text",
   * "background", "visibility", "alignment", "border",
   * "padding", "size", "render", "orientation", "socialMediaIcon"]
   */

  // Preview Drag

  let handle = document.getElementById("previewdrag");
  let right = document.querySelector(".panelPreview");
  let container = document.querySelector("body");

  let isResizing = false;

  handle.onmousedown = function (e) {
    isResizing = true;
  };

  document.onmousemove = function (e) {
    // we don't want to do anything if we aren't resizing.
    if (!isResizing) {
      return;
    }

    var offsetRight = container.clientWidth - (e.clientX - container.offsetLeft);

    // left.style.right = offsetRight + "px";
    right.style.width = offsetRight + "px";
  };

  document.onmouseup = function (e) {
    // stop resizing
    isResizing = false;
  };

  // End --- Preview Drag

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
    const customFieldsRawResponse = await fetch(`${SERVER_URL}/getCustomFields`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const customFields = await customFieldsRawResponse.json();

    let customTab = {};

    for (let item of customFields.recordsets[0]) {
      if (!customTab[item.G_DSC]) {
        customTab[item.G_DSC] = {
          TabName: item.G_DSC,
          TabFields: [],
        };
        customTab[item.G_DSC].TabFields.push({
          Name: item.K_ALIAS,
          Value: item.K_ALIAS,
          Type: "text",
        });
      } else {
        customTab[item.G_DSC].TabFields.push({
          Name: item.K_ALIAS,
          Value: item.K_ALIAS,
          Type: "text",
        });
      }
    }
    // let allFieldsCustom = [];

    Object.keys(customTab).forEach((key) => {
      customTab[key].TabFields.forEach((field) => {
        allFieldsCustom.push(field.Name);
      });
    });
    createAllFieldsForModal();

    setTimeout(function () {
      appendNewTabs(customTab);
    }, 100);

    // GeneralTab: {
    //   TabName: "General Tab",
    //   TabFields: [
    //     {
    //       Name: "Friendly Name",
    //       Value: "Noaman",
    //       Type: "text",
    //     },

    let url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id");
    if (id && id.length > 0) {
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
        addMouseOverEvents(HTMLObj.find(".data2"));
        addMouseOverEvents(HTMLObj.find(".data3"));

        $("#drop").droppable("destroy");
        // $("#drop").droppable("option", "disabled", true);

        HTMLObj.find("img").each(function () {
          if ($(this).attr("hyperlink") && $(this).parent().is("a")) {
            // const aTag = $(`<a href="${newValue}" id=atag_${id} target="_blank" style="text-decoration:none;">`);
            // $(`#${id}`).parent().append(aTag);
            const mainParent = $(this).parent().parent();
            $(this).detach().appendTo(mainParent);
            // const aTag = $(
            //   `<a href="${item.attr("hyperlink")}" id=atag_${item.attr("id")} target="_blank" style="text-decoration:none;">`
            // );
            // aTag.append(item);
            // return aTag;
          }
        });
        $("#drop").append(HTMLObj);

        if ($("#drop #customeFontDiv").length === 0) {
          $("#drop").append($('<div id="customeFontDiv" style="display: none"></div>'));
        } else if ($("#drop #customeFontDiv").length && $("#drop #customeFontDiv").children.length > 0) {
          // Append custom fonts if any
          const customFontDiv = Array.from(document.querySelector("#customeFontDiv").children);
          customFontDiv.forEach(async function (child) {
            const fontName = child.dataset.fontName;
            const fontId = child.id;
            let font = new FontFace(fontName, `url(${child.dataset.fontUrl}) format("woff2")`);
            await new Promise((resolve, reject) => {
              font
                .load()
                .then(function (loadedFont) {
                  document.fonts.add(loadedFont);

                  // Add to array
                  customeFontsArray.push(fontName);

                  // Prepend font to the font list
                  const fontList = document.querySelector("#text-fontFamily");
                  fontList.insertBefore(
                    $(`<option class="${fontId}" value="${fontName}">${fontName}</option>`)[0],
                    fontList.children[1]
                  );

                  // Append font to font list for deleteing
                  const fontDeleteList = document.querySelector("ul.customFontListShow");
                  fontDeleteList.append(
                    $(
                      `<li class="list-group-item ${fontId}"> ${fontName} <button class="btn btn-danger removeFontButton" type="button" data-font-id="${fontId}" style="float: right">Remove</button> </li>`
                    )[0]
                  );
                  $(".removeFontButton").off();
                  $("button.removeFontButton").click(function (e) {
                    const fontId = e.target.dataset.fontId;
                    // $(`#drop #customeFontDiv #${fontId}`).remove();
                    $(`.${fontId}`).remove();
                  });
                  resolve();
                })
                .catch(function (error) {
                  console.error("Error loading fonts", error);
                  reject();
                });
            });
          });
        }

        // Make all containers draggable
        setTimeout(function () {
          $(".drag.vertical").draggable({
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
        }, 50);
      }, 500);
    } else {
      $("#drop").append($('<div id="customeFontDiv" style="display: none"></div>'));
    }
    function getloginuser() {
      $.get(`${SERVER_URL}/loginuser?companyId=${companyId}`, function (data) {
        $("#searchEmail").prop("placeholder", data.E_Mail);
        userData = data;
        document.getElementById("searchDropdownButton").innerText = userData.E_Mail || userData.U_EMAIL;
        converToTableFunc();
      }).fail(function (error) {
        console.error("Error:", error);
        converToTableFunc();
      });
      Swal.close();
    }
    setTimeout(getloginuser, 500);
    $("#searchDropdownButton").on("click", function () {
      getloginuser();
    });

    // warn before closing if any inputs are modified
    addEventListener("beforeunload", (evt) => {
      if (edited) {
        const unsaved_changes_warning = "Changes you made may not be saved.";
        evt.returnValue = unsaved_changes_warning;
        return unsaved_changes_warning;
      }
    });
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
    applyRegexReplacementToTable($(".panelPreview2 > table.mainTable"), userData);
    $("#previewModel").modal("show");
    let name = $("#signatureName").val();
    console.log("name1", name.length);
    if (name) {
      saveHTMLToDB();
    } else {
      $("#nameModel").modal("show");
    }
  });

  $("#nameModelSave").click(function (e) {
    let sigName = $("#nameModelInput").val();
    let name = $("#signatureName").val();
    console.log("sigName", !sigName);
    console.log("name2", name.length);
    if (!sigName) {
      $("#nameEmptyError").show();
      setTimeout(function () {
        $("#nameEmptyError").hide();
      }, 3000);
      return;
    } else {
      saveHTMLToDB();
    }
  });

  function saveHTMLToDB() {
    let sigName = $("#nameModelInput").val();
    let name = $("#signatureName").val();
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
    setTimeout(function () {
      // console.log($("div.panelPreview2")[0]);
      const options = {
        // y: 0,
        // x: 0,
        // scrollY: 0,
        // scrollX: 0,
      };
      (async () => {
        // // Append the custom fonts
        // $("#drop").append($("#customeFontDiv"));
        applyRegexReplacementToTable($(".panelPreview2 > table.mainTable"), userData);
        let canvas,
          signatureHTML = $(".panelPreview2").html(),
          html = $("#drop").html(),
          imgData = "";
        try {
          /**
           * image style
           *
           * $("table").css("width", "");
           * canvas = await html2canvas($("div.panelPreview2 > table.mainTable > tbody")[0], options);
           *
           */
          canvas = await html2canvas($("div.panelPreview2 > table.mainTable")[0], options);

          if (canvas) {
            imgData = canvas.toDataURL("image/jpeg");
          }
          let img = $("img#previewImgElem");
          img.attr("src", imgData);
          // document.body.append(canvas);

          // SignatureData
          let name = $("#signatureName").val();
          // let body = JSON.stringify({ name, html, signatureHTML, imgData, compNo: companyId });
          let formData = new FormData();
          formData.append("name", sigName ? sigName : name);
          formData.append("html", html);
          formData.append("signatureHTML", signatureHTML);
          formData.append("imgData", imgData);
          formData.append("compNo", companyId);

          let postURL = `${SERVER_URL}/saveHTML`;
          let template = url.searchParams.get("template");

          if (id && id.length > 0 && template !== "1") {
            formData.append("id", id);
            // body = JSON.stringify({ name, html, signatureHTML, id, imgData, compNo: companyId });
            postURL = `${SERVER_URL}/updateHTML`;
          }
          const rawResponse = await fetch(postURL, {
            method: "POST",
            body: formData,
          });
          // console.log("rawResponse", rawResponse);
          const content = await rawResponse.json();
          Swal.fire({
            // position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500,
          });
          edited = false;
          if (close) {
            window.location.href = `index.html?companyId=${companyId}`;
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }, 1000);
  }

  // function html2Canvas

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
        edited = true;
        if (ui.draggable.closest(".tableDrop").length > 0) {
          ui.draggable.parent().droppable({
            classes: {
              "ui-droppable-hover": "ui-mouse-enter",
            },
          });
          ui.draggable.parent().html(" &nbsp; ");
        }

        const item = ui.draggable;

        removeAnyElement(item);
      },
    });
    $("#drop").droppable({
      classes: {
        "ui-droppable-hover": "ui-state-hover",
      },
      bubbles: false,
      greedy: true,
      tolerance: "pointer",
      drop: function (event, ui) {
        edited = true;
        // console.log("I am i #drop");
        var $canvas = $(this);
        if (!ui.draggable.hasClass("canvas-element")) {
          var $canvasElement = ui.draggable.clone();
          $canvasElement.addClass("canvas-element");

          let draggedItem = $canvasElement;
          draggedItem = initDraggedItem(draggedItem);

          $canvas.append(draggedItem);
          // $canvas.droppable("disable");
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
        } else {
          // Handle deletion of element inside #drop
          removeAnyElement(ui.draggable);
          converToTableFunc();
        }
      },
    });
  }, 500);

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

      childLeft.parent().closest("div.drag.vertical").removeClass("group2");
      childLeft.parent().closest("div.drag.vertical").removeClass("group3");
      childLeft.parent().closest("div.drag.vertical").addClass("dataItem");
      childLeft.parent().replaceWith(siblings.eq(index).find(".data:first"));
    } else if (siblings.length === 2 && (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3"))) {
      childLeft.parent().closest("div.drag.vertical").remove();
    } else {
      childLeft.remove();
    }
  }
  $("#arrowIcon").click(function () {
    $(".panelPreview").toggleClass("expanded");
    let paneldiv = document.querySelector(".panelPreview.expanded");
    let paneldiv1 = document.querySelector(".panelPreview");

    if (paneldiv) {
      paneldiv.style.width = "fit-content";
      $("#arrowIcon i").css("transform", "rotate(180deg)");
    } else {
      paneldiv1.style.width = "350px";
      $("#arrowIcon i").css("transform", "rotate(0deg)");
    }
  });
});

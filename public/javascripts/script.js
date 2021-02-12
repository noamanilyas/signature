$(document).ready(function () {
  /**
   * Sample
   * ["labelIcon", "imageSource", "hyperlink", "text",
   * "background", "visibility", "alignment", "border",
   * "padding", "size", "render", "orientation", "socialMediaIcon"]
   */

  function droppableDrop(event, ui) {
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
      $canvas.droppable("disable");
      console.log($canvas);
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
        if (canvasParent.children().length === 1 && canvasParent.attr("id") !== "drop") {
          canvasParent.remove();
        }

        if ($("#drop").children().length === 1) {
          $(".drop")
            .droppable({
              bubbles: false,
              greedy: true,
              tolerance: "pointer",
              drop: droppableDrop,
            })
            .droppable("enable");
        }

        setTimeout(function () {
          converToTableFunc();
        }, 200);
      },
    });
    $(".drop").droppable({
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
          $canvas.droppable("disable");
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
  }, 1500);

  function addDropEvent(el, greedy) {
    $(el).droppable({
      classes: {
        "ui-droppable-hover": "ui-mouse-enter",
      },
      bubbles: false,
      greedy: greedy,
      tolerance: "pointer",
      drop: function (event, ui) {
        // console.log(ui);
        // console.log(event);
        var $canvas = $(this);
        if (!ui.draggable.hasClass("canvas-element")) {
          var $canvasElement = ui.draggable.clone();

          let itemEdited = false;
          if ($canvasElement.attr("id")) {
            itemEdited = true;
          }
          // if (!$canvasElement.attr("id")) {
          $canvasElement.addClass("canvas-element");
          let draggedItem = $canvasElement;
          draggedItem = initDraggedItem(draggedItem);

          $canvasElement = draggedItem;
          // } else {
          //   // $canvasElement.addClass("canvas-element");
          //   let draggedItem = $canvasElement.find("");
          //   draggedItem = initDraggedItem(draggedItem);

          //   $canvasElement = draggedItem;
          //   console.log("$canvasElement", $canvasElement);
          // }
          // else {
          //   console.log($("#" + $canvasElement.attr("id")).parent());
          //   // Single child case only
          //   if (
          //     $("#" + $canvasElement.attr("id"))
          //       .parent()
          //       .children().length === 3
          //   ) {
          //     const childrenData = $("#" + $canvasElement.attr("id"))
          //       .parent()
          //       .children();
          //     // console.log("childrenData", childrenData);
          //     let childLeft;
          //     $.each(childrenData, function (key, value) {
          //       console.log("childrenData", $(this));
          //       if ($(this).attr("id") !== $canvasElement.attr("id")) {
          //         childLeft = $(this);
          //       }
          //     });

          //     // childLeft = addMissingNorthSouth(childLeft);
          //     // childLeft = addMissingEastWest(childLeft);

          //     if (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3")) {
          //       childLeft = compareAddRemNSEW(childLeft.parent(), childLeft);
          //       const parentId = childLeft.parent().closest("div.drag.vertical").replaceWith(childLeft);
          //     }
          //     // $("div.second").replaceWith("<h2>New heading</h2>");

          //     console.log("childLeft", childLeft);
          //   }
          //   // Mouse events
          //   addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));

          //   //Drop events
          //   addDropEvent($canvasElement.find(".ns"), true);
          //   addDropEvent($canvasElement.find(".we"), true);
          //   addMouseOverEvents($canvasElement.find(".data"));
          //   addModalClick($canvasElement.find(".data"));
          //   $("#" + $canvasElement.attr("id")).remove();
          // }

          // Mouse events
          // addMouseEvents($canvasElement.find(".ns"), $canvasElement.find(".we"));

          // //Drop events
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

          // console.log("Canvas: ", $canvas);
          // console.log("Parent: ", $canvas.closest("div.drag.vertical"));
          // console.log("east: ", $canvas.hasClass("east"));
          // console.log("west: ", $canvas.hasClass("west"));
          // console.log("len: ", $canvas.closest("div.data2").length);

          if ($canvas.hasClass("east") || $canvas.hasClass("west")) {
            let data2Parent = $canvas.closest("div.data2");
            // console.log("data2Parent+++", data2Parent);
            let existingItemParent = $canvas.closest("div.drag.vertical").parent();

            // console.log("existingItemParent", existingItemParent);
            if (existingItemParent.hasClass("data2")) {
              let existingItem = $canvas.closest("div.drag.vertical");
              // Change from table row to table cell
              if ($canvasElement.hasClass("ph-table-row")) {
                $canvasElement.removeClass("ph-table-row");
                $canvasElement.addClass("ph-table-cell");
              }
              if ($canvas.hasClass("east")) {
                existingItem.after($canvasElement);
                $canvas.remove();
              } else if ($canvas.hasClass("west")) {
                existingItem.before($canvasElement);
                $canvas.remove();
              }
            }

            // If new container
            else if (existingItemParent.hasClass("data3") || existingItemParent.attr("id") == "drop") {
              let existingItem = $canvas.closest("div.drag.vertical");
              let newItem = $canvasElement;

              // Change from table row to table cell
              if (existingItem.hasClass("ph-table-row")) {
                existingItem.removeClass("ph-table-row");
                existingItem.addClass("ph-table-cell");
              }
              if (newItem.hasClass("ph-table-row")) {
                newItem.removeClass("ph-table-row");
                newItem.addClass("ph-table-cell");
              }

              let container = getNewContainerWE();

              let existingItemNorth = existingItem.find("div.noso:first > div > div.north");
              let existingItemSouth = existingItem.find("div.noso:first > div > div.south");
              // console.log("existingItem", existingItem);

              console.log("Edited", itemEdited);
              console.log("Parent item count", existingItem.parent().children().length);

              if (!itemEdited) {
                if (existingItemNorth.length && !existingItemSouth.length) {
                  container.find("div.south").parent().remove();
                } else if (existingItemSouth.length && !existingItemNorth.length) {
                  container.find("div.north").parent().remove();
                }
              }

              existingItem = addMissingNorthSouth(existingItem);
              if ($canvas.hasClass("east")) {
                existingItem.after(container);
                container.find("div.data2").append(existingItem);
                container.find("div.data2:first").append(newItem);
                $canvas.remove();
              } else if ($canvas.hasClass("west")) {
                existingItem.before(container);
                container.find("div.data2").append(newItem);
                container.find("div.data2").append(existingItem);
                $canvas.remove();
              }
            }
          } else if ($canvas.hasClass("north") || $canvas.hasClass("south")) {
            // console.log("Canvas: ", $canvas);
            // console.log("Parent: ", $canvas.closest("div.drag.vertical"));
            // console.log("north: ", $canvas.hasClass("north"));
            // console.log("south: ", $canvas.hasClass("south"));

            let canvasParent = $canvas.closest("div.drag.vertical").parent();
            let existingItem = $canvas.closest("div.drag.vertical");
            // console.log("canvasParent: ", canvasParent);
            // console.log("existingItem: ", existingItem);
            // console.log(" $canvas: ", $canvas);

            if (canvasParent.hasClass("data2")) {
              let container = getNewContainerNS();

              // console.log("New Container NS", container);
              // console.log("canvasParent -> Parent", canvasParent);

              let existingItem = $canvas.closest("div.drag.vertical");
              let newItem = $canvasElement;

              // Change from table cell to table row
              if (existingItem.hasClass("ph-table-cell")) {
                existingItem.removeClass("ph-table-cell");
                existingItem.addClass("ph-table-row");
              }
              if (newItem.hasClass("ph-table-cell")) {
                newItem.removeClass("ph-table-cell");
                newItem.addClass("ph-table-row");
              }

              let existingItemEast = existingItem.find("div.eowo:first > div.east");
              let existingItemWest = existingItem.find("div.eowo:first > div.west");
              if (!itemEdited) {
                if (existingItemEast.length && !existingItemWest.length) {
                  container.find("div.west").remove();
                } else if (existingItemWest.length && !existingItemEast.length) {
                  container.find("div.east").remove();
                }
              }

              if ($canvas.hasClass("north")) {
                existingItem = addMissingEastWest(existingItem);
                existingItem.before(container);
                container.find("div.data3").append(newItem);
                container.find("div.data3").append(existingItem);
                $canvas.parent().remove();
              } else if ($canvas.hasClass("south")) {
                existingItem = addMissingEastWest(existingItem);
                existingItem.after(container);
                container.find("div.data3").append(existingItem);
                container.find("div.data3:first").append(newItem);
                $canvas.parent().remove();
              }
            } else if (canvasParent.hasClass("data3")) {
              if ($canvas.hasClass("north")) {
                $canvas.closest("div.drag.vertical").before($canvasElement);
                $canvas.parent().remove();
              } else if ($canvas.hasClass("south")) {
                $canvas.closest("div.drag.vertical").after($canvasElement);
                $canvas.parent().remove();
              }
            } else if (canvasParent.attr("id") == "drop") {
              if ($canvas.hasClass("north")) {
                $canvas.closest("div.drag.vertical").before($canvasElement);
                $canvas.parent().remove();
              } else if ($canvas.hasClass("south")) {
                $canvas.closest("div.drag.vertical").after($canvasElement);
                $canvas.parent().remove();
              }
            }
          }

          // $canvas.remove();
          // $canvas.append($canvasElement);
          $canvasElement?.css({
            my: "center",
            at: "center",
            of: $canvas,
            using: function (pos) {
              $canvas.animate(pos, 200, "linear");
            },
          });
          setTimeout(function () {
            converToTableFunc();
          }, 1000);
          // converToTableFunc();
        }
      },
    });
  }

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

  function addModalClick(item) {
    $(item).click(function (e) {
      e.stopPropagation();
      renderModel(e);
    });
  }

  function removeItemWithParent(itemId) {
    let childLeft = $("#" + itemId);
    let siblings = childLeft.parent().children();
    // If siblings are 3 then it means there will be only 1 item left in group 2 or group 3.
    if (
      siblings.length === 3 &&
      (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3"))
    ) {
      // If first item is the one which is left out
      // then replace the data of left out item with data of the group2 or group3
      // Remove group2 or group3 class
      // Add dataItem class so it show ups in preview

      console.log("siblings", siblings);
      console.log("itemId", itemId);
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
    } else if (
      siblings.length === 2 &&
      (childLeft.parent().hasClass("data2") || childLeft.parent().hasClass("data3"))
    ) {
      childLeft.parent().closest("div.drag.vertical").remove();
    } else {
      childLeft.remove();
    }
  }

  function initDraggedItem(draggedItem) {
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

    // If existing item is dragged for editing then do belwo tasks

    if (draggedItem.attr("id")) {
      removeItemWithParent(draggedItem.attr("id"));
      container.attr("id", draggedItem.attr("id"));
      container.find(".data").replaceWith(draggedItem.find(".data"));
      return container;
    }

    let UUID = `item-${Date.now()}`;
    container.attr("id", "container-" + UUID);
    let dataDiv = container.find(".data");

    if (draggedItem.attr("item") && itemIds.hasOwnProperty(draggedItem.attr("item"))) {
      let item = $(itemIds[draggedItem.attr("item")]);
      addModalClick(item);

      item.attr("id", UUID);
      if (draggedItem.attr("item") === "btnIcon") {
        item.attr("src", draggedItem.attr("src"));
      }
      dataDiv.append(item);
      // addModalClick(draggedItem);
      return container;
    }

    // dataDiv.append(draggedItem);
    // return container;
  }

  function getNewContainer() {
    let containerHTML = `<div class="drag vertical ph-table-row dataItem">
          <div class="ph-table">
            <div class="ph-table-row eowo">
              <div class="ph-table-cell west drop we s"></div>
              <div class="ph-table-cell">
                <div class="ph-table noso">
                  <div class="ph-table-row">
                    <div class="ph-table-cell north ns drop s"></div>
                  </div>
                  <div class="ph-table-row">
                    <div class="ph-table-cell data"></div>
                  </div>
                  <div class="ph-table-row">
                    <div class="ph-table-cell south ns drop s"></div>
                  </div>
                </div>
              </div>
              <div class="ph-table-cell east drop we s"></div>
            </div>
          </div>
        </div>`;

    let container = $(containerHTML);

    // Mouse events
    // addMouseEvents(container.find(".ns"), container.find(".we"));

    //Drop events
    addDropEvent(container.find(".ns"), true);
    addDropEvent(container.find(".we"), true);
    addMouseOverEvents(container.find(".data"));
    addModalClick(container.find(".data"));

    return container;
  }

  function addMissingNorthSouth(existingItem) {
    let divnoso = existingItem.find("div.noso:first");
    let firstChild = existingItem.find("div.noso:first > div > div.north");
    let lastChild = existingItem.find("div.noso:first > div > div.south");
    // let existingItemNorth = existingItem.find("div.noso:first > div > div.north");
    // let existingItemSouth = existingItem.find("div.noso:first > div > div.south");
    // console.log(lastChild);
    if (!lastChild.length) {
      let n = $(`<div class="ph-table-row">
													<div class="ph-table-cell south ns drop s"></div>
													</div>`);
      divnoso.append(n);
      //Drop events
      addDropEvent(n.find("div"), true);
      // addMouseEvents(n.find("div"), null);
      return existingItem;
    } else if (!firstChild.length) {
      let n = $(`<div class="ph-table-row">
													<div class="ph-table-cell north ns drop s"></div>
													</div>`);
      divnoso.prepend(n);
      //Drop events
      addDropEvent(n.find("div"), true);
      // addMouseEvents(n.find("div"), null);
      return existingItem;
    } else {
      return existingItem;
    }
  }

  function addMissingEastWest(existingItem) {
    let diveowo = existingItem.find("div.eowo:first");
    let firstChild = diveowo.children().first();
    let lastChild = diveowo.children().last();
    // console.log("existingItem++", existingItem);
    // console.log("diveowo++", diveowo);
    // console.log("firstChild", firstChild);
    // console.log("lastChild", lastChild);
    // console.log("firstChild", firstChild.hasClass("west"));
    // console.log("lastChild", lastChild.hasClass("east"));
    if (!firstChild.hasClass("west")) {
      let n = $(`<div class="ph-table-cell west drop we s"></div>`);
      //Drop events
      addDropEvent(n, true);
      // addMouseEvents(null, n);

      diveowo.prepend(n);
      return existingItem;
    } else if (!lastChild.hasClass("east")) {
      let n = $(`<div class="ph-table-cell east drop we s"></div>`);
      //Drop events
      addDropEvent(n, true);
      // addMouseEvents(null, n);

      diveowo.append(n);
      return existingItem;
    } else {
      return existingItem;
    }
  }

  function getNewContainerNS() {
    let containerHTML = `<div class="drag vertical ph-table-cell group3">
								<div class="ph-table">
									<div class="ph-table-row eowo">
										<div class="ph-table-cell west drop we s"></div>
										<div class="ph-table-cell">
											<div class="ph-table noso">
												<div class="ph-table-row">
													<div class="ph-table-cell north ns drop s"></div>
												</div>
												<div class="ph-table-row">
													<div class="data3" category="group">

													</div>
												</div>
												<div class="ph-table-row">
													<div class="ph-table-cell south ns drop s"></div>
												</div>
											</div>
										</div>
										<div class="ph-table-cell east drop we s"></div>
									</div>
								</div>
							</div>`;

    let container = $(containerHTML);

    // Mouse events
    // addMouseEvents(container.find(".ns"), container.find(".we"));

    //Drop events
    addDropEvent(container.find(".ns"), true);
    addDropEvent(container.find(".we"), true);
    addMouseOverEvents(container.find(".data3"));
    addModalClick(container.find(".data3"));
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
    return container;
  }

  function getNewContainerWE() {
    let containerHTML = `<div class="drag vertical ph-table-row group2">
								<div class="ph-table">
									<div class="ph-table-row eowo">
										<div class="ph-table-cell west drop we s"></div>
										<div class="ph-table-cell">
											<div class="ph-table noso">
												<div class="ph-table-row">
													<div class="ph-table-cell north ns drop s"></div>
												</div>
												<div class="ph-table-row">
													<div class="ph-table-cell">
														<div class="data2" category="group">

														</div>
													</div>
												</div>
												<div class="ph-table-row">
													<div class="ph-table-cell south ns drop s"></div>
												</div>
											</div>
										</div>
										<div class="ph-table-cell east drop we s"></div>
									</div>
								</div>
							</div>`;

    let container = $(containerHTML);

    // Mouse events
    // addMouseEvents(container.find(".ns"), container.find(".we"));

    //Drop events
    addDropEvent(container.find(".ns"), true);
    addDropEvent(container.find(".we"), true);
    addMouseOverEvents(container.find(".data2"));
    addModalClick(container.find(".data2"));
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
    return container;
  }
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

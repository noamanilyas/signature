function removeExitingItem(itemId) {
  // console.log();

  let oldItem = $(`#${itemId}`);
  let siblings = oldItem.parent().children();

  console.log("oldItem.parent()", oldItem.parent());

  if (siblings.length === 2 && (oldItem.parent().hasClass("data2") || oldItem.parent().hasClass("data3"))) {
    oldItem.parent().closest("div.drag.vertical").remove();
  } else {
    oldItem.remove();
  }
}

function addDropEvent(el, greedy) {
  el.removeClass("ui-droppable");
  $(el).droppable({
    classes: {
      "ui-droppable-hover": "ui-mouse-enter",
    },
    bubbles: false,
    greedy: greedy,
    tolerance: "pointer",
    drop: function (event, ui) {
      console.log("I am in el");

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

          console.log("existingItemParent", existingItemParent);
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
          else if (
            existingItemParent.hasClass("data3") ||
            existingItemParent.attr("id") == "drop" ||
            existingItemParent.hasClass("editor-td-div")
          ) {
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

          // let existingItemParent = $canvas.closest("div.drag.vertical").parent();

          // console.log("existingItemParent", existingItemParent);
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
          } else if (canvasParent.attr("id") == "drop" || canvasParent.hasClass("editor-td-div")) {
            if ($canvas.hasClass("north")) {
              $canvas.closest("div.drag.vertical").before($canvasElement);
              $canvas.parent().remove();
            } else if ($canvas.hasClass("south")) {
              $canvas.closest("div.drag.vertical").after($canvasElement);
              $canvas.parent().remove();
            }
          }
        } else if ($canvas.hasClass("tableDrop")) {
          console.log($canvas);
          $canvas.html("");
          $canvas.append(draggedItem);
          $canvas.droppable("destroy");
          // $canvas.droppable("disable");
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
    // removeItemWithParent(draggedItem.attr("id"));
    removeExitingItem(draggedItem.attr("id"));
    container.attr("id", draggedItem.attr("id"));
    container.find(".data").replaceWith(draggedItem.find(".data"));
    return container;
  }

  let UUID = `item-${Date.now()}`;
  container.attr("id", "container-" + UUID);
  let dataDiv = container.find(".data");

  if (draggedItem.attr("item") && itemIds.hasOwnProperty(draggedItem.attr("item"))) {
    let item = $(itemIds[draggedItem.attr("item")]);
    // addModalClick(item);
    if (draggedItem.attr("item") === "btnTable") {
      let tds = item.find("div.editor-td-div");
      tds.each(function (index) {
        let UUID2 = `item-${Date.now() + index}`;
        $(this).attr("id", "editorTD-" + UUID2);
        addDropEvent($(this), true);
        addModalClick($(this));
        addMouseOverEvents($(this));
      });
    } else {
      item.attr("id", UUID);
    }
    if (draggedItem.attr("item") === "btnIcon") {
      item.attr("src", draggedItem.attr("src"));
    }
    dataDiv.append(item);
    // addModalClick(draggedItem);
    return container;
  } else if (draggedItem.attr("category") === "image" || draggedItem.attr("category") === "textField") {
    // console.log(draggedItem);
    let item = draggedItem;
    item.attr("id", UUID);
    dataDiv.append(item);
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

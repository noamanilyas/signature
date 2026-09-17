let edited = false;
var userData = false;

// Date.now() alone is millisecond-resolution, so two ids minted within the
// same drop (e.g. a new item's own id and a wrapping group container's id,
// which are generated back-to-back in the same synchronous handler) can
// collide. jQuery's #id lookups (removeExitingItem, edits, ...) then resolve
// to the wrong element - e.g. deleting an entire group instead of the single
// leaf item that was actually being moved. Appending a monotonic counter
// guarantees uniqueness regardless of timing.
let __idSuffixCounter = 0;
function nextIdSuffix() {
  __idSuffixCounter += 1;
  return __idSuffixCounter;
}
function addDropEvent(el, greedy) {
  el.removeClass("ui-droppable");
  // console.log(el.closest("drag"));

  let hoverClass = "ui-mouse-enter";

  if (el.hasClass("we")) {
    hoverClass = "ui-mouse-enter-2";
  }

  $(el).droppable({
    classes: {
      "ui-droppable-hover": hoverClass,
    },
    bubbles: false,
    greedy: greedy,
    tolerance: "pointer",
    drop: function (event, ui) {
      edited = true;
      var $canvas = $(this);
      // if (!ui.draggable.hasClass("canvas-element")) {
      console.log("canvas-element");
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

          // console.log("Edited", itemEdited);
          // console.log("Parent item count", existingItem.parent().children().length);

          if (!itemEdited) {
            if (!existingItemNorth.length && !existingItemSouth.length) {
              // Sandwiched: a neighbor already occupies both the north and
              // south of the existing item, so the new group inherits its
              // position and needs neither drop zone of its own either.
              container.find("div.south").parent().remove();
              container.find("div.north").parent().remove();
            } else if (existingItemNorth.length && !existingItemSouth.length) {
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

        if (canvasParent.hasClass("data2") || canvasParent.hasClass("editor-td-div")) {
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
            if (!existingItemEast.length && !existingItemWest.length) {
              // Sandwiched: a neighbor already occupies both the east and
              // west of the existing item, so the new group inherits its
              // position and needs neither drop zone of its own either.
              container.find("div.west").remove();
              container.find("div.east").remove();
            } else if (existingItemEast.length && !existingItemWest.length) {
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
        // $canvas.droppable("destroy");
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
      // }
    },
  });
}

function removeExitingItem(itemId) {
  // console.log();

  let oldItem = $(`#${itemId}`);
  let siblings = oldItem.parent().children();
  const oldItemParent = oldItem.parent();

  if (siblings.length >= 2 && (oldItemParent.hasClass("data2") || oldItemParent.hasClass("data3"))) {
    /**
     * Remove just this item and leave its sibling(s) in place. Removing the
     * whole data2/data3 wrapper here (as this used to do when exactly 2
     * siblings existed) would also destroy the other sibling, since this
     * item is only being relocated elsewhere on the canvas, not deleted.
     */
    oldItem.remove();
    setTimeout(function () {
      // console.log(oldItemParent);
      // console.log(oldItemParent.children());

      const childs = oldItemParent.children();
      if (childs.length === 1) {
        const child1st = childs.eq(0);
        addMissingNorthSouth(child1st);
        addMissingEastWest(child1st);
      } else {
        const child1st = childs.eq(0);
        const childlast = childs.eq(childs.length - 1);

        if (oldItemParent.hasClass("data2")) {
          addMissingEastWest(child1st, true, false);
          addMissingEastWest(childlast, false, true);
        } else if (oldItemParent.hasClass("data3")) {
          addMissingNorthSouth(child1st, true, false);
          addMissingNorthSouth(childlast, false, true);
        }
      }
    }, 50);
  } else {
    // Plain root/table-cell sibling: removing it makes its neighbors
    // directly adjacent, so the gap between them must end up with exactly
    // one drop zone (see reconcileNorthSouth).
    const prevSibling = oldItem.prev("div.drag.vertical");
    const nextSibling = oldItem.next("div.drag.vertical");
    oldItem.remove();
    reconcileNorthSouth(prevSibling, nextSibling);
  }
}

// clone() drops all jQuery UI/event bindings. Whenever an existing group2,
// group3, or table item is picked up and re-dropped elsewhere (see the
// branches below), everything nested inside it - leaf items, nested
// opposite-type groups, table cells - needs these rebound, or that nested
// content stops accepting drops/clicks and can no longer be dragged on its
// own.
function rebindClonedSubtree(clonedItem) {
  // jQuery UI's droppable greedy check (see _drop in jquery-ui.js) walks a
  // droppable's *current* descendants at drop time to decide whether to
  // defer to a nested greedy droppable. It relies on registration order:
  // an ancestor (e.g. a table cell) must be re-registered via .droppable()
  // before its descendants (e.g. that cell's item's own north/south/east/
  // west strips), or the ancestor's drop handler can end up running *after*
  // the descendant's - by which point the descendant's own handler has
  // already mutated/removed itself from the DOM, so the ancestor no longer
  // sees it as a live greedy child and wrongly fires too (e.g. replacing a
  // table cell's content right after a "beside" drop had just added to it).
  // A single combined selector keeps results in document order (ancestors
  // before descendants), matching how these elements were bound originally.
  clonedItem.find(".ns, .we, div.editor-td-div").each(function () {
    let el = $(this);
    addDropEvent(el, true);
    if (el.hasClass("editor-td-div")) {
      addModalClick(el);
      addMouseOverEvents(el);
    }
  });
  clonedItem.find(".data, .data2, .data3").each(function () {
    addMouseOverEvents($(this));
    addModalClick($(this));
  });
  clonedItem
    .add(clonedItem.find(".drag.vertical"))
    .draggable({
      // Keep the drag-ghost helper out of the real DOM tree it's dragged
      // within. jQuery UI's default appendTo:"parent" inserts the helper as
      // an actual sibling of the dragged item for the life of the drag, and
      // drop handlers run their prev()/next() neighbor lookups (see
      // reconcileNorthSouth) *before* jQuery UI removes that helper - so a
      // last-child drag would see its own drag-ghost as a phantom neighbor.
      appendTo: "body",
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
}

function initDraggedItem(draggedItem, cell = false) {
  // sync changes in setTableSubItems
  let container = getNewContainer(cell);
  container.draggable({
    appendTo: "body", // keep the drag-ghost helper out of #drop; see rebindClonedSubtree
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
  /**
   * Edit
   * If existing item is dragged for editing then do below tasks
   */

  if (draggedItem.hasClass("group2")) {
    let clonedItem = draggedItem.clone();
    removeExitingItem(draggedItem.attr("id"));
    addMissingNorthSouth(clonedItem);
    clonedItem = addEventsToContainer2(clonedItem);
    rebindClonedSubtree(clonedItem);
    return clonedItem;
  } else if (draggedItem.hasClass("group3")) {
    let clonedItem = draggedItem.clone();
    removeExitingItem(draggedItem.attr("id"));
    addMissingNorthSouth(clonedItem);
    clonedItem = addEventsToContainer3(clonedItem);
    rebindClonedSubtree(clonedItem);
    return clonedItem;
  } else if (draggedItem.hasClass("tableItem")) {
    // clone() drops all jQuery UI/event bindings, so the table, its cells and
    // anything already placed inside those cells must be fully re-bound here,
    // otherwise the table loses its "tableItem" class (breaks the preview
    // conversion) and its cells stop accepting drops/clicks.
    let clonedItem = draggedItem.clone();
    removeExitingItem(draggedItem.attr("id"));
    rebindClonedSubtree(clonedItem);
    return clonedItem;
  } else if (draggedItem.attr("id")) {
    // removeItemWithParent(draggedItem.attr("id"));
    removeExitingItem(draggedItem.attr("id"));
    container.attr("id", draggedItem.attr("id"));
    container.find(".data").replaceWith(draggedItem.find(".data"));
    addDropEvent(container.find(".ns"), true);
    addDropEvent(container.find(".we"), true);
    addMouseOverEvents(container.find(".data"));
    addModalClick(container.find(".data"));
    return container;
  }

  let UUID = `item-${Date.now()}-${nextIdSuffix()}`;
  container.attr("id", "container-" + UUID);
  let dataDiv = container.find(".data");

  if (draggedItem.attr("item") && itemIds.hasOwnProperty(draggedItem.attr("item"))) {
    let item = $(itemIds[draggedItem.attr("item")]);
    // addModalClick(item);
    if (draggedItem.attr("item") === "btnTable") {
      let tds = item.find("div.editor-td-div");
      tds.each(function (index) {
        let UUID2 = `item-${Date.now() + index}-${nextIdSuffix()}`;
        $(this).attr("id", "editorTD-" + UUID2);
        addDropEvent($(this), true);
        addModalClick($(this));
        addMouseOverEvents($(this));
      });
      let UUID3 = `item-${Date.now()}`;
      let table1 = item;
      table1.attr("id", "editorTable-" + UUID3);
      container.addClass("tableItem");
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
  } else if (draggedItem.attr("item") === "btnFields") {
    /**
     * This part is for dynamic fields
     */
    // First open modal
    // $("#fieldsModel").modal("show");
    $("#fieldsModel").modal({
      backdrop: "static",
      keyboard: false,
    });

    let item = $(itemIds["btnText"]);
    item.attr("id", UUID);
    dataDiv.append(item);
    container.addClass("toBeReplacedByActual");
    return container;
    // First check if single line or multi line
  }

  // dataDiv.append(draggedItem);
  // return container;
}

function getNewContainer(cell = false) {
  let containerHTML = `<div class="drag vertical ${!!cell ? "ph-table-cell" : "ph-table-row"} dataItem">
          <div class="ph-table">
            <div class="ph-table-row eowo">
              <div class="ph-table-cell west drop we s"></div>
              <div class="ph-table-cell">
                <div class="ph-table noso">
                  <div class="ph-table-row">
                    <div class="ph-table-cell north ns drop s"></div>
                  </div>
                  <div class="ph-table-row">
                    <div class="ph-table-cell data" style="padding: 5px"></div>
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

function addMissingNorthSouth(existingItem, north = true, south = true) {
  let divnoso = existingItem.find("div.noso:first");
  let firstChild = existingItem.find("div.noso:first > div > div.north");
  let lastChild = existingItem.find("div.noso:first > div > div.south");
  // let existingItemNorth = existingItem.find("div.noso:first > div > div.north");
  // let existingItemSouth = existingItem.find("div.noso:first > div > div.south");
  // console.log(lastChild);
  // Fix: these used to be an if/else-if pair that returned after adding just
  // one side. An item that was sandwiched (e.g. a neighbor was added to its
  // north AND another to its south, consuming both) had both sides missing,
  // but the early return meant only south ever got restored, leaving north
  // missing (e.g. right after wrapping such an item into a new east/west
  // group, where it needs both of its own north/south back). Both checks now
  // run independently so either or both sides can be restored in one call.
  if (!lastChild.length && south) {
    let n = $(`<div class="ph-table-row">
													<div class="ph-table-cell south ns drop s"></div>
													</div>`);
    divnoso.append(n);
    //Drop events
    addDropEvent(n.find("div"), true);
    // addMouseEvents(n.find("div"), null);
  }
  if (!firstChild.length && north) {
    let n = $(`<div class="ph-table-row">
													<div class="ph-table-cell north ns drop s"></div>
													</div>`);
    divnoso.prepend(n);
    //Drop events
    addDropEvent(n.find("div"), true);
    // addMouseEvents(n.find("div"), null);
  }
  return existingItem;
}

// When an item is removed from #drop (or another plain vertical stack) its
// former prev/next siblings become directly adjacent. Each gap between two
// siblings is meant to have exactly one drop zone, owned by whichever side
// kept it when the items were originally placed. Depending on which side
// that was, removing the item in between can leave either sibling pair with
// TWO drop zones for the same gap (if the removed item held neither, e.g. it
// was sandwiched) or ZERO (if the removed item held the one connector for a
// gap, e.g. it used to be an end item). This reconciles that gap down to
// exactly one drop zone.
function reconcileNorthSouth(prevSibling, nextSibling) {
  const hasPrev = prevSibling && prevSibling.length;
  const hasNext = nextSibling && nextSibling.length;
  if (hasPrev && hasNext) {
    const prevSouth = prevSibling.find("div.noso:first > div > div.south");
    const nextNorth = nextSibling.find("div.noso:first > div > div.north");
    if (prevSouth.length && nextNorth.length) {
      // Duplicate: both sides still carry a zone for what is now one gap.
      nextNorth.parent().remove();
    } else if (!prevSouth.length && !nextNorth.length) {
      // Neither survived: the removed item held the only connector.
      addMissingNorthSouth(prevSibling, false, true);
    }
  } else if (hasPrev) {
    addMissingNorthSouth(prevSibling, false, true);
  } else if (hasNext) {
    addMissingNorthSouth(nextSibling, true, false);
  }
}

function addMissingEastWest(existingItem, west = true, east = true) {
  let diveowo = existingItem.find("div.eowo:first");
  let firstChild = diveowo.children().first();
  let lastChild = diveowo.children().last();
  // console.log("existingItem++", existingItem);
  // console.log("diveowo++", diveowo);
  // console.log("firstChild", firstChild);
  // console.log("lastChild", lastChild);
  // console.log("firstChild", firstChild.hasClass("west"));
  // console.log("lastChild", lastChild.hasClass("east"));
  if (!firstChild.hasClass("west") && west) {
    let n = $(`<div class="ph-table-cell west drop we s"></div>`);
    //Drop events
    addDropEvent(n, true);
    // addMouseEvents(null, n);

    diveowo.prepend(n);
    return existingItem;
  } else if (!lastChild.hasClass("east") && east) {
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
  container = addEventsToContainer3(container);

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
														<div class="data2" category="group" style="border-spacing: 1px;">

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
  container = addEventsToContainer2(container);

  return container;
}

function addEventsToContainer2(container) {
  //Drop events
  addDropEvent(container.find(".ns"), true);
  addDropEvent(container.find(".we"), true);
  addMouseOverEvents(container.find(".data2"));
  addModalClick(container.find(".data2"));
  container.draggable({
    appendTo: "body", // keep the drag-ghost helper out of #drop; see rebindClonedSubtree
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
  let UUID = `item-${Date.now()}-${nextIdSuffix()}`;
  container.attr("id", "container-" + UUID);
  container.find(".data2").attr("id", "container-group-" + UUID);
  return container;
}

function addEventsToContainer3(container) {
  //Drop events
  addDropEvent(container.find(".ns"), true);
  addDropEvent(container.find(".we"), true);
  addMouseOverEvents(container.find(".data3"));
  addModalClick(container.find(".data3"));
  container.draggable({
    appendTo: "body", // keep the drag-ghost helper out of #drop; see rebindClonedSubtree
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
  let UUID = `item-${Date.now()}-${nextIdSuffix()}`;
  container.attr("id", "container-" + UUID);
  container.find(".data3").attr("id", "container-group-" + UUID);

  return container;
}

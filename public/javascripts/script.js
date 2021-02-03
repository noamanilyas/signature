$(document).ready(function () {
  /**
   * Sample
   * ["labelIcon", "imageSource", "hyperlink", "text",
   * "background", "visibility", "alignment", "border",
   * "padding", "size", "render", "orientation", "socialMediaIcon"]
   */

  var personalData = {
    firstName: "Noaman",
    lastName: "Ilyas",
    email: "noaman.ilyas@gmail.com",
    address: "House No. 169-POF, WahCantt",
  };

  const itemIds = {
    btnText: `<span category="textField">Your text here!</span>`,
    btnFN: `<span category="textField">${personalData.firstName}</span>`,
    btnLN: `<span category="textField">${personalData.lastName}</span>`,
    btnEM: `<span category="textField">${personalData.email}</span>`,
    btnAD: `<span category="textField">${personalData.address}</span>`,
    // btnText: `<div category="textField"><span>Your text here!</span></div>`,
    btnImage: `<img
        alt="Fax"
        category="image"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADeElEQVR4Xu2Yi27iMBBFDX1BW+j//yQSlL4LVCfy1Y68Djixl7Kyj2SNA3nMXM/YTiar1ergKmbqbbU0AbytliaAt9XSBPC2WpoA3lZLE8DbamkCeFstTQBvq6UJ4O3Fs9vt3OfnZ9dKUvyL0H6/dx8fH246nXbt6uqqs6lwPY2AbbM8PDy4m5sbf5RHcQG22637/v72R3+wYtgWBno4nHbn7u7Ozedzf5RHcQHW63VSEKkgmtr7+3t37+vra/f4+OjPyKPoHIBzCp4Uvb+/d7PZzN3e3nYBTCaT7r+hcE/KQteHJZHD6AzAqTB9cVICkKKkaoiC0fm2r2tTUUlhedYYgUcJ8PX15V5eXvxRnDETlUQNhUkRp0/wU4wSgFqkWRgJwFlYLBbdyJRCQqghjgQCyo1SG8qoOUDBAjX+9PTklstlNzmJMHgcfX197TJnzFrOM7k/QfJMMgwrrE9DGHVVGJxqT6MRc4blkcApH4TA5kIGiLMLEJuR1Q+dsakqSuzodE98OasAoAcqaCYpTVRhhsSc63OYoFJXg2MZl8roKxWkHLYjHDrECNmdG9fa+hXchzmCrXQKfRk3hGwBAEfkDMQcYonSZMkKEVuzCZ77IMCpLLCChxk3hGICpDh0rFaZGPUOQfCnsuBYxg3hnwgw1CH2FOGkaLOA/8L/f10AO5q2BIY6Q2DhpgoInt+1bOr+wh7/igCgLGA0NCI2MxTE8/Nz95ZIo6/NkILrg3O05Q4F0PNylkAoIgCBKl3lDMdsfhAA53UOfQWu4PrQPaFPgJzgoYgAFjn09vb2l9M5IIate937YgVgneejhd7SeDPMdVZBx4QYS/YXofALEC8rvLQQrFoIAdBwPuwfA1FpLJeUl2B/EdtXpJAtQN83QKFJikbG2H7M6T5haGQRb4EskZSYyHn1zhYAR1K3riESxwpzShz+t8/kPHaXsfNTyBaApUpLGTWPg7HRoz+EmDjq8zxWktzgIVsAAmNth9hnKf5Xw2nEKAWCkP45ZAvABMhECEx+1KkNOgUCUYMwg/pgwuVTWA7ZAsBms0kaWVLVBmuDPoYVQ32EJ+PsZ7gxFBGAmgxfVhScalf9S6OIAIwKAtiJKmdiOidFBPifubycPDNNAG+rpQngbbU0AbytliaAt9XSBPC2WpoA3lZLE8DbaqlcAOd+ALQ27cXvtzg+AAAAAElFTkSuQmCC"
      />`,
    btnIcon: `<img
        alt="Fax"
        category="icons"
        class="icon-list drag"
        src=""
      />`,
  };

  setTimeout(function () {
    addMouseEvents();

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
    $(".drop").droppable({
      // accept: function (item) {
      // 	return $(this).data('color') == item.data('color');
      // },
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
          $canvas.css({ "min-width": "0px" });
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

  function addDropEvent(el, greedy) {
    $(el).droppable({
      bubbles: false,
      greedy: greedy,
      tolerance: "pointer",
      drop: function (event, ui) {
        // console.log(ui);
        // console.log(event);
        var $canvas = $(this);
        if (!ui.draggable.hasClass("canvas-element")) {
          var $canvasElement = ui.draggable.clone();
          $canvasElement.addClass("canvas-element");

          let draggedItem = $canvasElement;
          draggedItem = initDraggedItem(draggedItem);

          $canvasElement = draggedItem;

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

              // console.log("existingItemNorth", existingItemNorth);
              // console.log("existingItemSouth", existingItemSouth);
              if (existingItemNorth.length && !existingItemSouth.length) {
                container.find("div.south").parent().remove();
              } else if (existingItemSouth.length && !existingItemNorth.length) {
                container.find("div.north").parent().remove();
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
              if (existingItemEast.length && !existingItemWest.length) {
                container.find("div.west").remove();
              } else if (existingItemWest.length && !existingItemEast.length) {
                container.find("div.east").remove();
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

  function addModalClick(item) {
    $(item).click(function (e) {
      e.stopPropagation();
      renderModel(e);
    });
  }

  function initDraggedItem(draggedItem) {
    let container = getNewContainer();
    let dataDiv = container.find(".data");
    if (draggedItem.attr("item") && itemIds.hasOwnProperty(draggedItem.attr("item"))) {
      let item = $(itemIds[draggedItem.attr("item")]);
      addModalClick(item);
      let UUID = `item-${Date.now()}`;
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
    addMouseEvents(container.find(".ns"), container.find(".we"));

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
      addMouseEvents(n.find("div"), null);
      return existingItem;
    } else if (!firstChild.length) {
      let n = $(`<div class="ph-table-row">
													<div class="ph-table-cell north ns drop s"></div>
													</div>`);
      divnoso.prepend(n);
      //Drop events
      addDropEvent(n.find("div"), true);
      addMouseEvents(n.find("div"), null);
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
      addMouseEvents(null, n);

      diveowo.prepend(n);
      return existingItem;
    } else if (!lastChild.hasClass("east")) {
      let n = $(`<div class="ph-table-cell east drop we s"></div>`);
      //Drop events
      addDropEvent(n, true);
      addMouseEvents(null, n);

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
    addMouseEvents(container.find(".ns"), container.find(".we"));

    //Drop events
    addDropEvent(container.find(".ns"), true);
    addDropEvent(container.find(".we"), true);
    addMouseOverEvents(container.find(".data3"));
    addModalClick(container.find(".data3"));
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
    addMouseEvents(container.find(".ns"), container.find(".we"));

    //Drop events
    addDropEvent(container.find(".ns"), true);
    addDropEvent(container.find(".we"), true);
    addMouseOverEvents(container.find(".data2"));
    addModalClick(container.find(".data2"));

    return container;
  }
});

function getSubItemsForgroup2(item) {
  let group = $(item).find(".data2:first").children();
  let tbody = $("<tbody>");
  let table = $("<table>");
  let tr = $("<tr>");
  console.log(group);
  $.each(group, function (index, value) {
    let td = $("<td>");
    console.log($(this));
    if ($(this).hasClass("dataItem")) {
      let dataItem = $(this).find(".data").children().eq(0).clone();
      let vAlign = $(this).find(".data").css("vertical-align");
      if (vAlign) {
        td.css("vertical-align", vAlign);
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
  console.log(group);
  $.each(group, function (index, value) {
    let tr = $("<tr>");
    let td = $("<td>");
    console.log($(this));
    if ($(this).hasClass("dataItem")) {
      let dataItem = $(this).find(".data").children().eq(0).clone();
      let vAlign = $(this).find(".data").css("vertical-align");
      if (vAlign) {
        td.css("vertical-align", vAlign);
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

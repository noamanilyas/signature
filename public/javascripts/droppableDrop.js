// #drop only accepts a direct drop while it has no items yet (see the
// drop handler below, which destroys this droppable the moment an item
// lands). Once an item exists, further placement must go through that
// item's own north/south/east/west drop zones (see drop.js). customeFontDiv
// is a permanent hidden child of #drop, so children().length is not a
// reliable "is #drop empty" check.
function isDropEmpty() {
  return $("#drop > .drag.vertical").length === 0;
}

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

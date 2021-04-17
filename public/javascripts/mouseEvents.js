var isDown = false; // Tracks status of mouse button

$(document)
  .mousedown(function () {
    isDown = true; // When mouse goes down, set isDown to true
  })
  .mouseup(function () {
    isDown = false; // When mouse goes up, set isDown to false
  });
const colors = {
  mouseEnt: "deepskyblue",
  mouseLve: "#f1f1f1;",
};

function addMouseEvents(ns, we) {
  if (ns) {
    $(ns).mouseenter(function () {
      if (isDown)
        $(this).css({
          "background-color": colors.mouseEnt,
          height: "30px",
        });
    });

    $(ns).mouseleave(function () {
      if (isDown)
        $(this).css({
          "background-color": colors.mouseLve,
          height: "3px",
        });
    });
  }

  if (we) {
    $(we).mouseenter(function () {
      if (isDown)
        $(this).css({
          "background-color": colors.mouseEnt,
          width: "30px",
        });
    });

    $(we).mouseleave(function () {
      if (isDown)
        $(this).css({
          "background-color": colors.mouseLve,
          width: "3px",
        });
    });
  }
}
function addMouseOverEvents(el) {
  $(el).hover(
    function () {
      $(this).css("box-shadow", "0px 0px 3px 0px");
    },
    function () {
      $(this).css("box-shadow", "none");
    }
  );
}

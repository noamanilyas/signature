function renderAlignmentTab(id) {
  resetAlignTab(formattersAlign);
  setTimeout(function () {
    formattersAlign.forEach(function (value, key, myArray) {
      fillAndFormatAlign(id, value);
    });
  }, 100);
}

function fillAndFormatAlign(id, item) {
  let { inputElem, cssProperty, cssPropertyVal } = item;
  // Get existing value
  const element = document.querySelector(`#${id}`).parentElement.style[cssProperty];
  // console.log(element);
  if (element && cssPropertyVal === element) {
    $(`#${inputElem}`).addClass("active");
  }
  // Add event listeners
  $(`#${inputElem}`).on("click", function () {
    // If already exists then remove
    removeActiveClassAll(formattersAlign, inputElem.split("-")[1]);
    const element = document.querySelector(`#${id}`).parentElement.style[cssProperty];
    if (element && cssPropertyVal === element) {
      removeCSSClass(cssProperty, id, inputElem);
    } else {
      $(`#${id}`).parent().closest(".drag").css(cssProperty, cssPropertyVal);
      $(`#${id}`).attr(cssProperty, cssPropertyVal);
      $(`#${inputElem}`).addClass("active");
    }
    converToTableFunc();
  });
}
// Remove css property & active class from elem
function removeCSSClass(cssProperty, id, inputElem) {
  let obj = {};
  obj[cssProperty] = "";
  $(`#${id}`).parent().css(obj);
  $(`#${inputElem}`).removeClass("active");
}

function resetAlignTab(formattersAlign) {
  formattersAlign?.forEach(function (value, key, myArray) {
    $(`#${value.inputElem}`).off();
    $(`#${value.inputElem}`).removeClass("active");
  });
  // inputElemArr.each(function (index, item) {});
  // $(selector).off();
  $("#alignment-form").trigger("reset");
}

function removeActiveClassAll(formattersAlign, category) {
  formattersAlign?.forEach(function (value, key, myArray) {
    if (value.inputElem.split("-")[1] === category) $(`#${value.inputElem}`).removeClass("active");
  });
}

const formattersAlign = [
  {
    inputElem: "align-text-left",
    cssProperty: "text-align",
    cssPropertyVal: "left",
  },
  {
    inputElem: "align-text-right",
    cssProperty: "text-align",
    cssPropertyVal: "right",
  },
  {
    inputElem: "align-text-center",
    cssProperty: "text-align",
    cssPropertyVal: "center",
  },
  {
    inputElem: "align-text-justify",
    cssProperty: "text-align",
    cssPropertyVal: "justify",
  },
  {
    inputElem: "align-text-inherit",
    cssProperty: "text-align",
    cssPropertyVal: "inherit",
  },
  {
    inputElem: "align-vert-top",
    cssProperty: "vertical-align",
    cssPropertyVal: "top",
  },
  {
    inputElem: "align-vert-center",
    cssProperty: "vertical-align",
    cssPropertyVal: "middle",
  },
  {
    inputElem: "align-vert-bottom",
    cssProperty: "vertical-align",
    cssPropertyVal: "bottom",
  },
  {
    inputElem: "align-horiz-left",
    cssProperty: "text-align",
    cssPropertyVal: "left",
  },
  {
    inputElem: "align-horiz-right",
    cssProperty: "text-align",
    cssPropertyVal: "right",
  },
  {
    inputElem: "align-horiz-center",
    cssProperty: "text-align",
    cssPropertyVal: "center",
  },
];
